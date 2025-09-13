import { NextResponse as Resp } from "next/server";
import { prisma as q } from "../../../utils/prisma";
import { Prisma } from "@prisma/client";
import { requireSession } from "../../_lib/auth";
import { MutateOfferSchema } from "../../_lib/schemas/opportunity";

export async function PATCH(req, { params }) {
    try {
        const session = requireSession();
        const data = MutateOfferSchema.parse(await req.json());


        const offer = await q.offer.findUnique({
            where: { id: params.id },
            include: { opportunity: true },
        });
        if (!offer) return Resp.json({ message: "Offer not found" }, { status: 404 });


        const isPublisher = session.sub === offer.opportunity.publisherId || session.role === "ADMIN";
        const isAdvertiser = session.sub === offer.advertiserId || session.role === "ADMIN";


        // Permission gates per action
        if (data.action === "WITHDRAW") {
            if (!isAdvertiser) return Resp.json({ message: "Forbidden" }, { status: 403 });
            const updated = await q.offer.update({ where: { id: offer.id }, data: { status: "WITHDRAWN" } });
            return Resp.json({ ok: true, offer: updated });
        }


        if (data.action === "DECLINE") {
            if (!isPublisher && !isAdvertiser) return Resp.json({ message: "Forbidden" }, { status: 403 });
            const updated = await q.offer.update({ where: { id: offer.id }, data: { status: "DECLINED" } });
            return Resp.json({ ok: true, offer: updated });
        }


        if (data.action === "COUNTER") {
            // Either party can counter; update proposed terms
            if (!isPublisher && !isAdvertiser) return Resp.json({ message: "Forbidden" }, { status: 403 });
            const updated = await q.offer.update({
                where: { id: offer.id },
                data: {
                    status: "COUNTERED",
                    pricingType: data.pricingType || offer.pricingType,
                    proposedPrice: data.proposedPrice ? new Prisma.Decimal(data.proposedPrice) : offer.proposedPrice,
                    currency: data.currency || offer.currency,
                    proposedStart: data.proposedStart ? new Date(data.proposedStart) : offer.proposedStart,
                    proposedEnd: data.proposedEnd ? new Date(data.proposedEnd) : offer.proposedEnd,
                    notes: data.notes ?? offer.notes,
                },
            });
            return Resp.json({ ok: true, offer: updated });
        }



        if (data.action === "ACCEPT") {
            // Only the publisher can accept (finalizes booking)
            if (!isPublisher) return Resp.json({ message: "Forbidden" }, { status: 403 });


            const start = data.proposedStart ? new Date(data.proposedStart) : offer.proposedStart;
            const end = data.proposedEnd ? new Date(data.proposedEnd) : offer.proposedEnd;
            if (!start || !end || !(start < end)) return Resp.json({ message: "Provide a valid booking window" }, { status: 400 });


            try {
                const result = await q.$transaction(async (tx) => {
                    const overlap = await tx.opportunityAvailability.findFirst({
                        where: {
                            opportunityId: offer.opportunityId,
                            isBooked: true,
                            NOT: [{ end: { lte: start } }, { start: { gte: end } }],
                        },
                        select: { id: true },
                    });
                    if (overlap) throw new Error("OVERLAP");


                    await tx.opportunityAvailability.create({
                        data: { opportunityId: offer.opportunityId, start, end, isBooked: true, note: "Booked via offer" },
                    });


                    const accepted = await tx.offer.update({ where: { id: offer.id }, data: { status: "ACCEPTED", proposedStart: start, proposedEnd: end } });


                    // If your model is single-booking, set status=BOOKED
                    await tx.opportunity.update({ where: { id: offer.opportunityId }, data: { status: "BOOKED" } });


                    return accepted;
                });
                return Resp.json({ ok: true, offer: result });
            } catch (err) {
                if (err?.message === "OVERLAP") return Resp.json({ message: "Booking overlaps an existing reservation" }, { status: 409 });
                throw err;
            }
        }


        return Resp.json({ message: "Unsupported action" }, { status: 400 });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return Resp.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.name === "JsonWebTokenError") return Resp.json({ message: "Invalid session" }, { status: 401 });
        console.error("Mutate offer error:", e);
        return Resp.json({ message: "Failed to update offer" }, { status: 500 });
    }
}