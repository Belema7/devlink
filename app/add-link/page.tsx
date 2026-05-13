import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";
import { requireUser } from "@/lib/auth-guard";

const AddLinkPage = async () => {
  await requireUser();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="min-h-screen bg-white px-5 py-12 text-black sm:px-6">
        <div className="mx-auto max-w-7xl px-0 py-0">
          <LinkForm />
        </div>
      </main>
    </div>
  );
};

export default AddLinkPage;
