import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(3).max(50),
    newPassword: z.string().trim().min(3).max(50),
    confirmNewPassword: z.string().trim().min(3).max(50),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
