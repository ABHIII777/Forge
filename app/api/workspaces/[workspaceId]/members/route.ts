import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/lib/db";
import { user, workspace, workspaceMember } from "@/db/schema";
import { inviteMemberSchema } from "@/lib/validators";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ workspaceId: string }> },
) {
    const { workspaceId } = await params;
    const check = z.string().uuid().safeParse(workspaceId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid workspaceId" }, { status: 400 });
    }

    try {
        const [ws] = await db
            .select({ id: workspace.id })
            .from(workspace)
            .where(eq(workspace.id, check.data))
            .limit(1);
        if (!ws) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const members = await db
            .select({
                userId: user.id,
                displayName: user.displayName,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOnline: user.isOnline,
                role: workspaceMember.role,
                joinedAt: workspaceMember.joinedAt,
            })
            .from(workspaceMember)
            .innerJoin(user, eq(workspaceMember.userId, user.id))
            .where(eq(workspaceMember.workspaceId, check.data))
            .orderBy(workspaceMember.joinedAt);

        return NextResponse.json({ members }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ workspaceId: string }> },
) {
    const { workspaceId } = await params;
    const check = z.string().uuid().safeParse(workspaceId);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid workspaceId" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const parsed = inviteMemberSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid invite data", details: parsed.error.flatten() },
            { status: 400 },
        );
    }

    try {
        const [ws] = await db
            .select({ id: workspace.id })
            .from(workspace)
            .where(eq(workspace.id, check.data))
            .limit(1);
        if (!ws) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const [found] = await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.email, parsed.data.email))
            .limit(1);
        if (!found) {
            return NextResponse.json(
                { error: "No user with this email — they need to sign up first" },
                { status: 404 },
            );
        }

        const [existing] = await db
            .select({ userId: workspaceMember.userId })
            .from(workspaceMember)
            .where(
                and(
                    eq(workspaceMember.workspaceId, check.data),
                    eq(workspaceMember.userId, found.id),
                ),
            )
            .limit(1);
        if (existing) {
            return NextResponse.json({ error: "Already a member" }, { status: 409 });
        }

        const [member] = await db
            .insert(workspaceMember)
            .values({
                workspaceId: check.data,
                userId: found.id,
                role: parsed.data.role,
            })
            .returning();

        return NextResponse.json({ member }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
    }
}
