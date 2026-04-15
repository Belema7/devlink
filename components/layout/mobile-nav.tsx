"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, UserRound, Sparkles, LayoutDashboard, Newspaper } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export type NavItem = {
  href: string;
  label: string;
  protected?: boolean;
  icon?: ComponentType<{ className?: string }>;
};

type MobileNavProps = {
  navItems: NavItem[];
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

export default function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-10 rounded-2xl border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95"
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        className="w-full max-w-xs border-zinc-700 bg-zinc-950 text-zinc-100 sm:max-w-sm"
        side="right"
      >
        {/* Polished header with matching logo */}
        <SheetHeader className="border-b border-zinc-800 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-left text-xl font-semibold tracking-[-0.5px]">
            <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-zinc-900 text-blue-400 ring-1 ring-inset ring-zinc-700">
              <Sparkles className="size-4" />
            </span>
            DevLink
          </SheetTitle>
          <SheetDescription className="text-left text-zinc-400">
            Developer tools, resources, and links.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-[calc(100%-73px)] flex-col gap-8 px-5 py-8">
          {/* Navigation with icons + consistent active styling */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-zinc-900 text-blue-400 shadow-inner"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon && <item.icon className="size-5" />}
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* User / Auth card - refined shadows and spacing */}
          <div className="mt-auto rounded-3xl border border-zinc-700 bg-zinc-900/60 p-5 shadow-xl">
            {isPending ? (
              <div className="space-y-3">
                <div className="h-12 animate-pulse rounded-2xl bg-zinc-800" />
                <div className="h-10 animate-pulse rounded-2xl bg-zinc-800" />
              </div>
            ) : session ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 ring-2 ring-inset ring-zinc-700">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                    <AvatarFallback className="bg-zinc-800 text-sm font-medium">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-zinc-100">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-400">{session.user.email}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "h-11 w-full justify-start border-zinc-600 bg-zinc-950/80 text-zinc-100 hover:bg-zinc-900 hover:text-white",
                      })}
                    >
                      <UserRound className="mr-3 size-4" />
                      Profile
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "h-11 w-full justify-start border-zinc-600 bg-zinc-950/80 text-zinc-100 hover:bg-zinc-900 hover:text-white",
                      })}
                    >
                      <LogOut className="mr-3 size-4" />
                      Logout
                    </button>
                  </SheetClose>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className:
                        "h-11 w-full justify-start border-zinc-600 bg-zinc-950/80 text-zinc-100 hover:bg-zinc-900 hover:text-white",
                    })}
                  >
                    Sign in
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/register"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className:
                        "h-11 w-full justify-start bg-blue-500 text-white hover:bg-blue-600",
                    })}
                  >
                    Get started
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}