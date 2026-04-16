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
          className="md:hidden text-zinc-200 hover:bg-zinc-900 hover:text-white"
          aria-label="Open dashboard sidebar"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[84vw] max-w-xs border-white/5 bg-[#232530]/95 p-0 text-zinc-200 backdrop-blur-xl"
      >
        <SheetHeader className="border-b border-white/5 px-4 py-4">
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
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[#2d2f3a] text-[#66dbc6] ring-1 ring-[#22c6a4]/25"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  )}
                >
                  <Icon className={cn("size-4", active && "text-[#22c6a4]")} />
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
