import { z } from "zod";

export const personalDetailsFormSchema = z.object({
  email: z.string().email().trim().min(1).max(100),
  username: z.string().max(50).min(3),
});
export type PersonalDetailsFormType = z.infer<typeof personalDetailsFormSchema>;
