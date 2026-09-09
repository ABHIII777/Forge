import { NextResponse } from "next/server";
import z from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { discussion, discussionReply, user } from "@/db/schema";

const replySchema = z.object({
    content: z.string().trim().min(1).max(5000),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ discussionId: string }> },
) {
    const { discussionId } = await params;

    const check = z.string().uuid().safeParse(discussionId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid discussion ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid reply data", details: parsed.error.flatten() },
            { status: 400 },
        );
    }

    try {
        const row = await db.query.discussion.findFirst({
            where: eq(discussion.id, check.data),
        });
        if (!row) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }
        if (row.isLocked) {
            return NextResponse.json({ error: "Discussion is locked" }, { status: 403 });
        }

        // TODO(auth): use the signed-in user instead of the first user.
        const [author] = await db.select({ id: user.id }).from(user).limit(1);
        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        const [created] = await db
            .insert(discussionReply)
            .values({
                discussionId: check.data,
                authorId: author.id,
                content: parsed.data.content,
            })
            .returning();

        return NextResponse.json({ reply: created }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
    }
}
