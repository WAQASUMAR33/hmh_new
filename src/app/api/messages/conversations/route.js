import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (req) => {
    try {
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return null;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-development-only');
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};

export async function POST(req) {
    try {
        // Verify user is authenticated
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipientId, message } = await req.json();

        if (!recipientId || !message) {
            return NextResponse.json({ error: 'Recipient ID and message are required' }, { status: 400 });
        }

        // Verify recipient exists and is a publisher
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId },
            select: { id: true, role: true, firstName: true, lastName: true }
        });

        if (!recipient) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
        }

        if (recipient.role !== 'PUBLISHER') {
            return NextResponse.json({ error: 'Can only message publishers' }, { status: 403 });
        }

        // Check if conversation already exists
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    {
                        advertiserId: user.sub,
                        publisherId: recipientId
                    },
                    {
                        advertiserId: recipientId,
                        publisherId: user.sub
                    }
                ]
            }
        });

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    advertiserId: user.role === 'ADVERTISER' ? user.sub : recipientId,
                    publisherId: user.role === 'PUBLISHER' ? user.sub : recipientId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        }

        // Create the message
        const newMessage = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: user.sub,
                recipientId: recipientId,
                content: message,
                messageType: 'TEXT',
                createdAt: new Date()
            }
        });

        // Update conversation's updatedAt
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() }
        });

        // Create notification for recipient
        await prisma.notification.create({
            data: {
                userId: recipientId,
                type: 'MESSAGE',
                title: `New message from ${user.firstName} ${user.lastName}`,
                message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
                isRead: false,
                createdAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            conversation: conversation,
            message: newMessage
        });

    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Verify user is authenticated
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's conversations
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { advertiserId: user.sub },
                    { publisherId: user.sub }
                ]
            },
            include: {
                advertiser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        brandName: true,
                        companyLegalName: true
                    }
                },
                publisher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        companyLegalName: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            conversations: conversations
        });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
