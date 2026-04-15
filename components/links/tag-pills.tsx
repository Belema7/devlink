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
            <p className="mr-2 text-sm font-medium text-muted-foreground">Filter by tag:</p>
            {tags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                    <Badge
                        key={tag}
                        asChild
                        variant={isActive ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer border-transparent transition-all hover:-translate-y-px hover:shadow-sm",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                    className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                >
                    Clear tags
                </button>
            )}
        </div>
    );
}
