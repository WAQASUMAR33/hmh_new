import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.json({ 
                success: false, 
                error: 'User not found' 
            }, { status: 404 });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid password' 
            }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with cookie
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
