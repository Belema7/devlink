"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
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
    <header className="sticky top-0 z-20 border-b border-blue-950/60 bg-zinc-950/75 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <MobileSidebar />
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100 md:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button asChild size="sm" className="bg-linear-to-r from-blue-600 to-indigo-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:from-blue-500 hover:to-indigo-400">
            <Link href="/links/new">
              <Plus className="size-4" />
              Add Link
            </Link>
          </Button>

          <Link href="/profile" className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-zinc-900">
            <Avatar size="sm">
              <AvatarImage src={userImage ?? undefined} alt={userName} />
              <AvatarFallback className="bg-blue-950 text-blue-200">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-zinc-300 md:inline">{userName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
