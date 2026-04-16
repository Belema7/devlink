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
    <Card className="group h-full border border-[#d8d0bc] bg-[#f9f5ec] transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e6f52]">
              Shared by {link.createdBy}
            </p>
            <CardTitle className="line-clamp-2 text-lg text-zinc-900">{link.title}</CardTitle>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-[#d7c7aa] bg-white px-3 py-1 text-xs font-medium text-zinc-700">
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
                className="border-[#d8d0bc] bg-[#fffdf8] text-zinc-700"
              >
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No tags</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-[#e6deca] bg-[#f2ede3]">
        <p className="text-xs text-zinc-600">{link.createdBy}</p>
        <Button asChild size="sm" className="rounded-full bg-[#242220] text-white hover:bg-[#35312d]">
          <Link href={`/link/${link.id}`}>
            Open
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
