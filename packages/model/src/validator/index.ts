import { z, ZodType } from "zod"

export const LoginCredentials: ZodType = z.object({
    username: z.string(),
    password: z.string()
})


