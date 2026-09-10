import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/lib/db";
import { workspace, workspaceMember } from "@/db/schema";
import { updateMemberRoleSchema } from "@/lib/validators";

const paramsSchema = z.object({
    workspaceId: z.string().uuid(),
    userId: z.string().uuid(),
});

async function ownerCount(workspaceId: string) {
    return db
        .select({ userId: workspaceMember.userId })
        .from(workspaceMember)
        .where(
            and(
                eq(workspaceMember.workspaceId, workspaceId),
                eq(workspaceMember.role, "owner"),
            ),
        );
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ workspaceId: string; userId: string }> },
) {
    const check = paramsSchema.safeParse(await params);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid workspaceId or userId" }, { status: 400 });
    }
    const { workspaceId, userId } = check.data;

    const body = await req.json().catch(() => null);
    const parsed = updateMemberRoleSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid role data", details: parsed.error.flatten() },
            { status: 400 },
        );
    }

    try {
        const [ws] = await db
            .select({ id: workspace.id })
            .from(workspace)
            .where(eq(workspace.id, workspaceId))
            .limit(1);
        if (!ws) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const [row] = await db
            .select({ role: workspaceMember.role })
            .from(workspaceMember)
            .where(
                and(
                    eq(workspaceMember.workspaceId, workspaceId),
                    eq(workspaceMember.userId, userId),
                ),
            )
            .limit(1);
        if (!row) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        if (row.role === "owner" && parsed.data.role !== "owner") {
            const owners = await ownerCount(workspaceId);
            if (owners.length <= 1) {
                return NextResponse.json(
                    { error: "Workspace must keep at least one owner" },
                    { status: 400 },
                );
            }
        }

        const [updated] = await db
            .update(workspaceMember)
            .set({ role: parsed.data.role })
            .where(
                and(
                    eq(workspaceMember.workspaceId, workspaceId),
                    eq(workspaceMember.userId, userId),
                ),
            )
            .returning();

        return NextResponse.json({ member: updated }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ workspaceId: string; userId: string }> },
) {
    const check = paramsSchema.safeParse(await params);
    if (!check.success) {
        return NextResponse.json({ error: "Invalid workspaceId or userId" }, { status: 400 });
    }
    const { workspaceId, userId } = check.data;

    try {
        const [row] = await db
            .select({ role: workspaceMember.role })
            .from(workspaceMember)
            .where(
                and(
                    eq(workspaceMember.workspaceId, workspaceId),
                    eq(workspaceMember.userId, userId),
                ),
            )
            .limit(1);
        if (!row) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        if (row.role === "owner") {
            // Target is an owner: only allow removal if another owner remains.
            const owners = await ownerCount(workspaceId);
            const others = owners.filter((o) => o.userId !== userId);
            if (others.length === 0) {
                return NextResponse.json(
                    { error: "Workspace must keep at least one owner" },
                    { status: 400 },
                );
            }
        }

        await db
            .delete(workspaceMember)
            .where(
                and(
                    eq(workspaceMember.workspaceId, workspaceId),
                    eq(workspaceMember.userId, userId),
                ),
            );

        return NextResponse.json({ removed: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}
