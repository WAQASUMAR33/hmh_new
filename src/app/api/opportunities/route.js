import { NextResponse } from "next/server";
import { prisma } from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { requireSession, requireRole } from "../_lib/auth";
import { CreateOpportunitySchema } from "../_lib/schemas/opportunity";

export async function POST(req) {
    try {
        const session = await requireSession(req);
        requireRole(session, ["PUBLISHER", "ADMIN"]);

        const body = await req.json();
        const data = CreateOpportunitySchema.parse(body);

        const opportunity = await prisma.opportunity.create({
            data: {
                publisherId: session.sub,
                title: data.title,
                slug: data.slug,
                summary: data.summary,
                description: data.description,
                placementType: data.placementType,
                pricingType: data.pricingType,
                basePrice: data.basePrice ? new Prisma.Decimal(data.basePrice) : null,
                currency: data.currency || "USD",
                verticals: data.verticals || undefined,
                geos: data.geos || undefined,
                requirements: data.requirements,
                deliverables: data.deliverables,
                monthlyTraffic: data.monthlyTraffic ?? null,
                availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
                availableTo: data.availableTo ? new Date(data.availableTo) : null,
                status: "DRAFT",
            },
            select: { id: true, slug: true, title: true, status: true },
        });

        return NextResponse.json({ ok: true, opportunity }, { status: 201 });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED")
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN")
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        if (e?.code === "P2002")
            return NextResponse.json({ message: "Slug already in use" }, { status: 409 });
        console.error("Create opportunity error:", e);
        return NextResponse.json({ message: "Failed to create opportunity" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = (searchParams.get("q") || "").trim();
        const placementType = searchParams.get("placementType") || undefined;
        const status = searchParams.get("status") || "PUBLISHED"; // default public catalog
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const take = Math.min(parseInt(searchParams.get("take") || "20", 10), 50);
        const cursor = searchParams.get("cursor") || undefined;

        const where = { status };
        if (placementType) where.placementType = placementType;
        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
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
                summary: true,            // ⬅️ for cards
                placementType: true,
                pricingType: true,
                basePrice: true,
                currency: true,
                status: true,
                monthlyTraffic: true,
                availableFrom: true,      // ⬅️ your card uses these
                availableTo: true,        // ⬅️ your card uses these
                publisher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                        role: true,
                        companyLegalName: true,
                        brandName: true,
                    }
                }
            },
        });

        const nextCursor = items.length === take ? items[items.length - 1].id : null;
        return NextResponse.json({ ok: true, items, nextCursor });
    } catch (e) {
        console.error("List opportunities error:", e);
        return NextResponse.json({ message: "Failed to list" }, { status: 500 });
    }
}
