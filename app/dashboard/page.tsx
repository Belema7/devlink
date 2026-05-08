import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PublicLinkCard from "@/components/PublicLinkCard";
import { getUserLinks } from "@/app/actions/link.actions";
import { BGPattern } from "@/components/ui/bg-pattern";
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
    <div className="warm-library-theme min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="warm-library-shell relative isolate min-h-screen overflow-hidden text-foreground">
        <BGPattern
          aria-hidden="true"
          variant="grid"
          mask="fade-y"
          size={40}
          fill="color-mix(in srgb, var(--primary) 22%, transparent)"
          className="pointer-events-none z-0 opacity-25"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14">
          <section className="max-w-3xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary">Dashboard</p>
            <h1 className="mt-5 font-heading text-4xl font-medium tracking-normal text-foreground sm:text-5xl">
              Your saved links.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-7 text-muted-foreground">
              Review every link you have added, including public resources and private drafts.
            </p>
          </section>

          <section className="mt-12 space-y-8">
            <div className="ornate-frame border border-border bg-card/80 px-6 py-6 backdrop-blur-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Your collection</p>
                  <p className="mt-2 font-heading text-2xl font-medium text-foreground">{links.length} total links</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {publicCount} public and {privateCount} private.
                  </p>
                </div>

                <Button asChild className="w-full sm:w-auto">
                  <Link href="/add-link">Add Link</Link>
                </Button>
              </div>
            </div>

            {links.length === 0 ? (
              <Card className="corner-flourish border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">No links yet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
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
