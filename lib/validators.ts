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

export const createDiscussionSchema = z.object({
    projectId: z.string().uuid(),
    workspaceId: z.string().uuid(),
    title: z.string(),
    content: z.preprocess(
        (v) => (v == "" || v == undefined || v == null ? undefined : v),
        z.string().trim().min(10).max(2000)
    ),
    category: z.enum(["general",
        "technical",
        "proposal",
        "announcement",
        "question"
    ]),
    tags: z.string().array().default([])
})

export const inviteMemberSchema = z.object({
    email: z.email().transform((v) => v.toLowerCase().trim()),
    role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
})

export const updateMemberRoleSchema = z.object({
    role: z.enum(["owner", "admin", "member", "viewer"]),
})

export const updateProfileSchema = z.object({
    displayName: z.string().trim().min(2).max(50).optional(),
    username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores").optional(),
    bio: z.preprocess(
        (v) => (v === "" ? null : v),
        z.string().trim().max(500).nullable().optional(),
    ),
    avatarUrl: z.preprocess(
        (v) => (v === "" ? null : v),
        z.string().trim().url("Must be a valid URL").max(2000).nullable().optional(),
    ),
}).refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: "Nothing to update",
})

export const updateAccountSchema = z.object({
    email: z.email(),
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(72),
}).refine((v) => v.newPassword !== v.currentPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
})

export const activityTypeEnum = z.enum([
    "issue.created", "issue.updated", "issue.status_changed", "issue.assigned",
    "issue.commented", "project.created", "project.updated",
    "discussion.created", "discussion.replied",
    "workspace.member_added", "workspace.member_removed",
    "system"
])

export const createActivitySchema = z.object({
    workspaceId: z.string().uuid(),
    projectId: z.string().uuid().nullable().optional(),
    type: activityTypeEnum,
    description: z.string().trim().min(3).max(500),
    metadata: z.record(z.string(), z.unknown()).default({})
})

export const listActivitySchema = z.object({
    workspaceId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    type: activityTypeEnum.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().uuid().optional()
})
