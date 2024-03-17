import { z } from "zod";

export const createNewEmployeeSchema = z
  .object({
    email: z.string().email().trim().min(1).max(100),
    username: z.string().max(50).min(3),
    password: z.string().max(50).min(3),
    confirmPassword: z.string().max(50).min(3),
    role: z.enum(["admin", "employee"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CreateNewEmployeeType = z.infer<typeof createNewEmployeeSchema>;
