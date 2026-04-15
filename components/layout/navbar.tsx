"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles, LayoutDashboard, Newspaper } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import MobileNav, { type NavItem } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    protected: true,
    icon: LayoutDashboard,
  },
  {
    href: "/feed",
    label: "Feed",
    icon: Newspaper,
  },
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
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo - refined hover and spacing */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-zinc-100 transition-all duration-200 hover:bg-zinc-900 hover:text-white active:scale-95"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-zinc-900 text-blue-400 ring-1 ring-inset ring-zinc-700/70 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[21px] font-semibold tracking-[-0.5px]">DevLink</span>
          </Link>
        </div>

        {/* Desktop Navigation - polished active/hover states with pill design */}
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-zinc-900 text-blue-400 shadow-inner shadow-blue-400/10"
                    : "text-zinc-300 hover:bg-zinc-900/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Section - refined spacing and hover feedback */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-40 animate-pulse rounded-2xl bg-zinc-900" />
          ) : session ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white active:scale-[0.97]"
              >
                <Avatar className="size-8 ring-1 ring-inset ring-zinc-700">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                  <AvatarFallback className="bg-zinc-800 text-xs font-medium">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate font-medium">{session.user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "border-zinc-700 bg-zinc-900/60 px-5 text-zinc-200 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white active:scale-95",
                })}
              >
                <LogOut className="mr-2 size-3.5" />
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
                  className:
                    "px-5 text-zinc-300 transition-all duration-200 hover:bg-zinc-900 hover:text-white active:scale-95",
                })}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className:
                    "bg-blue-500 px-5 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-600 active:scale-95",
                })}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <div className="flex md:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </nav>
  );
}