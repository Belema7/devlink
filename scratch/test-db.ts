import { PrismaClient } from "./lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

async function testConnection() {
  console.log("Testing database connection...");
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("DATABASE_URL is not defined");
    return;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const start = Date.now();
    const userCount = await prisma.user.count();
    const end = Date.now();
    console.log(`Connection successful! User count: ${userCount}`);
    console.log(`Query took ${end - start}ms`);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testConnection();
