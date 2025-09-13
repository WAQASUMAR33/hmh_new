import { NextResponse } from "next/server";
import { prisma } from "../../../../utils/prisma";
import { requireSession, requireRole } from "../../../_lib/auth";

export async function POST(req, { params }) {
    try {
        const session = await requireSession(req);
        requireRole(session, ["PUBLISHER", "ADMIN"]);

        const { start, end, note } = await req.json();

        if (!start || !end) {
            return NextResponse.json({ message: "Start and end required" }, { status: 400 });
        }

        const availability = await prisma.availability.create({
            data: {
                opportunityId: params.id,
                start: new Date(start), // RFC3339 string → JS Date
                end: new Date(end),
                note: note || null,
            },
        });

        return NextResponse.json({ ok: true, availability });
    } catch (e) {
        console.error("Add availability error:", e);
        if (e?.message === "UNAUTHENTICATED")
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        if (e?.message === "FORBIDDEN")
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        return NextResponse.json({ message: "Failed to add availability" }, { status: 500 });
    }
}
