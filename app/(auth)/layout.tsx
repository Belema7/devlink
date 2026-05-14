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

        <main className="flex flex-1 items-center justify-center py-16 lg:py-20">
          <section className="flex w-full justify-center">
            <div className="w-full max-w-md border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
