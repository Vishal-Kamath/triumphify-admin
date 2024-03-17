import { z } from "zod";

export const resetPaswordSchema = z
  .object({
    password: z.string().trim().min(3).max(50),
    confirmPassword: z.string().trim().min(3).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordType = z.infer<typeof resetPaswordSchema>;
