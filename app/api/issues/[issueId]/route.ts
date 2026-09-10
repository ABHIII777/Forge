import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { comment, issue, issueLabel, label, project, user } from "@/db/schema"
import { updateIssueSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";

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

export async function PATCH(
    req: Request,
    { params } : { params: Promise<{issueId : string}> },
) {
    const { issueId } = await params;
    const check = z.string().uuid().safeParse(issueId)

    if (!check.success) {
        return NextResponse.json({ error: "Invalid issueId" }, { status : 400 })
    }

    const body = await req.json()

    const parsed = updateIssueSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    try {
        const row = await db.query.issue.findFirst({
            where: eq(issue.id, check.data),
        })

        if (!row) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 })
        }

        const { status, title, description, priority, assigneeId, dueDate } = parsed.data;

        if (assigneeId) {
            const [a] = await db.select({ id: user.id }).from(user).where(eq(user.id, assigneeId)).limit(1);
            if (!a) {
                return NextResponse.json({ error: "Assignee not found" }, { status: 404 });
            }
        }

        const values: Partial<typeof issue.$inferInsert> = { updatedAt: new Date() };
        if (status !== undefined) {
            values.status = status;
            if (status === "in_progress" && !row.startedAt) values.startedAt = new Date();
            if (status === "done") {
                if (!row.startedAt) values.startedAt = new Date();
                values.completedAt = new Date();
            }
            if (status === "backlog" || status === "review") values.completedAt = null;
        }
        if (title !== undefined) values.title = title;
        if (description !== undefined) values.description = description;
        if (priority !== undefined) values.priority = priority;
        if (assigneeId !== undefined) values.assigneeId = assigneeId;
        if (dueDate !== undefined) values.dueDate = dueDate;

        const [updated] = await db.update(issue).set(values)
            .where(eq(issue.id, check.data)).returning();

        try {
            const [proj] = await db
                .select({ workspaceId: project.workspaceId, key: project.key })
                .from(project)
                .where(eq(project.id, updated.projectId))
                .limit(1);
            if (proj) {
                const type =
                    status !== undefined && status !== row.status
                        ? ("issue.status_changed" as const)
                        : assigneeId !== undefined && assigneeId !== row.assigneeId
                          ? ("issue.assigned" as const)
                          : ("issue.updated" as const);
                await logActivity(db, {
                    workspaceId: proj.workspaceId,
                    projectId: updated.projectId,
                    userId: updated.reporterId,
                    type,
                    description:
                        type === "issue.status_changed"
                            ? `moved issue ${proj.key}-${updated.number} from ${row.status} to ${status}`
                            : type === "issue.assigned"
                              ? `assigned issue ${proj.key}-${updated.number}`
                              : `updated issue ${proj.key}-${updated.number}`,
                    metadata: { issueId: updated.id, number: updated.number, status: updated.status },
                });
            }
        } catch (err) {
            console.error("Failed to log activity for issue update", err);
        }

        return NextResponse.json({ issue: updated }, { status: 200 })

    } catch {
        return NextResponse.json({ error: "Failed to update the issue" }, { status : 500 } )
    }
}
