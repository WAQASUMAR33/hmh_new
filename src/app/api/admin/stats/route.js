import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(req) {
    try {
        // Get counts for different user types
        const [publishers, advertisers, opportunities, bookings] = await Promise.all([
            prisma.user.count({ where: { role: 'PUBLISHER' } }),
            prisma.user.count({ where: { role: 'ADVERTISER' } }),
            prisma.opportunity.count(),
            prisma.booking.count()
        ]);

        // Get revenue from completed bookings
        const revenueResult = await prisma.booking.aggregate({
            where: {
                status: {
                    in: ['COMPLETED', 'DELIVERED', 'PAID']
                }
            },
            _sum: {
                selectedPrice: true
            }
        });

        const totalRevenue = revenueResult._sum.selectedPrice || 0;

        // Get recent activity counts
        const [recentPublishers, recentAdvertisers, recentOpportunities, recentBookings] = await Promise.all([
            prisma.user.count({
                where: {
                    role: 'PUBLISHER',
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            }),
            prisma.user.count({
                where: {
                    role: 'ADVERTISER',
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            }),
            prisma.opportunity.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            }),
            prisma.booking.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            })
        ]);

        // Get active users (users who have created opportunities or bookings in last 30 days)
        const activePublishers = await prisma.user.count({
            where: {
                role: 'PUBLISHER',
                OR: [
                    {
                        opportunities: {
                            some: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                }
                            }
                        }
                    },
                    {
                        publisherBookings: {
                            some: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                }
                            }
                        }
                    }
                ]
            }
        });

        const activeAdvertisers = await prisma.user.count({
            where: {
                role: 'ADVERTISER',
                advertiserBookings: {
                    some: {
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalPublishers: publishers,
                totalAdvertisers: advertisers,
                totalOpportunities: opportunities,
                totalBookings: bookings,
                totalRevenue: parseFloat(totalRevenue.toString()),
                activeUsers: activePublishers + activeAdvertisers,
                recentPublishers,
                recentAdvertisers,
                recentOpportunities,
                recentBookings,
                suspendedAccounts: 0, // Placeholder - would need to implement suspension system
                pendingAppeals: 0 // Placeholder - would need to implement appeals system
            }
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

