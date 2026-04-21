"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Hash, ThumbsUp } from "lucide-react";
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
  createdBy: string;
  voteCount: number;
  hasVoted: boolean;
};

type PublicLinkCardProps = {
  link: PublicLink;
  allowVoting: boolean;
};

export default function PublicLinkCard({ link, allowVoting }: PublicLinkCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [voteCount, setVoteCount] = useState(link.voteCount);
  const [hasVoted, setHasVoted] = useState(link.hasVoted);
  const [message, setMessage] = useState<string | null>(null);
  const selectedTag = normalizeFeedTag(searchParams.get("tag"));

  const handleVoteToggle = () => {
    if (!allowVoting || isPending) return;

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

    const destination = pathname === "/feed" ? buildFeedHref(pathname, params) : buildFeedHref("/feed", params);
    router.push(destination, { scroll: false });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-xl">
      <CardHeader className="space-y-4 px-6 pt-6 pb-5">
        {/* Creator + Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-medium tracking-widest text-zinc-500">
              Shared by{" "}
              <span className="font-semibold text-zinc-400">{link.createdBy}</span>
            </p>
            <CardTitle className="line-clamp-2 text-2xl font-semibold leading-tight tracking-tighter text-zinc-50">
              {link.title}
            </CardTitle>
          </div>
        </div>

        {/* URL */}
        <Link
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="group/url flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-300"
        >
          <span className="truncate font-medium">{link.url}</span>
          <ExternalLink className="size-3.5 opacity-60 transition-opacity group-hover/url:opacity-100" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 px-6 py-6">
        {/* Description */}
        <p className="line-clamp-4 text-[15px] leading-relaxed text-zinc-300">
          {link.description?.trim() ? link.description : "No description provided."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-3xl border px-4 py-1.5 text-xs font-medium transition-all",
                  selectedTag === normalizeFeedTag(tag.name)
                    ? "border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-inner"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <Hash className="size-3" />
                {tag.name}
              </button>
            ))
          ) : (
            <span className="rounded-3xl border border-dashed border-zinc-700 px-4 py-1.5 text-xs text-zinc-500">
              No tags
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t border-zinc-800 px-6 py-5">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-900 hover:text-white"
            >
              <Link href={`/link/${link.id}`}>Open details</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-900 hover:text-white"
            >
              <Link href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                Visit site
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Vote button */}
          <div className="flex items-center gap-2">
            {allowVoting ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleVoteToggle}
                disabled={isPending}
                className={cn(
                  "h-9 w-9 items-center justify-center gap-1 rounded-3xl border border-zinc-700 bg-zinc-950 px-5 text-sm font-semibold text-zinc-100 transition-all hover:bg-zinc-900",
                  hasVoted
                    ? "border-emerald-500 bg-emerald-950 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/90"
                    : "hover:border-zinc-400"
                )}
              >
                <ThumbsUp
                  className={cn("size-4 transition-transform", hasVoted && "scale-110")}
                />
                <span className="tabular-nums">{voteCount}</span>
              </Button>
            ) : (
              <Button
                asChild
                type="button"
                size="sm"
                variant="outline"
                className="h-9 w-9 items-center justify-center gap-1 rounded-3xl border border-zinc-700 bg-zinc-950 px-5 text-sm font-semibold text-zinc-100 hover:bg-zinc-900"
              >
                <Link href="/login">
                  <ThumbsUp className="size-4" />
                  <span className="tabular-nums">{voteCount}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Error message */}
      {message && (
        <div className="px-6 pb-6 text-xs text-red-400">{message}</div>
      )}
    </Card>
  );
}