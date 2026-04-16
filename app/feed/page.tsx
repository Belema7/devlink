import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicLinks } from "@/lib/public-links";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PublicFeedPage = async () => {
  const [links, session] = await Promise.all([
    getPublicLinks(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const trendingLinks = links.slice(0, 6);
  const allowVoting = Boolean(session?.user);

  return (
    <>
      <Navbar />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Public Feed</h1>
          <p className="text-sm text-zinc-400">
            Discover the most useful resources shared by the DevLink community.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Trending Resources</h2>
          {trendingLinks.length === 0 ? (
            <Card className="border border-blue-950/70 bg-zinc-900/70">
              <CardHeader>
                <CardTitle className="text-zinc-100">No trending resources yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">
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

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100">All Public Resources</h2>
            <p className="text-sm text-zinc-400">{links.length} total</p>
          </div>
          {links.length === 0 ? (
            <Card className="border border-blue-950/70 bg-zinc-900/70">
              <CardHeader>
                <CardTitle className="text-zinc-100">No public resources yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">
                Share your first public link from the dashboard to seed the feed.
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
