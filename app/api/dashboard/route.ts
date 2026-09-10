import { NextResponse } from "next/server";
import { and, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { issue, project, projectMember, user, workspace } from "@/db/schema";

export async function GET() {
    try {
        // TODO(auth): scope everything to the signed-in user instead of the first user.
        const [me] = await db
            .select({
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                role: user.role,
                isOnline: user.isOnline,
            })
            .from(user)
            .limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const [[activeProjects], [openIssues], [assignedToMe], [teamOnline], [pendingReviews]] =
            await Promise.all([
                db.select({ value: count() }).from(project).where(eq(project.status, "active")),
                db.select({ value: count() }).from(issue).where(ne(issue.status, "done")),
                db
                    .select({ value: count() })
                    .from(issue)
                    .where(and(eq(issue.assigneeId, me.id), ne(issue.status, "done"))),
                db.select({ value: count() }).from(user).where(eq(user.isOnline, true)),
                db.select({ value: count() }).from(issue).where(eq(issue.status, "review")),
            ]);

        const workspaces = await db
            .select({ id: workspace.id, name: workspace.name, slug: workspace.slug })
            .from(workspace)
            .orderBy(workspace.createdAt);

        const recentProjectsRaw = await db
            .select()
            .from(project)
            .orderBy(desc(project.updatedAt))
            .limit(4);

        const recentProjects = await Promise.all(
            recentProjectsRaw.map(async (p) => {
                const [[open], [members], [total]] = await Promise.all([
                    db
                        .select({ value: count() })
                        .from(issue)
                        .where(and(eq(issue.projectId, p.id), ne(issue.status, "done"))),
                    db
                        .select({ value: count() })
                        .from(projectMember)
                        .where(eq(projectMember.projectId, p.id)),
                    db
                        .select({ value: count() })
                        .from(issue)
                        .where(eq(issue.projectId, p.id)),
                ]);
                return { ...p, openIssueCount: open.value, memberCount: members.value, issueCount: total.value };
            }),
        );

        const assignedIssues = await db
            .select({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                status: issue.status,
                priority: issue.priority,
                projectId: issue.projectId,
                reporterId: issue.reporterId,
                updatedAt: issue.updatedAt,
                projectKey: project.key,
                projectName: project.name,
                workspaceId: project.workspaceId,
            })
            .from(issue)
            .innerJoin(project, eq(issue.projectId, project.id))
            .where(eq(issue.assigneeId, me.id))
            .orderBy(desc(issue.updatedAt))
            .limit(6);

        const onlineUsers = await db
            .select({
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                avatarUrl: user.avatarUrl,
                role: user.role,
                isOnline: user.isOnline,
            })
            .from(user)
            .where(eq(user.isOnline, true))
            .limit(8);

        return NextResponse.json(
            {
                user: me,
                stats: {
                    activeProjects: activeProjects.value,
                    openIssues: openIssues.value,
                    assignedToMe: assignedToMe.value,
                    teamOnline: teamOnline.value,
                    pendingReviews: pendingReviews.value,
                },
                workspaces,
                recentProjects,
                assignedIssues,
                onlineUsers,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
