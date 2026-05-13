import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpenText, Search, Tags } from "lucide-react";
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
    <div className="min-h-screen bg-white text-black">
      <div>
        <Navbar />

        <main className="mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-6">
          <section className="flex flex-1 flex-col justify-center py-12 sm:py-16 lg:py-20">
            <div className="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="inline-flex border-2 border-black bg-muted px-3 py-1 font-display text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">Developer bookmarks</p>
                  <h1 className="mt-6 font-heading text-5xl font-black leading-[1.02] tracking-normal text-black sm:text-6xl lg:text-7xl">
                    DevLinks
                  </h1>
                  <p className="mt-4 max-w-2xl font-heading text-3xl font-extrabold leading-tight text-black sm:text-4xl">
                    A clean place for the links that shape your craft.
                  </p>
                  <p className="mt-7 max-w-2xl font-body text-lg font-medium leading-relaxed text-muted-foreground">
                    Keep developer resources ordered, searchable, and ready at hand without turning your bookmark list into visual noise.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Button asChild>
                      <Link href={isSignedIn ? "/add-link" : "/register"}>
                        {isSignedIn ? "Add Link" : "Get Started"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/feed">Browse Feed</Link>
                    </Button>
                  </div>
                </div>

                <div className="group mx-auto hidden w-full max-w-md md:block">
                  <div className="border-2 border-black bg-muted p-4 shadow-[6px_6px_0px_#000]">
                    <div className="sepia-reveal min-h-[420px] border-2 border-black bg-white p-6">
                      <div className="flex h-full min-h-[372px] flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b-2 border-black pb-4">
                            <span className="font-display text-xs font-black uppercase text-black">Saved links</span>
                            <BookOpenText className="size-5 text-black" />
                          </div>
                          <div className="mt-8 space-y-4">
                            {["React patterns", "Database guides", "Design systems"].map((entry, index) => (
                              <div key={entry} className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                                <p className="font-display text-xs font-black uppercase text-muted-foreground">
                                  0{index + 1}
                                </p>
                                <p className="mt-2 font-heading text-2xl font-black leading-tight text-black">{entry}</p>
                                <div className="mt-4 h-2 w-24 bg-black" />
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

            <div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="border-2 border-black bg-white p-7 shadow-[6px_6px_0px_#000] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#000]">
                      <div className="flex size-12 items-center justify-center rounded border-2 border-black bg-muted text-black shadow-[3px_3px_0px_#000]">
                        <Icon className="size-5 stroke-[2.25]" />
                      </div>
                      <p className="mt-6 font-display text-xs font-black uppercase text-muted-foreground">
                        Feature {feature.numeral}
                      </p>
                      <h2 className="mt-3 font-heading text-2xl font-black leading-tight text-black">{feature.title}</h2>
                      <p className="mt-4 font-body text-base font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-2 border-black bg-black p-8 text-white shadow-[6px_6px_0px_#000] md:p-10">
                <p className="font-display text-xs font-black uppercase text-white">Why it works</p>
                <h2 className="mt-4 font-heading text-4xl font-black leading-tight text-white">
                  Built for clarity and daily use.
                </h2>
                <p className="mt-6 font-body text-lg font-medium leading-relaxed text-white/80">
                  DevLinks keeps the daily act of saving resources simple, while giving shared references enough structure to become useful again weeks or months later.
                </p>
              </div>

              <div className="border-2 border-black bg-white p-7 shadow-[6px_6px_0px_#000]">
                <p className="font-display text-xs font-black uppercase text-black">What You Get</p>
                <ul className="mt-6 space-y-4 font-body text-base font-medium text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-display font-black text-black">01</span>
                    <span>Simple navigation through public and personal collections.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display font-black text-black">02</span>
                    <span>Fast tag management for keeping ideas grouped by context.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display font-black text-black">03</span>
                    <span>A dignified sharing experience for resources worth citing.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-black pt-6 font-display text-xs font-black uppercase text-muted-foreground">
              <p>Built for developers who prefer clarity over clutter.</p>
              <div className="flex items-center gap-4">
                {isSignedIn ? (
                  <Link href="/trending" className="transition-colors hover:text-black">
                    Trending
                  </Link>
                ) : null}
                <Link href="/feed" className="transition-colors hover:text-black">
                  Feed
                </Link>
                <Link href="/add-link" className="transition-colors hover:text-black">
                  Add Link
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
