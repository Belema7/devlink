"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildFeedHref, normalizeFeedSearchQuery } from "@/lib/feed-filters";

export default function FeedSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeSearch = normalizeFeedSearchQuery(searchParams.get("search"));
  const [searchValue, setSearchValue] = useState(activeSearch);

  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue === activeSearch) return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.replace(buildFeedHref(pathname, params), { scroll: false });
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [activeSearch, pathname, router, searchParams, searchValue, startTransition]);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="size-4 text-primary" />
      </div>
      <Input
        type="search"
        aria-label="Search public resources"
        placeholder="Search the catalogue by title or tag..."
        className="h-12 border-border bg-background/70 pl-11 pr-24 text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
        {searchValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-primary"
            onClick={() => setSearchValue("")}
            aria-label="Clear search"
          >
            <X className="size-4" />
          </Button>
        ) : null}
        {isPending ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : null}
      </div>
    </div>
  );
}
