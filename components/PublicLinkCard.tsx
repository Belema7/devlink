"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Hash, Pencil, ScrollText, Star, ThumbsUp } from "lucide-react";
import { removeVote, upvoteLink } from "@/app/actions/vote.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buildFeedHref, normalizeFeedTag } from "@/lib/feed-filters";
import { cn } from "@/lib/utils";

export type PublicLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  tags: Array<{ id: string; name: string }>;
  isPublic?: boolean;
  voteCount: number;
  hasVoted: boolean;
};

type PublicLinkCardProps = {
  link: PublicLink;
  isAuthenticated: boolean;
};

export default function PublicLinkCard({ link, isAuthenticated }: PublicLinkCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [voteCount, setVoteCount] = useState(link.voteCount);
  const [hasVoted, setHasVoted] = useState(link.hasVoted);
  const [message, setMessage] = useState<string | null>(null);
  const selectedTag = normalizeFeedTag(searchParams.get("tag"));

  const handleVoteToggle = () => {
    if (!isAuthenticated || isPending) return;

    const previousVoteCount = voteCount;
    const previousHasVoted = hasVoted;
    const optimisticHasVoted = !hasVoted;
    const optimisticVoteCount = hasVoted ? Math.max(0, voteCount - 1) : voteCount + 1;

    setHasVoted(optimisticHasVoted);
    setVoteCount(optimisticVoteCount);
    setMessage(null);

    startTransition(async () => {
      const result = previousHasVoted ? await removeVote(link.id) : await upvoteLink(link.id);

      if (!result.success) {
        setHasVoted(previousHasVoted);
        setVoteCount(previousVoteCount);
        setMessage(result.message);
        return;
      }

      setHasVoted(result.hasVoted);
      setVoteCount(result.voteCount);
    });
  };

  const handleTagClick = (tagName: string) => {
    const normalizedTag = normalizeFeedTag(tagName);
    if (!normalizedTag) return;

    const params = new URLSearchParams(searchParams.toString());
    if (selectedTag === normalizedTag) {
      params.delete("tag");
    } else {
      params.set("tag", normalizedTag);
    }

    const destination = pathname === "/feed" || pathname === "/trending"
      ? buildFeedHref(pathname, params)
      : buildFeedHref("/feed", params);
    router.push(destination, { scroll: false });
  };

  return (
    <Card className="corner-flourish group relative flex h-full flex-col overflow-visible border-border bg-card text-foreground">
      {hasVoted ? (
        <div className="wax-seal absolute -top-3 right-6 z-10 flex size-10 items-center justify-center rounded-full text-foreground" aria-label="Voted resource">
          <Star className="size-4 fill-current stroke-[1.5]" />
        </div>
      ) : null}

      <div className="mx-6 mt-6 overflow-hidden border border-primary/30 bg-background arch-top">
        <div className="sepia-reveal flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(201,169,98,0.2),transparent_34%),linear-gradient(135deg,#3D332B_0%,#251E19_52%,#1C1714_100%)]">
          <ScrollText className="size-10 text-primary" />
        </div>
      </div>

      <CardHeader className="space-y-4 px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">I. Catalogue Entry</p>
            <CardTitle className="line-clamp-2 font-heading text-3xl font-medium leading-[1.05] tracking-normal text-foreground">
              {link.title}
            </CardTitle>
            {typeof link.isPublic === "boolean" ? (
              <span className="inline-flex w-fit rounded border border-border bg-background px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {link.isPublic ? "Public" : "Private"}
              </span>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 px-6 py-5">
        <p className="line-clamp-4 font-body text-base leading-relaxed text-muted-foreground">
          {link.description?.trim() ? link.description : "No description provided."}
        </p>

        <div className="ornate-divider" aria-hidden="true" />

        <div className="flex flex-wrap gap-2">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                className={cn(
                  "inline-flex min-h-8 items-center gap-1.5 rounded border px-3 py-1.5 font-display text-[10px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selectedTag === normalizeFeedTag(tag.name)
                    ? "border-primary bg-primary text-primary-foreground shadow-inner"
                    : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-primary"
                )}
              >
                <Hash className="size-3" />
                {tag.name}
              </button>
            ))
          ) : (
            <span className="rounded border border-border px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              No tags
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t border-border bg-muted/30 px-6 py-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          {isAuthenticated ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 px-3 text-[10px]"
            >
              <Link href={`/edit-link/${link.id}`}>
                <Pencil className="size-3.5" />
                Edit Link
              </Link>
            </Button>
          ) : null}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 px-3 text-[10px]"
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Visit Site
              <ExternalLink className="size-3.5" />
            </a>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleVoteToggle}
            disabled={!isAuthenticated || isPending}
            className={cn(
              "h-10 items-center justify-center gap-1 border px-3 text-[10px] transition-all",
              hasVoted
                ? "border-primary bg-primary text-primary-foreground hover:brightness-110"
                : "border-border bg-background text-primary hover:border-primary"
            )}
          >
            <ThumbsUp
              className={cn("size-4 transition-transform", hasVoted && "scale-110")}
            />
            Vote
            <span className="tabular-nums">{voteCount}</span>
          </Button>
        </div>
      </CardFooter>

      {message && (
        <div className="px-6 pb-6 text-xs text-red-400">{message}</div>
      )}
    </Card>
  );
}
