"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { createTag, deleteTag, updateTag, type UserTag } from "@/app/actions/tag.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TagCard } from "@/components/tags/tag-card";
import { TagDialog } from "@/components/tags/tag-dialog";

type TagsManagementProps = {
  initialTags: UserTag[];
};

export function TagsManagement({ initialTags }: TagsManagementProps) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<UserTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<UserTag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const visibleTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return tags;
    }

    return tags.filter((tag) => tag.name.includes(normalizedQuery));
  }, [query, tags]);

  const handleCreate = async (name: string) => {
    const result = await createTag(name);

    if (result.success) {
      setMessage(result.message);
      router.refresh();
    }

    return result;
  };

  const handleUpdate = async (name: string) => {
    if (!editingTag) {
      return { success: false, message: "No tag selected." };
    }

    const result = await updateTag(editingTag.id, name);

    if (result.success) {
      setMessage(result.message);
      setEditingTag(null);
      router.refresh();
    }

    return result;
  };

  const handleDelete = async () => {
    if (!deletingTag) {
      return;
    }

    const tagToDelete = deletingTag;
    setMessage(null);
    setIsDeleting(true);

    try {
      const result = await deleteTag(tagToDelete.id);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setTags((current) => current.filter((tag) => tag.id !== tagToDelete.id));
      setDeletingTag(null);
      setMessage(result.message);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  const featuredTag = tags[0] ?? null;

  return (
    <>
      <div className="space-y-4 rounded-[28px] border border-white/5 bg-[#232530] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex size-8 items-center justify-center rounded-2xl bg-[#22c6a4]/10 text-[#22c6a4] ring-1 ring-inset ring-[#22c6a4]/20">
                <Search className="size-4" />
              </div>
              <p className="text-sm font-medium text-zinc-200">Search your tags</p>
            </div>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by tag name..."
              className="h-10 border-white/10 bg-[#2b2d37] text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="size-4" />
              New Tag
            </Button>
          </div>
        </div>

        {message ? <p className="text-sm text-zinc-400">{message}</p> : null}

        {visibleTags.length === 0 ? (
          <Empty className="border border-dashed border-white/10 bg-[#2b2d37] py-14">
            <EmptyHeader>
              <EmptyTitle className="text-zinc-100">
                {query ? "No tags match this search" : "No tags yet"}
              </EmptyTitle>
              <EmptyDescription className="text-zinc-400">
                {query
                  ? "Try a different tag name or clear the search."
                  : "Add links with tags to populate this panel. You can also create a reusable tag for later."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {!query ? (
                <Button className="bg-[#22c6a4] text-[#07221d] hover:bg-[#2ad0af]" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="size-4" />
                  New Tag
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Showing {visibleTags.length} {visibleTags.length === 1 ? "tag" : "tags"}
              </p>
              {featuredTag ? (
                <p className="text-xs text-zinc-500">
                  Highlighted tag: <span className="text-[#6fe7cf]">{featuredTag.name}</span>
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTags.map((tag, index) => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  isFeatured={index === 0}
                  onEdit={setEditingTag}
                  onDelete={setDeletingTag}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <TagDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Tag"
        description="Create a reusable tag name for future links. It will show here once it is attached to one of your links."
        submitLabel="Create Tag"
        onSubmit={handleCreate}
      />

      <TagDialog
        open={Boolean(editingTag)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTag(null);
          }
        }}
        title="Edit Tag"
        description="Rename this tag. The new name is normalized to lowercase before saving."
        submitLabel="Save Changes"
        initialValue={editingTag?.name ?? ""}
        onSubmit={handleUpdate}
      />

      <AlertDialog open={Boolean(deletingTag)} onOpenChange={(open) => !open && setDeletingTag(null)}>
        <AlertDialogContent className="border-white/5 bg-[#232530] text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-50">Delete tag?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This removes the tag from your dashboard and disconnects it from your links. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/5 bg-[#1f2129]">
            <AlertDialogCancel className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              {isDeleting ? "Deleting..." : "Delete Tag"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
