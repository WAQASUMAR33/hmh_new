import { NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";
import { requireSession } from "../../_lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(req) {
    try {
        console.log("Create test data: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("Create test data: Auth token found:", !!authToken);
        
        // Use manual JWT verification
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("Create test data: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("Create test data: JWT verification failed:", jwtError.message);
                return NextResponse.json({ error: "JWT verification failed", details: jwtError.message }, { status: 401 });
            }
        } else {
            return NextResponse.json({ error: "No auth token found" }, { status: 401 });
        }
        
        console.log("Create test data - Session:", session);
        
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: session.sub },
            select: { id: true, email: true, role: true, firstName: true, lastName: true }
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found", sessionSub: session.sub }, { status: 404 });
        }
        
        console.log("Create test data - User found:", user);
        
        // Create test opportunity if user is publisher
        let opportunity = null;
        if (user.role === "PUBLISHER") {
            opportunity = await prisma.opportunity.create({
                data: {
                    publisherId: user.id,
                    title: "Test Opportunity for Bookings",
                    slug: "test-opportunity-bookings",
                    summary: "This is a test opportunity to test the booking system",
                    description: "A comprehensive test opportunity to verify that the booking system works correctly.",
                    placementType: "SPONSORED_POST",
                    pricingType: "FIXED",
                    basePrice: new Prisma.Decimal("100.00"),
                    currency: "USD",
                    requirements: "Test requirements",
                    deliverables: "Test deliverables",
                    availableFrom: new Date(),
                    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    status: "PUBLISHED",
                }
            });
            console.log("Created test opportunity:", opportunity.id);
        }
        
        // Create test booking if user is advertiser
        let booking = null;
        if (user.role === "ADVERTISER") {
            // First, find an opportunity to book
            const testOpportunity = await prisma.opportunity.findFirst({
                where: { status: "PUBLISHED" },
                select: { id: true, publisherId: true, title: true }
            });
            
            if (testOpportunity) {
                booking = await prisma.booking.create({
                    data: {
                        opportunityId: testOpportunity.id,
                        advertiserId: user.id,
                        publisherId: testOpportunity.publisherId,
                        requestedStart: new Date(),
                        requestedEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        selectedPrice: new Prisma.Decimal("100.00"),
                        currency: "USD",
                        notes: "This is a test booking to verify the system works",
                        status: "PENDING",
                        paymentStatus: "PENDING",
                    },
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
                    }
                });
                console.log("Created test booking:", booking.id);
            } else {
                console.log("No opportunities available for booking");
            }
        }
        
        return NextResponse.json({
            user,
            createdOpportunity: opportunity,
            createdBooking: booking,
            message: "Test data created successfully"
        });
        
    } catch (error) {
        console.error("Create test data error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
