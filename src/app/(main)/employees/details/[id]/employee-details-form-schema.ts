import { z } from "zod";

export const employeeDetailsFormSchema = z.object({
  email: z.string().email().trim().min(1).max(100),
  username: z.string().max(50).min(3),
  role: z.enum(["admin", "employee"]),
});
export type EmployeeDetailsFormType = z.infer<typeof employeeDetailsFormSchema>;
