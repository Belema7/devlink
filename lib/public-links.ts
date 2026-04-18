import { headers } from "next/headers";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { normalizeFeedSearchQuery, normalizeFeedTag, type FeedSort } from "@/lib/feed-filters";

const getAuthUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
};

const isVoteTableMissingError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";

type GetPublicLinksOptions = {
  search?: string | null;
  tag?: string | null;
  sort?: FeedSort;
};

export async function getPublicLinks(options: GetPublicLinksOptions = {}) {
  const userId = await getAuthUserId();
  const search = normalizeFeedSearchQuery(options.search);
  const tag = normalizeFeedTag(options.tag);
  const sort = options.sort ?? "all";

  const where: Prisma.LinkWhereInput = {
    isPublic: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      {
        tags: {
          some: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  if (tag) {
    where.tags = {
      some: {
        name: tag,
      },
    };
  }

  const orderBy =
    sort === "trending"
      ? ([{ votes: { _count: "desc" } }, { createdAt: "desc" }] as Prisma.LinkOrderByWithRelationInput[])
      : ([{ createdAt: "desc" }] as Prisma.LinkOrderByWithRelationInput[]);

  try {
    const links = await prisma.link.findMany({
      where,
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
      orderBy,
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
      where,
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

export async function getTrendingLinks() {
  const userId = await getAuthUserId();

  try {
    const links = await prisma.link.findMany({
      where: {
        isPublic: true,
        votes: {
          some: {},
        },
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
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
      take: 10,
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

    return [];
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
