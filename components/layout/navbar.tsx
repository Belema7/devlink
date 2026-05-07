"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const isAuthenticated = Boolean(session?.user);
  const navItems = [
    { href: "/feed", label: "Feed" },
    ...(isAuthenticated ? [{ href: "/trending", label: "Trending" }] : []),
  ];

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-zinc-100">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight md:inline">DevLinks</span>
          <span className="text-base font-semibold tracking-tight md:hidden">Devlink</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-32 animate-pulse rounded-full bg-zinc-900" />
          ) : (
            <ButtonLink href="/add-link" className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              Add Link
              <ArrowRight className="size-4" />
            </ButtonLink>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ButtonLink href="/add-link" className="h-9 rounded-full border border-zinc-700 bg-zinc-100 px-3 text-zinc-950 hover:bg-zinc-200">
            Add Link
          </ButtonLink>
        </div>
      </div>

      <div className="border-t border-zinc-900 px-6 py-3 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <MobileTab href="/feed" active={isActiveRoute(pathname, "/feed")}>
            Feed
          </MobileTab>
          {isAuthenticated ? (
            <MobileTab href="/trending" active={isActiveRoute(pathname, "/trending")}>
              Trending
            </MobileTab>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function MobileTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-zinc-700 bg-zinc-100 text-zinc-950"
          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
      )}
    >
      {children}
    </Link>
  );
}

function ButtonLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "default",
          size: "sm",
        }),
        "inline-flex h-11 items-center gap-2 px-4",
        className
      )}
    >
      {children}
    </Link>
  );
}
