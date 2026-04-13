import "dotenv/config";
import { randomUUID } from "node:crypto";
import prisma from "../lib/db";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Make sure your .env is present before running seed.",
    );
  }

  const userAId = randomUUID();
  const userBId = randomUUID();

  const [userA, userB] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@devlink.app" },
      update: { name: "Alice Johnson" },
      create: {
        id: userAId,
        name: "Alice Johnson",
        email: "alice@devlink.app",
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@devlink.app" },
      update: { name: "Bob Smith" },
      create: {
        id: userBId,
        name: "Bob Smith",
        email: "bob@devlink.app",
        emailVerified: true,
      },
    }),
  ]);

  const tagNames = ["react", "nextjs", "css", "typescript", "prisma", "zod"];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const linksInput = [
    {
      title: "React Official Docs",
      url: "https://react.dev",
      description: "Official React documentation and guides.",
      isPublic: true,
      userId: userA.id,
      tags: ["react", "typescript"],
    },
    {
      title: "Next.js Docs",
      url: "https://nextjs.org/docs",
      description: "Everything about building with Next.js.",
      isPublic: true,
      userId: userA.id,
      tags: ["nextjs", "react"],
    },
    {
      title: "Prisma ORM Docs",
      url: "https://www.prisma.io/docs",
      description: "Prisma schema, migrations, and client docs.",
      isPublic: true,
      userId: userB.id,
      tags: ["prisma", "typescript"],
    },
    {
      title: "Modern CSS Guide",
      url: "https://web.dev/learn/css",
      description: "Practical modern CSS reference.",
      isPublic: false,
      userId: userB.id,
      tags: ["css"],
    },
    {
      title: "Zod Validation",
      url: "https://zod.dev",
      description: "Type-safe schema validation for TypeScript.",
      isPublic: true,
      userId: userA.id,
      tags: ["zod", "typescript"],
    },
  ];

  const links = [];
  for (const item of linksInput) {
    const resolvedTags = tags.filter((tag) => item.tags.includes(tag.name));
    const existingLink = await prisma.link.findFirst({
      where: { url: item.url },
      select: { id: true },
    });
    const link = existingLink
      ? await prisma.link.update({
          where: { id: existingLink.id },
          data: {
            title: item.title,
            description: item.description,
            isPublic: item.isPublic,
            userId: item.userId,
            tags: {
              set: [],
              connect: resolvedTags.map((tag) => ({ id: tag.id })),
            },
          },
        })
      : await prisma.link.create({
          data: {
            title: item.title,
            url: item.url,
            description: item.description,
            isPublic: item.isPublic,
            userId: item.userId,
            tags: {
              connect: resolvedTags.map((tag) => ({ id: tag.id })),
            },
          },
        });
    links.push(link);
  }

  await Promise.all([
    prisma.bookmark.upsert({
      where: {
        userId_linkId: {
          userId: userA.id,
          linkId: links[2].id,
        },
      },
      update: {},
      create: {
        userId: userA.id,
        linkId: links[2].id,
      },
    }),
    prisma.bookmark.upsert({
      where: {
        userId_linkId: {
          userId: userB.id,
          linkId: links[1].id,
        },
      },
      update: {},
      create: {
        userId: userB.id,
        linkId: links[1].id,
      },
    }),
    prisma.bookmark.upsert({
      where: {
        userId_linkId: {
          userId: userB.id,
          linkId: links[4].id,
        },
      },
      update: {},
      create: {
        userId: userB.id,
        linkId: links[4].id,
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
