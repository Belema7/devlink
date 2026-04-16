import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, LockKeyhole, Search, ShieldCheck, Sparkles } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden bg-[#f6f1e8] text-zinc-900">
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(180,143,103,0.16),transparent)]" />
      <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#b48f67]/15 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#242220]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-6">
        <header className="flex items-center justify-between gap-4 border-b border-[#d8d0bc]/70 pb-5">
          <Link href="/" className="flex items-center gap-3 text-zinc-900 transition-opacity hover:opacity-90">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f] shadow-[0_12px_28px_rgba(36,34,32,0.18)]">
              <Sparkles className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">DevLinks</span>
              <span className="text-xs text-zinc-500">Developer resource hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/feed"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/5 hover:text-zinc-900"
            >
              Explore feed
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#242220] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_28px_rgba(36,34,32,0.18)] transition-colors hover:bg-[#35312d]"
            >
              Home
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-10">
          <section className="relative overflow-hidden rounded-[2rem] border border-[#d8d0bc] bg-[#242220] p-6 text-white shadow-[0_24px_70px_rgba(36,34,32,0.16)] sm:p-8 lg:min-h-[680px] lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,226,127,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(180,143,103,0.16),transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_35%,rgba(255,255,255,0.03))]" />

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="max-w-xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#f5e27f]">
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
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-[#f5e27f]/10 text-[#f5e27f]">
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

          <section className="flex items-center justify-center lg:justify-end">{children}</section>
        </main>
      </div>
    </div>
  );
}
