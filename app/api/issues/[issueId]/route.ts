import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { comment, issue, issueLabel, label } from "@/db/schema"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ issueId: string }> },
) {
    const { issueId } = await params;
    const check = z.string().uuid().safeParse(issueId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid issueId" }, { status: 400 });
    }

    try {
        const row = await db.query.issue.findFirst({
            where: eq(issue.id, check.data),
        });
        if (!row) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        const labels = await db
            .select({ id: label.id, name: label.name, color: label.color })
            .from(issueLabel)
            .innerJoin(label, eq(issueLabel.labelId, label.id))
            .where(eq(issueLabel.issueId, check.data));

        const comments = await db.query.comment.findMany({
            where: eq(comment.issueId, check.data),
            orderBy: (c, { asc }) => [asc(c.createdAt)],
        });

        return NextResponse.json({ issue: row, labels, comments }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to load the issue" }, { status: 500 });
    }
}
