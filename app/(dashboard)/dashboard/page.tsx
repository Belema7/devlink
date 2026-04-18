import Link from "next/link";
import { getUserLinks, getUserTagNames } from "@/app/actions/link.actions";
import DashboardLinksView from "@/components/links/dashboard-links-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isDashboardVisibility, normalizeSearchQuery, normalizeTagList } from "@/lib/dashboard-filters";
import { ArrowUpRight, Link2, Lock, Sparkles, Tags } from "lucide-react";

type DashboardPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string | string[];
    visibility?: string;
  }>;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const params = await searchParams;
  const search = normalizeSearchQuery(params.search);
  const tags = normalizeTagList(params.tag);
  const visibility = isDashboardVisibility(params.visibility) ? params.visibility : "all";

  const [links, availableTags] = await Promise.all([
    getUserLinks({ search, tags, visibility }),
    getUserTagNames(),
  ]);

  const serializableLinks = links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    description: link.description,
    isPublic: link.isPublic,
    tags: link.tags,
    createdAt: link.createdAt.toISOString(),
  }));

  const totalLinks = serializableLinks.length;
  const publicLinks = serializableLinks.filter((link) => link.isPublic).length;
  const privateLinks = totalLinks - publicLinks;
  const publicShare = totalLinks > 0 ? Math.round((publicLinks / totalLinks) * 100) : 0;
  const recentTagCount = availableTags.length;
  const topTags = availableTags.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-300">
                <Sparkles className="size-3.5" />
                Workspace overview
              </span>
              <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400">
                Updated just now
              </span>
            </div>

            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">Your dashboard at a glance.</h1>
              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                Track link volume, visibility, and tag usage from a quiet workspace built for fast scanning.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="border border-zinc-800 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                <Link href="/links/new">
                  Add Link
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
                <Link href="/links">View all links</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-zinc-300">Total links</CardTitle>
                <Link2 className="size-4 text-zinc-400" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-4xl font-semibold tracking-tight text-zinc-50">
                  {totalLinks.toString().padStart(2, "0")}
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{publicLinks} public</span>
                  <span>{privateLinks} private</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${publicShare}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-zinc-300">Visibility</CardTitle>
                <Lock className="size-4 text-zinc-400" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-semibold tracking-tight text-zinc-50">{publicShare}%</div>
                  <Badge className="border border-zinc-800 bg-zinc-900/40 text-zinc-300">
                    public share
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Public</span>
                    <span>{publicLinks}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${publicShare}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 border-t border-zinc-800 pt-6 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Active tags</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-50">{recentTagCount}</p>
            <p className="mt-1 text-sm text-zinc-400">Organize saved links with lightweight tags.</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Top tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topTags.length > 0 ? (
                topTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-sm text-zinc-300"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-400">No tags yet.</span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Snapshot</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 text-zinc-200">
                <Tags className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-50">{totalLinks} links in total</p>
                <p className="text-sm text-zinc-400">A compact dashboard surface for quick decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DashboardLinksView initialLinks={serializableLinks} availableTags={availableTags} />
    </div>
  );
};

export default DashboardPage;
