"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, BookOpenText, LayoutDashboard, LogOut, UserRound } from "lucide-react";
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
    <nav className="border-b border-border bg-background/95 text-foreground backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-foreground transition-transform duration-300 ease-out hover:scale-105">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-primary/40 bg-card text-primary">
            <BookOpenText className="size-4 stroke-[1.5]" />
          </span>
          <span className="hidden font-heading text-2xl font-medium tracking-normal md:inline">DevLinks</span>
          <span className="font-heading text-2xl font-medium tracking-normal md:hidden">Devlink</span>
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
                  "font-display text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out",
                  active ? "text-primary" : "text-muted-foreground hover:text-primary hover:tracking-[0.25em]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href={addLinkHref}>
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
          <ButtonLink href={addLinkHref} className="h-10 px-4">
            Add Link
          </ButtonLink>
        </div>
      </div>

      <div className="border-t border-border px-6 py-3 md:hidden">
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
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/60 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open profile menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
            <AvatarFallback className="bg-muted font-display text-xs font-medium text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-border bg-card text-foreground">
        <DropdownMenuLabel className="flex min-w-0 items-center gap-2 font-body text-xs font-normal text-muted-foreground">
          <UserRound className="size-4 shrink-0" />
          <span className="truncate">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
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
        "inline-flex h-10 items-center rounded border px-4 font-display text-[0.7rem] font-medium uppercase tracking-[0.16em] transition-colors",
        active
          ? "brass-gradient border-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-primary"
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
        "inline-flex items-center gap-2",
        className
      )}
    >
      {children}
    </Link>
  );
}
