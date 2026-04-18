import { notFound } from "next/navigation";
import LinkForm from "@/components/links/link-form";
import { getUserLinkById } from "@/app/actions/link.actions";

type EditLinkPageProps = {
  params: Promise<{ id: string }>;
};

const EditLinkPage = async ({ params }: EditLinkPageProps) => {
  const { id } = await params;
  const link = await getUserLinkById(id);

  if (!link) {
    notFound();
  }

  return (
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
  );
};

export default EditLinkPage;
