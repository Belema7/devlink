"use client";

import Link from "next/link";
import { ArrowUpRight, Pencil, Tag as TagIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserTag } from "@/app/actions/tag.actions";

type TagCardProps = {
  tag: UserTag;
  isFeatured?: boolean;
  onEdit: (tag: UserTag) => void;
  onDelete: (tag: UserTag) => void;
};

export function TagCard({ tag, isFeatured = false, onEdit, onDelete }: TagCardProps) {
  return (
    <Card
      className={[
        "h-full border border-zinc-800 bg-zinc-950 text-zinc-100",
        isFeatured ? "border-zinc-700" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CardHeader className="space-y-3 border-b border-zinc-800 pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-zinc-100">
            <Badge
              className={[
                "border-zinc-800 bg-zinc-900/40 text-zinc-200",
                isFeatured ? "border-zinc-700 text-zinc-100" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <TagIcon className="size-3" />
              {tag.name}
            </Badge>
            {isFeatured ? (
              <Badge className="border border-zinc-800 bg-zinc-900/40 text-zinc-300">Most used</Badge>
            ) : null}
          </CardTitle>

          <p className="text-sm font-semibold text-zinc-300">
            {tag.linkCount} {tag.linkCount === 1 ? "link" : "links"}
          </p>
        </div>

        <Link
          href={`/dashboard?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100"
        >
          Filter dashboard
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 py-4">
        <p className="text-sm text-zinc-300">
          This tag is attached to {tag.linkCount} {tag.linkCount === 1 ? "link" : "links"} in your workspace.
        </p>
      </CardContent>

      <CardFooter className="justify-end gap-2 border-t border-zinc-800 pt-4">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900"
          onClick={() => onEdit(tag)}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={() => onDelete(tag)}>
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
