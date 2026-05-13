import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import { getUserLinks } from "@/app/actions/link.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-guard";

export const metadata = {
  title: "Dashboard",
  description: "View your public and private DevLinks.",
};

export default async function DashboardPage() {
  await requireUser();
  const links = await getUserLinks();
  const publicCount = links.filter((link) => link.isPublic).length;
  const privateCount = links.length - publicCount;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6">
          <section className="max-w-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
            <p className="inline-flex border-2 border-black bg-muted px-3 py-1 font-display text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">Dashboard</p>
            <h1 className="mt-5 font-heading text-4xl font-black tracking-normal text-black sm:text-5xl">
              Your saved links.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base font-medium leading-7 text-muted-foreground">
              Review every link you have added, including public resources and private drafts.
            </p>
          </section>

          <section className="mt-12 space-y-8">
            <div className="border-2 border-black bg-muted px-6 py-6 shadow-[6px_6px_0px_#000]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-display text-xs font-black uppercase text-black">Your collection</p>
                  <p className="mt-2 font-heading text-2xl font-black text-black">{links.length} total links</p>
                  <p className="mt-2 text-sm font-bold text-muted-foreground">
                    {publicCount} public and {privateCount} private.
                  </p>
                </div>

                <Button asChild className="w-full sm:w-auto">
                  <Link href="/add-link">Add Link</Link>
                </Button>
              </div>
            </div>

            {links.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">No links yet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm font-medium text-muted-foreground">
                  <p>Add your first link and it will appear here.</p>
                  <Button asChild>
                    <Link href="/add-link">Add Link</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {links.map((link) => (
                  <PublicLinkCard key={link.id} link={link} isAuthenticated />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
