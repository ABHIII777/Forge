import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/lib/db";
import { project, projectMember, user } from "@/db/schema";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ projectId: string }> },
) {
    const { projectId } = await params;
    const check = z.string().uuid().safeParse(projectId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    }

    try {
        const [proj] = await db
            .select({ id: project.id })
            .from(project)
            .where(eq(project.id, check.data))
            .limit(1);
        if (!proj) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const members = await db
            .select({
                userId: user.id,
                displayName: user.displayName,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOnline: user.isOnline,
                role: projectMember.role,
                joinedAt: projectMember.joinedAt,
            })
            .from(projectMember)
            .innerJoin(user, eq(projectMember.userId, user.id))
            .where(eq(projectMember.projectId, check.data))
            .orderBy(projectMember.joinedAt);

        return NextResponse.json({ members }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
    }
}
