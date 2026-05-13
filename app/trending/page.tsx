import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import FeedSearch from "@/components/feed/feed-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-guard";
import { getTrendingLinks } from "@/lib/public-links";
import { normalizeFeedSearchQuery, normalizeFeedTag } from "@/lib/feed-filters";

export const metadata = {
  title: "Trending Resources",
  description: "Top voted developer resources from the community.",
};

type TrendingPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
  }>;
};

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  await requireUser();
  const params = await searchParams;
  const search = normalizeFeedSearchQuery(params.search);
  const tag = normalizeFeedTag(params.tag);
  const links = await getTrendingLinks({ search, tag });
  const hasFilters = Boolean(search || tag);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
          <section className="space-y-10">
            <div className="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-10">
              <p className="inline-flex border-2 border-black bg-muted px-3 py-1 font-display text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">Trending</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <h1 className="font-heading text-5xl font-black leading-[1.05] tracking-normal text-black md:text-6xl">
                    Trending Resources
                  </h1>
                  <p className="mt-6 max-w-3xl font-body text-lg font-medium leading-relaxed text-muted-foreground">
                    See the most endorsed resources in the collection, ranked by community votes.
                  </p>
                </div>
                <div className="border-2 border-black bg-muted p-5 shadow-[4px_4px_0px_#000]">
                  <FeedSearch />
                </div>
              </div>
            </div>

            <div>
              <p className="font-display text-xs font-black uppercase text-muted-foreground">Top voted</p>
              <h2 className="mt-2 font-heading text-3xl font-black text-black">Most Cited Entries</h2>
            </div>

            {links.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-3xl text-black">No trending resources yet</CardTitle>
                </CardHeader>
                <CardContent className="font-body text-base font-medium text-muted-foreground">
                  {hasFilters ? "Try a different search or tag." : "No cards to show yet."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {links.map((link) => (
                  <PublicLinkCard key={link.id} link={link} isAuthenticated />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
