"use client";

import Link from "next/link";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type DashboardLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  isPublic: boolean;
  tags: Array<{ id: string; name: string }>;
  createdAt: string;
};

type LinkCardProps = {
  link: DashboardLink;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export default function LinkCard({ link, onDelete, isDeleting }: LinkCardProps) {
  return (
    <Card className="h-full border border-zinc-800 bg-zinc-950 text-zinc-100">
      <CardHeader className="space-y-2 border-b border-zinc-800 pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-zinc-100">{link.title}</CardTitle>
          <Badge
            variant={link.isPublic ? "secondary" : "outline"}
            className={link.isPublic ? "border-zinc-800 bg-zinc-900/40 text-zinc-200" : "border-zinc-800 bg-zinc-950 text-zinc-300"}
          >
            {link.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <Link
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100"
        >
          Open Link
          <ExternalLink className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3 py-4">
        {link.description ? (
          <p className="line-clamp-3 text-sm text-zinc-300">{link.description}</p>
        ) : (
          <p className="text-sm text-zinc-500">No description added.</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-300">
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No tags</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500">
          Added {new Date(link.createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
          <Button
            asChild
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900"
          >
            <Link href={`/links/${link.id}`}>
              <Eye className="size-3.5" />
              View
            </Link>
          </Button>
          <Button
            asChild
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900"
          >
            <Link href={`/links/edit/${link.id}`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => onDelete(link.id)}
            disabled={isDeleting}
          >
            <Trash2 className="size-3.5" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
