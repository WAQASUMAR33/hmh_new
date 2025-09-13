import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { hashPassword, generateVerificationToken } from '../../lib/auth';
import { prisma } from '../../utils/prisma';

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
        console.log('=== SIGNUP REQUEST RECEIVED ===');
        
        const requestData = await req.json();
        console.log('Raw request data:', requestData);
        
        const {
            role,
            firstName,
            lastName,
            email,
            username,
            password,
            companyLegalName,
            entityType,
            contactName,
            websiteRegion,
            monthlyTraffic,
            monthlyPageViews,
            briefIntro,
            brandName,
            termsAccepted,
            termsAndConditions,
            website,
            phoneNumber,
            country,
            state,
            city,
            postalCode,
            address,
        } = requestData;

        // Validate required fields
        console.log('=== VALIDATING FIELDS ===');
        console.log('Required fields check:', {
            role: !!role,
            firstName: !!firstName,
            lastName: !!lastName,
            email: !!email,
            username: !!username,
            password: !!password
        });
        
        if (!role || !firstName || !lastName || !email || !username || !password) {
            console.error('❌ Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate role
        if (!['PUBLISHER', 'ADVERTISER'].includes(role)) {
            console.error('❌ Invalid role:', role);
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }
        
        console.log('✅ Field validation passed');

        // Check if user already exists
        console.log('=== CHECKING EXISTING USER ===');
        console.log('Checking for existing user with email:', email, 'and username:', username);
        
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            console.error('❌ User already exists:', existingUser.email);
            return NextResponse.json({ error: 'Email or username already exists' }, { status: 400 });
        }
        
        console.log('✅ No existing user found');

        // Hash password
        console.log('=== HASHING PASSWORD ===');
        const hashedPassword = await hashPassword(password);
        console.log('✅ Password hashed successfully');

        // Create user
        console.log('=== CREATING USER ===');
        console.log('User data to create:', {
            role,
            firstName,
            lastName,
            email,
            username,
            brandName: role === 'ADVERTISER' ? brandName : null,
            companyLegalName: role === 'PUBLISHER' ? companyLegalName : null,
            termsAndConditions: role === 'ADVERTISER' ? termsAndConditions : null,
            termsAccepted: role === 'ADVERTISER' ? termsAccepted : null,
        });
        
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    role,
                    firstName,
                    lastName,
                    email,
                    username,
                    password: hashedPassword,
                    companyLegalName: role === 'PUBLISHER' ? companyLegalName : null,
                    entityType: role === 'PUBLISHER' ? entityType : null,
                    contactName: role === 'PUBLISHER' ? contactName : null,
                    websiteRegion: role === 'PUBLISHER' ? websiteRegion : null,
                    monthlyTraffic: role === 'PUBLISHER' ? monthlyTraffic : null,
                    monthlyPageViews: role === 'PUBLISHER' ? monthlyPageViews : null,
                    briefIntro: role === 'PUBLISHER' ? briefIntro : null,
                    brandName: role === 'ADVERTISER' ? brandName : null,
                    termsAccepted: role === 'ADVERTISER' ? termsAccepted : null,
                    termsAndConditions: role === 'ADVERTISER' ? termsAndConditions : null,
                    website,
                    phoneNumber,
                    country,
                    state,
                    city,
                    postalCode,
                    address,
                },
            });
            console.log('✅ User created successfully with ID:', user.id);
        } catch (createError) {
            console.error('❌ User creation failed:', createError);
            console.error('Error details:', {
                message: createError.message,
                code: createError.code,
                meta: createError.meta
            });
            return NextResponse.json({ 
                error: 'Failed to create user',
                details: createError.message 
            }, { status: 500 });
        }

        // Generate verification token
        console.log('=== GENERATING VERIFICATION TOKEN ===');
        const verificationToken = generateVerificationToken(user.id);
        console.log('Generated Token:', verificationToken);
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/verify?token=${verificationToken}`;
        console.log('Verification Link:', verificationLink);

        // Skip email sending for now - just return success
        console.log('=== SKIPPING EMAIL SENDING ===');
        console.log('User created with ID:', user.id);
        console.log('Verification link:', verificationLink);
        
        return NextResponse.json(
            {
                message: 'User registered successfully! Email verification is temporarily disabled. You can use the manual verification option.',
                userId: user.id,
                emailSent: false,
                debug: { 
                    emailSent: false, 
                    userId: user.id,
                    verificationLink
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}