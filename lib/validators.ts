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