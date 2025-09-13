import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/prisma";
import { requireSession, requireRole } from "../../_lib/auth";

export async function GET(req) {
    try {
        const session = await requireSession();
        requireRole(session, ["PUBLISHER", "ADMIN"]);

        const { searchParams } = new URL(req.url);
        const q = (searchParams.get("q") || "").trim();
        const placementType = searchParams.get("placementType") || undefined;
        const status = searchParams.get("status") || "ALL"; // ALL | DRAFT | PUBLISHED | ...
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const take = Math.min(parseInt(searchParams.get("take") || "20", 10), 50);
        const cursor = searchParams.get("cursor") || undefined;

        const where = { publisherId: session.sub };
        if (status !== "ALL") where.status = status;
        if (placementType) where.placementType = placementType;

        // 🔧 Remove `mode: "insensitive"` to avoid Prisma runtime error
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { summary: { contains: q } },
                { description: { contains: q } },
            ];
        }

        if (minPrice || maxPrice) {
            where.basePrice = {};
            if (minPrice) where.basePrice.gte = new Prisma.Decimal(minPrice);
            if (maxPrice) where.basePrice.lte = new Prisma.Decimal(maxPrice);
        }

        const items = await prisma.opportunity.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                status: true,
                placementType: true,
                pricingType: true,
                basePrice: true,
                currency: true,
                createdAt: true,
            },
        });

        const nextCursor = items.length === take ? items[items.length - 1].id : null;
        return NextResponse.json({ ok: true, items, nextCursor });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED")
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN")
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        console.error("List mine error:", e);
        return NextResponse.json({ message: "Failed to list" }, { status: 500 });
    }
}
