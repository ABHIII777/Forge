import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { issue, project, projectMember } from "@/db/schema";

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
    const row = await db.query.project.findFirst({
      where: eq(project.id, check.data),
    });
    if (!row) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const issues = await db.query.issue.findMany({
      where: eq(issue.projectId, check.data),
      orderBy: (i, { asc }) => [asc(i.number)],
      limit: 50,
    });

    const members = await db
      .select({ userId: projectMember.userId })
      .from(projectMember)
      .where(eq(projectMember.projectId, check.data));

    const open = issues.filter((i) => i.status !== "done").length;

    return NextResponse.json(
      {
        project: row,
        issues,
        counts: { open, total: issues.length, members: members.length },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }
}
