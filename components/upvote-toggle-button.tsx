"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { removeVote, upvoteLink } from "@/app/actions/vote.actions";
import { Button } from "@/components/ui/button";

type UpvoteToggleButtonProps = {
  linkId: string;
  initialVoteCount: number;
  initialHasVoted: boolean;
  allowVoting: boolean;
};

export default function UpvoteToggleButton({
  linkId,
  initialVoteCount,
  initialHasVoted,
  allowVoting,
}: UpvoteToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);

  const handleToggleVote = () => {
    if (!allowVoting || isPending) return;

    const previousVoteCount = voteCount;
    const previousHasVoted = hasVoted;
    setHasVoted(!previousHasVoted);
    setVoteCount(previousHasVoted ? Math.max(0, previousVoteCount - 1) : previousVoteCount + 1);

    startTransition(async () => {
      const result = previousHasVoted ? await removeVote(linkId) : await upvoteLink(linkId);

      if (!result.success) {
        setHasVoted(previousHasVoted);
        setVoteCount(previousVoteCount);
        return;
      }

      setHasVoted(result.hasVoted);
      setVoteCount(result.voteCount);
    });
  };

  if (!allowVoting) {
    return (
      <Button asChild type="button" variant="secondary">
        <Link href="/login">
          <ThumbsUp className="size-4" />
          Sign in to upvote ({voteCount})
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={hasVoted ? "default" : "secondary"}
      onClick={handleToggleVote}
      disabled={isPending}
    >
      <ThumbsUp className="size-4" />
      {voteCount} {voteCount === 1 ? "upvote" : "upvotes"}
    </Button>
  );
}
