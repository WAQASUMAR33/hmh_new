import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "auth_token";

/** Works with both sync and async `cookies()` across Next.js versions */
async function getCookieStore() {
    const c = cookies();
    if (c && typeof c.then === "function") return await c; // Next 13.5.1+
    return c; // older Next (sync)
}

export async function requireSession() {
    const cookieStore = await getCookieStore();
    const token = cookieStore?.get(COOKIE_NAME)?.value;

    if (!token) throw new Error("UNAUTHENTICATED");

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("requireSession: JWT payload", payload);
        
        const session = { 
            sub: payload.sub, 
            email: payload.email, 
            role: payload.role,
            firstName: payload.firstName,
            lastName: payload.lastName
        };
        
        console.log("requireSession: returning session", session);
        return session;
    } catch (error) {
        console.error("requireSession: JWT verification failed", error);
        throw new Error("UNAUTHENTICATED");
    }
}

export function requireRole(session, roles = []) {
    if (!session || (roles.length && !roles.includes(session.role))) {
        throw new Error("FORBIDDEN");
    }
}

export async function getSessionOrNull() {
    try {
        const cookieStore = await getCookieStore();
        const token = cookieStore?.get(COOKIE_NAME)?.value;

        if (!token) return null;

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return { 
            id: payload.sub, 
            email: payload.email, 
            role: payload.role,
            sub: payload.sub, // Add this for consistency
            firstName: payload.firstName,
            lastName: payload.lastName
        };
    } catch {
        return null;
    }
}
