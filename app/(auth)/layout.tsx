import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="academia-shell min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between border-b border-border py-4">
          <Link href="/" className="flex items-center gap-3 text-foreground transition-transform duration-300 ease-out hover:scale-105">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-primary/40 bg-card text-primary">
              <BookOpenText className="size-4 stroke-[1.5]" />
            </span>
            <span className="font-heading text-2xl font-medium tracking-normal">DevLinks</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/feed" className="hidden font-display text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary sm:inline">
              Feed
            </Link>
            <Button asChild variant="outline" size="sm" className="h-10 px-4">
              <Link href="/">
                Home
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <section className="hidden max-w-xl md:block">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Volume I</p>
            <h1 className="mt-6 font-heading text-5xl font-medium leading-[1.05] tracking-normal text-foreground sm:text-6xl">
              Return to your private catalogue.
            </h1>
            <p className="drop-cap mt-6 max-w-lg font-body text-lg leading-relaxed text-muted-foreground">
              DevLinks gives you a warm, orderly workspace for saving resources, adding tags, and keeping references ready for the next session.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="corner-flourish border border-border bg-card px-4 py-5">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">I</p>
                <p className="mt-3 font-heading text-2xl text-foreground">Simple</p>
                <p className="mt-1 font-body text-sm text-muted-foreground">No clutter, just focus.</p>
              </div>
              <div className="corner-flourish border border-border bg-card px-4 py-5">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">II</p>
                <p className="mt-3 font-heading text-2xl text-foreground">Fast</p>
                <p className="mt-1 font-body text-sm text-muted-foreground">Save and organize quickly.</p>
              </div>
              <div className="corner-flourish border border-border bg-card px-4 py-5">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">III</p>
                <p className="mt-3 font-heading text-2xl text-foreground">Focused</p>
                <p className="mt-1 font-body text-sm text-muted-foreground">Built for daily use.</p>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="ornate-frame w-full max-w-md border border-border bg-card/80 p-6 md:p-8">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
