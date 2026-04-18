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
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-zinc-800 md:bg-zinc-950/95 md:backdrop-blur-xl">
      <div className="border-b border-zinc-800 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-zinc-50">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400 ring-1 ring-inset ring-teal-500/25">
            <LayoutDashboard className="size-5" />
          </span>
          <span>DevLink</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {dashboardLinks.map((link) => {
          const active = isActivePath(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-zinc-900 text-teal-400 ring-1 ring-teal-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.22)]"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              <Icon className={cn("size-4", active && "text-teal-400")} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
