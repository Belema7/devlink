import { z } from "zod";

export const bookmarkSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  linkId: z.string().min(1, "Link ID is required."),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
