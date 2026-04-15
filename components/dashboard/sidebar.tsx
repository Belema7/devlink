"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Tags, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/links/new", label: "Add Link", icon: PlusCircle },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-60 md:flex-col md:border-r md:border-zinc-800 md:bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-zinc-100">
          DevLink
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {dashboardLinks.map((link) => {
          const active = isActivePath(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-800 text-blue-400"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon className="size-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
