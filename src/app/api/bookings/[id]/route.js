import { NextResponse as RR } from "next/server";
import { prisma as p } from "../../../utils/prisma";
import { requireSession, requireRole } from "../../_lib/auth";
import { UpdateBookingSchema } from "../../_lib/schemas/opportunity";

// Get a specific booking
export async function GET(req, { params }) {
    try {
        console.log("GET /api/bookings/[id]: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("GET /api/bookings/[id]: Auth token found:", !!authToken);
        
        // Use manual JWT verification since requireSession seems to have issues
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("GET /api/bookings/[id]: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("GET /api/bookings/[id]: JWT verification failed:", jwtError.message);
                return RR.json({ message: "Unauthenticated" }, { status: 401 });
            }
        } else {
            return RR.json({ message: "Unauthenticated" }, { status: 401 });
        }
        
        // Validate session has required fields
        if (!session || !session.sub || !session.role) {
            console.error("GET /api/bookings/[id]: Invalid session data:", session);
            return RR.json({ message: "Invalid session data" }, { status: 401 });
        }
        
        const { id } = params;

        const booking = await p.booking.findUnique({
            where: { id },
            include: {
                opportunity: {
                    select: { 
                        title: true, 
                        placementType: true,
                        description: true,
                        publisher: { 
                            select: { 
                                firstName: true, 
                                lastName: true, 
                                email: true,
                                companyLegalName: true,
                                brandName: true
                            } 
                        }
                    }
                },
                advertiser: {
                    select: { 
                        firstName: true, 
                        lastName: true, 
                        email: true,
                        brandName: true
                    }
                },
                publisher: {
                    select: { 
                        firstName: true, 
                        lastName: true, 
                        email: true,
                        companyLegalName: true,
                        brandName: true
                    }
                },
                offer: {
                    select: { id: true, notes: true, proposedPrice: true }
                }
            }
        });

        if (!booking) {
            return RR.json({ message: "Booking not found" }, { status: 404 });
        }

        // Check if user has access to this booking
        if (session.role !== "ADMIN" && 
            booking.advertiserId !== session.sub && 
            booking.publisherId !== session.sub) {
            return RR.json({ message: "Forbidden" }, { status: 403 });
        }

        return RR.json({ ok: true, booking });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return RR.json({ message: "Unauthenticated" }, { status: 401 });
        console.error("Get booking error:", e);
        return RR.json({ message: "Failed to get booking" }, { status: 500 });
    }
}

// Update booking status
export async function PATCH(req, { params }) {
    try {
        console.log("PATCH /api/bookings/[id]: Starting request");
        
        // Debug: Check cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        console.log("PATCH /api/bookings/[id]: Auth token found:", !!authToken);
        
        // Use manual JWT verification since requireSession seems to have issues
        let session;
        if (authToken) {
            try {
                const jwt = await import("jsonwebtoken");
                const payload = jwt.verify(authToken.value, process.env.JWT_SECRET);
                console.log("PATCH /api/bookings/[id]: JWT verification successful:", payload);
                session = { 
                    sub: payload.sub, 
                    email: payload.email, 
                    role: payload.role,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                };
            } catch (jwtError) {
                console.log("PATCH /api/bookings/[id]: JWT verification failed:", jwtError.message);
                return RR.json({ message: "Unauthenticated" }, { status: 401 });
            }
        } else {
            return RR.json({ message: "Unauthenticated" }, { status: 401 });
        }
        
        // Validate session has required fields
        if (!session || !session.sub || !session.role) {
            console.error("PATCH /api/bookings/[id]: Invalid session data:", session);
            return RR.json({ message: "Invalid session data" }, { status: 401 });
        }
        
        const { id } = params;
        const data = UpdateBookingSchema.parse(await req.json());

        // Get booking with basic info
        const booking = await p.booking.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                advertiserId: true,
                publisherId: true,
                opportunityId: true,
                opportunity: {
                    select: { title: true }
                }
            }
        });

        if (!booking) {
            return RR.json({ message: "Booking not found" }, { status: 404 });
        }

        // Check permissions based on action
        let canPerformAction = false;
        let notificationRecipientId = null;

        console.log("PATCH /api/bookings/[id]: Checking permissions", {
            action: data.action,
            sessionRole: session.role,
            sessionSub: session.sub,
            bookingPublisherId: booking.publisherId,
            bookingAdvertiserId: booking.advertiserId
        });

        switch (data.action) {
            case "ACCEPT":
            case "REJECT":
                // Only publisher can accept/reject
                if (session.role === "PUBLISHER" && booking.publisherId === session.sub) {
                    canPerformAction = true;
                    notificationRecipientId = booking.advertiserId;
                    console.log("PATCH /api/bookings/[id]: Publisher can perform ACCEPT/REJECT");
                } else {
                    console.log("PATCH /api/bookings/[id]: Publisher cannot perform ACCEPT/REJECT", {
                        isPublisher: session.role === "PUBLISHER",
                        publisherMatch: booking.publisherId === session.sub
                    });
                }
                break;
            case "DELIVER":
                // Only publisher can deliver
                if (session.role === "PUBLISHER" && booking.publisherId === session.sub) {
                    canPerformAction = true;
                    notificationRecipientId = booking.advertiserId;
                    console.log("PATCH /api/bookings/[id]: Publisher can perform DELIVER");
                } else {
                    console.log("PATCH /api/bookings/[id]: Publisher cannot perform DELIVER");
                }
                break;
            case "APPROVE":
            case "DISPUTE":
                // Only advertiser can approve/dispute
                if (session.role === "ADVERTISER" && booking.advertiserId === session.sub) {
                    canPerformAction = true;
                    notificationRecipientId = booking.publisherId;
                    console.log("PATCH /api/bookings/[id]: Advertiser can perform APPROVE/DISPUTE");
                } else {
                    console.log("PATCH /api/bookings/[id]: Advertiser cannot perform APPROVE/DISPUTE");
                }
                break;
        }

        if (!canPerformAction && session.role !== "ADMIN") {
            console.log("PATCH /api/bookings/[id]: Forbidden - cannot perform action", {
                canPerformAction,
                sessionRole: session.role,
                action: data.action
            });
            return RR.json({ message: "Forbidden" }, { status: 403 });
        }

        // Update booking based on action
        let updateData = {};
        let notificationData = {};

        switch (data.action) {
            case "ACCEPT":
                updateData = { status: "ACCEPTED" };
                notificationData = {
                    type: "BOOKING_ACCEPTED",
                    title: "Booking Accepted",
                    body: `Your booking for "${booking.opportunity.title}" has been accepted`
                };
                break;
            case "REJECT":
                updateData = { status: "CANCELLED" };
                notificationData = {
                    type: "BOOKING_REJECTED",
                    title: "Booking Rejected",
                    body: `Your booking for "${booking.opportunity.title}" has been rejected`
                };
                break;
            case "DELIVER":
                updateData = { 
                    status: "DELIVERED",
                    deliveredAt: new Date(),
                    deliveredFiles: data.deliveredFiles || [],
                    deliveredNotes: data.deliveredNotes
                };
                notificationData = {
                    type: "BOOKING_DELIVERED",
                    title: "Work Delivered",
                    body: `Work has been delivered for "${booking.opportunity.title}"`
                };
                break;
            case "APPROVE":
                updateData = { 
                    status: "COMPLETED",
                    approvedAt: new Date(),
                    approvedBy: session.sub
                };
                notificationData = {
                    type: "BOOKING_APPROVED",
                    title: "Work Approved",
                    body: `Your delivered work for "${booking.opportunity.title}" has been approved`
                };
                break;
            case "DISPUTE":
                updateData = { 
                    status: "DISPUTED",
                    disputeReason: data.disputeReason
                };
                notificationData = {
                    type: "BOOKING_DISPUTED",
                    title: "Booking Disputed",
                    body: `A dispute has been raised for "${booking.opportunity.title}"`
                };
                break;
        }

        // Update booking
        const updatedBooking = await p.booking.update({
            where: { id },
            data: updateData,
            include: {
                opportunity: {
                    select: { title: true }
                },
                advertiser: {
                    select: { firstName: true, lastName: true, email: true }
                },
                publisher: {
                    select: { firstName: true, lastName: true, email: true }
                }
            }
        });

        // Create notification if recipient exists
        if (notificationRecipientId && notificationData) {
            await p.notification.create({
                data: {
                    userId: notificationRecipientId,
                    senderId: session.sub,
                    opportunityId: booking.opportunityId,
                    bookingId: booking.id,
                    ...notificationData
                }
            });
        }

        return RR.json({ ok: true, booking: updatedBooking });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return RR.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN") return RR.json({ message: "Forbidden" }, { status: 403 });
        console.error("Update booking error:", e);
        return RR.json({ message: "Failed to update booking" }, { status: 500 });
    }
}
