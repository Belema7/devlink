"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", label: "Your Feeds" },
  { href: "/trending", label: "Trending" },
];

const isActiveRoute = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-zinc-100">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">DevLinks</span>
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
                  active
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-100"
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
          ) : session ? (
            <>
              <ButtonLink href="/dashboard" className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                Add resource
                <Rocket className="size-4" />
              </ButtonLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-2.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
                    aria-label="Open account menu"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                      <AvatarFallback className="bg-zinc-900 text-xs font-medium text-zinc-300">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="size-4 text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-950 text-zinc-100">
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/profile")}>
                    <UserRound className="mr-2 size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ButtonLink
                href="/login"
                variant="ghost"
                className="rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
              >
                Login
              </ButtonLink>
              <ButtonLink
                href="/register"
                className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
              >
                Register
                <ArrowRight className="size-4" />
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-200 transition-colors hover:bg-zinc-900"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="border-zinc-800 bg-zinc-950 text-zinc-100">
              <SheetHeader className="border-b border-zinc-800 px-5 py-5">
                <SheetTitle className="flex items-center gap-3 text-left text-xl font-semibold tracking-tight">
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
                    <Sparkles className="size-4" />
                  </span>
                  DevLinks
                </SheetTitle>
              </SheetHeader>

              <div className="flex h-full flex-col gap-4 px-5 py-6">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const active = isActiveRoute(pathname, item.href);

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "rounded-2xl px-4 py-4 text-sm font-medium transition-colors",
                            active
                              ? "bg-zinc-900 text-zinc-100"
                              : "bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                <div className="mt-auto rounded-[24px] border border-zinc-800 bg-zinc-900 p-4">
                  {isPending ? (
                    <div className="space-y-3">
                      <div className="h-12 animate-pulse rounded-2xl bg-zinc-800" />
                      <div className="h-12 animate-pulse rounded-2xl bg-zinc-800" />
                    </div>
                  ) : session ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11">
                          <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                          <AvatarFallback className="bg-zinc-900 text-zinc-300">
                            {getInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-100">{session.user.name}</p>
                          <p className="truncate text-sm text-zinc-400">{session.user.email}</p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <SheetClose asChild>
                          <ButtonLink
                            href="/dashboard"
                            className="w-full justify-start rounded-2xl border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                          >
                            <LayoutDashboard className="size-4" />
                            Add resource
                          </ButtonLink>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-11 w-full justify-start rounded-2xl border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900"
                            )}
                          >
                            <LogOut className="size-4" />
                            Logout
                          </button>
                        </SheetClose>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <SheetClose asChild>
                        <ButtonLink
                          href="/login"
                          variant="ghost"
                          className="w-full justify-start rounded-2xl text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        >
                          Login
                        </ButtonLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <ButtonLink
                          href="/register"
                          className="w-full justify-start rounded-2xl border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                        >
                          Register
                          <ArrowRight className="size-4" />
                        </ButtonLink>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function ButtonLink({
  href,
  variant,
  className,
  children,
}: {
  href: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: variant ?? "default",
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
