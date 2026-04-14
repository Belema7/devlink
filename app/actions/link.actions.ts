"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
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

type DeleteLinkActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

const deleteLinkSchema = z.object({
  id: z.string().min(1, "Link ID is required."),
});

const normalizeTags = (tags: string[] = []) =>
  [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

const getAuthUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
};

export async function getUserLinks() {
  const userId = await getAuthUserId();

  if (!userId) {
    return [];
  }

  return prisma.link.findMany({
    where: { userId },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

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

  const userId = await getAuthUserId();

  if (!userId) {
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
        userId,
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

export async function deleteLinkAction(linkId: string): Promise<DeleteLinkActionResult> {
  const parsed = deleteLinkSchema.safeParse({ id: linkId });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid link ID.",
    };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return {
      success: false,
      message: "You must be logged in to delete a link.",
    };
  }

  try {
    const deleted = await prisma.link.deleteMany({
      where: {
        id: parsed.data.id,
        userId,
      },
    });

    if (deleted.count === 0) {
      return {
        success: false,
        message: "Link not found or you do not have access.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/links");

    return {
      success: true,
      message: "Link deleted.",
    };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the link.",
    };
  }
}
