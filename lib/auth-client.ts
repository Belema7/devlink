import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Same origin as the server (e.g. http://localhost:3000). Paths like /api/auth are applied automatically.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { useSession, signOut, signIn, signUp } = authClient;



