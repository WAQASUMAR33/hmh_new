import { NextResponse } from 'next/server';
import { getSessionOrNull } from '../../_lib/auth';

export async function GET(req) {
    try {
        console.log("Debug user: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("Debug user: Auth token found:", !!authToken);
        
        if (!authToken?.value) {
            return NextResponse.json({ 
                authenticated: false,
                message: "No auth token found",
                cookies: Object.keys(cookieStore.getAll())
            });
        }
        
        // Use manual JWT verification
        try {
            const jwt = await import("jsonwebtoken");
            const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
            console.log("Debug user: JWT verification successful:", payload);
            
            const session = { 
                id: payload.sub,
                sub: payload.sub, 
                email: payload.email, 
                role: payload.role,
                firstName: payload.firstName,
                lastName: payload.lastName
            };
            
            return NextResponse.json({
                authenticated: true,
                user: session,
                jwtPayload: payload
            });
            
        } catch (jwtError) {
            console.error("Debug user: JWT verification failed:", jwtError);
            
            // Try to decode without verification to see the payload
            try {
                const decodedWithoutVerification = jwt.decode(authToken.value);
                return NextResponse.json({
                    authenticated: false,
                    error: "JWT verification failed",
                    jwtError: jwtError.message,
                    decodedWithoutVerification,
                    tokenExists: true,
                    jwtSecretExists: !!process.env.JWT_SECRET
                });
            } catch (decodeError) {
                return NextResponse.json({
                    authenticated: false,
                    error: "JWT decode failed",
                    jwtError: jwtError.message,
                    decodeError: decodeError.message,
                    tokenExists: true,
                    jwtSecretExists: !!process.env.JWT_SECRET
                });
            }
        }
        
    } catch (error) {
        console.error("Debug user error:", error);
        return NextResponse.json({ 
            authenticated: false,
            error: error.message,
            stack: error.stack
        });
    }
}
