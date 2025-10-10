import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendSuspensionEmail } from '../../../lib/email.js';

const prisma = new PrismaClient();

// POST - Suspend a user (publisher or advertiser)
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, suspensionReason, suspendedBy } = body;

        if (!userId || !suspensionReason || !suspendedBy) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
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
                isSuspended: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is already suspended
        if (user.isSuspended) {
            return NextResponse.json(
                { success: false, error: 'User is already suspended' },
                { status: 400 }
            );
        }

        // Update user suspension status
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                isSuspended: true,
                suspensionReason: suspensionReason,
                suspensionDate: new Date(),
                suspendedBy: suspendedBy
            }
        });

        // Send suspension email
        try {
            const userType = user.role.toLowerCase();
            await sendSuspensionEmail(
                user.email,
                user.firstName,
                user.lastName,
                userType,
                suspensionReason
            );
        } catch (emailError) {
            console.error('Failed to send suspension email:', emailError);
            // Don't fail the suspension if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'User suspended successfully',
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isSuspended: updatedUser.isSuspended,
                suspensionReason: updatedUser.suspensionReason,
                suspensionDate: updatedUser.suspensionDate
            }
        });

    } catch (error) {
        console.error('Error suspending user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to suspend user' },
            { status: 500 }
        );
    }
}

// PUT - Unsuspend a user
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, unsuspendedBy } = body;

        if (!userId || !unsuspendedBy) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
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
                isSuspended: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is not suspended
        if (!user.isSuspended) {
            return NextResponse.json(
                { success: false, error: 'User is not suspended' },
                { status: 400 }
            );
        }

        // Update user suspension status
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                isSuspended: false,
                suspensionReason: null,
                suspensionDate: null,
                suspendedBy: null
            }
        });

        return NextResponse.json({
            success: true,
            message: 'User unsuspended successfully',
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isSuspended: updatedUser.isSuspended
            }
        });

    } catch (error) {
        console.error('Error unsuspending user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to unsuspend user' },
            { status: 500 }
        );
    }
}
