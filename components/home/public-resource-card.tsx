import Link from "next/link";
import { ArrowUpRight, Vote } from "lucide-react";
import type { PublicLink } from "@/components/PublicLinkCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type PublicResourceCardProps = {
  link: PublicLink;
};

export default function PublicResourceCard({ link }: PublicResourceCardProps) {
  return (
    <Card className="group h-full border border-zinc-800 bg-zinc-900/80 transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
              Shared by {link.createdBy}
            </p>
            <CardTitle className="line-clamp-2 text-lg text-zinc-100">{link.title}</CardTitle>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs font-medium text-zinc-300">
            <Vote className="size-3.5" />
            {link.voteCount}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="border-zinc-800 bg-zinc-950/60 text-zinc-300"
              >
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No tags</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/60">
        <p className="text-xs text-zinc-400">{link.createdBy}</p>
        <Button asChild size="sm" className="rounded-full bg-teal-500 text-zinc-950 hover:bg-teal-400">
          <Link href={`/link/${link.id}`}>
            Open
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
