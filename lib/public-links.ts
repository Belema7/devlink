import { headers } from "next/headers";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const getAuthUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
};

const isVoteTableMissingError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";

export async function getPublicLinks() {
  const userId = await getAuthUserId();
  try {
    const links = await prisma.link.findMany({
      where: { isPublic: true },
      include: {
        tags: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
        _count: {
          select: { votes: true },
        },
        votes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
      orderBy: [{ votes: { _count: "desc" } }, { createdAt: "desc" }],
    });

    return links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      voteCount: link._count.votes,
      hasVoted: userId ? link.votes.length > 0 : false,
    }));
  } catch (error) {
    if (!isVoteTableMissingError(error)) {
      throw error;
    }

    const links = await prisma.link.findMany({
      where: { isPublic: true },
      include: {
        tags: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      voteCount: 0,
      hasVoted: false,
    }));
  }
}

export async function getPublicLinkById(linkId: string) {
  const userId = await getAuthUserId();
  try {
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        isPublic: true,
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
        _count: {
          select: { votes: true },
        },
        votes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!link) return null;

    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      voteCount: link._count.votes,
      hasVoted: userId ? link.votes.length > 0 : false,
      createdAt: link.createdAt.toISOString(),
    };
  } catch (error) {
    if (!isVoteTableMissingError(error)) {
      throw error;
    }

    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        isPublic: true,
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!link) return null;

    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags,
      createdBy: link.user.name,
      voteCount: 0,
      hasVoted: false,
      createdAt: link.createdAt.toISOString(),
    };
  }
}
