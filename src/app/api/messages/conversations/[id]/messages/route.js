import { NextResponse } from 'next/server';
import { prisma } from '../../../../../utils/prisma';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (req) => {
    try {
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return null;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};

export async function GET(req, { params }) {
    try {
        // Verify user is authenticated
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: conversationId } = params;

        // Verify user is part of this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                advertiser: {
                    select: { id: true, firstName: true, lastName: true }
                },
                publisher: {
                    select: { id: true, firstName: true, lastName: true }
                }
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Check if user is part of this conversation
        if (conversation.advertiserId !== user.sub && conversation.publisherId !== user.sub) {
            return NextResponse.json({ error: 'Forbidden - Not part of this conversation' }, { status: 403 });
        }

        // Fetch messages for this conversation
        const messages = await prisma.message.findMany({
            where: { conversationId: conversationId },
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({
            success: true,
            conversation: conversation,
            messages: messages
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
