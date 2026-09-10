import { NextResponse } from "next/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { activity, project, user, workspace } from "@/db/schema";
import { createActivitySchema, listActivitySchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
    const params = Object.fromEntries(new URL(req.url).searchParams.entries());
    const parsed = listActivitySchema.safeParse(params);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { workspaceId, projectId, userId, type, limit, cursor } = parsed.data;

    try {
        const conditions = [];
        if (workspaceId) conditions.push(eq(activity.workspaceId, workspaceId));
        if (projectId) conditions.push(eq(activity.projectId, projectId));
        if (userId) conditions.push(eq(activity.userId, userId));
        if (type) conditions.push(eq(activity.type, type));

        if (cursor) {
            const [cursorRow] = await db
                .select({ id: activity.id, createdAt: activity.createdAt })
                .from(activity)
                .where(eq(activity.id, cursor))
                .limit(1);
            if (!cursorRow) {
                return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
            }
            conditions.push(
                or(
                    lt(activity.createdAt, cursorRow.createdAt),
                    and(
                        eq(activity.createdAt, cursorRow.createdAt),
                        lt(activity.id, cursorRow.id),
                    ),
                )!,
            );
        }

        const rows = await db
            .select({
                id: activity.id,
                workspaceId: activity.workspaceId,
                projectId: activity.projectId,
                userId: activity.userId,
                type: activity.type,
                description: activity.description,
                metadata: activity.metadata,
                createdAt: activity.createdAt,
                userDisplayName: user.displayName,
                userAvatarUrl: user.avatarUrl,
            })
            .from(activity)
            .leftJoin(user, eq(activity.userId, user.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(activity.createdAt), desc(activity.id))
            .limit(limit + 1);

        const hasMore = rows.length > limit;
        const page = hasMore ? rows.slice(0, limit) : rows;

        const activities = page.map(({ userDisplayName, userAvatarUrl, ...a }) => ({
            ...a,
            user:
                userDisplayName === null
                    ? null
                    : { id: a.userId, displayName: userDisplayName, avatarUrl: userAvatarUrl },
        }));

        return NextResponse.json(
            { activities, nextCursor: hasMore ? page[page.length - 1].id : null },
            { status: 200 },
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const parsed = createActivitySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const [ws] = await db
            .select({ id: workspace.id })
            .from(workspace)
            .where(eq(workspace.id, parsed.data.workspaceId))
            .limit(1);
        if (!ws) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        if (parsed.data.projectId) {
            const [proj] = await db
                .select({ id: project.id, workspaceId: project.workspaceId })
                .from(project)
                .where(eq(project.id, parsed.data.projectId))
                .limit(1);
            if (!proj) {
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            }
            if (proj.workspaceId !== parsed.data.workspaceId) {
                return NextResponse.json(
                    { error: "Project does not belong to workspace" },
                    { status: 400 },
                );
            }
        }

        // TODO(auth): use the signed-in user instead of the first user.
        const [actor] = await db.select({ id: user.id }).from(user).limit(1);
        if (!actor) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const created = await logActivity(db, { ...parsed.data, userId: actor.id });
        return NextResponse.json({ activity: created }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
    }
}
