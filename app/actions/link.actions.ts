"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createLinkSchema } from "@/lib/validators/link.schema";

type CreateLinkActionInput = {
  title: string;
  url: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
};

type CreateLinkActionResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

const normalizeTags = (tags: string[] = []) =>
  [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

export async function createLinkAction(
  input: CreateLinkActionInput
): Promise<CreateLinkActionResult> {
  const parsed = createLinkSchema.safeParse({
    ...input,
    description: input.description?.trim() ? input.description.trim() : undefined,
    tags: normalizeTags(input.tags),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the validation errors and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to create a link.",
    };
  }

  try {
    const normalizedTags = normalizeTags(parsed.data.tags);

    await prisma.link.create({
      data: {
        title: parsed.data.title,
        url: parsed.data.url,
        description: parsed.data.description,
        isPublic: parsed.data.isPublic,
        userId: session.user.id,
        tags: {
          connectOrCreate: normalizedTags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });

    return {
      success: true,
      message: "Link saved successfully.",
    };
  } catch (error) {
    console.error("Failed to create link:", error);
    return {
      success: false,
      message: "Something went wrong while saving your link. Please try again.",
    };
  }
}
