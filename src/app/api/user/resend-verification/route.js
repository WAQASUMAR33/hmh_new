import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '../../../utils/prisma';
import { generateVerificationToken } from '../../../lib/auth';

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
        const { email } = await req.json();

        // Validate required field
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        console.log('=== RESEND VERIFICATION ===');
        console.log('Looking for user with email:', email);
        
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log('User lookup result:', user ? `Found user ID: ${user.id}` : 'User not found');
        
        if (!user) {
            console.error('❌ User not found for email:', email);
            return NextResponse.json({ 
                error: 'User not found',
                debug: { email, userFound: false }
            }, { status: 404 });
        }

        // Check if email is already verified
        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken(user.id);
        console.log('Generated Token:', verificationToken); // Debug
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/verify?token=${verificationToken}`;
        console.log('Verification Link:', verificationLink); // Debug

        // Send verification email with better error handling
        try {
            // Check if email configuration is set up
            if (!EMAIL_USER || !EMAIL_PASS) {
                console.error('Email configuration missing:', { EMAIL_USER: !!EMAIL_USER, EMAIL_PASS: !!EMAIL_PASS });
                return NextResponse.json({ 
                    error: 'Email verification is not configured. Please contact support.' 
                }, { status: 500 });
            }

            await transporter.sendMail({
                from: EMAIL_USER,
                to: email,
                subject: 'Verify Your Email Address',
                html: `
                    <h3>Welcome, ${user.firstName}!</h3>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none;">Verify Email</a>
                    <p>Or copy and paste this link: ${verificationLink}</p>
                    <p>This link will expire in 24 hours.</p>
                `,
            });

            console.log('Verification email resent successfully to:', email);
            return NextResponse.json({ message: 'Verification email resent successfully' }, { status: 200 });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({ 
                error: `Failed to send verification email: ${emailError.message}` 
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}