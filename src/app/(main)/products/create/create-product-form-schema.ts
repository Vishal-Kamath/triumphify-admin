import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  brand_name: z
    .string()
    .trim()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  category_id: z.string().refine((data) => !!data.trim(), "Field is required"),

  description: z
    .string()
    .max(750)
    .refine((data) => !!data.trim(), "Field is required"),
  // description
  product_accordians: z.array(
    z.object({
      title: z
        .string()
        .trim()
        .max(100)
        .refine((data) => !!data.trim(), "Field is required"),
      description: z
        .string()
        .trim()
        .max(500)
        .refine((data) => !!data.trim(), "Field is required"),
    })
  ),

  // images
  product_images: z
    .array(
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
          "Invalid file type"
        )
    )
    .refine((value) => value.length > 0, "Field is required"),

  // variations
  variations: z.array(
    z.object({
      id: z.string(),
      key: z
        .string()
        .trim()
        .refine((data) => !!data.trim(), "Field is required"),
      combinations: z.record(z.string(), z.string()),
      quantity: z.number(),
      discount: z.number(),
      price: z.number(),
    })
  ),

  // meta data
  meta_title: z
    .string()
    .trim()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
  meta_description: z
    .string()
    .trim()
    .max(250)
    .refine((data) => !!data.trim(), "Field is required"),
  meta_keywords: z
    .string()
    .trim()
    .max(100)
    .refine((data) => !!data.trim(), "Field is required"),
});
export type CreateProductType = z.infer<typeof createProductSchema>;
