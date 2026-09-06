import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comment, issue, user } from "@/db/schema";
import { createCommentSchema } from "@/lib/validators";
import { z } from "zod"
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const body = await req.json();

    const parsed = createCommentSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: "Error occured during parsing the data" }, { status: 500 })
    }
    
    const { content, issueId } = parsed.data

    const [author] = await db.select({ id : user.id }).from(user).limit(1)
    if (!author) {
        return NextResponse.json({ error: "The user does not exist" }, { status: 404 })
    }

    try {
        const [created] = await db.insert(comment).values ({
            content: content,
            issueId: issueId,
            authorId: author.id
        }).returning();

        return NextResponse.json({ comment: created }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error : err }, { status : 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const issueId = searchParams.get("issueId")

    if (!issueId) {
        return NextResponse.json({ error: "IssueId not found" }, { status: 400 })
    }

    const check = z.string().uuid().safeParse(issueId)
    if (!check.success) {
        return NextResponse.json({ error: "Invalid issueId" }, { status: 400 })
    }

    try {
        const rows = await db.query.comment.findMany({
            where: eq(comment.issueId, check.data),
            orderBy: (c, {asc}) => [asc(c.createdAt)]
        })

        return NextResponse.json({ comments: rows }, { status: 200 })

    } catch(err) {
        return NextResponse.json({ error: err }, { status : 500 })
    }

}