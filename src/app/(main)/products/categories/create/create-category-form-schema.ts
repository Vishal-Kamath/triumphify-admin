import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createCategoryFormSchema = z.object({
  name: z
    .string()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  description: z
    .string()
    .max(500)
    .refine((data) => !!data.trim(), "Field is required"),
  category_image: z.array(
    z
      .object({
        name: z
          .string()
          .trim()
          .refine((data) => !!data.trim(), "Field is required"),
        size: z.number(),
        type: z
          .string()
          .trim()
          .refine((data) => !!data.trim(), "Field is required"),
        lastModified: z.number(),
      })
      .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
      .refine(
        (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
        "Invalid file type",
      ),
  ),
  meta_title: z
    .string()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  meta_description: z
    .string()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  meta_keywords: z
    .string()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
});
export type CreateCategoryType = z.infer<typeof createCategoryFormSchema>;
