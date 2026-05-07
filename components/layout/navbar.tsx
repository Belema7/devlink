import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import NavbarClient from "@/components/layout/navbar-client";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <NavbarClient
      user={
        session?.user
          ? {
              email: session.user.email,
              image: session.user.image,
              name: session.user.name,
            }
          : null
      }
    />
  );
}
