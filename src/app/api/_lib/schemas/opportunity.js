import { z } from "zod";

export const PlacementType = z.enum([
    "HOMEPAGE_BANNER",
    "CATEGORY_BANNER",
    "SPONSORED_ARTICLE",
    "NEWSLETTER_FEATURE",
    "SOCIAL_POST",
    "REVIEW",
    "GIVEAWAY",
    "PODCAST_READ",
    "OTHER",
]);

export const PricingType = z.enum(["FIXED", "CPM", "CPC", "CPA", "HYBRID", "FREE"]);

export const CreateOpportunitySchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    summary: z.string().optional(),
    description: z.string().optional(),
    placementType: PlacementType,
    pricingType: PricingType.default("FIXED"),
    basePrice: z.string().optional(), // send as string for Decimal
    currency: z.string().default("USD"),
    verticals: z.array(z.string()).optional(),
    geos: z.array(z.string()).optional(),
    requirements: z.string().optional(),
    deliverables: z.string().optional(),
    monthlyTraffic: z.number().int().optional(),
    averageCTR: z.number().optional(),
    avgOpenRate: z.number().optional(),
    availableFrom: z.string().datetime().optional(),
    availableTo: z.string().datetime().optional(),
});


export const UpdateOpportunitySchema = CreateOpportunitySchema.partial().extend({
    status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED", "BOOKED"]).optional(),
});


export const CreatePriceOptionSchema = z.object({
    label: z.string().min(2),
    pricingType: PricingType,
    price: z.string().optional(), // Decimal
    cpm: z.string().optional(),
    cpc: z.string().optional(),
    cpaPercent: z.string().optional(),
    currency: z.string().default("USD"),
    minTermDays: z.number().int().optional(),
});


export const CreateAvailabilitySchema = z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    note: z.string().optional(),
});


export const CreateOfferSchema = z.object({
    opportunityId: z.string().min(1),
    proposedStart: z.string().datetime().optional(),
    proposedEnd: z.string().datetime().optional(),
    pricingType: PricingType,
    proposedPrice: z.string().optional(), // Decimal
    currency: z.string().default("USD"),
    notes: z.string().optional(),
});


export const MutateOfferSchema = z.object({
    action: z.enum(["COUNTER", "ACCEPT", "DECLINE", "WITHDRAW"]).default("COUNTER"),
    // when COUNTER
    pricingType: PricingType.optional(),
    proposedPrice: z.string().optional(),
    currency: z.string().optional(),
    proposedStart: z.string().datetime().optional(),
    proposedEnd: z.string().datetime().optional(),
    notes: z.string().optional(),
});

// ── Booking Schemas ────────────────────────────────────────────────────────────

export const CreateBookingSchema = z.object({
    opportunityId: z.string().min(1),
    offerId: z.string().optional(),
    requestedStart: z.string().datetime(),
    requestedEnd: z.string().datetime(),
    selectedPrice: z.string(), // Decimal
    currency: z.string().default("USD"),
    notes: z.string().optional(),
});

export const UpdateBookingSchema = z.object({
    action: z.enum(["ACCEPT", "REJECT", "DELIVER", "APPROVE", "DISPUTE"]),
    deliveredFiles: z.array(z.string().url()).optional(),
    deliveredNotes: z.string().optional(),
    disputeReason: z.string().optional(),
});

export const PaymentIntentSchema = z.object({
    bookingId: z.string().min(1),
    paymentMethodId: z.string().optional(),
});