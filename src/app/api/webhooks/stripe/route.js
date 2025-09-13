import { NextResponse as RR } from "next/server";
import { prisma as p } from "../../../utils/prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_key_for_build');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return RR.json({ message: 'Invalid signature' }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await handleChargeRefunded(event.data.object);
                break;
            case 'transfer.created':
                await handleTransferCreated(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return RR.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return RR.json({ message: 'Webhook error' }, { status: 500 });
    }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        const bookingId = paymentIntent.metadata.bookingId;
        
        if (!bookingId) {
            console.error('No booking ID in payment intent metadata');
            return;
        }

        // Update booking status
        const booking = await p.booking.update({
            where: { id: bookingId },
            data: {
                status: 'PAID',
                paymentStatus: 'PAID',
            },
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

        // Create notification for publisher
        await p.notification.create({
            data: {
                userId: booking.publisherId,
                senderId: booking.advertiserId,
                opportunityId: booking.opportunityId,
                bookingId: booking.id,
                type: 'BOOKING_PAID',
                title: 'Payment Received',
                body: `Payment received for "${booking.opportunity.title}" - You can now start working!`
            }
        });

        console.log(`Booking ${bookingId} marked as paid`);
    } catch (error) {
        console.error('Error handling payment_intent.succeeded:', error);
    }
}

async function handlePaymentIntentFailed(paymentIntent) {
    try {
        const bookingId = paymentIntent.metadata.bookingId;
        
        if (!bookingId) {
            console.error('No booking ID in payment intent metadata');
            return;
        }

        // Update booking payment status
        await p.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: 'FAILED',
            }
        });

        console.log(`Booking ${bookingId} payment failed`);
    } catch (error) {
        console.error('Error handling payment_intent.payment_failed:', error);
    }
}

async function handleChargeRefunded(charge) {
    try {
        const paymentIntentId = charge.payment_intent;
        
        if (!paymentIntentId) {
            console.error('No payment intent ID in charge');
            return;
        }

        // Find booking by payment intent ID
        const booking = await p.booking.findFirst({
            where: { stripePaymentIntentId: paymentIntentId }
        });

        if (!booking) {
            console.error('No booking found for payment intent:', paymentIntentId);
            return;
        }

        // Update booking status
        await p.booking.update({
            where: { id: booking.id },
            data: {
                status: 'CANCELLED',
                paymentStatus: 'REFUNDED',
            }
        });

        console.log(`Booking ${booking.id} refunded`);
    } catch (error) {
        console.error('Error handling charge.refunded:', error);
    }
}

async function handleTransferCreated(transfer) {
    try {
        // This webhook is useful for tracking when money is transferred to publishers
        // You can use this to update booking status or send notifications
        console.log(`Transfer created: ${transfer.id} for amount: ${transfer.amount}`);
    } catch (error) {
        console.error('Error handling transfer.created:', error);
    }
}
