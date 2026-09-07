import { z } from "zod"

export const signupSchema = z.object({
    username: z.string().min(5),
    fullName: z.string().min(5).max(20),
    email: z.email(),
    password: z.string().min(8).max(20)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(5).max(20)
})

export const createProjectSchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().trim().min(10).max(2000).optional(),
    ),
    key: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{2,6}$/),
    workspaceId: z.string().uuid(),
    ownerId: z.string().uuid().optional(),
    status: z.enum(["planning", "active", "on_hold", "completed", "archived"]).default("planning"),
})

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(3).max(20),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,50}$/).optional(),
    description: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().trim().min(10).max(2000).optional(),
    ),
})

export const createIssueSchema = z.object({
    projectId: z.string().uuid(),
    title: z.string().trim().min(3).max(200),
    description: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().trim().min(10).max(2000).optional()
    ),

    assigneeId: z.preprocess(
        (value) => {
            if (value === "") return undefined;
            return value;
        },
        z.string().uuid().optional()
    ),

    priority: z
        .enum(["low", "medium", "high", "critical"])
        .default("medium"),

    labelIds: z.array(z.string().uuid()).default([]),
})

export const createLabelSchema = z.object({
    projectId: z.string().uuid(),
    name: z.string().trim().min(1).max(50),
    color: z.string().trim().toLowerCase().regex(/^#[0-9a-f]{6}$/),
    description: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().trim().max(500).optional()
    ),
})

export const createCommentSchema = z.object({
  issueId: z.string().uuid().optional(),
  discussionId: z.string().uuid().optional(),
  content: z.string().trim().min(1).max(5000),
}).refine((v) => (v.issueId ? !v.discussionId : !!v.discussionId), {
  message: "Exactly one of issueId or discussionId is required",
});

export const updateIssueSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().min(10).max(2000).optional(),
  ),
  status: z.enum(["backlog", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  assigneeId: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().uuid().nullable().optional(),
  ),
  dueDate: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.coerce.date().nullable().optional(),
  ),
}).refine((v) => Object.values(v).some((x) => x !== undefined), {
  message: "Nothing to update",
});