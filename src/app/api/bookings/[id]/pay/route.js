import { NextResponse as RR } from "next/server";
import { prisma as p } from "../../../../utils/prisma";
import { requireSession, requireRole } from "../../../_lib/auth";
import { PaymentIntentSchema } from "../../../_lib/schemas/opportunity";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_key_for_build');

// Create payment intent for booking
export async function POST(req, { params }) {
    try {
        const session = requireSession();
        requireRole(session, ["ADVERTISER", "ADMIN"]);
        
        const { id } = params;
        const data = PaymentIntentSchema.parse(await req.json());

        // Get booking details
        const booking = await p.booking.findUnique({
            where: { id },
            include: {
                opportunity: {
                    select: { 
                        title: true,
                        publisher: { 
                            select: { 
                                stripeAccountId: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            } 
                        }
                    }
                }
            }
        });

        if (!booking) {
            return RR.json({ message: "Booking not found" }, { status: 404 });
        }

        // Check if user owns this booking
        if (booking.advertiserId !== session.sub && session.role !== "ADMIN") {
            return RR.json({ message: "Forbidden" }, { status: 403 });
        }

        // Check if booking is in correct status
        if (booking.status !== "ACCEPTED") {
            return RR.json({ 
                message: "Booking must be accepted before payment" 
            }, { status: 400 });
        }

        if (booking.paymentStatus === "PAID") {
            return RR.json({ 
                message: "Booking is already paid" 
            }, { status: 400 });
        }

        // Calculate platform fee (example: 10%)
        const platformFeePercent = 0.10;
        const platformFee = booking.selectedPrice * platformFeePercent;
        const publisherPayout = booking.selectedPrice - platformFee;

        // Create Stripe payment intent
        const paymentIntentData = {
            amount: Math.round(parseFloat(booking.selectedPrice) * 100), // Convert to cents
            currency: booking.currency.toLowerCase(),
            metadata: {
                bookingId: booking.id,
                opportunityId: booking.opportunityId,
                advertiserId: booking.advertiserId,
                publisherId: booking.publisherId,
            },
            application_fee_amount: Math.round(parseFloat(platformFee) * 100),
        };

        // If publisher has Stripe Connect account, use destination charges
        if (booking.opportunity.publisher.stripeAccountId) {
            paymentIntentData.transfer_data = {
                destination: booking.opportunity.publisher.stripeAccountId,
                amount: Math.round(parseFloat(publisherPayout) * 100),
            };
        }

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

        // Update booking with payment intent ID
        await p.booking.update({
            where: { id },
            data: {
                stripePaymentIntentId: paymentIntent.id,
                platformFee: platformFee,
                publisherPayout: publisherPayout,
            }
        });

        return RR.json({
            ok: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntent: {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
            }
        });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return RR.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN") return RR.json({ message: "Forbidden" }, { status: 403 });
        console.error("Create payment intent error:", e);
        return RR.json({ message: "Failed to create payment intent" }, { status: 500 });
    }
}
