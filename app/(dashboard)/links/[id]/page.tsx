import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Hash, Sparkles } from "lucide-react";
import { getUserLinkById } from "@/app/actions/link.actions";
import LinkDetailsActions from "@/components/links/link-details-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-guard";

type LinkDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const LinkDetailsPage = async ({ params }: LinkDetailsPageProps) => {
  await requireUser();
  const { id } = await params;
  const link = await getUserLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button asChild variant="ghost" className="rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </Button>

      <Card className="overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100">
        <CardHeader className="space-y-4 border-b border-zinc-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-300">
              <Sparkles className="size-3.5" />
              Link detail
            </span>
            <Badge className="border border-zinc-800 bg-zinc-900/40 text-zinc-300">
              {link.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <CardTitle className="text-3xl text-zinc-50">{link.title}</CardTitle>
          <Link
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            Open resource
            <ExternalLink className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          {link.description ? <p className="text-sm leading-7 text-zinc-300">{link.description}</p> : null}
          <div className="flex flex-wrap gap-2">
            {link.tags.length > 0 ? (
              link.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-300">
                  <Hash className="mr-1 size-3" />
                  {tag.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-zinc-500">No tags</span>
            )}
          </div>
          <LinkDetailsActions linkId={link.id} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100">URL</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">{link.url}</CardContent>
        </Card>
        <Card className="border border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">{link.isPublic ? "Public" : "Private"}</CardContent>
        </Card>
        <Card className="border border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100">Actions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">Edit or delete this resource from your workspace.</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkDetailsPage;
