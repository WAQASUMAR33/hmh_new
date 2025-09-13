import { NextResponse } from 'next/server';
import { requireSession, requireRole } from '../../_lib/auth';

export async function GET(req) {
    try {
        // Test the exact same authentication flow as the booking API
        const session = requireSession();
        requireRole(session, ["ADVERTISER", "ADMIN"]);
        
        return NextResponse.json({
            message: "Authentication successful",
            session: {
                sub: session.sub,
                email: session.email,
                role: session.role,
                firstName: session.firstName,
                lastName: session.lastName
            }
        });
    } catch (error) {
        console.error('Booking test error:', error);
        return NextResponse.json({ 
            message: error.message,
            error: error.message 
        }, { status: error.message === "UNAUTHENTICATED" ? 401 : 403 });
    }
}
