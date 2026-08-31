import { email, z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(5).max(20),
    email: z.email(),
    password: z.string().min(8).max(20)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(5).max(20)
})