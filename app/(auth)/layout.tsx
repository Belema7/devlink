import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, LockKeyhole, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Search,
    title: "Fast search",
    description: "Find saved resources instantly across titles and tags.",
  },
  {
    icon: GitBranch,
    title: "Organized links",
    description: "Structure your stack with tags, votes, and visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "Keep drafts private until you are ready to publish.",
  },
];

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_35%)]" />
      <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-6">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <Link href="/" className="flex items-center gap-3 text-zinc-100 transition-opacity hover:opacity-90">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400 shadow-[0_12px_28px_rgba(20,184,166,0.12)]">
              <Sparkles className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">DevLinks</span>
              <span className="text-xs text-zinc-400">Developer resource hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/feed"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              Explore feed
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-medium text-zinc-950 shadow-[0_12px_28px_rgba(20,184,166,0.16)] transition-colors hover:bg-teal-400"
            >
              Home
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-10">
          <section className="hidden md:block relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8 lg:min-h-[680px] lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_35%,rgba(255,255,255,0.03))]" />

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="max-w-xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-teal-300">
                  <LockKeyhole className="size-3.5" />
                  Secure access
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Build your dev resource hub without tab chaos.
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                    Sign in to save links, organize them with tags, and share curated resources with the
                    developer community from one clean workspace.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 backdrop-blur-sm"
                    >
                      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
                        <Icon className="size-5" />
                      </div>
                      <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="outline" asChild className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <section className="flex items-center justify-center lg:justify-end">{children}</section>
        </main>
      </div>
    </div>
  );
}
