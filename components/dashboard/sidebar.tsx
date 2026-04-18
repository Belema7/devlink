"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/links/new", label: "Add Link" },
  { href: "/tags", label: "Tags" },
  { href: "/profile", label: "Profile" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-zinc-800 md:bg-zinc-950">
      <div className="border-b border-zinc-800 px-6 py-5">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-zinc-50">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
            D
          </span>
          <span>DevLinks</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {dashboardLinks.map((link) => {
          const active = isActivePath(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center rounded-lg border-l-2 px-3 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-teal-500 bg-zinc-900/40 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-100"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
