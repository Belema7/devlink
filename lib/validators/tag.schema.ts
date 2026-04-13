import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag name must be at least 2 characters.")
    .max(50, "Tag name cannot exceed 50 characters.")
    .transform((value) => value.trim().toLowerCase()),
});

export type TagInput = z.infer<typeof tagSchema>;
