import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";

export const metadata = {
  title: "Add New Link | DevLinks",
  description: "Save a new resource to your collection.",
};

export default async function AddLinkPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Add New Resource</h1>
          <p className="mt-2 text-zinc-400">Share a useful link with the community or save it for yourself.</p>
        </div>
        <LinkForm mode="create" />
      </main>
    </div>
  );
}
