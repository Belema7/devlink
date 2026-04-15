import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import UpvoteToggleButton from "@/components/upvote-toggle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPublicLinkById } from "@/lib/public-links";
import { headers } from "next/headers";

type PublicLinkDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const PublicLinkDetailsPage = async ({ params }: PublicLinkDetailsPageProps) => {
  const [{ id }, session] = await Promise.all([params, auth.api.getSession({ headers: await headers() })]);
  const link = await getPublicLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Card>
          <CardHeader className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Shared by {link.createdBy}
            </p>
            <CardTitle className="text-3xl">{link.title}</CardTitle>
            <Link href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              {link.url}
              <ExternalLink className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {link.description?.trim() ? link.description : "No description provided."}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {link.tags.length > 0 ? (
                  link.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tags</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <UpvoteToggleButton
                linkId={link.id}
                initialVoteCount={link.voteCount}
                initialHasVoted={link.hasVoted}
                allowVoting={Boolean(session?.user)}
              />

              <Button asChild>
                <Link href={link.url} target="_blank" rel="noreferrer">
                  Visit Resource
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default PublicLinkDetailsPage;
