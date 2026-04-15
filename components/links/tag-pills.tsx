"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TagPillsProps = {
    tags: string[];
};

export default function TagPills({ tags }: TagPillsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const selectedTags = searchParams.getAll("tag");

    const toggleTag = (tag: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTags = params.getAll("tag");

        if (currentTags.includes(tag)) {
            // Remove tag
            const newTags = currentTags.filter((t) => t !== tag);
            params.delete("tag");
            newTags.forEach((t) => params.append("tag", t));
        } else {
            // Add tag
            params.append("tag", tag);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
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
                        variant={isActive ? "default" : "secondary"}
                        className={cn(
                            "cursor-pointer transition-colors hover:opacity-80",
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary/80"
                        )}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </Badge>
                );
            })}
            {selectedTags.length > 0 && (
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("tag");
                        startTransition(() => {
                            router.push(`${pathname}?${params.toString()}`);
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
