import { NextResponse } from "next/server";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "auth_token";
const TOKEN_EXPIRES_IN = "7d";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true, email: true, password: true, role: true,
                firstName: true, lastName: true,
                emailVerified: true, isActivated: true,
            },
        });
        if (!user) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

        if (!user.emailVerified) return NextResponse.json({ message: "Please verify your email before logging in." }, { status: 403 });
        if (!user.isActivated) return NextResponse.json({ message: "Account not activated by admin." }, { status: 403 });

        const token = jwt.sign({ 
            sub: user.id, 
            email: user.email, 
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

        const res = NextResponse.json({
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

        res.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: false, // Set to false for development to allow JavaScript access
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
