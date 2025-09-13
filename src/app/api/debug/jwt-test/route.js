import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        console.log("JWT Test: Starting");
        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
        
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("JWT Test: Auth token found:", !!authToken);
        
        if (!authToken) {
            return NextResponse.json({ 
                message: "No auth token found",
                error: "NO_TOKEN" 
            });
        }
        
        console.log("JWT Test: Token length:", authToken.value.length);
        
        // Decode without verification first
        const decoded = jwt.decode(authToken.value);
        console.log("JWT Test: Decoded payload:", decoded);
        
        // Now verify
        const verified = jwt.verify(authToken.value, process.env.JWT_SECRET);
        console.log("JWT Test: Verified payload:", verified);
        
        return NextResponse.json({
            message: "JWT verification successful",
            decoded,
            verified,
            hasRole: !!verified.role,
            role: verified.role
        });
        
    } catch (error) {
        console.error('JWT Test error:', error);
        return NextResponse.json({ 
            message: error.message,
            error: error.message 
        }, { status: 500 });
    }
}
