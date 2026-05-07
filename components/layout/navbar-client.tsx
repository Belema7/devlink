"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogOut, Sparkles, UserRound } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavbarClientProps = {
  user: {
    email: string;
    image?: string | null;
    name?: string | null;
  } | null;
};

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const getInitials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export default function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = Boolean(user);
  const addLinkHref = isAuthenticated ? "/add-link" : "/login?redirectTo=/add-link";
  const navItems = [
    { href: "/feed", label: "Feed" },
    ...(isAuthenticated ? [{ href: "/trending", label: "Trending" }] : []),
  ];

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
          <ButtonLink href={addLinkHref} className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
            Add Link
            <ArrowRight className="size-4" />
          </ButtonLink>
          {user ? (
            <ProfileMenu
              email={user.email}
              image={user.image}
              name={user.name}
              onLogout={handleLogout}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ButtonLink href={addLinkHref} className="h-9 rounded-full border border-zinc-700 bg-zinc-100 px-3 text-zinc-950 hover:bg-zinc-200">
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
            <>
              <MobileTab href="/trending" active={isActiveRoute(pathname, "/trending")}>
                Trending
              </MobileTab>
              {user ? (
                <div className="ml-auto">
                  <ProfileMenu
                    email={user.email}
                    image={user.image}
                    name={user.name}
                    onLogout={handleLogout}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function ProfileMenu({
  email,
  image,
  name,
  onLogout,
}: {
  email: string;
  image?: string | null;
  name?: string | null;
  onLogout: () => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          aria-label="Open profile menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
            <AvatarFallback className="bg-zinc-900 text-xs font-medium text-zinc-300">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-zinc-800 bg-zinc-950 text-zinc-100">
        <DropdownMenuLabel className="flex min-w-0 items-center gap-2 text-xs font-normal text-zinc-400">
          <UserRound className="size-4 shrink-0" />
          <span className="truncate">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
          onClick={onLogout}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
