import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getSessionOrNull } from '@/app/api/_lib/auth';

// GET /api/messages - Get messages for an opportunity or offer
export async function GET(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const opportunityId = searchParams.get('opportunityId');
        const offerId = searchParams.get('offerId');
        const bookingId = searchParams.get('bookingId');
        const publisherId = searchParams.get('publisherId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const cursor = searchParams.get('cursor');

        if (!opportunityId && !offerId && !bookingId && !publisherId) {
            return NextResponse.json({ error: 'opportunityId, offerId, bookingId, or publisherId is required' }, { status: 400 });
        }

        // Build where clause
        const where = {};
        if (opportunityId) where.opportunityId = opportunityId;
        if (offerId) where.offerId = offerId;
        if (bookingId) where.bookingId = bookingId;
        if (publisherId) {
            // For publisher conversations, we need to find messages between the current user and the publisher
            // This is a direct conversation, not tied to a specific opportunity
            where.OR = [
                { 
                    authorId: session.id, 
                    recipientId: publisherId 
                },
                { 
                    authorId: publisherId, 
                    recipientId: session.id 
                }
            ];
        }

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        image: true,
                    }
                }
            }
        });

        // Reverse to get chronological order
        const reversedMessages = messages.reverse();

        return NextResponse.json({
            data: reversedMessages,
            hasMore: messages.length === limit,
            cursor: messages.length > 0 ? messages[messages.length - 1].id : null
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/messages - Create a new message
export async function POST(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { opportunityId, offerId, bookingId, publisherId, content } = await req.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
        }

        if (!opportunityId && !offerId && !bookingId && !publisherId) {
            return NextResponse.json({ error: 'opportunityId, offerId, bookingId, or publisherId is required' }, { status: 400 });
        }

        // Verify the opportunity exists and user has access
        if (opportunityId) {
            const opportunity = await prisma.opportunity.findUnique({
                where: { id: opportunityId },
                include: { publisher: true }
            });

            if (!opportunity) {
                return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
            }

            // Check if user is the publisher or is an advertiser (allow direct messaging)
            const hasAccess = opportunity.publisherId === session.id || session.role === 'ADVERTISER';

            if (!hasAccess) {
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        }

        // Verify the offer exists and user has access
        if (offerId) {
            const offer = await prisma.offer.findUnique({
                where: { id: offerId },
                include: { opportunity: true }
            });

            if (!offer) {
                return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
            }

            // Check if user is the advertiser or publisher
            const hasAccess = offer.advertiserId === session.id || 
                offer.opportunity.publisherId === session.id;

            if (!hasAccess) {
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        }

        // Verify the booking exists and user has access
        if (bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { opportunity: true }
            });

            if (!booking) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }

            // Check if user is the advertiser or publisher
            const hasAccess = booking.advertiserId === session.id || 
                booking.publisherId === session.id;

            if (!hasAccess) {
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        }

        // Verify the publisher exists and user has access
        if (publisherId) {
            const publisher = await prisma.user.findUnique({
                where: { id: publisherId }
            });

            if (!publisher) {
                return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
            }

            // Allow bidirectional messaging between advertisers and publishers
            // Either: advertiser sending to publisher, or publisher sending to advertiser
            const isValidConversation = 
                (session.role === 'ADVERTISER' && publisher.role === 'PUBLISHER') ||
                (session.role === 'PUBLISHER' && publisher.role === 'ADVERTISER');

            if (!isValidConversation) {
                return NextResponse.json({ error: 'Access denied - invalid conversation' }, { status: 403 });
            }
        }

        const message = await prisma.message.create({
            data: {
                authorId: session.id,
                opportunityId: opportunityId || null,
                offerId: offerId || null,
                bookingId: bookingId || null,
                recipientId: publisherId || null,
                content: content.trim()
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        image: true,
                    }
                }
            }
        });

        // Create notification for the recipient
        if (opportunityId) {
            const opportunity = await prisma.opportunity.findUnique({
                where: { id: opportunityId },
                select: { publisherId: true, title: true }
            });

            if (opportunity && opportunity.publisherId !== session.id) {
                // Notify publisher about new message
                await prisma.notification.create({
                    data: {
                        userId: opportunity.publisherId,
                        senderId: session.id,
                        opportunityId: opportunityId,
                        messageId: message.id,
                        type: 'MESSAGE',
                        title: 'New message from advertiser',
                        content: `${message.author.firstName} sent you a message about "${opportunity.title}"`
                    }
                });
            }
        }

        if (publisherId) {
            // Notify the recipient about new direct message
            const recipientId = publisherId;
            const senderRole = session.role;
            const recipientRole = senderRole === 'ADVERTISER' ? 'PUBLISHER' : 'ADVERTISER';
            
            await prisma.notification.create({
                data: {
                    userId: recipientId,
                    senderId: session.id,
                    messageId: message.id,
                    type: 'MESSAGE',
                    title: `New message from ${senderRole.toLowerCase()}`,
                    content: `${message.author.firstName} sent you a direct message`
                }
            });
        }

        if (bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                select: { 
                    advertiserId: true, 
                    publisherId: true,
                    opportunity: { select: { title: true } }
                }
            });

            if (booking) {
                const recipientId = session.id === booking.advertiserId ? booking.publisherId : booking.advertiserId;
                
                await prisma.notification.create({
                    data: {
                        userId: recipientId,
                        senderId: session.id,
                        opportunityId: booking.opportunity.id,
                        bookingId: bookingId,
                        messageId: message.id,
                        type: 'MESSAGE',
                        title: 'New message about booking',
                        content: `${message.author.firstName} sent you a message about "${booking.opportunity.title}"`
                    }
                });
            }
        }

        return NextResponse.json({ data: message });

    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
