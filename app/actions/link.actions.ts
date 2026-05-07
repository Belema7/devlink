"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
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

type UpdateLinkActionInput = {
  id: string;
  title: string;
  url: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
};

type UpdateLinkActionResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

const deleteLinkSchema = z.object({
  id: z.string().min(1, "Link ID is required."),
});

const updateLinkActionSchema = createLinkSchema.extend({
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

const isVoteTableMissingError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";

export async function getUserLinks() {
  const userId = await getAuthUserId();

  if (!userId) {
    return [];
  }

  try {
    const links = await prisma.link.findMany({
      where: {
        userId,
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
        votes: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      isOwner: true,
      isPublic: link.isPublic,
      voteCount: link._count.votes,
      hasVoted: link.votes.length > 0,
    }));
  } catch (error) {
    if (!isVoteTableMissingError(error)) {
      throw error;
    }

    const links = await prisma.link.findMany({
      where: {
        userId,
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      isOwner: true,
      isPublic: link.isPublic,
      voteCount: 0,
      hasVoted: false,
    }));
  }
}

export async function getUserLinkById(linkId: string) {
  const parsed = deleteLinkSchema.safeParse({ id: linkId });
  if (!parsed.success) {
    return null;
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return null;
  }

  return prisma.link.findFirst({
    where: {
      id: parsed.data.id,
      userId,
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
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

    const link = await prisma.link.create({
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

    revalidatePath("/feed");
    revalidatePath("/trending");
    revalidatePath("/dashboard");
    revalidatePath("/add-link");
    revalidatePath(`/edit-link/${link.id}`);

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

export async function updateLinkAction(
  input: UpdateLinkActionInput
): Promise<UpdateLinkActionResult> {
  const parsed = updateLinkActionSchema.safeParse({
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
      message: "You must be logged in to update a link.",
    };
  }

  try {
    const normalizedTags = normalizeTags(parsed.data.tags);

    const ownedLink = await prisma.link.findFirst({
      where: {
        id: parsed.data.id,
        userId,
      },
    });

    if (!ownedLink) {
      return {
        success: false,
        message: "Link not found or you do not have access.",
      };
    }

    await prisma.link.update({
      where: {
        id: ownedLink.id,
      },
      data: {
        title: parsed.data.title,
        url: parsed.data.url,
        description: parsed.data.description,
        isPublic: parsed.data.isPublic,
        tags: {
          set: [],
          connectOrCreate: normalizedTags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });

    revalidatePath("/feed");
    revalidatePath("/trending");
    revalidatePath("/dashboard");
    revalidatePath("/add-link");
    revalidatePath(`/edit-link/${parsed.data.id}`);

    return {
      success: true,
      message: "Link updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update link:", error);
    return {
      success: false,
      message: "Something went wrong while updating your link. Please try again.",
    };
  }
}
