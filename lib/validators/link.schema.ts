import { z } from "zod";

export const createLinkSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  url: z.string().url("Please enter a valid URL."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string().min(1)).optional(),
});

export const updateLinkSchema = createLinkSchema.partial().extend({
  id: z.string().min(1, "Link ID is required."),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
