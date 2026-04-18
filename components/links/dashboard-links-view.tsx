"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { deleteLinkAction } from "@/app/actions/link.actions";
import { Button } from "@/components/ui/button";
import LinkCard, { type DashboardLink } from "@/components/links/link-card";
import SearchBar from "@/components/links/search-bar";
import TagPills from "@/components/links/tag-pills";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { normalizeTagList } from "@/lib/dashboard-filters";

type DashboardLinksViewProps = {
  initialLinks: DashboardLink[];
  availableTags: string[];
};

export default function DashboardLinksView({ initialLinks, availableTags }: DashboardLinksViewProps) {
  const [links, setLinks] = useState(initialLinks);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Sync state with server-side props when they change
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const normalizedAvailableTags = useMemo(
    () => normalizeTagList(availableTags).sort(),
    [availableTags]
  );

  const visibility = (searchParams.get("visibility") as "all" | "public" | "private") || "all";

  const handleVisibilityChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("visibility");
    } else {
      params.set("visibility", value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

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
      router.refresh();
      setDeletingId(null);
    });
  };

  const hasFilters = searchParams.has("search") || searchParams.has("tag") || searchParams.has("visibility");

  return (
    <div className="space-y-6 rounded-[28px] border border-zinc-800 bg-zinc-900/80 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] md:p-6">
      {actionMessage ? (
        <p className="text-sm text-zinc-400">{actionMessage}</p>
      ) : null}

      <div className="flex flex-col gap-4">
        <SearchBar />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <TagPills tags={normalizedAvailableTags} />

          <div className="flex items-center gap-2 min-w-[150px]">
            <span className="text-sm font-medium text-zinc-400">Visibility:</span>
            <NativeSelect
              value={visibility}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              className="h-9 border-zinc-800 bg-zinc-950/60 text-zinc-100"
            >
              <NativeSelectOption value="all">All</NativeSelectOption>
              <NativeSelectOption value="public">Public</NativeSelectOption>
              <NativeSelectOption value="private">Private</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/60 p-8 text-center">
          <p className="text-lg font-medium text-zinc-100">
            {hasFilters ? "No links match these filters" : "No links yet"}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {hasFilters
              ? "Try clearing filters or using different criteria."
              : "Start by adding your first link to build your dashboard."}
          </p>
          {hasFilters ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          ) : (
            <Button asChild className="mt-4 bg-teal-500 text-zinc-950 hover:bg-teal-400">
              <Link href="/links/new">Add Link</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Showing {links.length} {links.length === 1 ? "link" : "links"}
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-medium text-zinc-300 hover:text-teal-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={handleDelete}
                isDeleting={isPending && deletingId === link.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
