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
        "h-full border border-white/5 bg-[#2b2d37] text-zinc-100 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur",
        isFeatured ? "ring-1 ring-[#22c6a4]/25" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-zinc-100">
            <Badge
              className={[
                "border-white/10 bg-white/5 text-zinc-200",
                isFeatured ? "border-[#22c6a4]/20 bg-[#22c6a4]/10 text-[#6fe7cf]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <TagIcon className="size-3" />
              {tag.name}
            </Badge>
            {isFeatured ? (
              <Badge className="border border-[#22c6a4]/20 bg-[#22c6a4]/10 text-[#6fe7cf]">Most used</Badge>
            ) : null}
          </CardTitle>

          <p className="text-sm font-semibold text-zinc-300">
            {tag.linkCount} {tag.linkCount === 1 ? "link" : "links"}
          </p>
        </div>

        <Link
          href={`/dashboard?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-1 text-sm text-[#6fe7cf] hover:underline"
        >
          Filter dashboard
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-zinc-400">
          This tag is attached to {tag.linkCount} {tag.linkCount === 1 ? "link" : "links"} in your workspace.
        </p>
      </CardContent>

      <CardFooter className="justify-end gap-2 border-white/5 bg-[#232530]">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
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
