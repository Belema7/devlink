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
          <section className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
              <FeedSearch />
            </div>

            {links.length === 0 ? (
              <Card className="border-white/10 bg-black/60">
                <CardHeader>
                  <CardTitle className="text-zinc-100">No trending resources yet</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-300">
                  {hasFilters ? "Try a different search or tag." : "No cards to show yet."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
