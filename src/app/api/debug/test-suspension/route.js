import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Test suspension system
export async function GET(request) {
    try {
        // Get a test user (publisher or advertiser)
        const testUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { role: 'PUBLISHER' },
                    { role: 'ADVERTISER' }
                ]
            },
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

        if (!testUser) {
            return NextResponse.json({
                success: false,
                message: 'No test users found. Please create a publisher or advertiser account first.'
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Suspension system test data',
            testUser: testUser,
            systemStatus: {
                suspensionFields: {
                    isSuspended: testUser.isSuspended !== undefined,
                    suspensionReason: testUser.suspensionReason !== undefined,
                    suspensionDate: testUser.suspensionDate !== undefined
                },
                userRole: testUser.role,
                currentStatus: testUser.isSuspended ? 'SUSPENDED' : 'ACTIVE'
            }
        });

    } catch (error) {
        console.error('Error testing suspension system:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to test suspension system',
                details: error.message
            },
            { status: 500 }
        );
    }
}
