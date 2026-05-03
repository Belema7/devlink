import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
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
void prisma.vote;

export default prisma;

