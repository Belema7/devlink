"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/links/new", label: "Add Link" },
  { href: "/tags", label: "Tags" },
  { href: "/profile", label: "Profile" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden text-zinc-200 hover:bg-zinc-900 hover:text-white"
          aria-label="Open dashboard sidebar"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[84vw] max-w-xs border-zinc-800 bg-zinc-950 p-0 text-zinc-200"
      >
        <SheetHeader className="border-b border-zinc-800 px-4 py-4">
          <SheetTitle className="text-zinc-100">Dashboard</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Navigate your workspace.
          </SheetDescription>
        </SheetHeader>

        <nav className="space-y-1 px-3 py-3">
          {dashboardLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg border-l-2 px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "border-teal-500 bg-zinc-900/40 text-zinc-100"
                      : "border-transparent text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-100"
                  )}
                >
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
