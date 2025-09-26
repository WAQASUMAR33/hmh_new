import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/admin/opportunities - Get all opportunities for admin dashboard
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (status) {
            whereClause.status = status;
        }

        const [opportunities, total] = await Promise.all([
            prisma.opportunity.findMany({
                where: whereClause,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    description: true,
                    placementType: true,
                    pricingType: true,
                    basePrice: true,
                    currency: true,
                    status: true,
                    monthlyTraffic: true,
                    availableFrom: true,
                    availableTo: true,
                    createdAt: true,
                    updatedAt: true,
                    publisher: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            companyLegalName: true,
                            brandName: true
                        }
                    },
                    _count: {
                        select: {
                            bookings: true,
                            offers: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit
            }),
            prisma.opportunity.count({ where: whereClause })
        ]);

        return NextResponse.json({
            success: true,
            data: opportunities,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching opportunities for admin:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

