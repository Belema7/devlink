"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteLinkAction } from "@/app/actions/link.actions";
import { Button } from "@/components/ui/button";

type LinkDetailsActionsProps = {
  linkId: string;
};

export default function LinkDetailsActions({ linkId }: LinkDetailsActionsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setMessage(null);

    startTransition(async () => {
      const result = await deleteLinkAction(linkId);
      if (!result.success) {
        setMessage(result.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline">
          <Link href={`/links/edit/${linkId}`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
          <Trash2 className="size-4" />
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}
