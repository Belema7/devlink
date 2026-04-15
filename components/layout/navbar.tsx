"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import MobileNav, { type NavItem } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", protected: true },
  { href: "/feed", label: "Feed" },
];

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const getInitials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-1 text-zinc-100 transition-colors duration-200 hover:bg-zinc-900 hover:text-white"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-blue-400 ring-1 ring-zinc-800 transition-transform duration-200 group-hover:-translate-y-0.5">
              <Sparkles className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">DevLink</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-blue-400 underline decoration-blue-400 decoration-2 underline-offset-8"
                    : "text-zinc-300 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-40 animate-pulse rounded-xl bg-zinc-900" />
          ) : session ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
              >
                <Avatar className="size-8">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                  <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate">{session.user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "border-zinc-800 bg-zinc-900/60 px-4 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white",
                })}
              >
                <LogOut className="size-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "px-4 text-zinc-200 hover:bg-zinc-900 hover:text-white",
                })}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "bg-blue-500 px-4 text-white hover:bg-blue-600",
                })}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </nav>
  );
}
