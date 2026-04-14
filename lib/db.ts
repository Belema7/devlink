import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prismaClientSingleton = () => new PrismaClient({ adapter });

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// Better Auth's Prisma adapter uses `prisma[model]` (dynamic keys). Bundlers can drop delegates
// that are never referenced statically; keep them reachable from this module.
void prisma.post;
void prisma.user;
void prisma.session;
void prisma.account;
void prisma.verification;
void prisma.link;
void prisma.tag;
void prisma.bookmark;

export default prisma;

