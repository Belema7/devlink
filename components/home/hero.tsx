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
        <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 px-6 py-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.26)] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.16),transparent_36%),radial-gradient(circle_at_85%_10%,rgba(20,184,166,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] opacity-20" />

          <div className="relative max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
              <Zap className="size-3.5" />
              Developer resource hub
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Save, organize, and share dev resources effortlessly
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                DevLinks keeps your favorite tools, docs, snippets, and references in one calm workspace so you can move faster and share the good stuff with your community.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-teal-500 text-zinc-950 shadow-[0_14px_32px_rgba(20,184,166,0.22)] hover:bg-teal-400">
                <Link href={isSignedIn ? "/dashboard" : "/register"}>
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-zinc-800 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-900"
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
                <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden gap-4 md:block">
          <Card className="overflow-hidden border border-zinc-800 bg-zinc-900/80 text-white shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Workspace snapshot</p>
                  <p className="mt-1 text-2xl font-semibold">Fast, tidy, shareable.</p>
                </div>
                <div className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs text-teal-300">
                  Live
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <Search className="size-5 text-teal-400" />
                  <p className="mt-3 text-sm font-medium text-white">Blazing fast search</p>
                  <p className="mt-1 text-sm text-zinc-400">Find links by title, tag, or topic in seconds.</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <ShieldCheck className="size-5 text-teal-400" />
                  <p className="mt-3 text-sm font-medium text-white">Public or private</p>
                  <p className="mt-1 text-sm text-zinc-400">Keep drafts private and publish only what matters.</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
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
                      className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                <Tags className="size-5 text-teal-400" />
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
