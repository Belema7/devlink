import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import FeedTabs from "@/components/feed/feed-tabs";
import FeedSearch from "@/components/feed/feed-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicLinks } from "@/lib/public-links";
import { auth } from "@/lib/auth";
import { isFeedSort, normalizeFeedSearchQuery, normalizeFeedTag } from "@/lib/feed-filters";

type FeedPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    sort?: string;
  }>;
};

const PublicFeedPage = async ({ searchParams }: FeedPageProps) => {
  const params = await searchParams;
  const search = normalizeFeedSearchQuery(params.search);
  const tag = normalizeFeedTag(params.tag);
  const sort = isFeedSort(params.sort) ? params.sort : "all";

  const [links, session] = await Promise.all([
    getPublicLinks({ search, tag, sort }),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const allowVoting = Boolean(session?.user);
  const trendingLinks = [...links].sort((a, b) => b.voteCount - a.voteCount).slice(0, 6);
  const hasFilters = Boolean(search || tag || sort === "trending");
  const currentResultLabel = `${links.length} ${links.length === 1 ? "resource" : "resources"}`;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="overflow-hidden rounded-[32px] border border-[#d8d0bc] bg-[#242220] text-white shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
          <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-[#f5e27f]/20 bg-[#f5e27f]/10 px-3 py-1 text-xs font-medium text-[#f9f0b6]">
                Public resources
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  Discover the best developer resources shared by the community.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                  Search by title or tag, switch between newest and trending links, and jump into anything that looks useful.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <FeedTabs activeTab={sort === "trending" ? "trending" : "all"} />
                {hasFilters ? (
                  <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Link href="/feed">Clear filters</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#1f1d1a] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Results</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{currentResultLabel}</p>
                </div>
                <div className="rounded-full border border-[#f5e27f]/20 bg-[#f5e27f]/10 px-3 py-1 text-xs text-[#f9f0b6]">
                  {sort === "trending" ? "Trending" : "All"}
                </div>
              </div>

              <FeedSearch />

              <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Search title and tags
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Click a tag to filter
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="trending" className="mt-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Trending Resources</h2>
              <p className="text-sm text-zinc-600">Top voted public links across the feed.</p>
            </div>
            <span className="rounded-full border border-[#d8d0bc] bg-[#f9f5ec] px-3 py-1 text-sm text-zinc-700">
              Top 6
            </span>
          </div>

          {trendingLinks.length === 0 ? (
            <Card className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_14px_34px_rgba(30,27,22,0.05)]">
              <CardHeader>
                <CardTitle className="text-zinc-900">No trending resources yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Public resources will appear here once users begin sharing links.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {trendingLinks.map((link) => (
                <PublicLinkCard key={`trending-${link.id}`} link={link} allowVoting={allowVoting} />
              ))}
            </div>
          )}
        </section>

        <section id="resources" className="mt-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">All Public Resources</h2>
              <p className="text-sm text-zinc-600">
                {search || tag ? "Filtered results from the public feed." : "Browse everything the community has shared."}
              </p>
            </div>
            <p className="text-sm text-zinc-600">{links.length} total</p>
          </div>

          {links.length === 0 ? (
            <Card className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_14px_34px_rgba(30,27,22,0.05)]">
              <CardHeader>
                <CardTitle className="text-zinc-900">No public resources yet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-600">
                <p>
                  {hasFilters
                    ? "Try clearing the search or tag filter."
                    : "Share your first public link from the dashboard to seed the feed."}
                </p>
                {hasFilters ? (
                  <Button asChild className="rounded-full bg-[#242220] text-white hover:bg-[#35312d]">
                    <Link href="/feed">Reset feed</Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {links.map((link) => (
                <PublicLinkCard key={link.id} link={link} allowVoting={allowVoting} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default PublicFeedPage;
