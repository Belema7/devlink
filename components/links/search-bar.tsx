"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildDashboardHref, normalizeSearchQuery } from "@/lib/dashboard-filters";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const activeSearch = normalizeSearchQuery(searchParams.get("search"));
    const [searchValue, setSearchValue] = useState(activeSearch);

    useEffect(() => {
        setSearchValue(activeSearch);
    }, [activeSearch]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchValue === activeSearch) {
                return;
            }

            const params = new URLSearchParams(searchParams.toString());
            if (searchValue) {
                params.set("search", searchValue);
            } else {
                params.delete("search");
            }

            startTransition(() => {
                router.replace(buildDashboardHref(pathname, params), { scroll: false });
            });
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [activeSearch, pathname, router, searchParams, searchValue, startTransition]);

    return (
        <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <Input
                type="search"
                aria-label="Search links by title or tag"
                placeholder="Search by title or tag..."
                className="rounded-2xl border-white/10 bg-[#2d2f3a] pl-10 pr-24 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-[#22c6a4]/60"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-1.5">
                {searchValue ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSearchValue("")}
                        aria-label="Clear search"
                        className="h-6 w-6"
                    >
                        <X className="size-3.5" />
                    </Button>
                ) : null}
                {isPending ? (
                    <div className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : null}
            </div>
        </div>
    );
}
