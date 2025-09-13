import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';

export async function GET(req) {
    try {
        // Check if there are any publishers in the database
        const publishers = await prisma.user.findMany({
            where: {
                role: 'PUBLISHER'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                emailVerified: true,
                isActivated: true,
                companyLegalName: true,
                contactName: true,
                websiteRegion: true,
                monthlyTraffic: true,
                monthlyPageViews: true,
                briefIntro: true,
                entityType: true,
                website: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            totalPublishers: publishers.length,
            publishers: publishers,
            message: `Found ${publishers.length} publishers in database`
        });

    } catch (error) {
        console.error('Error checking publishers:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Create test publisher data
        const testPublishers = [
            {
                role: 'PUBLISHER',
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@techblog.com',
                username: 'techblogger',
                password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password123
                emailVerified: true,
                isActivated: 1,
                companyLegalName: 'Tech Blog Media LLC',
                contactName: 'John Smith',
                websiteRegion: 'USA',
                monthlyTraffic: 150000,
                monthlyPageViews: 450000,
                briefIntro: 'Leading technology blog covering the latest in software development, AI, and digital innovation.',
                entityType: 'LLC',
                website: 'https://techblog.com'
            },
            {
                role: 'PUBLISHER',
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah@lifestylehub.com',
                username: 'lifestylehub',
                password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password123
                emailVerified: true,
                isActivated: 1,
                companyLegalName: 'Lifestyle Hub Media',
                contactName: 'Sarah Johnson',
                websiteRegion: 'UK',
                monthlyTraffic: 75000,
                monthlyPageViews: 200000,
                briefIntro: 'Premier lifestyle and wellness content platform helping readers live their best lives.',
                entityType: 'Corporation',
                website: 'https://lifestylehub.com'
            },
            {
                role: 'PUBLISHER',
                firstName: 'Mike',
                lastName: 'Chen',
                email: 'mike@startupdaily.com',
                username: 'startupdaily',
                password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password123
                emailVerified: true,
                isActivated: 1,
                companyLegalName: 'Startup Daily Inc',
                contactName: 'Mike Chen',
                websiteRegion: 'Global',
                monthlyTraffic: 300000,
                monthlyPageViews: 800000,
                briefIntro: 'Your daily source for startup news, funding rounds, and entrepreneurial insights.',
                entityType: 'Corporation',
                website: 'https://startupdaily.com'
            },
            {
                role: 'PUBLISHER',
                firstName: 'Emma',
                lastName: 'Wilson',
                email: 'emma@fashionforward.com',
                username: 'fashionforward',
                password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password123
                emailVerified: true,
                isActivated: 1,
                companyLegalName: 'Fashion Forward Media',
                contactName: 'Emma Wilson',
                websiteRegion: 'Europe',
                monthlyTraffic: 120000,
                monthlyPageViews: 350000,
                briefIntro: 'Trendsetting fashion and beauty content for the modern, style-conscious audience.',
                entityType: 'Partnership',
                website: 'https://fashionforward.com'
            },
            {
                role: 'PUBLISHER',
                firstName: 'David',
                lastName: 'Brown',
                email: 'david@fitnesspro.com',
                username: 'fitnesspro',
                password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password123
                emailVerified: true,
                isActivated: 1,
                companyLegalName: 'Fitness Pro Network',
                contactName: 'David Brown',
                websiteRegion: 'USA',
                monthlyTraffic: 95000,
                monthlyPageViews: 280000,
                briefIntro: 'Comprehensive fitness and nutrition content to help readers achieve their health goals.',
                entityType: 'Sole Proprietorship',
                website: 'https://fitnesspro.com'
            }
        ];

        const createdPublishers = [];

        for (const publisherData of testPublishers) {
            try {
                const publisher = await prisma.user.create({
                    data: publisherData
                });
                createdPublishers.push(publisher);
            } catch (error) {
                if (error.code === 'P2002') {
                    // User already exists, skip
                    console.log(`Publisher ${publisherData.email} already exists`);
                } else {
                    console.error(`Error creating publisher ${publisherData.email}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${createdPublishers.length} test publishers`,
            createdPublishers: createdPublishers.map(p => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                companyLegalName: p.companyLegalName
            }))
        });

    } catch (error) {
        console.error('Error creating test publishers:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
