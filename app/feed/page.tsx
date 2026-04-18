import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import FeedSearch from "@/components/feed/feed-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicLinks } from "@/lib/public-links";
import { auth } from "@/lib/auth";
import { normalizeFeedSearchQuery, normalizeFeedTag } from "@/lib/feed-filters";

type FeedPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
  }>;
};

const PublicFeedPage = async ({ searchParams }: FeedPageProps) => {
  const params = await searchParams;
  const search = normalizeFeedSearchQuery(params.search);
  const tag = normalizeFeedTag(params.tag);

  const [links, session] = await Promise.all([
    getPublicLinks({ search, tag }),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const allowVoting = Boolean(session?.user);
  const hasFilters = Boolean(search || tag);
  const currentResultLabel = `${links.length} ${links.length === 1 ? "resource" : "resources"}`;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="overflow-hidden rounded-[32px] border border-[#e6deca] bg-[#fbf8f1] text-[#1f1c17] shadow-[0_22px_60px_rgba(31,28,23,0.08)]">
          <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-[#d8c98a] bg-[#f5e27f]/20 px-3 py-1 text-xs font-medium text-[#6c5a12]">
                Public resources
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[#16130f] md:text-5xl">
                  Discover the best developer resources shared by the community.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
                  Search by title or tag and jump into anything that looks useful.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasFilters ? (
                  <Button asChild variant="outline" className="rounded-full border-[#d8d0bc] bg-white text-[#2a251c] hover:bg-[#f6f1e6]">
                    <Link href="/feed">Clear filters</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-[#e1d7c3] bg-white p-5 shadow-[0_14px_32px_rgba(31,28,23,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Results</p>
                  <p className="mt-1 text-2xl font-semibold text-[#16130f]">{currentResultLabel}</p>
                </div>
                <div className="rounded-full border border-[#d8c98a] bg-[#f5e27f]/20 px-3 py-1 text-xs text-[#6c5a12]">
                  All
                </div>
              </div>

              <FeedSearch />

              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-full border border-[#e1d7c3] bg-[#fbf8f1] px-3 py-1">
                  Search title and tags
                </span>
                <span className="rounded-full border border-[#e1d7c3] bg-[#fbf8f1] px-3 py-1">
                  Click a tag to filter
                </span>
              </div>
            </div>
          </div>
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
