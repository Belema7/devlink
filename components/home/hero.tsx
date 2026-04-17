import Link from "next/link";
import { ArrowRight, BookMarked, Search, ShieldCheck, Tags, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type HeroProps = {
  isSignedIn: boolean;
  publicCount: number;
  tagCount: number;
  topVoteCount: number;
};

export default function Hero({ isSignedIn, publicCount, tagCount, topVoteCount }: HeroProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#242220] px-6 py-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.26)] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,226,127,0.14),transparent_36%),radial-gradient(circle_at_85%_10%,rgba(180,143,103,0.2),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:14px_14px] opacity-20" />

          <div className="relative max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f5e27f]/20 bg-[#f5e27f]/10 px-3 py-1 text-xs font-medium text-[#f9f0b6]">
              <Zap className="size-3.5" />
              Developer resource hub
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Save, organize, and share dev resources effortlessly
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                DevLinks keeps your favorite tools, docs, snippets, and references in one calm workspace so you can move faster and share the good stuff with your community.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-[#f5e27f] text-[#201c13] shadow-[0_14px_32px_rgba(245,226,127,0.22)] hover:bg-[#f8eb9b]">
                <Link href={isSignedIn ? "/dashboard" : "/register"}>
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/feed">Explore Resources</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Public resources", value: `${publicCount.toString().padStart(2, "0")}` },
                { label: "Tags tracked", value: `${tagCount.toString().padStart(2, "0")}` },
                { label: "Top votes", value: topVoteCount.toString().padStart(2, "0") },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden gap-4 md:block">
          <Card className="overflow-hidden border border-white/8 bg-[#2b2926] text-white shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Workspace snapshot</p>
                  <p className="mt-1 text-2xl font-semibold">Fast, tidy, shareable.</p>
                </div>
                <div className="rounded-full border border-[#f5e27f]/20 bg-[#f5e27f]/10 px-3 py-1 text-xs text-[#f9f0b6]">
                  Live
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-[#1f1d1a] p-4">
                  <Search className="size-5 text-[#f5e27f]" />
                  <p className="mt-3 text-sm font-medium text-white">Blazing fast search</p>
                  <p className="mt-1 text-sm text-zinc-400">Find links by title, tag, or topic in seconds.</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#1f1d1a] p-4">
                  <ShieldCheck className="size-5 text-[#f5e27f]" />
                  <p className="mt-3 text-sm font-medium text-white">Public or private</p>
                  <p className="mt-1 text-sm text-zinc-400">Keep drafts private and publish only what matters.</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[#1f1d1a] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#f5e27f]/10 text-[#f5e27f]">
                    <BookMarked className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-zinc-400">Curated collections</p>
                    <p className="text-base font-medium text-white">Bookmark, tag, and revisit resources without friction.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["react", "nextjs", "ui", "backend"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-4">
                <Tags className="size-5 text-[#f5e27f]" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Organized with tags</p>
                  <p className="text-sm text-zinc-400">Structure every saved link without clutter.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
