import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendAppealResponseEmail } from '../../../lib/email.js';

const prisma = new PrismaClient();

// PUT - Respond to an appeal (approve/reject)
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status, adminResponse, respondedBy } = body;

        if (!id || !status || !adminResponse || !respondedBy) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
            return NextResponse.json(
                { success: false, error: 'Invalid status. Must be APPROVED or REJECTED' },
                { status: 400 }
            );
        }

        // Get appeal with user details
        const appeal = await prisma.appeal.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        isSuspended: true
                    }
                }
            }
        });

        if (!appeal) {
            return NextResponse.json(
                { success: false, error: 'Appeal not found' },
                { status: 404 }
            );
        }

        if (appeal.status !== 'PENDING') {
            return NextResponse.json(
                { success: false, error: 'Appeal has already been responded to' },
                { status: 400 }
            );
        }

        const newStatus = status.toUpperCase();

        // Update appeal
        const updatedAppeal = await prisma.appeal.update({
            where: { id },
            data: {
                status: newStatus,
                adminResponse: adminResponse,
                responseDate: new Date(),
                respondedBy: respondedBy
            }
        });

        // If appeal is approved, unsuspend the user
        if (newStatus === 'APPROVED') {
            await prisma.user.update({
                where: { id: appeal.userId },
                data: {
                    isSuspended: false,
                    suspensionReason: null,
                    suspensionDate: null,
                    suspendedBy: null
                }
            });
        }

        // Send response email
        try {
            const userType = appeal.user.role.toLowerCase();
            await sendAppealResponseEmail(
                appeal.user.email,
                appeal.user.firstName,
                appeal.user.lastName,
                userType,
                newStatus,
                adminResponse
            );
        } catch (emailError) {
            console.error('Failed to send appeal response email:', emailError);
            // Don't fail the response if email fails
        }

        return NextResponse.json({
            success: true,
            message: `Appeal ${newStatus.toLowerCase()} successfully`,
            appeal: {
                id: updatedAppeal.id,
                userId: updatedAppeal.userId,
                userName: `${appeal.user.firstName} ${appeal.user.lastName}`,
                userEmail: appeal.user.email,
                userType: updatedAppeal.userType,
                appealDate: updatedAppeal.createdAt.toISOString().split('T')[0],
                status: updatedAppeal.status.toLowerCase(),
                originalSuspensionReason: updatedAppeal.originalSuspensionReason,
                appealMessage: updatedAppeal.appealMessage,
                adminResponse: updatedAppeal.adminResponse,
                responseDate: updatedAppeal.responseDate.toISOString().split('T')[0],
                respondedBy: updatedAppeal.respondedBy
            }
        });

    } catch (error) {
        console.error('Error responding to appeal:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to respond to appeal' },
            { status: 500 }
        );
    }
}
