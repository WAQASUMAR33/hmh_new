import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getSessionOrNull } from '@/app/api/_lib/auth';


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
            whereClause.isRead = false;
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
                isRead: true,
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


// POST /api/notifications - Mark notification as read
export async function POST(req) {
    try {
        const session = await getSessionOrNull();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId } = await req.json();

        if (notificationId) {
            // Mark specific notification as read
            await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId: session.id
                },
                data: { isRead: true }
            });
        } else {
            // Mark all notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId: session.id,
                    isRead: false
                },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
