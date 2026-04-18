import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import FeedSearch from "@/components/feed/feed-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPublicLinks } from "@/lib/public-links";
import { normalizeFeedSearchQuery, normalizeFeedTag } from "@/lib/feed-filters";

type FeedPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
  }>;
};

export default async function PublicFeedPage({ searchParams }: FeedPageProps) {
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

      <main className="mx-auto w-full px-6 py-14 bg-zinc-950 text-zinc-100">
        <section className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-500">Public feed</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            Browse developer resources shared by the community.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
            Search by title or tag and open the resources that are most useful to you.
          </p>
        </section>

        <section className="mt-12 space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-6 py-6">
            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Search</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-100">{currentResultLabel}</p>
                <p className="mt-2 text-sm text-zinc-500">
                  {search || tag ? "Filtered results from the public feed." : "Search by title or tag."}
                </p>
              </div>

              {hasFilters ? (
                <Button asChild variant="outline" className="w-full border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900 lg:w-auto">
                  <Link href="/feed">Clear filters</Link>
                </Button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <FeedSearch />
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-full border border-zinc-800 px-3 py-1">Search title and tags</span>
                <span className="rounded-full border border-zinc-800 px-3 py-1">Click a tag to filter</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-6 py-6">
            <div className="flex items-end justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">All public resources</h2>
                <p className="text-sm text-zinc-500">
                  {search || tag ? "Filtered results from the public feed." : "Everything the community has shared."}
                </p>
              </div>
              <p className="text-sm text-zinc-500">{links.length} total</p>
            </div>

            <div className="mt-5">
              {links.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-950">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">No public resources yet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-zinc-400">
                    <p>
                      {hasFilters
                        ? "Try clearing the search or tag filter."
                        : "Share your first public link from the dashboard to seed the feed."}
                    </p>
                    {hasFilters ? (
                      <Button asChild className="rounded-full border border-zinc-700 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                        <Link href="/feed">Reset feed</Link>
                      </Button>
                    ) : null}
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
      </main>
    </>
  );
}
