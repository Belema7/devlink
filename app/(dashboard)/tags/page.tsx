import { getUserTags } from "@/app/actions/tag.actions";
import { Card, CardContent } from "@/components/ui/card";
import { TagsManagement } from "@/components/tags/tags-management";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tags as TagsIcon } from "lucide-react";

const TagsPage = async () => {
  const tags = await getUserTags();
  const totalLinksTagged = tags.reduce((sum, tag) => sum + tag.linkCount, 0);
  const mostUsedTag = tags[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-900/80 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.35fr_0.9fr] lg:p-6">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
                <Sparkles className="size-3.5" />
                Tag control panel
              </span>
              <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-400">
                Manage tags attached to your links
              </span>
            </div>

            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                Your Tags
              </h1>
              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                View every tag used by your links, jump straight into filtered dashboard views, and keep the labels tidy from one calm control panel.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="border border-teal-500/20 bg-teal-500/10 text-teal-300">
                {tags.length} {tags.length === 1 ? "tag" : "tags"}
              </Badge>
              <Badge variant="outline" className="border-zinc-800 bg-zinc-950/60 text-zinc-300">
                {totalLinksTagged} linked uses
              </Badge>
              {mostUsedTag ? (
                <Badge variant="outline" className="border-zinc-800 bg-zinc-950/60 text-zinc-300">
                  Top tag: {mostUsedTag.name} ({mostUsedTag.linkCount})
                </Badge>
              ) : null}
            </div>
          </div>

          <Card className="border-zinc-800 bg-zinc-900/80 text-zinc-100 shadow-sm">
            <CardContent className="grid gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-inset ring-teal-500/20">
                  <TagsIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">Filter-ready tags</p>
                  <p className="text-sm text-zinc-400">Click any badge to jump back into the dashboard with that tag applied.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-zinc-800 bg-zinc-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Most used</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-50">
                    {mostUsedTag ? mostUsedTag.name : "No tags yet"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {mostUsedTag ? `${mostUsedTag.linkCount} links use this tag` : "Add a link to start building your tag library."}
                  </p>
                </div>
                <div className="rounded-[20px] border border-zinc-800 bg-zinc-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Status</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-50">
                    {tags.length > 0 ? "Ready" : "Empty"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {tags.length > 0
                      ? "Edit and delete actions are available for tags owned by your links."
                      : "No tags are attached to your links yet."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <TagsManagement initialTags={tags} />
    </div>
  );
};

export default TagsPage;
