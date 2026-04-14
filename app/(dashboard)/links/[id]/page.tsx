import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getUserLinkById } from "@/app/actions/link.actions";
import LinkDetailsActions from "@/components/links/link-details-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SingleLinkPageProps = {
  params: Promise<{ id: string }>;
};

const SingleLinkPage = async ({ params }: SingleLinkPageProps) => {
  const { id } = await params;
  const link = await getUserLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-5 px-4 py-8">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-2xl">{link.title}</CardTitle>
            <Badge variant={link.isPublic ? "secondary" : "outline"}>
              {link.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <Link
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
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

          <div className="text-xs text-muted-foreground">
            Created {new Date(link.createdAt).toLocaleString()}
          </div>

          <LinkDetailsActions linkId={link.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleLinkPage;