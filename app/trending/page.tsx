import Link from "next/link";
import { headers } from "next/headers";
import { Flame, Trophy } from "lucide-react";
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

const TrendingPage = async () => {
  const [links, session] = await Promise.all([
    getTrendingLinks(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const allowVoting = Boolean(session?.user);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="overflow-hidden rounded-[32px] border border-[#e6deca] bg-[#fbf8f1] text-[#1f1c17] shadow-[0_22px_60px_rgba(31,28,23,0.08)]">
          <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-[#d8c98a] bg-[#f5e27f]/20 px-3 py-1 text-xs font-medium text-[#6c5a12]">
                Community leaderboard
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[#16130f] md:text-5xl">
                  Trending Resources
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
                  Top voted developer resources from the community, ranked by public votes and limited to the strongest 10.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="rounded-full bg-[#242220] text-white hover:bg-[#35312d]">
                  <Link href="/feed">View All Feed</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-[#d8d0bc] bg-white text-[#2a251c] hover:bg-[#f6f1e6]">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-[#e1d7c3] bg-white p-5 shadow-[0_14px_32px_rgba(31,28,23,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Leaderboard</p>
                  <p className="mt-1 text-2xl font-semibold text-[#16130f]">{links.length} live picks</p>
                </div>
                <div className="rounded-full border border-[#d8c98a] bg-[#f5e27f]/20 px-3 py-1 text-xs text-[#6c5a12]">
                  Top 10
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e6deca] bg-[#fffdf8] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Public only</p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">Hidden links stay off the board</p>
                </div>
                <div className="rounded-2xl border border-[#e6deca] bg-[#fffdf8] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Votes required</p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">Only links with at least one vote appear</p>
                </div>
                <div className="rounded-2xl border border-[#e6deca] bg-[#fffdf8] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Ranked by</p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">Highest vote count first</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Top Resources</h2>
              <p className="text-sm text-zinc-600">Community favorites ranked by votes.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#d8d0bc] bg-[#f9f5ec] px-3 py-1 text-sm text-zinc-700">
              <Flame className="size-4" />
              Leaderboard
            </div>
          </div>

          {links.length === 0 ? (
            <Card className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_14px_34px_rgba(30,27,22,0.05)]">
              <CardHeader>
                <CardTitle className="text-zinc-900">No trending resources yet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-600">
                <p>Public resources will appear here once the community starts voting.</p>
                <Button asChild className="rounded-full bg-[#242220] text-white hover:bg-[#35312d]">
                  <Link href="/feed">Browse the Feed</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {links.map((link, index) => (
                <div
                  key={link.id}
                  className={cn(
                    "rounded-[28px] border p-4 shadow-[0_14px_34px_rgba(30,27,22,0.05)]",
                    index === 0
                      ? "border-[#d8c98a] bg-gradient-to-b from-[#fff8dc] to-[#f9f5ec]"
                      : index < 3
                        ? "border-[#e2d5b4] bg-[#fffdf8]"
                        : "border-[#e6deca] bg-[#fffdf8]"
                  )}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "inline-flex size-11 items-center justify-center rounded-2xl border text-sm font-semibold",
                        index === 0
                          ? "border-[#c8a84f] bg-[#242220] text-[#f5e27f]"
                          : index === 1
                            ? "border-[#d9c6a0] bg-[#f5efe1] text-[#8c6d3e]"
                            : index === 2
                              ? "border-[#d9c6a0] bg-[#f2ebdd] text-[#8c6d3e]"
                              : "border-[#e1d7c3] bg-white text-zinc-700"
                      )}
                    >
                      #{index + 1}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d8d0bc] bg-white px-3 py-1 text-xs text-zinc-700">
                      <Trophy className="size-3.5" />
                      {link.voteCount} votes
                    </div>
                  </div>

                  <PublicLinkCard link={link} allowVoting={allowVoting} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default TrendingPage;
