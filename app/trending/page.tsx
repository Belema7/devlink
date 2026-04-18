import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getTrendingLinks } from "@/lib/public-links";

export const metadata = {
  title: "Trending Resources",
  description: "Top voted developer resources from the community.",
};

export default async function TrendingPage() {
  const [links, session] = await Promise.all([
    getTrendingLinks(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const allowVoting = Boolean(session?.user);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                transparent 0%,
                transparent 30%,
                rgba(138, 43, 226, 0.22) 50%,
                transparent 70%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                #1a1a2e 0%,
                #24153f 42%,
                #0f0f23 100%
              )
            `,
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 79px,
                rgba(255, 255, 255, 0.05) 80px,
                rgba(255, 255, 255, 0.05) 81px
              ),
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 79px,
                rgba(255, 255, 255, 0.035) 80px,
                rgba(255, 255, 255, 0.035) 81px
              )
            `,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14">
          <section className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">Trending</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              See the most voted resources from the community.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
              The leaderboard is sorted by votes and only shows public links that people are actually using.
            </p>
          </section>

          <section className="mt-12 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Leaderboard</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-100">{links.length} live picks</p>
                  <p className="mt-2 text-sm text-zinc-400">Community favorites ranked by votes.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="border-white/10 bg-black/70 text-zinc-100 hover:bg-white/5">
                    <Link href="/feed">View feed</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/10 bg-black/70 text-zinc-100 hover:bg-white/5">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Public only</p>
                  <p className="mt-2 text-sm text-zinc-300">Hidden links stay off the board.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Votes required</p>
                  <p className="mt-2 text-sm text-zinc-300">Only links with votes appear.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Ranked by</p>
                  <p className="mt-2 text-sm text-zinc-300">Highest vote count first.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Top resources</h2>
                  <p className="text-sm text-zinc-400">Community favorites ranked by votes.</p>
                </div>
                <p className="text-sm text-zinc-500">{links.length} total</p>
              </div>

              <div className="mt-5">
                {links.length === 0 ? (
                  <Card className="border-white/10 bg-black/60">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">No trending resources yet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-zinc-300">
                      <p>Public resources will appear here once the community starts voting.</p>
                      <Button asChild className="rounded-full border border-white/10 bg-white/10 text-zinc-100 hover:bg-white/15">
                        <Link href="/feed">Browse the feed</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {links.map((link) => (
                      <PublicLinkCard key={link.id} link={link} allowVoting={allowVoting} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
