import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Check if user is suspended
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isSuspended: true,
                suspensionReason: true,
                suspensionDate: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.isSuspended) {
            return NextResponse.json({
                success: true,
                isSuspended: true,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    suspensionReason: user.suspensionReason,
                    suspensionDate: user.suspensionDate
                }
            });
        }

        return NextResponse.json({
            success: true,
            isSuspended: false,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error checking suspension status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to check suspension status' },
            { status: 500 }
        );
    }
}
