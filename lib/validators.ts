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
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(100),
    key: z.string().regex(/^[A-Z0-9]{2,6}$/),
    workspaceId: z.string().uuid(),
    status: z.enum(["planning","active","on_hold","completed","archived"]).default("planning"),
})