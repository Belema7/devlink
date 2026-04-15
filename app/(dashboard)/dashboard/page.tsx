import Link from "next/link";
import { getUserLinks, getUserTagNames } from "@/app/actions/link.actions";
import DashboardLinksView from "@/components/links/dashboard-links-view";
import { Button } from "@/components/ui/button";
import { isDashboardVisibility, normalizeSearchQuery, normalizeTagList } from "@/lib/dashboard-filters";

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

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your saved links, tags, and visibility in one place.
          </p>
        </div>
        <Button asChild>
          <Link href="/links/new">Add Link</Link>
        </Button>
      </div>

      <DashboardLinksView initialLinks={serializableLinks} availableTags={availableTags} />
    </div>
  );
};

export default DashboardPage;
