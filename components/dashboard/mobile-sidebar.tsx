"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, PlusCircle, Tags, UserCircle2 } from "lucide-react";
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/links/new", label: "Add Link", icon: PlusCircle },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
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
          className="md:hidden text-zinc-200 hover:bg-zinc-800 hover:text-white"
          aria-label="Open dashboard sidebar"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[84vw] max-w-xs border-zinc-800 bg-zinc-900 p-0 text-zinc-200"
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
            const Icon = link.icon;

            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-zinc-800 text-blue-400"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
