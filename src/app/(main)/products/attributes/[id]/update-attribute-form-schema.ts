import { z } from "zod";

export const updateAttributeFormSchema = z.object({
  name: z
    .string()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  values: z
    .object({
      id: z.string().max(36),
      name: z
        .string()
        .max(50)
        .refine((data) => !!data.trim(), "Field is required"),
    })
    .array(),
});
export type UpdateAttributeType = z.infer<typeof updateAttributeFormSchema>;
