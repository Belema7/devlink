import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid bundling Prisma in a way that drops model delegates (fixes "Model verification does not exist").
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "better-auth",
    "@better-auth/prisma-adapter",
  ],
};

export default nextConfig;
