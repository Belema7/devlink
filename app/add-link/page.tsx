import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";
import { requireUser } from "@/lib/auth-guard";

const AddLinkPage = async () => {
  await requireUser();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 px-6 py-14 text-zinc-100">
        <div className="mx-auto max-w-7xl px-0 py-0">
          <LinkForm />
        </div>
      </main>
    </>
  );
};

export default AddLinkPage;
