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
      <Button asChild variant="ghost" className="w-fit text-zinc-300 hover:bg-white/5 hover:text-zinc-50">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </Button>

      <Card className="border border-white/5 bg-[#2b2d37] text-zinc-100 shadow-[0_18px_48px_rgba(0,0,0,0.25)]">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-2xl">{link.title}</CardTitle>
            <Badge
              variant={link.isPublic ? "secondary" : "outline"}
              className={link.isPublic ? "bg-[#22c6a4]/15 text-[#6fe7cf]" : "border-white/10 text-zinc-300"}
            >
              {link.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <Link
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#6fe7cf] hover:underline"
          >
            {link.url}
            <ExternalLink className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-zinc-400">
              {link.description?.trim() ? link.description : "No description provided."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {link.tags.length > 0 ? (
                link.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="border-white/10 bg-white/5 text-zinc-300">
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-zinc-400">No tags</span>
              )}
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            Created {new Date(link.createdAt).toLocaleString()}
          </div>

          <LinkDetailsActions linkId={link.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleLinkPage;
