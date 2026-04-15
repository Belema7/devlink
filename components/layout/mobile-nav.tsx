"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, UserRound } from "lucide-react";
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

export type NavItem = {
  href: string;
  label: string;
  protected?: boolean;
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
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "border border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:text-white"
        )}
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent className="border-zinc-800 bg-zinc-950 text-zinc-100" side="right">
        <SheetHeader className="border-b border-zinc-800 px-5 py-4">
          <SheetTitle className="text-left text-base text-zinc-100">DevLink</SheetTitle>
          <SheetDescription className="text-left text-zinc-400">
            Developer tools, resources, and links.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col gap-6 px-5 py-6">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-zinc-900 text-blue-400"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            {isPending ? (
              <div className="space-y-3">
                <div className="h-10 animate-pulse rounded-lg bg-zinc-800" />
                <div className="h-9 animate-pulse rounded-lg bg-zinc-800" />
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                    <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
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
                          "w-full justify-start border-zinc-700 bg-zinc-950/70 text-zinc-100 hover:bg-zinc-900 hover:text-white",
                      })}
                    >
                      <UserRound className="size-3.5" />
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
                          "w-full justify-start border-zinc-700 bg-zinc-950/70 text-zinc-100 hover:bg-zinc-900 hover:text-white",
                      })}
                    >
                      <LogOut className="size-3.5" />
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
                        "w-full justify-start border-zinc-700 bg-zinc-950/70 text-zinc-100 hover:bg-zinc-900 hover:text-white",
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
                      className: "w-full justify-start bg-blue-500 text-white hover:bg-blue-600",
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
