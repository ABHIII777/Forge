import { NextResponse } from "next/server";
import { createWorkspaceSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { user, workspace, workspaceMember } from "@/db/schema";
import { eq } from "drizzle-orm";

function deriveSlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function GET() {
    const rows = await db
        .select({
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            description: workspace.description,
        })
        .from(workspace);

    return NextResponse.json({ workspaces: rows }, { status: 200 });
}

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = createWorkspaceSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = parsed.data.slug ?? deriveSlug(parsed.data.name);
    if (!/^[a-z0-9-]{2,50}$/.test(slug)) {
        return NextResponse.json(
            { error: "Could not derive a valid slug from the name; provide one explicitly" },
            { status: 400 },
        );
    }

    const [owner] = await db.select({ id: user.id }).from(user).limit(1);
    if (!owner) {
        return NextResponse.json({ error: "No users exist" }, { status: 404 });
    }

    try {
        const created = await db.transaction(async (tx) => {
            const [ws] = await tx
                .insert(workspace)
                .values({
                    name: parsed.data.name,
                    slug,
                    description: parsed.data.description ?? null,
                    ownerId: owner.id,
                })
                .returning();
            await tx.insert(workspaceMember).values({
                workspaceId: ws.id,
                userId: owner.id,
                role: "owner",
            });
            return ws;
        });

        return NextResponse.json({ workspace: created }, { status: 201 });
    } catch (e) {
        if (pgErrorCode(e) === "23505") {
            return NextResponse.json({ error: "Workspace slug already exists" }, { status: 409 });
        }
        throw e;
    }
}

function pgErrorCode(e: unknown): string | undefined {
    if (typeof e !== "object" || e === null) return undefined;
    const rec = e as Record<string, unknown>;
    if (typeof rec.code === "string") return rec.code;
    const cause = rec.cause;
    if (typeof cause === "object" && cause !== null && typeof (cause as Record<string, unknown>).code === "string") {
        return (cause as Record<string, unknown>).code as string;
    }
    return undefined;
}
