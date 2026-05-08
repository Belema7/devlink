import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpenText, Library, Search, Tags } from "lucide-react";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "DevLinks",
  description: "Save, organize, and share developer resources effortlessly.",
};

const features = [
  {
    title: "Archive Without Noise",
    description: "Preserve useful resources in a quiet catalogue built for return visits.",
    icon: BookOpenText,
    numeral: "I",
  },
  {
    title: "Index By Tags",
    description: "Group references by language, framework, pattern, or whatever your work demands.",
    icon: Tags,
    numeral: "II",
  },
  {
    title: "Retrieve With Ease",
    description: "Search the shelves quickly when a decision, bug, or idea needs the right source.",
    icon: Search,
    numeral: "III",
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isSignedIn = Boolean(session?.user);

  return (
    <div className="academia-shell min-h-screen text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col px-6">
        <section className="flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="ornate-frame border border-border bg-card/80 p-8 md:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Volume I</p>
                <h1 className="mt-6 font-heading text-5xl font-medium leading-[1.05] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                  DevLinks
                </h1>
                <p className="mt-4 max-w-2xl font-heading text-3xl leading-tight text-foreground/90 sm:text-4xl">
                  A private reference library for the links that shape your craft.
                </p>
                <p className="drop-cap mt-7 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
                  Keep developer resources ordered, searchable, and ready at hand in a warm catalogue that feels closer to a study desk than another disposable dashboard.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href={isSignedIn ? "/add-link" : "/register"}>
                      {isSignedIn ? "Add Link" : "Begin Archive"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/feed">Browse Catalogue</Link>
                  </Button>
                </div>
              </div>

              <div className="group mx-auto hidden w-full max-w-md md:block">
                <div className="arch-top overflow-hidden border border-primary/40 bg-background p-4">
                  <div className="sepia-reveal arch-top min-h-[420px] border border-border bg-[radial-gradient(circle_at_50%_10%,rgba(201,169,98,0.22),transparent_30%),linear-gradient(180deg,#3D332B_0%,#251E19_45%,#1C1714_100%)] p-6">
                    <div className="flex h-full min-h-[372px] flex-col justify-between border border-primary/25 bg-background/45 p-5">
                      <div>
                        <div className="flex items-center justify-between border-b border-border pb-4">
                          <span className="font-display text-[10px] uppercase tracking-[0.28em] text-primary">Ledger</span>
                          <Library className="size-5 text-primary" />
                        </div>
                        <div className="mt-8 space-y-4">
                          {["React patterns", "Database guides", "Design systems"].map((entry, index) => (
                            <div key={entry} className="corner-flourish border border-border bg-card/80 p-4">
                              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                                {["I", "II", "III"][index]}
                              </p>
                              <p className="mt-2 font-heading text-2xl leading-tight text-foreground">{entry}</p>
                              <div className="mt-4 h-1 w-24 bg-primary/50" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ornate-divider mt-8" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-12 ornate-divider" aria-hidden="true" />

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Volume II</p>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="corner-flourish border border-border bg-card p-7 transition-colors duration-300 ease-out hover:border-primary/50">
                    <div className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-background text-primary">
                      <Icon className="size-5 stroke-[1.5]" />
                    </div>
                    <p className="mt-6 font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                      {feature.numeral}
                    </p>
                    <h2 className="mt-3 font-heading text-3xl font-medium leading-tight text-foreground">{feature.title}</h2>
                    <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="ornate-frame border border-border bg-card/70 p-8 md:p-10">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Volume III</p>
              <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-foreground">
                Built for clarity, shaped with ceremony.
              </h2>
              <p className="drop-cap mt-6 font-body text-lg leading-relaxed text-muted-foreground">
                DevLinks keeps the daily act of saving resources simple, while giving shared references enough structure to become useful again weeks or months later.
              </p>
            </div>

            <div className="border border-border bg-background/50 p-7">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary">What You Receive</p>
              <ul className="mt-6 space-y-4 font-body text-base text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-display text-primary">I</span>
                  <span>Simple navigation through public and personal collections.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-display text-primary">II</span>
                  <span>Fast tag management for keeping ideas grouped by context.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-display text-primary">III</span>
                  <span>A dignified sharing experience for resources worth citing.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <p>Built for developers who prefer clarity over clutter.</p>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Link href="/trending" className="transition-colors hover:text-primary">
                  Trending
                </Link>
              ) : null}
              <Link href="/feed" className="transition-colors hover:text-primary">
                Feed
              </Link>
              <Link href="/add-link" className="transition-colors hover:text-primary">
                Add Link
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
