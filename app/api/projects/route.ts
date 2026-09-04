import { NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { project } from "@/db/schema";

export async function POST(req: Request) {
    const body = await req.json()

    const parsed = createProjectSchema.safeParse(body);
    console.log(parsed)

    const { workspaceId, name, description, key, status } = parsed.data;

    try {
        await db.insert(project).values({
            name: name,
            description: description,
            key: key,
            workspaceId: workspaceId,
            status: status
        })

        return NextResponse.json({ message: "Project data inserted"}, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function GET(req: Request) {
    
}