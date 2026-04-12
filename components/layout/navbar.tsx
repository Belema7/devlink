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
    <nav className="bg-zinc-950 text-zinc-100 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            DevLink
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded" />
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition"
                >
                  Dashboard
                </Link>

                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

                <span className="text-sm text-zinc-400 hidden sm:block">
                  {session.user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "px-4 py-2",
                  })}
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "px-4 py-2",
                  })}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

