"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

    const handleSearch = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        },
        [router, searchParams, pathname]
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchValue !== (searchParams.get("search") || "")) {
                handleSearch(searchValue);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, handleSearch, searchParams]);

    return (
        <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
                type="search"
                placeholder="Search links by title, description or tags..."
                className="pl-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            {isPending && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    );
}
