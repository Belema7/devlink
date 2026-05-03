"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", label: "Feed" },
  { href: "/trending", label: "Trending", protected: true },
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
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleAddLinkClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push("/");
    }
  };

  const AccountDropdown = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-zinc-800 transition-colors hover:border-zinc-700 hover:bg-zinc-900",
            isMobile ? "p-1" : "p-1 pr-2 md:p-1.5 md:pr-2.5"
          )}
          aria-label="Open account menu"
        >
          <Avatar className="size-7 md:size-8">
            <AvatarImage src={session?.user.image ?? undefined} alt={session?.user.name} />
            <AvatarFallback className="bg-zinc-900 text-[10px] font-medium text-zinc-300 md:text-xs">
              {getInitials(session?.user.name)}
            </AvatarFallback>
          </Avatar>
          {!isMobile && <ChevronDown className="size-4 text-zinc-500" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "start" : "end"} 
        className="w-56 border-zinc-800 bg-zinc-950 text-zinc-100"
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none text-zinc-100">{session?.user.name}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{session?.user.email}</p>
        </div>
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
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-zinc-100">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">DevLinks</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            if (item.protected && !session) return null;
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

        <div className="flex items-center gap-3">
          {/* Add Link Button */}
          {!isPending && (
            <ButtonLink 
              href="/add-link" 
              onClick={handleAddLinkClick}
              className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
            >
              <span className="hidden sm:inline">Add Link</span>
              <Plus className="size-4 sm:ml-1" />
            </ButtonLink>
          )}

          {/* Desktop User Profile */}
          {!isPending && session && (
            <div className="hidden lg:block">
              <AccountDropdown />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Secondary Navigation (Profile/Feed/Trending) */}
      <div className="border-t border-zinc-900 bg-zinc-950/50 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-2">
          {/* Mobile Profile Dropdown (Left side) */}
          {!isPending && session && (
            <AccountDropdown isMobile={true} />
          )}

          <div className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              if (item.protected && !session) return null;
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-1 min-w-[70px] rounded-full px-3 py-1.5 text-center text-[11px] font-medium transition-all",
                    active
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

function ButtonLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        buttonVariants({
          variant: "default",
          size: "sm",
        }),
        "inline-flex h-10 items-center gap-1.5 px-4 text-sm font-medium transition-transform active:scale-95",
        className
      )}
    >
      {children}
    </Link>
  );
}
