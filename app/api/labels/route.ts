import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { label, project } from "@/db/schema";
import { createLabelSchema } from "@/lib/validators";

// TODO(auth): scope to labels of projects the signed-in user can access.
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
        const rows = await db.query.label.findMany({
            where: eq(label.projectId, check.data),
        });
        return NextResponse.json({ labels: rows }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to load labels" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = createLabelSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const [proj] = await db.select({ id: project.id }).from(project).where(eq(project.id, parsed.data.projectId)).limit(1);
    if (!proj) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    try {
        const [created] = await db.insert(label).values({
            projectId: parsed.data.projectId,
            name: parsed.data.name,
            color: parsed.data.color,
            description: parsed.data.description ?? null,
        }).returning();

        return NextResponse.json({ label: created }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create label" }, { status: 500 });
    }
}
