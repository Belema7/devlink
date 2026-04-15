"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, ThumbsUp } from "lucide-react";
import { removeVote, upvoteLink } from "@/app/actions/vote.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [voteCount, setVoteCount] = useState(link.voteCount);
  const [hasVoted, setHasVoted] = useState(link.hasVoted);
  const [message, setMessage] = useState<string | null>(null);

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

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Shared by {link.createdBy}
          </p>
          <CardTitle className="line-clamp-2 text-xl">{link.title}</CardTitle>
        </div>
        <Link
          href={`/link/${link.id}`}
          className="text-sm text-primary hover:underline"
        >
          Open details
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {link.description?.trim() ? link.description : "No description provided."}
        </p>
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

      <CardFooter className="flex-wrap items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={link.url} target="_blank" rel="noreferrer">
            Visit Resource
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {allowVoting ? (
            <Button
              type="button"
              size="sm"
              variant={hasVoted ? "default" : "secondary"}
              onClick={handleVoteToggle}
              disabled={isPending}
            >
              <ThumbsUp className="size-3.5" />
              {voteCount}
            </Button>
          ) : (
            <Button asChild type="button" size="sm" variant="secondary">
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
