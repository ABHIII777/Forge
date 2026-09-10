import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comment, discussion, issue, project, user } from "@/db/schema";
import { createCommentSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";
import { z } from "zod"
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const body = await req.json();

    const parsed = createCommentSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: "Error occured during parsing the data" }, { status: 400 })
    }

    const { content, issueId, discussionId } = parsed.data

    const [author] = await db.select({ id : user.id }).from(user).limit(1)
    if (!author) {
        return NextResponse.json({ error: "The user does not exist" }, { status: 404 })
    }

    let workspaceId: string | undefined;
    let projectId: string | null | undefined;
    let description: string;

    if (issueId) {
        const [found] = await db
            .select({
                id: issue.id,
                number: issue.number,
                projectId: issue.projectId,
                workspaceId: project.workspaceId,
                key: project.key,
            })
            .from(issue)
            .innerJoin(project, eq(issue.projectId, project.id))
            .where(eq(issue.id, issueId))
            .limit(1);
        if (!found) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 })
        }
        workspaceId = found.workspaceId;
        projectId = found.projectId;
        description = `commented on issue ${found.key}-${found.number}`;
    } else {
        const [found] = await db
            .select({
                id: discussion.id,
                title: discussion.title,
                projectId: discussion.projectId,
                workspaceId: discussion.workspaceId,
            })
            .from(discussion)
            .where(eq(discussion.id, discussionId!))
            .limit(1);
        if (!found) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
        }
        workspaceId = found.workspaceId;
        projectId = found.projectId;
        description = `commented on discussion "${found.title}"`;
    }

    try {
        const [created] = await db.insert(comment).values ({
            content: content,
            issueId: issueId ?? null,
            discussionId: discussionId ?? null,
            authorId: author.id
        }).returning();

        try {
            await logActivity(db, {
                workspaceId,
                projectId: projectId ?? null,
                userId: author.id,
                type: "issue.commented",
                description,
                metadata: { commentId: created.id, issueId: issueId ?? null, discussionId: discussionId ?? null },
            });
        } catch (err) {
            console.error("Failed to log activity for comment", err);
        }

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