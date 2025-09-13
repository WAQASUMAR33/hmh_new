import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getSessionOrNull } from '@/app/api/_lib/auth';

// GET /api/notifications - Get notifications for current user
export async function GET(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get('unread') === 'true';

        // Build the where clause conditionally
        let whereClause = {
            userId: session.id
        };

        // Only add read filter if the field is available
        if (unreadOnly) {
            try {
                // Test if the read field exists by trying to access it
                const testNotification = await prisma.notification.findFirst({
                    where: { userId: session.id },
                    select: { read: true }
                });
                
                if (testNotification && 'read' in testNotification) {
                    whereClause.read = false;
                }
            } catch (fieldError) {
                console.warn('Read field not available in Prisma client:', fieldError.message);
                // Continue without the read filter
            }
        }

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                userId: true,
                senderId: true,
                opportunityId: true,
                messageId: true,
                bookingId: true,
                type: true,
                title: true,
                // Only select read field if it exists
                ...(await checkFieldExists('read') ? { read: true } : {}),
                createdAt: true,
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                        role: true,
                        companyLegalName: true,
                        brandName: true,
                    }
                },
                opportunity: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    }
                }
            }
        });

        return NextResponse.json({ data: notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Helper function to check if a field exists in the Prisma model
async function checkFieldExists(fieldName) {
    try {
        const testResult = await prisma.notification.findFirst({
            select: { [fieldName]: true }
        });
        return testResult && fieldName in testResult;
    } catch (error) {
        return false;
    }
}

// POST /api/notifications - Mark notification as read
export async function POST(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId } = await req.json();

        // Check if read field exists before trying to use it
        const readFieldExists = await checkFieldExists('read');
        
        if (!readFieldExists) {
            return NextResponse.json({ 
                error: 'Read functionality not available in current Prisma client' 
            }, { status: 501 });
        }

        if (notificationId) {
            // Mark specific notification as read
            await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId: session.id
                },
                data: { read: true }
            });
        } else {
            // Mark all notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId: session.id,
                    read: false
                },
                data: { read: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
