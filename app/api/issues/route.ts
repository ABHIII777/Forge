import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { issue, issueLabel, label, project, user } from "@/db/schema"
import { createIssueSchema } from "@/lib/validators";
import { and, desc, eq, inArray } from "drizzle-orm"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) {
        return NextResponse.json({ error: "projectId query param is required" }, { status: 400 });
    }
    const check = z.string().uuid().safeParse(projectId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    }

    try {
        const rows = await db.query.issue.findMany({
            where: eq(issue.projectId, check.data),
            orderBy: (i, { asc }) => [asc(i.number)],
        });
        return NextResponse.json({ issues: rows }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to load issues" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json()

    const parsed = createIssueSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Some occured during parsing the data" }, { status: 400 })
    }

    const { projectId, title, description, assigneeId, priority, labelIds } = parsed.data
    const [proj] = await db.select({ id: project.id }).from(project).where(eq(project.id, projectId)).limit(1)
    
    if (!proj) {
        return NextResponse.json({ error: "Project does not exist" }, { status: 404 })
    }

    if (assigneeId) {
        const [a] = await db.select({ id: user.id}).from(user).where(eq(user.id, assigneeId)).limit(1)
        if (!a) {
            return NextResponse.json({ error: "Assignee not found" }, { status: 404 })
        }
    }

    const [reporter] = await db.select({ id: user.id }).from(user).limit(1)
    if(!reporter) {
        return NextResponse.json({ error: "Reporter not found" }, { status: 404 })
    }

    try {
        const created = await db.transaction(async (tx) => {
            const [last] = await tx.select({ n : issue.number }).from(issue).where(eq(issue.projectId, projectId)).orderBy(desc(issue.number)).limit(1)
            const [row] = await tx.insert(issue).values({
                number: (last?.n ?? 0) + 1,
                reporterId: reporter.id,
                title,
                description: description ?? null,
                projectId,
                assigneeId,
                priority
            }).returning()

            let labels: { id: string; name: string; color: string }[] = [];
            if (labelIds.length > 0) {
                labels = await tx.select({ id: label.id, name: label.name, color: label.color }).from(label)
                    .where(and(eq(label.projectId, projectId), inArray(label.id, labelIds)));
                if (labels.length !== labelIds.length) {
                    throw new Error("LABEL_NOT_FOUND");
                }
                await tx.insert(issueLabel).values(labelIds.map((labelId) => ({ issueId: row.id, labelId })));
            }

            return { issue: row, labels };
        })

        return NextResponse.json(created, { status: 201 })
    } catch (e) {
        if (e instanceof Error && e.message === "LABEL_NOT_FOUND") {
            return NextResponse.json({ error: "Label not found" }, { status: 404 })
        }
        throw e;
    }
    
}