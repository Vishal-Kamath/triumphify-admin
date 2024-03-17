import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email().trim().min(1).max(100),
  password: z.string().trim().min(3).max(50),
});
export type LoginFormType = z.infer<typeof LoginFormSchema>;
