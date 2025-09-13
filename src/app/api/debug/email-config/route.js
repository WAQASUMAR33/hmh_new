import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const emailConfig = {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not Set',
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? 'Set' : 'Not Set',
            JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
        };

        const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        
        return NextResponse.json({
            emailConfiguration: emailConfig,
            emailConfigured: hasEmailConfig,
            message: hasEmailConfig 
                ? 'Email configuration appears to be set up correctly' 
                : 'Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.',
        });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to check email configuration',
            details: error.message 
        }, { status: 500 });
    }
}
