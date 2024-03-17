import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateProductSchema = z.object({
  name: z.string().trim().max(100),
  brand_name: z.string().trim().max(100),
  category_id: z.string().refine((data) => !!data.trim(), "Field is required"),

  description: z.string().max(750),
  // description
  product_accordians: z.array(
    z.object({
      title: z.string().trim().max(100),
      description: z.string().trim().max(500),
    }),
  ),

  // images
  product_images: z.array(
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
      )
      .or(z.string()),
  ),

  // variations
  variations: z.array(
    z.object({
      key: z
        .string()
        .trim()
        .refine((data) => !!data.trim(), "Field is required"),
      combinations: z.record(z.string(), z.string()),
      quantity: z.number(),
      discount: z.number(),
      price: z.number(),
    }),
  ),

  // meta data
  meta_title: z.string().trim().max(100),
  meta_description: z.string().trim().max(250),
  meta_keywords: z.string().trim().max(100),
});
export type UpdateProductType = z.infer<typeof updateProductSchema>;
