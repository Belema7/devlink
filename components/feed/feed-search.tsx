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
    <div className="relative w-full max-w-2xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="size-4 text-zinc-500" />
      </div>
      <Input
        type="search"
        aria-label="Search public resources"
        placeholder="Search resources by title or tag..."
        className="h-12 rounded-full border-[#ddd3bf] bg-white pl-11 pr-24 text-[#1f1c17] placeholder:text-zinc-500 focus-visible:border-[#cdbb6e] focus-visible:ring-[#f5e27f]/20"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
        {searchValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-8 w-8 rounded-full text-zinc-500 hover:bg-[#f6f1e6] hover:text-[#1f1c17]"
            onClick={() => setSearchValue("")}
            aria-label="Clear search"
          >
            <X className="size-4" />
          </Button>
        ) : null}
        {isPending ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#cdbb6e] border-t-transparent" /> : null}
      </div>
    </div>
  );
}
