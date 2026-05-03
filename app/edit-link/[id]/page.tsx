import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";
import { getUserLinkById } from "@/app/actions/link.actions";

export const metadata = {
  title: "Edit Link | DevLinks",
  description: "Update your saved resource details.",
};

type EditLinkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLinkPage({ params }: EditLinkPageProps) {
  const [{ id }, session] = await Promise.all([
    params,
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!session) {
    redirect("/login");
  }

  const link = await getUserLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Edit Resource</h1>
          <p className="mt-2 text-zinc-400">Update the details for "{link.title}".</p>
        </div>
        <LinkForm
          mode="edit"
          linkId={link.id}
          initialValues={{
            title: link.title,
            url: link.url,
            description: link.description,
            isPublic: link.isPublic,
            tags: link.tags.map((t) => t.name),
          }}
        />
      </main>
    </div>
  );
}
