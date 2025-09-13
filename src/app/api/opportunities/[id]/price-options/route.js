import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../utils/prisma";
import { requireSession, requireRole } from "../../../_lib/auth";

export async function POST(req, { params }) {
    try {
        const session = await requireSession(req);
        requireRole(session, ["PUBLISHER", "ADMIN"]);

        const body = await req.json();

        const priceOption = await prisma.priceOption.create({
            data: {
                opportunityId: params.id,
                label: body.label,
                pricingType: body.pricingType,
                price: body.price ? new Prisma.Decimal(body.price) : null,
                cpm: body.cpm ? new Prisma.Decimal(body.cpm) : null,
                cpc: body.cpc ? new Prisma.Decimal(body.cpc) : null,
                cpaPercent: body.cpaPercent ? new Prisma.Decimal(body.cpaPercent) : null,
                currency: body.currency || "USD",
                minTermDays: body.minTermDays ?? null,
            },
        });

        return NextResponse.json({ ok: true, priceOption });
    } catch (e) {
        console.error("Add price option error:", e);
        if (e?.message === "UNAUTHENTICATED")
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN")
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        return NextResponse.json({ message: "Failed to add price option" }, { status: 500 });
    }
}
