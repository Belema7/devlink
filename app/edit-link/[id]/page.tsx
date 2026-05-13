import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";
import { getUserLinkById } from "@/app/actions/link.actions";
import { requireUser } from "@/lib/auth-guard";

type EditLinkPageProps = {
  params: Promise<{ id: string }>;
};

const EditLinkPage = async ({ params }: EditLinkPageProps) => {
  await requireUser();

  const { id } = await params;
  const link = await getUserLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-5 py-12 text-black sm:px-6">
        <div className="mx-auto max-w-7xl px-0 py-0">
          <LinkForm
            mode="edit"
            linkId={link.id}
            initialValues={{
              title: link.title,
              url: link.url,
              description: link.description,
              isPublic: link.isPublic,
              tags: link.tags.map((tag) => tag.name),
            }}
          />
        </div>
      </main>
    </>
  );
};

export default EditLinkPage;
