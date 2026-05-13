import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-6">
        <header className="flex items-center justify-between border-b-2 border-black py-4">
          <Link href="/" className="flex items-center gap-3 text-black transition-transform duration-150 ease-out hover:-translate-y-0.5">
            <span className="inline-flex size-10 items-center justify-center rounded border-2 border-black bg-white shadow-[3px_3px_0px_#000]">
              <BookOpenText className="size-5 stroke-[2.25]" />
            </span>
            <span className="font-heading text-2xl font-black tracking-normal">DevLinks</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/feed" className="hidden rounded border-2 border-transparent px-3 py-2 font-display text-xs font-extrabold uppercase text-black transition-colors hover:border-black hover:bg-muted sm:inline">
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
            <p className="inline-flex border-2 border-black bg-muted px-3 py-1 font-display text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">Account</p>
            <h1 className="mt-6 font-heading text-5xl font-black leading-[1.05] tracking-normal text-black sm:text-6xl">
              Return to your workspace.
            </h1>
            <p className="mt-6 max-w-lg font-body text-lg font-medium leading-relaxed text-muted-foreground">
              DevLinks gives you an orderly workspace for saving resources, adding tags, and keeping references ready for the next session.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="border-2 border-black bg-white px-4 py-5 shadow-[4px_4px_0px_#000]">
                <p className="font-display text-xs font-black uppercase text-muted-foreground">01</p>
                <p className="mt-3 font-heading text-2xl font-black text-black">Simple</p>
                <p className="mt-1 font-body text-sm font-medium text-muted-foreground">No clutter, just focus.</p>
              </div>
              <div className="border-2 border-black bg-white px-4 py-5 shadow-[4px_4px_0px_#000]">
                <p className="font-display text-xs font-black uppercase text-muted-foreground">02</p>
                <p className="mt-3 font-heading text-2xl font-black text-black">Fast</p>
                <p className="mt-1 font-body text-sm font-medium text-muted-foreground">Save and organize quickly.</p>
              </div>
              <div className="border-2 border-black bg-white px-4 py-5 shadow-[4px_4px_0px_#000]">
                <p className="font-display text-xs font-black uppercase text-muted-foreground">03</p>
                <p className="mt-3 font-heading text-2xl font-black text-black">Focused</p>
                <p className="mt-1 font-body text-sm font-medium text-muted-foreground">Built for daily use.</p>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
