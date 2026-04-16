import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#feed", label: "Resources" },
  { href: "#trending", label: "Trending" },
];

type TopNavProps = {
  isSignedIn: boolean;
};

export default function TopNav({ isSignedIn }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ded6c2] bg-[#f6f1e8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-zinc-900 transition-opacity hover:opacity-90">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f] shadow-sm ring-1 ring-black/10">
            <Code2 className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">DevLinks</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-900 sm:inline-flex"
          >
            <Link href={isSignedIn ? "/dashboard" : "/login"}>Login</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#b48f67] text-white shadow-[0_12px_28px_rgba(180,143,103,0.28)] hover:bg-[#a97d55]"
          >
            <Link href={isSignedIn ? "/dashboard" : "/register"}>
              {isSignedIn ? "Open dashboard" : "Get started"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
