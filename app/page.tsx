import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "DevLinks",
  description: "Save, organize, and share developer resources effortlessly.",
};

const features = [
  "Save links without noise",
  "Organize by tags",
  "Find what you need fast",
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isSignedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col px-6">
        <section className="flex flex-1 flex-col justify-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-500">Developer link organizer</p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl">
              Keep your favorite links simple, searchable, and in one place.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              DevLinks gives you a calm, focused place to save resources, tag them clearly, and get back to work.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={isSignedIn ? "/dashboard" : "/register"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                {isSignedIn ? "Open dashboard" : "Get started"}
              </Link>
              <Link
                href="/feed"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
              >
                Browse feed
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <span className="size-3 rounded-full border border-zinc-700" />
                  <span className="size-3 rounded-full border border-zinc-700" />
                  <span className="size-3 rounded-full border border-zinc-700" />
                </div>

                <div className="grid gap-4 py-8 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="rounded-2xl border border-zinc-800 px-4 py-5">
                      <p className="text-sm text-zinc-300">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <div className="h-10 w-full rounded-full border border-zinc-800 bg-zinc-950" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div className="rounded-3xl border border-zinc-800 px-6 py-7">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Designed for focus</p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100">Clean UI. Clear structure. Less friction.</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  A minimal workspace for saving dev links, organizing them by tags, and staying organized without distraction.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-800 px-6 py-7">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">What you get</p>
                <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                  <li>• Simple navigation</li>
                  <li>• Fast tag management</li>
                  <li>• A calm dashboard experience</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
            <p>Built for developers who prefer clarity over clutter.</p>
            <div className="flex items-center gap-4">
              <Link href="/trending" className="transition-colors hover:text-zinc-300">
                Trending
              </Link>
              <Link href="/feed" className="transition-colors hover:text-zinc-300">
                Feed
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-zinc-300">
                Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
