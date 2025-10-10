import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/prisma";
import { requireSession, requireRole } from "../../_lib/auth";

const ALLOWED_STATUSES = ["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"];

async function getSessionOrNull() {
    try {
        return await requireSession();
    } catch {
        return null;
    }
}

async function assertOwnerOrAdmin(userId, oppId, role) {
    const opp = await prisma.opportunity.findUnique({
        where: { id: oppId },
        select: { id: true, publisherId: true },
    });
    if (!opp) throw Object.assign(new Error("NOT_FOUND"), { code: 404 });
    if (role !== "ADMIN" && opp.publisherId !== userId) {
        throw Object.assign(new Error("FORBIDDEN"), { code: 403 });
    }
    return opp;
}

// ✅ PUBLIC-READ for published opportunities; owner/admin can read anything
export async function GET(_req, { params }) {
    try {
        const session = await getSessionOrNull();
        const { id } = await params;

        // Try to fetch the opportunity
        const opp = await prisma.opportunity.findUnique({
            where: { id },
            select: {
                id: true,
                publisherId: true,
                title: true,
                slug: true,
                summary: true,
                description: true,
                placementType: true,
                pricingType: true,
                basePrice: true,
                currency: true,
                verticals: true,
                geos: true,
                requirements: true,
                deliverables: true,
                monthlyTraffic: true,
                availableFrom: true,
                availableTo: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                publisher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        image: true,
                    }
                }
            },
        });

        if (!opp) return NextResponse.json({ message: "Not found" }, { status: 404 });

        const isOwner = session && (session.role === "ADMIN" || opp.publisherId === session.sub);

        // If not owner/admin, only allow reading PUBLISHED
        if (!isOwner && opp.status !== "PUBLISHED") {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Parse JSON strings back to arrays
        const parsedOpp = {
            ...opp,
            verticals: opp.verticals ? JSON.parse(opp.verticals) : [],
            geos: opp.geos ? JSON.parse(opp.geos) : [],
        };

        return NextResponse.json({ ok: true, opportunity: parsedOpp });
    } catch (e) {
        if (e?.code === 404) return NextResponse.json({ message: "Not found" }, { status: 404 });
        console.error("Get opportunity error:", e);
        return NextResponse.json({ message: "Failed to load" }, { status: 500 });
    }
}

// Owner/admin updates only (unchanged from your secured version)
export async function PATCH(req, { params }) {
    try {
        const session = await requireSession();
        const { id } = await params;
        requireRole(session, ["PUBLISHER", "ADMIN"]);
        await assertOwnerOrAdmin(session.sub, id, session.role);

        const b = await req.json();
        const data = {};

        if ("status" in b) {
            const s = String(b.status).toUpperCase();
            if (!ALLOWED_STATUSES.includes(s)) {
                return NextResponse.json({ message: "Invalid status", allowed: ALLOWED_STATUSES }, { status: 400 });
            }
            data.status = s;
        }
        if ("title" in b) data.title = b.title?.trim() || null;
        if ("slug" in b) data.slug = b.slug?.trim() || null;
        if ("summary" in b) data.summary = b.summary || null;
        if ("description" in b) data.description = b.description || null;
        if ("placementType" in b) data.placementType = b.placementType;
        if ("pricingType" in b) data.pricingType = b.pricingType;
        if ("basePrice" in b) data.basePrice = b.basePrice != null ? new Prisma.Decimal(b.basePrice) : null;
        if ("currency" in b) data.currency = b.currency || "USD";
        if ("verticals" in b) data.verticals = b.verticals ? JSON.stringify(b.verticals) : undefined;
        if ("geos" in b) data.geos = b.geos ? JSON.stringify(b.geos) : undefined;
        if ("requirements" in b) data.requirements = b.requirements || null;
        if ("deliverables" in b) data.deliverables = b.deliverables || null;
        if ("monthlyTraffic" in b) data.monthlyTraffic = b.monthlyTraffic ?? null;
        if ("availableFrom" in b) data.availableFrom = b.availableFrom ? new Date(b.availableFrom) : null;
        if ("availableTo" in b) data.availableTo = b.availableTo ? new Date(b.availableTo) : null;

        const opportunity = await prisma.opportunity.update({
            where: { id },
            data,
            select: { id: true, title: true, slug: true, status: true, updatedAt: true },
        });

        return NextResponse.json({ ok: true, opportunity });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN" || e?.code === 403) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        if (e?.code === "P2002") return NextResponse.json({ message: "Slug already in use" }, { status: 409 });
        console.error("Update opportunity error:", e);
        return NextResponse.json({ message: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(_req, { params }) {
    try {
        const session = await requireSession();
        const { id } = await params;
        requireRole(session, ["PUBLISHER", "ADMIN"]);
        await assertOwnerOrAdmin(session.sub, id, session.role);

        await prisma.opportunity.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (e) {
        if (e?.message === "UNAUTHENTICATED") return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN" || e?.code === 403) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        console.error("Delete opportunity error:", e);
        return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
    }
}
