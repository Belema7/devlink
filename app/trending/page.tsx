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

      <main className="academia-shell relative min-h-screen overflow-hidden text-foreground">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
          <section className="space-y-10">
            <div className="ornate-frame border border-border bg-card/80 p-8 md:p-10">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Volume I</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <h1 className="font-heading text-5xl font-medium leading-[1.05] tracking-normal text-foreground md:text-6xl">
                    Trending Volumes
                  </h1>
                  <p className="drop-cap mt-6 max-w-3xl font-body text-lg leading-relaxed text-muted-foreground">
                    Consult the most endorsed resources in the collection, elevated by the community as references worthy of a prominent shelf.
                  </p>
                </div>
                <div className="border border-border bg-background/60 p-5">
                  <FeedSearch />
                </div>
              </div>
            </div>

            <div className="ornate-divider" aria-hidden="true" />

            <div>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Volume II</p>
              <h2 className="mt-2 font-heading text-3xl font-medium text-foreground">Most Cited Entries</h2>
            </div>

            {links.length === 0 ? (
              <Card className="corner-flourish border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl text-foreground">No trending resources yet</CardTitle>
                </CardHeader>
                <CardContent className="font-body text-base text-muted-foreground">
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
