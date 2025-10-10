import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all appeals
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';
        const userType = searchParams.get('userType') || 'all';

        // Build where clause
        const where = {};
        
        if (status !== 'all') {
            where.status = status.toUpperCase();
        }
        
        if (userType !== 'all') {
            where.userType = userType;
        }

        const appeals = await prisma.appeal.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform data for frontend
        const transformedAppeals = appeals.map(appeal => ({
            id: appeal.id,
            userId: appeal.userId,
            userName: `${appeal.user.firstName} ${appeal.user.lastName}`,
            userEmail: appeal.user.email,
            userType: appeal.userType,
            appealDate: appeal.createdAt.toISOString().split('T')[0],
            status: appeal.status.toLowerCase(),
            originalSuspensionReason: appeal.originalSuspensionReason,
            appealMessage: appeal.appealMessage,
            adminResponse: appeal.adminResponse || '',
            responseDate: appeal.responseDate ? appeal.responseDate.toISOString().split('T')[0] : null,
            respondedBy: appeal.respondedBy || null
        }));

        return NextResponse.json({
            success: true,
            appeals: transformedAppeals
        });

    } catch (error) {
        console.error('Error fetching appeals:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch appeals' },
            { status: 500 }
        );
    }
}

// POST - Create new appeal
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, userType, originalSuspensionReason, appealMessage } = body;

        if (!userId || !userType || !originalSuspensionReason || !appealMessage) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user exists and is suspended
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isSuspended: true,
                suspensionReason: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.isSuspended) {
            return NextResponse.json(
                { success: false, error: 'User is not suspended' },
                { status: 400 }
            );
        }

        // Check if user already has a pending appeal
        const existingAppeal = await prisma.appeal.findFirst({
            where: {
                userId: userId,
                status: 'PENDING'
            }
        });

        if (existingAppeal) {
            return NextResponse.json(
                { success: false, error: 'You already have a pending appeal' },
                { status: 400 }
            );
        }

        // Create new appeal
        const newAppeal = await prisma.appeal.create({
            data: {
                userId: userId,
                userType: userType,
                originalSuspensionReason: originalSuspensionReason,
                appealMessage: appealMessage,
                status: 'PENDING'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Appeal submitted successfully',
            appeal: {
                id: newAppeal.id,
                userId: newAppeal.userId,
                userName: `${newAppeal.user.firstName} ${newAppeal.user.lastName}`,
                userEmail: newAppeal.user.email,
                userType: newAppeal.userType,
                appealDate: newAppeal.createdAt.toISOString().split('T')[0],
                status: newAppeal.status.toLowerCase(),
                originalSuspensionReason: newAppeal.originalSuspensionReason,
                appealMessage: newAppeal.appealMessage
            }
        });

    } catch (error) {
        console.error('Error creating appeal:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit appeal' },
            { status: 500 }
        );
    }
}
