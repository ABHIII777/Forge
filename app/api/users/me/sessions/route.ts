import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { session, user } from "@/db/schema";

export async function GET() {
    try {
        // TODO(auth): resolve the signed-in user instead of the first user.
        const [me] = await db.select({ id: user.id }).from(user).limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const rows = await db
            .select({
                id: session.id,
                device: session.device,
                browser: session.browser,
                os: session.os,
                location: session.location,
                lastActiveAt: session.lastActiveAt,
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
            })
            .from(session)
            .where(eq(session.userId, me.id))
            .orderBy(desc(session.lastActiveAt));

        return NextResponse.json({ sessions: rows }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const check = z.string().uuid().safeParse(searchParams.get("sessionId") ?? "");
    if (!check.success) {
        return NextResponse.json({ error: "Valid sessionId query param is required" }, { status: 400 });
    }

    try {
        const [me] = await db.select({ id: user.id }).from(user).limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const [row] = await db
            .select({ id: session.id })
            .from(session)
            .where(and(eq(session.id, check.data), eq(session.userId, me.id)))
            .limit(1);
        if (!row) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        await db.delete(session).where(eq(session.id, check.data));
        return NextResponse.json({ revoked: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
    }
}
