"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buildDashboardHref, normalizeTagList } from "@/lib/dashboard-filters";

type TagPillsProps = {
    tags: string[];
};

export default function TagPills({ tags }: TagPillsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const selectedTags = normalizeTagList(searchParams.getAll("tag"));

    const toggleTag = (tag: string) => {
        const normalizedTag = tag.trim().toLowerCase();
        if (!normalizedTag) return;

        const params = new URLSearchParams(searchParams.toString());
        const currentTags = normalizeTagList(params.getAll("tag"));

        if (currentTags.includes(normalizedTag)) {
            // Remove tag
            const newTags = currentTags.filter((t) => t !== normalizedTag);
            params.delete("tag");
            newTags.forEach((t) => params.append("tag", t));
        } else {
            // Add tag
            params.append("tag", normalizedTag);
        }

        startTransition(() => {
            router.push(buildDashboardHref(pathname, params), { scroll: false });
        });
    };

    if (tags.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-2", isPending && "opacity-50")}>
            <p className="mr-2 text-sm font-medium text-zinc-400">Filter by tag:</p>
            {tags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                    <Badge
                        key={tag}
                        asChild
                        variant={isActive ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer border-zinc-800 transition-colors",
                            isActive
                                ? "bg-zinc-100 text-zinc-950"
                                : "bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => toggleTag(tag)}
                            aria-pressed={isActive}
                            className="px-0.5"
                        >
                            {tag}
                        </button>
                    </Badge>
                );
            })}
            {selectedTags.length > 0 && (
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("tag");
                        startTransition(() => {
                            router.push(buildDashboardHref(pathname, params), { scroll: false });
                        });
                    }}
                    className="text-xs text-zinc-400 transition-colors hover:text-zinc-100 hover:underline"
                >
                    Clear tags
                </button>
            )}
        </div>
    );
}
