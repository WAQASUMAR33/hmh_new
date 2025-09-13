import { NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";
import { requireSession } from "../../_lib/auth";

export async function GET(req) {
    try {
        console.log("Debug bookings test: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("Debug bookings test: Auth token found:", !!authToken);
        
        // Use manual JWT verification
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("Debug bookings test: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("Debug bookings test: JWT verification failed:", jwtError.message);
                return NextResponse.json({ error: "JWT verification failed", details: jwtError.message }, { status: 401 });
            }
        } else {
            return NextResponse.json({ error: "No auth token found" }, { status: 401 });
        }
        
        console.log("Debug bookings test - Session:", session);
        
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: session.sub },
            select: { id: true, email: true, role: true, firstName: true, lastName: true }
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found", sessionSub: session.sub }, { status: 404 });
        }
        
        console.log("Debug bookings test - User found:", user);
        
        // Check for bookings based on role
        let whereClause = {};
        if (user.role === "ADVERTISER") {
            whereClause.advertiserId = user.id;
        } else if (user.role === "PUBLISHER") {
            whereClause.publisherId = user.id;
        }
        
        console.log("Debug bookings test - Where clause:", whereClause);
        
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                opportunity: {
                    select: { title: true, placementType: true }
                },
                advertiser: {
                    select: { firstName: true, lastName: true, email: true }
                },
                publisher: {
                    select: { firstName: true, lastName: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        
        console.log("Debug bookings test - Bookings found:", bookings.length);
        
        return NextResponse.json({
            user,
            bookingsCount: bookings.length,
            bookings: bookings,
            whereClause,
            session
        });
        
    } catch (error) {
        console.error("Debug bookings test error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
