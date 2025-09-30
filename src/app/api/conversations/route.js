import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getSessionOrNull } from '@/app/api/_lib/auth';

// GET /api/conversations - Get all conversations for the current user
export async function GET(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const conversations = [];

        if (session.role === 'PUBLISHER') {
            // For publishers: Get conversations with advertisers who messaged about their opportunities
            const opportunitiesWithMessages = await prisma.opportunity.findMany({
                where: { 
                    publisherId: session.id,
                    messages: {
                        some: {} // Only opportunities that have messages
                    }
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                    createdAt: true,
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                    image: true,
                                    companyLegalName: true,
                                    brandName: true,
                                }
                            }
                        }
                    },
                    _count: {
                        select: { messages: true }
                    }
                }
            });

            // Group messages by advertiser for each opportunity
            opportunitiesWithMessages.forEach(opportunity => {
                // Group messages by advertiser
                const advertiserGroups = {};
                
                opportunity.messages.forEach(message => {
                    if (message.author.role === 'ADVERTISER') {
                        const advertiserId = message.author.id;
                        if (!advertiserGroups[advertiserId]) {
                            advertiserGroups[advertiserId] = {
                                advertiser: message.author,
                                messages: []
                            };
                        }
                        advertiserGroups[advertiserId].messages.push(message);
                    }
                });

                // Create conversation for each advertiser
                Object.values(advertiserGroups).forEach(group => {
                    const lastMessage = group.messages[0]; // Already sorted by desc
                    conversations.push({
                        id: `opp_${opportunity.id}_adv_${group.advertiser.id}`,
                        type: 'opportunity',
                        opportunityId: opportunity.id,
                        opportunityTitle: opportunity.title,
                        opportunitySlug: opportunity.slug,
                        opportunityStatus: opportunity.status,
                        participant: group.advertiser, // The advertiser they're talking to
                        lastMessage: {
                            content: lastMessage.content,
                            createdAt: lastMessage.createdAt,
                            author: lastMessage.author
                        },
                        messageCount: group.messages.length,
                        createdAt: opportunity.createdAt,
                        lastActivity: lastMessage.createdAt
                    });
                });
            });

            // Also get direct messages to this publisher (not tied to opportunities)
            const directMessages = await prisma.message.findMany({
                where: {
                    OR: [
                        { recipientId: session.id }, // Messages sent to this publisher
                        { authorId: session.id, recipientId: { not: null } } // Messages sent by this publisher to advertisers
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                            image: true,
                            companyLegalName: true,
                            brandName: true,
                        }
                    }
                }
            });

            // Group direct messages by advertiser
            const directMessageGroups = {};
            
            for (const message of directMessages) {
                const advertiserId = message.authorId === session.id ? message.recipientId : message.authorId;
                if (message.author.role === 'ADVERTISER' || (message.authorId === session.id && message.recipientId)) {
                    if (!directMessageGroups[advertiserId]) {
                        // Get advertiser info if message was sent by publisher
                        let advertiser = message.author;
                        if (message.authorId === session.id && message.recipientId) {
                            advertiser = await prisma.user.findUnique({ 
                                where: { id: advertiserId },
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                    image: true,
                                    companyLegalName: true,
                                    brandName: true,
                                }
                            });
                        }
                        
                        directMessageGroups[advertiserId] = {
                            advertiser: advertiser,
                            messages: []
                        };
                    }
                    directMessageGroups[advertiserId].messages.push(message);
                }
            }

            // Create conversations for direct messages
            for (const [advertiserId, group] of Object.entries(directMessageGroups)) {
                if (group.advertiser) {
                    const lastMessage = group.messages[0]; // Already sorted by desc
                    conversations.push({
                        id: `direct_${advertiserId}_pub_${session.id}`,
                        type: 'direct',
                        opportunityId: null,
                        opportunityTitle: `Direct conversation with ${group.advertiser.firstName} ${group.advertiser.lastName}`,
                        opportunitySlug: null,
                        opportunityStatus: null,
                        participant: group.advertiser,
                        lastMessage: {
                            content: lastMessage.content,
                            createdAt: lastMessage.createdAt,
                            author: lastMessage.author
                        },
                        messageCount: group.messages.length,
                        createdAt: lastMessage.createdAt,
                        lastActivity: lastMessage.createdAt
                    });
                }
            }

        } else if (session.role === 'ADVERTISER') {
            // For advertisers: Get conversations with publishers about opportunities
            const messagesFromAdvertiser = await prisma.message.findMany({
                where: { 
                    authorId: session.id,
                    opportunityId: { not: null }
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    opportunity: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            status: true,
                            createdAt: true,
                            publisher: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                    image: true,
                                    companyLegalName: true,
                                    brandName: true,
                                }
                            },
                            messages: {
                                orderBy: { createdAt: 'desc' },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            role: true,
                                            image: true,
                                            companyLegalName: true,
                                            brandName: true,
                                        }
                                    }
                                }
                            },
                            _count: {
                                select: { messages: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Group by opportunity and publisher
            const opportunityGroups = {};
            
            messagesFromAdvertiser.forEach(message => {
                const opportunityId = message.opportunity.id;
                if (!opportunityGroups[opportunityId]) {
                    opportunityGroups[opportunityId] = {
                        opportunity: message.opportunity,
                        messages: []
                    };
                }
                opportunityGroups[opportunityId].messages.push(message);
            });

            // Create conversations for each opportunity
            Object.values(opportunityGroups).forEach(group => {
                const lastMessage = group.opportunity.messages[0]; // Get the most recent message from the opportunity
                conversations.push({
                    id: `opp_${group.opportunity.id}_adv_${session.id}`,
                    type: 'opportunity',
                    opportunityId: group.opportunity.id,
                    opportunityTitle: group.opportunity.title,
                    opportunitySlug: group.opportunity.slug,
                    opportunityStatus: group.opportunity.status,
                    participant: group.opportunity.publisher, // The publisher they're talking to
                    lastMessage: {
                        content: lastMessage.content,
                        createdAt: lastMessage.createdAt,
                        author: lastMessage.author
                    },
                    messageCount: group.opportunity._count.messages,
                    createdAt: group.opportunity.createdAt,
                    lastActivity: lastMessage.createdAt
                });
            });

            // Also get direct messages to publishers (not tied to opportunities)
            const directMessages = await prisma.message.findMany({
                where: {
                    OR: [
                        { authorId: session.id, recipientId: { not: null } }, // Messages sent by this advertiser to publishers
                        { recipientId: session.id } // Messages sent to this advertiser
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                            image: true,
                            companyLegalName: true,
                            brandName: true,
                        }
                    }
                }
            });

            // Group direct messages by publisher
            const directMessageGroups = {};
            
            for (const message of directMessages) {
                const publisherId = message.authorId === session.id ? message.recipientId : message.authorId;
                if (message.author.role === 'PUBLISHER' || (message.authorId === session.id && message.recipientId)) {
                    if (!directMessageGroups[publisherId]) {
                        // Get publisher info if message was sent by advertiser
                        let publisher = message.author;
                        if (message.authorId === session.id && message.recipientId) {
                            publisher = await prisma.user.findUnique({ 
                                where: { id: publisherId },
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                    image: true,
                                    companyLegalName: true,
                                    brandName: true,
                                }
                            });
                        }
                        
                        directMessageGroups[publisherId] = {
                            publisher: publisher,
                            messages: []
                        };
                    }
                    directMessageGroups[publisherId].messages.push(message);
                }
            }

            // Create conversations for direct messages
            for (const [publisherId, group] of Object.entries(directMessageGroups)) {
                if (group.publisher) {
                    const lastMessage = group.messages[0]; // Already sorted by desc
                    conversations.push({
                        id: `direct_${publisherId}_adv_${session.id}`,
                        type: 'direct',
                        opportunityId: null,
                        opportunityTitle: `Direct conversation with ${group.publisher.firstName} ${group.publisher.lastName}`,
                        opportunitySlug: null,
                        opportunityStatus: null,
                        participant: group.publisher,
                        lastMessage: {
                            content: lastMessage.content,
                            createdAt: lastMessage.createdAt,
                            author: lastMessage.author
                        },
                        messageCount: group.messages.length,
                        createdAt: lastMessage.createdAt,
                        lastActivity: lastMessage.createdAt
                    });
                }
            }
        }

        // Sort by last activity
        conversations.sort((a, b) => {
            return new Date(b.lastActivity) - new Date(a.lastActivity);
        });

        return NextResponse.json({ data: conversations });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
