import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createDiscussionSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";
import { discussion, project, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const workspaceId = searchParams.get("workspaceId");

    const uuid = z.string().uuid();
    const parsedProjectId = projectId ? uuid.safeParse(projectId) : null;
    const parsedWorkspaceId = workspaceId ? uuid.safeParse(workspaceId) : null;

    if ((projectId && !parsedProjectId?.success) || (workspaceId && !parsedWorkspaceId?.success)) {
        return NextResponse.json({ error: "Invalid projectId or workspaceId" }, { status: 400 });
    }

    try {
        // Project is the primary scope: a project already belongs to a workspace,
        // so filtering by projectId alone is sufficient and avoids hiding rows
        // when the stored workspaceId differs. With no params, return recent
        // discussions across all scopes (used by the global /discussions page).
        const where = parsedProjectId?.success
            ? eq(discussion.projectId, parsedProjectId.data)
            : parsedWorkspaceId?.success
                ? eq(discussion.workspaceId, parsedWorkspaceId.data)
                : undefined;

        const rows = await db.query.discussion.findMany({
            where,
            orderBy: (d, { desc }) => [desc(d.updatedAt)],
            limit: 100,
        });

        return NextResponse.json({ discussions: rows }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to load discussions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json()

    console.log(body)
    const parsed = createDiscussionSchema.safeParse(body);  
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid discussion data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { projectId, workspaceId, title, content, category, tags } = parsed.data

    const [proj] = await db.select({ id: project.id }).from(project).where(eq(project.id, projectId)).limit(1)

    if (!proj) {
        return NextResponse.json({ error: "The project is not found or doesn't exist" }, { status: 404 })
    }

    const [author] = await db.select({ id: user.id }).from(user).limit(1)
    if (!author) {
        return NextResponse.json({ error : "Auther not found or doesn't exist" }, { status: 404 })
    }

    try {

        const [created] = await db.insert(discussion).values({
            title: title,
            content: content,
            tags: tags,
            category: category,
            authorId: author.id,
            projectId: projectId,
            workspaceId: workspaceId
        }).returning()

        try {
            await logActivity(db, {
                workspaceId,
                projectId,
                userId: author.id,
                type: "discussion.created",
                description: `started discussion "${title}"`,
                metadata: { discussionId: created.id, category },
            });
        } catch (err) {
            console.error("Failed to log activity for discussion creation", err);
        }

        return NextResponse.json({ discussion: created }, { status: 201 })
    } catch (err) {

        if (pgErrorCode(err) === "23505"){
            return NextResponse.json({ error: "Discussion already exists" }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
    }
}

function pgErrorCode(e: unknown) : string | undefined {
    if (typeof e !== "object" || e === null ) return undefined

    const rec = e as Record<string, unknown>
    if (typeof rec.code === "string") return rec.code;

    const cause =  rec.cause;
    if (typeof cause == "object" && cause !== null && typeof (cause as Record<string, unknown>).code === "string") {
        return (cause as Record<string, unknown>).code as string;
    }

    return undefined
}