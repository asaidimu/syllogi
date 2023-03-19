import { z, ZodType } from "zod"

const credentials: ZodType = z.object({
    id: z.number(),
    password: z.string()
})

export default {
    "POST:/": credentials
}
