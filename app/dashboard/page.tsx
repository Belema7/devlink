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
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                transparent 0%,
                transparent 30%,
                rgba(138, 43, 226, 0.22) 50%,
                transparent 70%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                #1a1a2e 0%,
                #24153f 42%,
                #0f0f23 100%
              )
            `,
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 79px,
                rgba(255, 255, 255, 0.05) 80px,
                rgba(255, 255, 255, 0.05) 81px
              ),
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 79px,
                rgba(255, 255, 255, 0.035) 80px,
                rgba(255, 255, 255, 0.035) 81px
              )
            `,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14">
          <section className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">Dashboard</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              Your saved links.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
              Review every link you have added, including public resources and private drafts.
            </p>
          </section>

          <section className="mt-12 space-y-8">
            <div className="rounded-3xl border border-white/10 bg-black/45 px-6 py-6 backdrop-blur-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Your collection</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-100">{links.length} total links</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {publicCount} public and {privateCount} private.
                  </p>
                </div>

                <Button asChild className="w-full rounded-full border border-white/10 bg-white/10 text-zinc-100 hover:bg-white/15 sm:w-auto">
                  <Link href="/add-link">Add Link</Link>
                </Button>
              </div>
            </div>

            {links.length === 0 ? (
              <Card className="border-white/10 bg-black/60">
                <CardHeader>
                  <CardTitle className="text-zinc-100">No links yet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-zinc-300">
                  <p>Add your first link and it will appear here.</p>
                  <Button asChild className="rounded-full border border-white/10 bg-white/10 text-zinc-100 hover:bg-white/15">
                    <Link href="/add-link">Add Link</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {links.map((link) => (
                  <PublicLinkCard key={link.id} link={link} allowVoting />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
