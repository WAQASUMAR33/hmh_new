import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/admin/users - Get all users for admin dashboard
export async function GET(req) {
    try {
        // Check if user is admin (you can add proper auth check here)
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role'); // 'PUBLISHER', 'ADVERTISER', or null for all
        
        let whereClause = {};
        if (role) {
            whereClause.role = role;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                emailVerified: true,
                isActivated: true,
                companyLegalName: true,
                brandName: true,
                website: true,
                phoneNumber: true,
                country: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        opportunities: true,
                        advertiserBookings: true,
                        publisherBookings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: users,
            total: users.length
        });

    } catch (error) {
        console.error('Error fetching users for admin:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

