import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (req) => {
    try {
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return null;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};

export async function GET(req) {
    try {
        const user = verifyToken(req);
        
        if (!user) {
            return NextResponse.json({ 
                authenticated: false,
                error: 'No valid authentication token found'
            });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.sub,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            message: `Authenticated as ${user.role}`
        });

    } catch (error) {
        console.error('Auth test error:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}
