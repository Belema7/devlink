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
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Link</CardTitle>
        <CardDescription>Save useful resources and organize them with tags.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" placeholder="e.g. React docs" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input id="url" placeholder="https://example.com" {...form.register("url")} />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
              <Textarea
                id="description"
                placeholder="A short note about why this link matters."
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="tagsInput">Tags</FieldLabel>
              <Input
                id="tagsInput"
                placeholder="frontend, react, docs"
                {...form.register("tagsInput")}
              />
              <p className="text-xs text-muted-foreground">
                Use commas to separate tags. Tags are normalized to lowercase.
              </p>
              <FieldError errors={[form.formState.errors.tagsInput]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="isPublic">Visibility</FieldLabel>
              <Controller
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <NativeSelect
                    id="isPublic"
                    value={field.value ? "public" : "private"}
                    onChange={(event) => field.onChange(event.target.value === "public")}
                  >
                    <NativeSelectOption value="private">Private</NativeSelectOption>
                    <NativeSelectOption value="public">Public</NativeSelectOption>
                  </NativeSelect>
                )}
              />
              <FieldError errors={[form.formState.errors.isPublic]} />
            </Field>
          </FieldGroup>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          {submitSuccess ? <p className="text-sm text-emerald-600">{submitSuccess}</p> : null}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
