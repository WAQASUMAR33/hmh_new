import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log('=== MANUAL VERIFICATION ===');
        console.log('Looking for user with email:', email);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ User not found for email:', email);
            return NextResponse.json({ 
                error: 'User not found',
                debug: { email, userFound: false }
            }, { status: 404 });
        }

        console.log('✅ User found:', user.id);

        // Update user to verified
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                isActivated: 1,
                isActivatedDate: new Date(),
            },
        });

        console.log('✅ User verified successfully');

        return NextResponse.json({
            success: true,
            message: 'User verified successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                emailVerified: updatedUser.emailVerified,
                isActivated: updatedUser.isActivated,
            }
        });
    } catch (error) {
        console.error('Manual verification error:', error);
        return NextResponse.json({ 
            error: 'Failed to verify user',
            details: error.message 
        }, { status: 500 });
    }
}
