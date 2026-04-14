"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteLinkAction } from "@/app/actions/link.actions";
import { Button } from "@/components/ui/button";
import DashboardFilterBar, { type VisibilityFilter } from "@/components/links/dashboard-filter-bar";
import LinkCard, { type DashboardLink } from "@/components/links/link-card";

type DashboardLinksViewProps = {
  initialLinks: DashboardLink[];
};

export default function DashboardLinksView({ initialLinks }: DashboardLinksViewProps) {
  const [links, setLinks] = useState(initialLinks);
  const [tagFilter, setTagFilter] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const availableTags = useMemo(
    () => [...new Set(links.flatMap((link) => link.tags.map((tag) => tag.name)))].sort(),
    [links]
  );

  const filteredLinks = useMemo(() => {
    const normalizedTagFilter = tagFilter.trim().toLowerCase();

    return links.filter((link) => {
      const matchesTag =
        normalizedTagFilter.length === 0 ||
        link.tags.some((tag) => tag.name.includes(normalizedTagFilter));

      const matchesVisibility =
        visibility === "all" ||
        (visibility === "public" ? link.isPublic : !link.isPublic);

      return matchesTag && matchesVisibility;
    });
  }, [links, tagFilter, visibility]);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setActionMessage(null);

    startTransition(async () => {
      const result = await deleteLinkAction(id);

      if (!result.success) {
        setActionMessage(result.message);
        setDeletingId(null);
        return;
      }

      setLinks((current) => current.filter((link) => link.id !== id));
      setActionMessage(result.message);
      setDeletingId(null);
    });
  };

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="text-lg font-medium">No links yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start by adding your first link to build your dashboard.
        </p>
        <Button asChild className="mt-4">
          <Link href="/links/new">Add Link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionMessage ? (
        <p className="text-sm text-muted-foreground">{actionMessage}</p>
      ) : null}

      <DashboardFilterBar
        tagFilter={tagFilter}
        visibility={visibility}
        availableTags={availableTags}
        onTagFilterChange={setTagFilter}
        onVisibilityChange={setVisibility}
      />

      {filteredLinks.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-lg font-medium">No links match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing filters or using a different tag.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => {
              setTagFilter("");
              setVisibility("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={handleDelete}
              isDeleting={isPending && deletingId === link.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
