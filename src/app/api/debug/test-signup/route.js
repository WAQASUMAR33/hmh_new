import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { hashPassword, generateVerificationToken } from '../../../lib/auth';
import { prisma } from '../../../utils/prisma';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function POST(req) {
    try {
        const testData = {
            role: 'ADVERTISER',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            brandName: 'Test Brand',
            companyLegalName: 'Test Company LLC',
            termsAndConditions: 'Test terms and conditions',
            termsAccepted: true,
            website: 'https://test.com',
            phoneNumber: '1234567890',
            country: 'USA',
            state: 'CA',
            city: 'Los Angeles',
            postalCode: '90210',
            address: '123 Test St',
        };

        console.log('=== TESTING SIGNUP PROCESS ===');
        
        // Step 1: Check if user already exists
        console.log('Step 1: Checking if user exists...');
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: testData.email }, { username: testData.username }],
            },
        });

        if (existingUser) {
            console.log('User already exists, deleting for test...');
            await prisma.user.delete({
                where: { id: existingUser.id },
            });
        }

        // Step 2: Hash password
        console.log('Step 2: Hashing password...');
        const hashedPassword = await hashPassword(testData.password);
        console.log('Password hashed successfully');

        // Step 3: Create user
        console.log('Step 3: Creating user...');
        const user = await prisma.user.create({
            data: {
                role: testData.role,
                firstName: testData.firstName,
                lastName: testData.lastName,
                email: testData.email,
                username: testData.username,
                password: hashedPassword,
                brandName: testData.brandName,
                companyLegalName: testData.companyLegalName,
                termsAndConditions: testData.termsAndConditions,
                termsAccepted: testData.termsAccepted,
                website: testData.website,
                phoneNumber: testData.phoneNumber,
                country: testData.country,
                state: testData.state,
                city: testData.city,
                postalCode: testData.postalCode,
                address: testData.address,
            },
        });
        console.log('User created successfully:', user.id);

        // Step 4: Generate verification token
        console.log('Step 4: Generating verification token...');
        const verificationToken = generateVerificationToken(user.id);
        console.log('Token generated:', verificationToken);
        
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/verify?token=${verificationToken}`;
        console.log('Verification link:', verificationLink);

        // Step 5: Test email sending
        console.log('Step 5: Testing email sending...');
        console.log('Email config:', {
            EMAIL_USER: EMAIL_USER ? 'Set' : 'Not Set',
            EMAIL_PASS: EMAIL_PASS ? 'Set' : 'Not Set',
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
        });

        try {
            await transporter.sendMail({
                from: EMAIL_USER,
                to: testData.email,
                subject: 'Test Email Verification',
                html: `
                    <h3>Test Email for ${testData.firstName}!</h3>
                    <p>This is a test verification email.</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none;">Verify Email</a>
                    <p>Or copy and paste this link: ${verificationLink}</p>
                `,
            });
            console.log('Test email sent successfully!');
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({
                success: false,
                message: 'User created but email failed',
                user: { id: user.id, email: user.email },
                emailError: emailError.message,
                steps: {
                    userExists: false,
                    passwordHashed: true,
                    userCreated: true,
                    tokenGenerated: true,
                    emailSent: false
                }
            });
        }

        // Step 6: Test user lookup
        console.log('Step 6: Testing user lookup...');
        const foundUser = await prisma.user.findUnique({
            where: { email: testData.email },
        });
        console.log('User lookup result:', foundUser ? 'Found' : 'Not found');

        return NextResponse.json({
            success: true,
            message: 'Test signup completed successfully',
            user: { id: user.id, email: user.email },
            verificationLink,
            steps: {
                userExists: false,
                passwordHashed: true,
                userCreated: true,
                tokenGenerated: true,
                emailSent: true,
                userLookup: !!foundUser
            }
        });

    } catch (error) {
        console.error('Test signup error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
