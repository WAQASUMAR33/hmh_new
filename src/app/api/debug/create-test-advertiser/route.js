import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        // Create test advertiser
        const testAdvertiser = {
            role: 'ADVERTISER',
            firstName: 'Test',
            lastName: 'Advertiser',
            email: 'test.advertiser@example.com',
            username: 'testadvertiser',
            password: await bcrypt.hash('password123', 12),
            emailVerified: true,
            isActivated: 1,
            brandName: 'Test Brand',
            termsAccepted: true,
            termsAndConditions: 'Test terms and conditions for our brand.',
            website: 'https://testbrand.com',
            phoneNumber: '1234567890',
            country: 'USA',
            state: 'CA',
            city: 'Los Angeles',
            postalCode: '90210',
            address: '123 Test Street'
        };

        try {
            const advertiser = await prisma.user.create({
                data: testAdvertiser
            });

            return NextResponse.json({
                success: true,
                message: 'Test advertiser created successfully',
                advertiser: {
                    id: advertiser.id,
                    email: advertiser.email,
                    firstName: advertiser.firstName,
                    lastName: advertiser.lastName,
                    role: advertiser.role
                },
                loginCredentials: {
                    email: 'test.advertiser@example.com',
                    password: 'password123'
                }
            });

        } catch (error) {
            if (error.code === 'P2002') {
                return NextResponse.json({
                    success: true,
                    message: 'Test advertiser already exists',
                    loginCredentials: {
                        email: 'test.advertiser@example.com',
                        password: 'password123'
                    }
                });
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('Error creating test advertiser:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
