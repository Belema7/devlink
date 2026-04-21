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
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">Public feed</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              Browse developer resources shared by the community.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
              Search by title or tag and open the resources that are most useful to you.
            </p>
          </section>

          <section className="mt-12 space-y-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Public feed</p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                  {links.length} {links.length === 1 ? "resource" : "resources"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                  {search || tag
                    ? "Showing filtered results from the public feed."
                    : "Browse community-shared resources and open the ones that matter most."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">Search titles and tags</span>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">Click a tag to filter</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Search</p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {search || tag ? "Refine the current results." : "Search by title, description, or tag."}
                    </p>
                  </div>

                  {hasFilters ? (
                    <Button asChild variant="outline" className="w-full border-white/10 bg-black/70 text-zinc-100 hover:bg-white/5 sm:w-auto">
                      <Link href="/feed">Clear filters</Link>
                    </Button>
                  ) : null}
                </div>

                <div className="mt-5 space-y-4">
                  <FeedSearch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">All public resources</h2>
                  <p className="text-sm text-zinc-400">
                    {search || tag ? "Filtered results from the public feed." : "Everything the community has shared."}
                  </p>
                </div>
                <p className="text-sm text-zinc-500">{links.length} total</p>
              </div>

              <div className="mt-5">
                {links.length === 0 ? (
                  <Card className="border-white/10 bg-black/60">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">No public resources yet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-zinc-300">
                      <p>
                        {hasFilters
                          ? "Try clearing the search or tag filter."
                          : "Share your first public link from the dashboard to seed the feed."}
                      </p>
                      {hasFilters ? (
                        <Button asChild className="rounded-full border border-white/10 bg-white/10 text-zinc-100 hover:bg-white/15">
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
        </div>
      </main>
    </>
  );
}


