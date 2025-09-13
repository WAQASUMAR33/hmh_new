import { NextResponse as RR } from "next/server";
import { prisma as p } from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { requireSession, requireRole } from "../_lib/auth";
import { CreateOfferSchema } from "../_lib/schemas/opportunity";


export async function POST(req) {
    try {
        const session = requireSession();
        requireRole(session, ["ADVERTISER", "ADMIN"]);


        const data = CreateOfferSchema.parse(await req.json());
        const opp = await p.opportunity.findUnique({
            where: { id: data.opportunityId },
            select: { id: true, status: true, publisherId: true },
        });
        if (!opp || opp.status === "ARCHIVED") return RR.json({ message: "Opportunity unavailable" }, { status: 404 });


        const offer = await p.offer.create({
            data: {
                opportunityId: data.opportunityId,
                advertiserId: session.sub,
                pricingType: data.pricingType,
                proposedPrice: data.proposedPrice ? new Prisma.Decimal(data.proposedPrice) : null,
                currency: data.currency || "USD",
                proposedStart: data.proposedStart ? new Date(data.proposedStart) : null,
                proposedEnd: data.proposedEnd ? new Date(data.proposedEnd) : null,
                notes: data.notes || null,
                status: "PENDING",
            },
        });


        return RR.json({ ok: true, offer }, { status: 201 });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return RR.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN") return RR.json({ message: "Forbidden" }, { status: 403 });
        console.error("Create offer error:", e);
        return RR.json({ message: "Failed to create offer" }, { status: 500 });
    }
}