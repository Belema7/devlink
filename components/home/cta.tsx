import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CTAProps = {
  isSignedIn: boolean;
};

export default function CTA({ isSignedIn }: CTAProps) {
  return (
    <section id="cta" className="py-20">
      <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 px-6 py-10 text-white shadow-[0_26px_70px_rgba(0,0,0,0.2)] md:px-10 md:py-12">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">Final call to action</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Start building your dev resource hub today
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Keep your best resources organized, searchable, and ready to share whenever you need them.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="rounded-full bg-teal-500 text-zinc-950 hover:bg-teal-400">
              <Link href={isSignedIn ? "/dashboard" : "/register"}>
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-zinc-800 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-900">
              <Link href="/feed">Explore Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
