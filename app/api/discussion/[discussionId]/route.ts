import { NextResponse } from "next/server";
import z from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { discussion, discussionReply } from "@/db/schema";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ discussionId: string }>}
) {
    const { discussionId } = await params

    const check = z.string().uuid().safeParse(discussionId)

    if (!check.success) {
        return NextResponse.json({ error: "Invalid discussion ID" }, { status : 400 })
    }

    try {
        const row = await db.query.discussion.findFirst({
            where: eq(discussion.id, check.data),
        });

        if (!row) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }

        const replies = await db.query.discussionReply.findMany({
            where: eq(discussionReply.discussionId, check.data),
            orderBy: (r, { asc }) => [asc(r.createdAt)],
            limit: 100,
        });

        return NextResponse.json({ discussion: row, replies }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to load discussion" }, { status: 500 });
    }
}
