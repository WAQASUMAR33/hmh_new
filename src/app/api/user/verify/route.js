import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';
import { verifyJwt } from '../../../lib/auth';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    console.log('Received Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        // Decode token for debugging
        const decodedPayload = jwt.decode(token);
        console.log('Token Payload:', decodedPayload);

        // Verify token
        const decoded = verifyJwt(token);
        const userId = decoded.userId;
        console.log('Decoded User ID:', userId);

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        console.log('User Found:', user);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user
        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    emailVerified: true,
                    isActivated: 1,
                    isActivatedDate: new Date(), // Use existing field
                },
            });
        } catch (updateError) {
            console.error('Prisma Update Error:', updateError);
            return NextResponse.json({ error: `Failed to update user: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.redirect(new URL('/login', req.url));
    } catch (error) {
        console.error('Error verifying email:', error);
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token has expired. Please request a new verification email at /api/user/resend-verification.' },
                { status: 400 }
            );
        }
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: `Invalid token: ${error.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: 'Invalid token or server error' }, { status: 400 });
    }
}