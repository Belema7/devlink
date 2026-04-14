"use client";

import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
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
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{link.title}</CardTitle>
          <Badge variant={link.isPublic ? "secondary" : "outline"}>
            {link.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <Link
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Open Link
          <ExternalLink className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {link.description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{link.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No description added.</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Added {new Date(link.createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
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
