"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Rocket,
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
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/feed", label: "Resources" },
  { href: "/feed#trending", label: "Trending" },
];

const isHashLink = (href: string) => href.includes("#");

const getHrefBase = (href: string) => href.split("#")[0] || href;

const getHrefHash = (href: string) => href.split("#")[1] || "";

const isActiveRoute = (pathname: string, activeHash: string, href: string) => {
  if (!isHashLink(href)) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const base = getHrefBase(href);
  const hash = getHrefHash(href);

  if (pathname !== base && !(base === "/" && pathname === "/")) {
    return false;
  }

  if (!activeHash) {
    if (pathname === "/" && base === "/" && hash === "features") {
      return true;
    }

    return base === "/feed" && hash === "resources";
  }

  return activeHash === hash;
};

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
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash.replace("#", ""));

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

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
    <nav className="sticky top-0 z-50 border-b border-[#d8d0bc] bg-[#f6f1e8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-zinc-900 transition-opacity hover:opacity-90">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f] shadow-sm ring-1 ring-black/10">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">DevLinks</span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, activeHash, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#242220] text-white shadow-[0_10px_22px_rgba(36,34,32,0.16)]"
                    : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-10 w-40 animate-pulse rounded-full bg-black/5" />
          ) : session ? (
            <>
              <ButtonLink href="/dashboard" className="rounded-full bg-[#242220] text-white hover:bg-[#35312d]">
                Dashboard
                <Rocket className="size-4" />
              </ButtonLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8d0bc] bg-white px-2.5 py-2 text-sm font-medium text-zinc-800 transition-all hover:border-[#c9bea5] hover:bg-[#fffdf8]"
                    aria-label="Open account menu"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                      <AvatarFallback className="bg-[#242220] text-xs font-medium text-[#f5e27f]">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="size-4 text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-[#d8d0bc] bg-[#fffdf8] text-zinc-900 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                >
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/profile")}>
                    <UserRound className="mr-2 size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#d8d0bc]" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
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
                className="rounded-full text-zinc-600 hover:bg-black/5 hover:text-zinc-900"
              >
                Login
              </ButtonLink>
              <ButtonLink
                href="/register"
                className="rounded-full bg-[#b48f67] text-white shadow-[0_12px_28px_rgba(180,143,103,0.28)] hover:bg-[#a97d55]"
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
                className="inline-flex size-11 items-center justify-center rounded-full border border-[#d8d0bc] bg-white text-zinc-700 transition-all hover:border-[#c9bea5] hover:bg-[#fffdf8]"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="border-[#d8d0bc] bg-[#f6f1e8] text-zinc-900">
              <SheetHeader className="border-b border-[#e6deca] px-5 py-5">
                <SheetTitle className="flex items-center gap-3 text-left text-xl font-semibold tracking-tight">
                  <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f]">
                    <Sparkles className="size-4" />
                  </span>
                  DevLinks
                </SheetTitle>
              </SheetHeader>

              <div className="flex h-full flex-col gap-4 px-5 py-6">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const active = isActiveRoute(pathname, activeHash, item.href);

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-[#242220] text-white"
                              : "bg-white text-zinc-700 hover:bg-[#fffdf8] hover:text-zinc-900"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                <div className="mt-auto rounded-[24px] border border-[#e6deca] bg-white p-4">
                  {isPending ? (
                    <div className="space-y-3">
                      <div className="h-12 animate-pulse rounded-2xl bg-zinc-100" />
                      <div className="h-12 animate-pulse rounded-2xl bg-zinc-100" />
                    </div>
                  ) : session ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11">
                          <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                          <AvatarFallback className="bg-[#242220] text-[#f5e27f]">
                            {getInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900">{session.user.name}</p>
                          <p className="truncate text-sm text-zinc-500">{session.user.email}</p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <SheetClose asChild>
                          <ButtonLink href="/dashboard" className="w-full justify-start rounded-2xl bg-[#242220] text-white hover:bg-[#35312d]">
                            <LayoutDashboard className="size-4" />
                            Dashboard
                          </ButtonLink>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-11 w-full justify-start rounded-2xl border-[#d8d0bc] bg-[#fffdf8] text-zinc-800 hover:bg-white"
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
                          className="w-full justify-start rounded-2xl text-zinc-700 hover:bg-black/5 hover:text-zinc-900"
                        >
                          Login
                        </ButtonLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <ButtonLink
                          href="/register"
                          className="w-full justify-start rounded-2xl bg-[#b48f67] text-white hover:bg-[#a97d55]"
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
