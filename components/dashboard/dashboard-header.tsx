"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Plus } from "lucide-react";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  userName: string;
  userImage?: string | null;
};

const titleByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/links/new": "Add Link",
  "/tags": "Tags",
  "/profile": "Profile",
};

export default function DashboardHeader({ userName, userImage }: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = titleByPath[pathname] ?? "Workspace";
  const initials =
    userName
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <MobileSidebar />
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-50 md:text-2xl">{title}</h1>
            <p className="hidden text-sm text-zinc-400 md:block">
              Manage your links, tags, and visibility from one calm place.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 md:inline-flex"
            aria-label="Search dashboard"
          >
            <Search className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 md:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </Button>

          <Button asChild size="sm" className="bg-teal-500 text-zinc-950 shadow-[0_0_24px_rgba(20,184,166,0.22)] hover:bg-teal-400">
            <Link href="/links/new">
              <Plus className="size-4" />
              Add Link
            </Link>
          </Button>

          <Link href="/profile" className="flex items-center gap-2 rounded-2xl px-1.5 py-1 transition-colors hover:bg-zinc-900">
            <Avatar size="sm">
              <AvatarImage src={userImage ?? undefined} alt={userName} />
              <AvatarFallback className="bg-zinc-900 text-teal-400">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-zinc-300 md:inline">{userName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
