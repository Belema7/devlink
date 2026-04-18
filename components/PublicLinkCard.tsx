import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Hash, ThumbsUp } from "lucide-react";
import { removeVote, upvoteLink } from "@/app/actions/vote.actions";
import { Badge } from "@/components/ui/badge";
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
    if (!allowVoting || isPending) {
      return;
    }

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

    const destination =
      pathname === "/feed" ? buildFeedHref(pathname, params) : buildFeedHref("/feed", params);

    router.push(destination, { scroll: false });
  };

  return (
    <Card className="group h-full border border-zinc-800 bg-zinc-900/80 text-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(0,0,0,0.22)]">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
              Shared by {link.createdBy}
            </p>
            <CardTitle className="line-clamp-2 text-xl text-white">{link.title}</CardTitle>
          </div>
          <Badge className="rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs font-medium text-zinc-200">
            {voteCount} votes
          </Badge>
        </div>
        <Link href={link.url} target="_blank" rel="noreferrer" className="truncate text-sm text-teal-400 hover:underline">
          {link.url}
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">
          {link.description?.trim() ? link.description : "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2">
          {link.tags.length > 0 ? (
            link.tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                  selectedTag === normalizeFeedTag(tag.name)
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-300"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <Hash className="size-3" />
                {tag.name}
              </button>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No tags</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-3 border-t border-zinc-800 bg-zinc-950/60 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-zinc-900">
              <Hash className="size-3" />
            </span>
            <span className="truncate">{link.createdBy}</span>
          </div>
          <Button asChild variant="outline" size="sm" className="border-zinc-800 bg-zinc-950/60 text-zinc-100 hover:bg-zinc-900">
            <Link href={`/link/${link.id}`}>Open</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-zinc-800 bg-zinc-950/60 text-zinc-100 hover:bg-zinc-900">
            <Link href={link.url} target="_blank" rel="noreferrer">
              Visit
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {allowVoting ? (
            <Button
              type="button"
              size="sm"
              variant={hasVoted ? "default" : "secondary"}
              onClick={handleVoteToggle}
              disabled={isPending}
              className="rounded-full"
            >
              <ThumbsUp className="size-3.5" />
              {voteCount}
            </Button>
          ) : (
            <Button asChild type="button" size="sm" variant="secondary" className="rounded-full">
              <Link href="/login">
                <ThumbsUp className="size-3.5" />
                {voteCount}
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
      {message ? <p className="px-6 pb-4 text-xs text-destructive">{message}</p> : null}
    </Card>
  );
}
