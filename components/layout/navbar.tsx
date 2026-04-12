"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 py-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-white hover:text-zinc-300 transition-colors"
          >
            DevLink
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-x-6">
            {isPending ? (
              <div className="h-9 w-28 bg-zinc-900 animate-pulse rounded-xl" />
            ) : session ? (
              <>
                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>

                <div className="h-5 w-px bg-zinc-800" />

                {/* User info */}
                <div className="flex items-center gap-x-2">
                  <span className="text-sm font-medium text-zinc-400 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>

                {/* Sign out button - consistent with shadcn */}
                <button
                  onClick={handleLogout}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "px-5 border-zinc-700 hover:bg-zinc-900 hover:text-white",
                  })}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Logged-out actions */}
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "px-5",
                  })}
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "px-5",
                  })}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


