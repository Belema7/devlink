"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type VoteActionResult =
  | { success: true; hasVoted: boolean; voteCount: number; message: string }
  | { success: false; hasVoted: boolean; voteCount: number; message: string };

const voteSchema = z.object({
  linkId: z.string().min(1, "Link ID is required."),
});

const isVoteTableMissingError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";

const isDuplicateVoteError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

const getAuthUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
};

const getVoteState = async (linkId: string, userId?: string | null) => {
  try {
    const [voteCount, vote] = await Promise.all([
      prisma.vote.count({ where: { linkId } }),
      userId ? prisma.vote.findUnique({ where: { userId_linkId: { userId, linkId } } }) : null,
    ]);

    return {
      voteCount,
      hasVoted: Boolean(vote),
    };
  } catch (error) {
    if (!isVoteTableMissingError(error)) {
      throw error;
    }

    return {
      voteCount: 0,
      hasVoted: false,
    };
  }
};

export async function upvoteLink(linkId: string): Promise<VoteActionResult> {
  const parsed = voteSchema.safeParse({ linkId });
  if (!parsed.success) {
    return {
      success: false,
      hasVoted: false,
      voteCount: 0,
      message: parsed.error.issues[0]?.message ?? "Invalid link.",
    };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return {
      success: false,
      hasVoted: false,
      voteCount: 0,
      message: "You must be logged in to upvote.",
    };
  }

  const link = await prisma.link.findFirst({
    where: {
      id: parsed.data.linkId,
      isPublic: true,
    },
    select: { id: true },
  });

  if (!link) {
    return {
      success: false,
      hasVoted: false,
      voteCount: 0,
      message: "Public resource not found.",
    };
  }

  try {
    await prisma.vote.create({
      data: {
        userId,
        linkId: parsed.data.linkId,
      },
    });
  } catch (error) {
    if (isVoteTableMissingError(error)) {
      return {
        success: false,
        hasVoted: false,
        voteCount: 0,
        message: "Voting is not available yet. Run the latest database migration first.",
      };
    }

    if (!isDuplicateVoteError(error)) {
      throw error;
    }

    const currentState = await getVoteState(parsed.data.linkId, userId);
    return {
      success: false,
      ...currentState,
      message: "You already upvoted this resource.",
    };
  }

  const currentState = await getVoteState(parsed.data.linkId, userId);
  revalidatePath("/feed");
  revalidatePath(`/link/${parsed.data.linkId}`);
  return {
    success: true,
    ...currentState,
    message: "Upvote added.",
  };
}

export async function removeVote(linkId: string): Promise<VoteActionResult> {
  const parsed = voteSchema.safeParse({ linkId });
  if (!parsed.success) {
    return {
      success: false,
      hasVoted: false,
      voteCount: 0,
      message: parsed.error.issues[0]?.message ?? "Invalid link.",
    };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return {
      success: false,
      hasVoted: false,
      voteCount: 0,
      message: "You must be logged in to remove a vote.",
    };
  }

  try {
    await prisma.vote.deleteMany({
      where: {
        linkId: parsed.data.linkId,
        userId,
      },
    });
  } catch (error) {
    if (isVoteTableMissingError(error)) {
      return {
        success: false,
        hasVoted: false,
        voteCount: 0,
        message: "Voting is not available yet. Run the latest database migration first.",
      };
    }
    throw error;
  }

  const currentState = await getVoteState(parsed.data.linkId, userId);
  revalidatePath("/feed");
  revalidatePath(`/link/${parsed.data.linkId}`);

  return {
    success: true,
    ...currentState,
    message: "Vote removed.",
  };
}
