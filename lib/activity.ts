import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { activity, project } from "@/db/schema";
import { activityTypeEnum } from "@/lib/validators";

export type ActivityType = z.infer<typeof activityTypeEnum>;

type DbOrTx = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface LogActivityInput {
    workspaceId?: string;
    projectId?: string | null;
    userId: string;
    type: ActivityType;
    description: string;
    metadata?: Record<string, unknown>;
}

export async function logActivity(client: DbOrTx, input: LogActivityInput) {
    const projectId = input.projectId ?? null;
    let workspaceId = input.workspaceId;

    if (!workspaceId && !projectId) {
        throw new Error("WORKSPACE_OR_PROJECT_REQUIRED");
    }

    if (projectId) {
        const [proj] = await client
            .select({ id: project.id, workspaceId: project.workspaceId })
            .from(project)
            .where(eq(project.id, projectId))
            .limit(1);

        if (!proj) {
            throw new Error("PROJECT_NOT_FOUND");
        }
        if (workspaceId && proj.workspaceId !== workspaceId) {
            throw new Error("PROJECT_WORKSPACE_MISMATCH");
        }
        workspaceId = proj.workspaceId;
    }

    const [row] = await client
        .insert(activity)
        .values({
            workspaceId: workspaceId!,
            projectId,
            userId: input.userId,
            type: input.type,
            description: input.description,
            metadata: input.metadata ?? {},
        })
        .returning();

    return row;
}
