"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { tagSchema } from "@/lib/validators/tag.schema";

type TagActionResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export type UserTag = {
  id: string;
  name: string;
  linkCount: number;
};

const tagIdSchema = z.object({
  id: z.string().min(1, "Tag ID is required."),
});

const tagMutationSchema = z.object({
  id: z.string().min(1, "Tag ID is required."),
  name: tagSchema.shape.name,
});

const getAuthUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
};

const revalidateTagRoutes = () => {
  revalidatePath("/dashboard");
  revalidatePath("/tags");
  revalidatePath("/links");
  revalidatePath("/links/new");
  revalidatePath("/feed");
  revalidatePath("/trending");
  revalidatePath("/");
};

const findOwnedTag = async (tagId: string, userId: string) =>
  prisma.tag.findFirst({
    where: {
      id: tagId,
      links: {
        some: { userId },
        none: {
          userId: {
            not: userId,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

export async function getUserTags(): Promise<UserTag[]> {
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
      id: true,
      name: true,
      _count: {
        select: {
          links: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });

  return tags
    .map((tag) => ({
      id: tag.id,
      name: tag.name,
      linkCount: tag._count.links,
    }))
    .sort((left, right) => right.linkCount - left.linkCount || left.name.localeCompare(right.name));
}

export async function updateTag(id: string, name: string): Promise<TagActionResult> {
  const parsed = tagMutationSchema.safeParse({ id, name });

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
      message: "You must be logged in to update a tag.",
    };
  }

  try {
    const ownedTag = await findOwnedTag(parsed.data.id, userId);

    if (!ownedTag) {
      return {
        success: false,
        message: "Tag not found or it is shared with another account.",
      };
    }

    await prisma.tag.update({
      where: {
        id: ownedTag.id,
      },
      data: {
        name: parsed.data.name,
      },
    });

    revalidateTagRoutes();

    return {
      success: true,
      message: "Tag updated successfully.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        message: "That tag name already exists.",
      };
    }

    console.error("Failed to update tag:", error);
    return {
      success: false,
      message: "Something went wrong while updating the tag.",
    };
  }
}

export async function deleteTag(id: string): Promise<TagActionResult> {
  const parsed = tagIdSchema.safeParse({ id });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid tag ID.",
    };
  }

  const userId = await getAuthUserId();

  if (!userId) {
    return {
      success: false,
      message: "You must be logged in to delete a tag.",
    };
  }

  try {
    const deleted = await prisma.tag.deleteMany({
      where: {
        id: parsed.data.id,
        links: {
          some: { userId },
          none: {
            userId: {
              not: userId,
            },
          },
        },
      },
    });

    if (deleted.count === 0) {
      return {
        success: false,
        message: "Tag not found or it is shared with another account.",
      };
    }

    revalidateTagRoutes();

    return {
      success: true,
      message: "Tag deleted.",
    };
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the tag.",
    };
  }
}

export async function createTag(name: string): Promise<TagActionResult> {
  const parsed = tagSchema.safeParse({ name });

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
      message: "You must be logged in to create a tag.",
    };
  }

  try {
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: parsed.data.name,
      },
      select: {
        id: true,
      },
    });

    if (!existingTag) {
      await prisma.tag.create({
        data: {
          name: parsed.data.name,
        },
      });
    }

    revalidatePath("/tags");

    return {
      success: true,
      message: existingTag
        ? "Tag already exists and is ready to use."
        : "Tag created. Attach it to a link to see it here.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        message: "That tag name already exists.",
      };
    }

    console.error("Failed to create tag:", error);
    return {
      success: false,
      message: "Something went wrong while creating the tag.",
    };
  }
}
