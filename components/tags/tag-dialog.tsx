"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { tagSchema } from "@/lib/validators/tag.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  initialValue?: string;
  onSubmit: (name: string) => Promise<{ success: boolean; message: string }>;
};

const clientTagSchema = z.object({
  name: tagSchema.shape.name,
});

export function TagDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  initialValue = "",
  onSubmit,
}: TagDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
    }
  }, [initialValue, open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = clientTagSchema.safeParse({ name: value });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid tag name.");
      return;
    }

    setIsPending(true);

    void (async () => {
      try {
        const result = await onSubmit(parsed.data.name);

        if (!result.success) {
          setError(result.message);
          return;
        }

        onOpenChange(false);
        setValue("");
      } finally {
        setIsPending(false);
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/5 bg-[#232530] text-zinc-100 sm:max-w-md">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-zinc-50">{title}</DialogTitle>
            <DialogDescription className="text-zinc-400">{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="tag-name" className="text-zinc-200">
              Tag name
            </Label>
            <Input
              id="tag-name"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="react"
              className="border-white/10 bg-[#2b2d37] text-zinc-100 placeholder:text-zinc-500"
              autoComplete="off"
              autoFocus
            />
            <p className="text-xs text-zinc-500">Names are normalized to lowercase and trimmed before saving.</p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter className="border-white/5 bg-[#1f2129] px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#22c6a4] text-[#07221d] hover:bg-[#2ad0af]" disabled={isPending}>
              {isPending ? "Saving..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
