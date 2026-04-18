import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Profile</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50">Account details</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Keep your account information in a quiet, readable place.
        </p>
      </section>

      <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-50">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          <p>{user.email}</p>
          <p className="text-zinc-500">Manage your workspace from the dashboard or add new links anytime.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
            <Button asChild className="border border-zinc-800 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              <Link href="/links/new">Add link</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
