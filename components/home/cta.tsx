import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CTAProps = {
  isSignedIn: boolean;
};

export default function CTA({ isSignedIn }: CTAProps) {
  return (
    <section id="cta" className="py-20">
      <div className="rounded-[32px] border border-[#d8d0bc] bg-[#242220] px-6 py-10 text-white shadow-[0_26px_70px_rgba(0,0,0,0.2)] md:px-10 md:py-12">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5e27f]">Final call to action</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Start building your dev resource hub today
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            Keep your best resources organized, searchable, and ready to share whenever you need them.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="rounded-full bg-[#f5e27f] text-[#201c13] hover:bg-[#f8eb9b]">
              <Link href={isSignedIn ? "/dashboard" : "/register"}>
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href="/feed">Explore Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
