import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getTrendingLinks } from "@/lib/public-links";
import { cn } from "@/lib/utils";

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

      <main className="mx-auto w-full max-w-6xl px-6 py-14">
        <section className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-500">Trending</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            See the most voted resources from the community.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
            The leaderboard is sorted by votes and only shows public links that people are actually using.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-3xl border border-zinc-800 px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Leaderboard</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-100">{links.length} live picks</p>
              </div>
              <p className="text-sm text-zinc-500">Top 10</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Public only</p>
                <p className="mt-2 text-sm text-zinc-300">Hidden links stay off the board.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Votes required</p>
                <p className="mt-2 text-sm text-zinc-300">Only links with votes appear.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Ranked by</p>
                <p className="mt-2 text-sm text-zinc-300">Highest vote count first.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
                <Link href="/feed">View feed</Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 px-6 py-6">
            <div className="flex items-end justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Top resources</h2>
                <p className="text-sm text-zinc-500">Community favorites ranked by votes.</p>
              </div>
              <p className="text-sm text-zinc-500">{links.length} total</p>
            </div>

            <div className="mt-5">
              {links.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-950">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">No trending resources yet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-zinc-400">
                    <p>Public resources will appear here once the community starts voting.</p>
                    <Button asChild className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                      <Link href="/feed">Browse the feed</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                  {links.map((link, index) => (
                    <div key={link.id} className={cn("rounded-3xl border border-zinc-800 bg-zinc-950 p-4", index === 0 ? "border-zinc-700" : "")}>
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                        <div className="text-sm font-medium text-zinc-100">#{index + 1}</div>
                        <div className="text-sm text-zinc-500">{link.voteCount} votes</div>
                      </div>

                      <PublicLinkCard link={link} allowVoting={allowVoting} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
