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
    { href: "/trending", label: "Trending" },
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
    <nav className="sticky top-0 z-40 border-b-2 border-black bg-white text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-black transition-transform duration-150 ease-out hover:-translate-y-0.5">
          <span className="inline-flex size-10 items-center justify-center rounded border-2 border-black bg-white shadow-[3px_3px_0px_#000]">
            <BookOpenText className="size-5 stroke-[2.25]" />
          </span>
          <span className="font-heading text-2xl font-black tracking-normal">DevLinks</span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded border-2 px-4 py-2 font-display text-xs font-extrabold uppercase tracking-normal transition-all duration-150 ease-out",
                  active
                    ? "border-black bg-black text-white shadow-[3px_3px_0px_#000]"
                    : "border-transparent text-black hover:border-black hover:bg-muted"
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

        <div className="flex items-center gap-3 md:hidden">
          <ButtonLink href={addLinkHref} className="h-10 px-4">
            Add Link
          </ButtonLink>
        </div>
      </div>

      <div className="border-t-2 border-black px-5 py-3 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <MobileTab href="/feed" active={isActiveRoute(pathname, "/feed")}>
            Feed
          </MobileTab>
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
          className="inline-flex size-10 items-center justify-center rounded border-2 border-black bg-white text-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-muted hover:shadow-[5px_5px_0px_#000] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open profile menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
            <AvatarFallback className="bg-muted font-display text-xs font-black text-black">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex min-w-0 items-center gap-2 font-body text-xs font-bold text-muted-foreground">
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
          className="cursor-pointer text-destructive focus:bg-destructive focus:text-white"
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
        "inline-flex h-10 items-center rounded border-2 px-4 font-display text-[0.7rem] font-extrabold uppercase tracking-normal transition-colors",
        active
          ? "brass-gradient border-black text-white shadow-[3px_3px_0px_#000]"
          : "border-black bg-white text-black hover:bg-muted"
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
