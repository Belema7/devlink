import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between border-b border-zinc-800 py-4">
          <Link href="/" className="flex items-center gap-3 text-zinc-100">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-100">
              <Sparkles className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">DevLinks</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/feed" className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-100">
              Feed
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-800 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            >
              Home
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <main className="hidden md:grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <section className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-500">Developer link organizer</p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-100 sm:text-6xl">
              Sign in to keep your links clean and organized.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400">
              DevLinks gives you a calm workspace for saving resources, adding tags, and managing the things you want to revisit.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 px-4 py-5">
                <p className="text-sm font-medium text-zinc-100">Simple</p>
                <p className="mt-1 text-sm text-zinc-500">No clutter, just focus.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 px-4 py-5">
                <p className="text-sm font-medium text-zinc-100">Fast</p>
                <p className="mt-1 text-sm text-zinc-500">Save and organize quickly.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 px-4 py-5">
                <p className="text-sm font-medium text-zinc-100">Focused</p>
                <p className="mt-1 text-sm text-zinc-500">Built for daily use.</p>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">{children}</section>
        </main>
      </div>
    </div>
  );
}
