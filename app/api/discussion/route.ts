import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createDiscussionSchema } from "@/lib/validators";
import { discussion, project, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const body = await req.json()

    console.log(body)
    const parsed = createDiscussionSchema.safeParse(body);  
    if (!parsed.success) {
        return NextResponse.json({ error: "Some error occured while parsing the data" }, { status: 500 })
    }

    const { projectId, workspaceId, title, content, category, tags } = parsed.data

    const [proj] = await db.select({ id: project.id }).from(project).where(eq(project.id, projectId)).limit(1)

    if (!proj) {
        return NextResponse.json({ error: "The project is not found or doesn't exist" }, { status: 404 })
    }

    const [author] = await db.select({ id: user.id }).from(user).limit(1)
    if (!author) {
        return NextResponse.json({ error : "Auther not found or doesn't exist" }, { status: 404 })
    }

    try {

        const [created] = await db.insert(discussion).values({
            title: title,
            content: content ?? null,
            tags: tags,
            category: category,
            authorId: author.id,
            workspaceId: workspaceId
        }).returning()

        return NextResponse.json({ discussion: created }, { status: 201 })
    } catch (err) {

        if (pgErrorCode(err) === "23505"){
            return NextResponse.json({ error: "Project key already exists" }, { status: 409 });
        }
        throw err;
    }
}

function pgErrorCode(e: unknown) : string | undefined {
    if (typeof e !== "object" || e === null ) return undefined

    const rec = e as Record<string, unknown>
    if (typeof rec.code === "string") return rec.code;

    const cause =  rec.cause;
    if (typeof cause == "object" && cause !== null && typeof (cause as Record<string, unknown>).code === "string") {
        return (cause as Record<string, unknown>).code as string;
    }

    return undefined
}