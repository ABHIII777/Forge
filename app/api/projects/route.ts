import { NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { project, user, workspace } from "@/db/schema";

export async function POST(req: Request) {
    const body = await req.json()

    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: "Some error occured during parsing the data" }, { status: 400 })
    }

    const { workspaceId, name, description, key, status } = parsed.data;
    const [owner] = await db.select({ id: user.id }).from(user).limit(1)

    if (!owner) {
        return NextResponse.json({ message: "No users exist" }, { status: 404 })
    }

    const [ws] = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1);
    if (!ws) {
        return NextResponse.json({ message: "Workspace not found" }, { status: 404 })
    }
    
    try {
        const [created] = await db.insert(project).values({
            name, description: description ?? null, key, workspaceId,
            ownerId: parsed.data.ownerId ?? owner.id, status,
        }).returning();
        return NextResponse.json({ project: created }, { status: 201 });
    } catch (e) {
        if (pgErrorCode(e) === "23505") {
            return NextResponse.json({ error: "Project key already exists" }, { status: 409 });
        }
        throw e;
    }
}

export async function GET(req: Request) {

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