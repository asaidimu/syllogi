import { z } from "zod";
export const LoginCredentials = z.object({
    username: z.string(),
    password: z.string()
});
//# sourceMappingURL=index.js.map