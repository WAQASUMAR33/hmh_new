import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';

export async function GET() {
    try {
        console.log('=== SIMPLE TEST ===');
        
        // Test 1: Check if Prisma is working
        console.log('Test 1: Checking Prisma connection...');
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
        
        // Test 2: Check environment variables
        console.log('Test 2: Checking environment variables...');
        const envCheck = {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not Set',
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? 'Set' : 'Not Set',
            JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
        };
        console.log('Environment check:', envCheck);
        
        // Test 3: Try to create a simple user
        console.log('Test 3: Testing user creation...');
        const testUser = await prisma.user.create({
            data: {
                role: 'ADVERTISER',
                firstName: 'Test',
                lastName: 'User',
                email: `test${Date.now()}@example.com`,
                username: `testuser${Date.now()}`,
                password: 'hashedpassword',
                brandName: 'Test Brand',
                companyLegalName: 'Test Company',
                termsAndConditions: 'Test terms',
                termsAccepted: true,
                website: 'https://test.com',
                phoneNumber: '1234567890',
                country: 'USA',
                state: 'CA',
                city: 'Los Angeles',
                postalCode: '90210',
                address: '123 Test St',
            },
        });
        console.log('User created successfully:', testUser.id);
        
        // Test 4: Try to find the user
        console.log('Test 4: Testing user lookup...');
        const foundUser = await prisma.user.findUnique({
            where: { id: testUser.id },
        });
        console.log('User lookup result:', foundUser ? 'Found' : 'Not found');
        
        // Clean up
        console.log('Test 5: Cleaning up...');
        await prisma.user.delete({
            where: { id: testUser.id },
        });
        console.log('Test user deleted');
        
        return NextResponse.json({
            success: true,
            message: 'All tests passed',
            results: {
                userCount,
                envCheck,
                userCreated: true,
                userLookup: !!foundUser,
                cleanup: true
            }
        });
        
    } catch (error) {
        console.error('Simple test error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
