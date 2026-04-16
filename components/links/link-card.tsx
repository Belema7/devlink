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
    <Card className="h-full border border-blue-950/70 bg-zinc-900/70 text-zinc-100 shadow-[0_8px_26px_rgba(2,8,23,0.4)] backdrop-blur">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-zinc-100">{link.title}</CardTitle>
          <Badge
            variant={link.isPublic ? "secondary" : "outline"}
            className={link.isPublic ? "bg-blue-600/20 text-blue-300" : "border-zinc-700 text-zinc-300"}
          >
            {link.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <Link
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
        >
          Open Link
          <ExternalLink className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {link.description ? (
          <p className="line-clamp-3 text-sm text-zinc-400">{link.description}</p>
        ) : (
          <p className="text-sm text-zinc-500">No description added.</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="border-zinc-700 bg-zinc-950 text-zinc-300">
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No tags</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-zinc-800 bg-zinc-950/70">
        <p className="text-xs text-zinc-500">
          Added {new Date(link.createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild type="button" size="sm" variant="secondary">
            <Link href={`/links/${link.id}`}>
              <Eye className="size-3.5" />
              View
            </Link>
          </Button>
          <Button asChild type="button" size="sm" variant="outline">
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
