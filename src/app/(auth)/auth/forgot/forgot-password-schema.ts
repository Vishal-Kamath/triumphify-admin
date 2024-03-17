import { z } from "zod";

export const forgotPaswordEnterEmailSchema = z.object({
  email: z.string().email().min(1).max(100),
});

export type ForgotPasswordEnterEmailType = z.infer<
  typeof forgotPaswordEnterEmailSchema
>;
