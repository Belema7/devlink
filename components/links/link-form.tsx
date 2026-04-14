"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, type CreateLinkInput } from "@/lib/validators/link.schema";
import { createLinkAction } from "@/app/actions/link.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const parseTags = (value: string) =>
  [...new Set(value.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

const linkFormSchema = createLinkSchema.omit({ tags: true }).extend({
  isPublic: z.boolean(),
  tagsInput: z.string().optional(),
});

type LinkFormValues = z.input<typeof linkFormSchema>;

export default function LinkForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      isPublic: false,
      tagsInput: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const tags = parseTags(values.tagsInput ?? "");
    const payload: CreateLinkInput = {
      title: values.title,
      url: values.url,
      description: values.description?.trim() ? values.description.trim() : undefined,
      isPublic: values.isPublic,
      tags,
    };

    const result = await createLinkAction(payload);

    if (!result.success) {
      setSubmitError(result.message);

      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(result.fieldErrors)) {
          if (!messages?.length) continue;
          if (fieldName === "tags") {
            form.setError("tagsInput", { message: messages[0] });
            continue;
          }
          if (fieldName in values) {
            form.setError(fieldName as keyof LinkFormValues, { message: messages[0] });
          }
        }
      }
      return;
    }

    setSubmitSuccess(result.message);
    form.reset();
    router.refresh();
  });

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-xl border border-border/60">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          Add New Link
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Save useful resources and organize them with tags.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <FieldGroup>
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title" className="text-sm font-semibold">
                Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                placeholder="e.g. React docs"
                className="h-11"
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            {/* URL */}
            <Field>
              <FieldLabel htmlFor="url" className="text-sm font-semibold">
                URL <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                className="h-11"
                {...form.register("url")}
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </FieldLabel>
              <Textarea
                id="description"
                placeholder="A short note about why this link matters."
                className="min-h-[108px] resize-y"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            {/* Tags */}
            <Field>
              <FieldLabel htmlFor="tagsInput" className="text-sm font-semibold">
                Tags
              </FieldLabel>
              <Input
                id="tagsInput"
                placeholder="frontend, react, docs"
                className="h-11"
                {...form.register("tagsInput")}
              />
              <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                Separate with commas • Tags are automatically lowercased
              </p>
              <FieldError errors={[form.formState.errors.tagsInput]} />
            </Field>

            {/* Visibility */}
            <Field>
              <FieldLabel htmlFor="isPublic" className="text-sm font-semibold">
                Visibility
              </FieldLabel>
              <Controller
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <NativeSelect
                    id="isPublic"
                    value={field.value ? "public" : "private"}
                    onChange={(event) => field.onChange(event.target.value === "public")}
                    className="h-11"
                  >
                    <NativeSelectOption value="private">Private • Only you can see it</NativeSelectOption>
                    <NativeSelectOption value="public">Public • Anyone with the link can view</NativeSelectOption>
                  </NativeSelect>
                )}
              />
              <FieldError errors={[form.formState.errors.isPublic]} />
            </Field>
          </FieldGroup>

          {/* Status messages */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span className="text-base">⚠️</span>
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              <span className="text-base">✅</span>
              {submitSuccess}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 text-base font-semibold shadow-sm"
          >
            {form.formState.isSubmitting ? (
              <>
                <span className="mr-2 animate-spin">⟳</span>
                Saving link…
              </>
            ) : (
              "Save Link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
