import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicLink } from "@/components/PublicLinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicResourceCard from "@/components/home/public-resource-card";

type FeedPreviewProps = {
  links: PublicLink[];
};

export default function FeedPreview({ links }: FeedPreviewProps) {
  const previewLinks = links.slice(0, 6);

  return (
    <section id="feed" className="py-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">Public feed preview</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Real resources from the community.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">
            See how shared links look before you even enter the app. These cards come from the public feed and show what the community is voting on.
          </p>
        </div>

        <Button asChild className="rounded-full bg-teal-500 text-zinc-950 hover:bg-teal-400">
          <Link href="/feed">
            View All Resources
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {previewLinks.length === 0 ? (
        <Card className="border border-zinc-800 bg-zinc-900/80">
          <CardHeader>
            <CardTitle className="text-zinc-100">No public resources yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">
            Share your first public link to populate the feed preview.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {previewLinks.map((link) => (
            <PublicResourceCard key={link.id} link={link} />
          ))}
        </div>
      )}
    </section>
  );
}
