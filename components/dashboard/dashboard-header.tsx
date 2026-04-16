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
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#1c1e26]/90 px-4 py-4 backdrop-blur-xl md:px-6">
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
            className="hidden text-zinc-300 hover:bg-white/5 hover:text-zinc-50 md:inline-flex"
            aria-label="Search dashboard"
          >
            <Search className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden text-zinc-300 hover:bg-white/5 hover:text-zinc-50 md:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </Button>

          <Button asChild size="sm" className="bg-[#22c6a4] text-[#07221d] shadow-[0_0_24px_rgba(34,198,164,0.28)] hover:bg-[#2ad0af]">
            <Link href="/links/new">
              <Plus className="size-4" />
              Add Link
            </Link>
          </Button>

          <Link href="/profile" className="flex items-center gap-2 rounded-2xl px-1.5 py-1 transition-colors hover:bg-white/5">
            <Avatar size="sm">
              <AvatarImage src={userImage ?? undefined} alt={userName} />
              <AvatarFallback className="bg-[#2d2f3a] text-[#66dbc6]">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-zinc-300 md:inline">{userName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
