import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";
import type { PublicLink } from "@/components/PublicLinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TrendingProps = {
  links: PublicLink[];
};

export default function Trending({ links }: TrendingProps) {
  const trending = [...links].sort((a, b) => b.voteCount - a.voteCount).slice(0, 4);

  return (
    <section id="trending" className="py-20">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8e6f52]">Trending</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Top voted resources surface what matters right now.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-base">
            Use community votes to spotlight the best reads, tools, and workflows for modern development teams.
          </p>
        </div>

        <div className="space-y-3">
          {trending.length === 0 ? (
            <Card className="border border-[#d8d0bc] bg-[#f9f5ec]">
              <CardHeader>
                <CardTitle className="text-zinc-900">No trending resources yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Trending links will appear here once the community starts voting.
              </CardContent>
            </Card>
          ) : (
            trending.map((link, index) => (
              <Card
                key={link.id}
                className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_14px_34px_rgba(30,27,22,0.05)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <CardContent className="flex items-center gap-4 p-4 md:p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f]">
                    <span className="text-lg font-semibold">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-semibold text-zinc-900">{link.title}</p>
                      <Badge variant="outline" className="border-[#d8d0bc] bg-white text-zinc-700">
                        {link.voteCount} votes
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">Shared by {link.createdBy}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {link.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="border-[#d8d0bc] bg-[#fffdf8] text-zinc-700">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="rounded-full border-[#d8d0bc] bg-white">
                    <Link href={`/link/${link.id}`}>
                      Open
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-[#d8d0bc] bg-[#242220] p-6 text-white shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f5e27f]/10 text-[#f5e27f]">
            <Flame className="size-5" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Community signal</p>
            <p className="text-lg font-medium text-white">Vote on resources to help the best dev links rise faster.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
