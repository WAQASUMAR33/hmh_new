import { NextResponse as RR } from "next/server";
import { prisma as p } from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { requireRole } from "../_lib/auth";
import { CreateBookingSchema } from "../_lib/schemas/opportunity";

// Create a new booking request
export async function POST(req) {
    try {
        console.log("Booking API: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("Booking API: Auth token found:", !!authToken);
        if (authToken) {
            console.log("Booking API: Auth token value length:", authToken.value.length);
        }
        
        // Use manual JWT verification since requireSession seems to have issues
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("Booking API: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("Booking API: JWT verification failed:", jwtError.message);
                throw new Error("UNAUTHENTICATED");
            }
        } else {
            throw new Error("UNAUTHENTICATED");
        }
        
        requireRole(session, ["ADVERTISER", "ADMIN"]);
        console.log("Booking API: Role check passed");

        // Debug: Log the raw request body
        const rawBody = await req.json();
        console.log("Booking API: Raw request body:", rawBody);
        
        let data;
        try {
            data = CreateBookingSchema.parse(rawBody);
            console.log("Booking API: Data validated", { opportunityId: data.opportunityId });
        } catch (validationError) {
            console.log("Booking API: Validation error:", validationError);
            return RR.json({ 
                message: "Invalid booking data", 
                error: validationError.message 
            }, { status: 400 });
        }
        
        // Validate opportunity exists and is published
        const opportunity = await p.opportunity.findUnique({
            where: { id: data.opportunityId },
            select: { 
                id: true, 
                status: true, 
                publisherId: true,
                availableFrom: true,
                availableTo: true,
                basePrice: true,
                currency: true
            },
        });
        
        if (!opportunity || opportunity.status !== "PUBLISHED") {
            return RR.json({ message: "Opportunity unavailable" }, { status: 404 });
        }

        // Validate availability window if specified
        if (opportunity.availableFrom && opportunity.availableTo) {
            const requestedStart = new Date(data.requestedStart);
            const requestedEnd = new Date(data.requestedEnd);
            const availableFrom = new Date(opportunity.availableFrom);
            const availableTo = new Date(opportunity.availableTo);
            
            if (requestedStart < availableFrom || requestedEnd > availableTo) {
                return RR.json({ 
                    message: "Requested dates outside available window" 
                }, { status: 400 });
            }
        }

        // Check if offer exists and belongs to user (if provided)
        if (data.offerId) {
            const offer = await p.offer.findFirst({
                where: { 
                    id: data.offerId,
                    advertiserId: session.sub,
                    opportunityId: data.opportunityId
                }
            });
            if (!offer) {
                return RR.json({ message: "Invalid offer" }, { status: 400 });
            }
        }

        // Create booking
        const booking = await p.booking.create({
            data: {
                opportunityId: data.opportunityId,
                advertiserId: session.sub,
                publisherId: opportunity.publisherId,
                offerId: data.offerId || null,
                requestedStart: new Date(data.requestedStart),
                requestedEnd: new Date(data.requestedEnd),
                selectedPrice: new Prisma.Decimal(data.selectedPrice),
                currency: data.currency || "USD",
                notes: data.notes || null,
                status: "PENDING",
                paymentStatus: "PENDING",
            },
            include: {
                opportunity: {
                    select: { title: true, publisher: { select: { firstName: true, lastName: true, email: true } } }
                },
                advertiser: {
                    select: { firstName: true, lastName: true, email: true }
                }
            }
        });

        // Create notification for publisher
        await p.notification.create({
            data: {
                userId: opportunity.publisherId,
                senderId: session.sub,
                opportunityId: data.opportunityId,
                bookingId: booking.id,
                type: "BOOKING_REQUEST",
                title: "New Booking Request",
                body: `You have a new booking request for "${opportunity.title}"`,
            }
        });

        return RR.json({ ok: true, booking }, { status: 201 });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return RR.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN") return RR.json({ message: "Forbidden" }, { status: 403 });
        console.error("Create booking error:", e);
        return RR.json({ message: "Failed to create booking" }, { status: 500 });
    }
}

// List bookings (filtered by user role)
export async function GET(req) {
    try {
        console.log("GET /api/bookings: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("GET /api/bookings: Auth token found:", !!authToken);
        
        // Use manual JWT verification since requireSession seems to have issues
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("GET /api/bookings: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("GET /api/bookings: JWT verification failed:", jwtError.message);
                return RR.json({ message: "Unauthenticated" }, { status: 401 });
            }
        } else {
            return RR.json({ message: "Unauthenticated" }, { status: 401 });
        }
        
        // Validate session has required fields
        if (!session || !session.sub || !session.role) {
            console.error("GET /api/bookings: Invalid session data:", session);
            return RR.json({ message: "Invalid session data" }, { status: 401 });
        }
        
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const opportunityId = searchParams.get('opportunityId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let whereClause = {};
        
        // Filter by user role
        if (session.role === "ADVERTISER") {
            whereClause.advertiserId = session.sub;
        } else if (session.role === "PUBLISHER") {
            whereClause.publisherId = session.sub;
        } else if (session.role !== "ADMIN") {
            return RR.json({ message: "Forbidden" }, { status: 403 });
        }

        if (status) whereClause.status = status;
        if (opportunityId) whereClause.opportunityId = opportunityId;

        console.log("GET /api/bookings: Query whereClause:", whereClause);

        const [bookings, total] = await Promise.all([
            p.booking.findMany({
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
                skip: offset,
                take: limit,
            }),
            p.booking.count({ where: whereClause })
        ]);

        console.log(`GET /api/bookings: Found ${bookings.length} bookings out of ${total} total`);

        return RR.json({
            ok: true,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (e) {
        console.error("GET /api/bookings: Error:", e);
        return RR.json({ message: "Failed to list bookings", error: e.message }, { status: 500 });
    }
}
