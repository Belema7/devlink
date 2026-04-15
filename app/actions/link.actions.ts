"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { createLinkSchema } from "@/lib/validators/link.schema";
import { normalizeSearchQuery, normalizeTagList } from "@/lib/dashboard-filters";

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

export type GetUserLinksInput = {
  search?: string;
  tags?: string[];
  visibility?: "all" | "public" | "private";
};

export async function getUserLinks(filters: GetUserLinksInput = {}) {
  const userId = await getAuthUserId();

  if (!userId) {
    return [];
  }

  const search = normalizeSearchQuery(filters.search);
  const tags = normalizeTagList(filters.tags);
  const visibility = filters.visibility;

  const andFilters: Prisma.LinkWhereInput[] = [];

  if (search) {
    andFilters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        {
          tags: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andFilters.push({
      tags: {
        some: {
          name: { in: tags },
        },
      },
    });
  }

  if (visibility && visibility !== "all") {
    andFilters.push({ isPublic: visibility === "public" });
  }

  return prisma.link.findMany({
    where: {
      userId,
      ...(andFilters.length > 0 ? { AND: andFilters } : {}),
    },
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

export async function getUserTagNames() {
  const userId = await getAuthUserId();

  if (!userId) {
    return [];
  }

  const tags = await prisma.tag.findMany({
    where: {
      links: {
        some: {
          userId,
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag) => tag.name);
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

    revalidatePath("/dashboard");
    revalidatePath("/links");
    revalidatePath(`/links/${parsed.data.id}`);
    revalidatePath(`/links/edit/${parsed.data.id}`);

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
