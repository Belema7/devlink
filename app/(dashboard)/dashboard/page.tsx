import Link from "next/link";
import { getUserLinks } from "@/app/actions/link.actions";
import DashboardLinksView from "@/components/links/dashboard-links-view";
import { Button } from "@/components/ui/button";

type DashboardPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string | string[];
    visibility?: "all" | "public" | "private";
  }>;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const params = await searchParams;
  const search = params.search;
  const tags = typeof params.tag === "string" ? [params.tag] : params.tag;
  const visibility = params.visibility;

  const links = await getUserLinks({ search, tags, visibility });

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

      <DashboardLinksView initialLinks={serializableLinks} />
    </div>
  );
};

export default DashboardPage;
