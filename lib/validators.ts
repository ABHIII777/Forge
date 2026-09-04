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
    status: z.enum(["planning","active","on_hold","completed","archived"]).default("planning"),
})

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(3).max(20),
    slug : z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,50}$/).optional(),
    description: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().trim().min(10).max(2000).optional(),
    ),
})