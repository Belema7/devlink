import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import FeedSearch from "@/components/feed/feed-search";
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

  const isAuthenticated = Boolean(session?.user);
  const hasFilters = Boolean(search || tag);
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
          <section className="space-y-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-display text-xs font-black uppercase text-muted-foreground">Latest</p>
                <h2 className="mt-2 font-heading text-3xl font-black text-black">Recent Entries</h2>
              </div>
              <div className="w-full md:max-w-xl">
                <FeedSearch />
              </div>
            </div>

            {links.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-3xl text-black">No public resources yet</CardTitle>
                </CardHeader>
                <CardContent className="font-body text-base font-medium text-muted-foreground">
                  {hasFilters ? "Try a different search or tag." : "No cards to show yet."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {links.map((link) => (
                  <PublicLinkCard key={link.id} link={link} isAuthenticated={isAuthenticated} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
