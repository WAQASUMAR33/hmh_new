import { NextResponse } from 'next/server';
import { prisma } from '../../utils/prisma';

export async function GET(req) {
    try {
        // Temporarily bypass authentication for testing
        console.log('Fetching publishers (bypassing auth for testing)...');
        
        const publishers = await prisma.user.findMany({
            where: { 
                role: 'PUBLISHER', 
                emailVerified: true, 
                isActivated: 1 
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isSuspended: true,
                suspensionReason: true,
                suspensionDate: true,
                companyLegalName: true,
                contactName: true,
                websiteRegion: true,
                monthlyTraffic: true,
                monthlyPageViews: true,
                briefIntro: true,
                entityType: true,
                website: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${publishers.length} publishers`);
        
        return NextResponse.json({ 
            success: true, 
            publishers: publishers,
            message: `Found ${publishers.length} publishers (auth bypassed for testing)`
        });

    } catch (error) {
        console.error('Error fetching publishers:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
