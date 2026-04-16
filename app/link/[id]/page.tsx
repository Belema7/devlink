import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ExternalLink,
  Hash,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import UpvoteToggleButton from "@/components/upvote-toggle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getPublicLinkById } from "@/lib/public-links";
import { headers } from "next/headers";

type PublicLinkDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const PublicLinkDetailsPage = async ({ params }: PublicLinkDetailsPageProps) => {
  const [{ id }, session] = await Promise.all([params, auth.api.getSession({ headers: await headers() })]);
  const link = await getPublicLinkById(id);

  if (!link) {
    notFound();
  }

  const publishedAt = new Date(link.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" className="rounded-full text-zinc-600 hover:bg-black/5 hover:text-zinc-900">
            <Link href="/feed">
              <ArrowLeft className="size-4" />
              Back to feed
            </Link>
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-[#d8d0bc] bg-[#f9f5ec] px-3 py-1 text-xs font-medium text-zinc-700">
              Public resource
            </span>
            <span className="rounded-full border border-[#d8d0bc] bg-[#f9f5ec] px-3 py-1 text-xs font-medium text-zinc-700">
              Shared by {link.createdBy}
            </span>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden border border-[#d8d0bc] bg-[#242220] text-white shadow-[0_28px_80px_rgba(0,0,0,0.2)]">
            <CardHeader className="space-y-5 border-b border-white/10 px-6 py-8 md:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f5e27f]/20 bg-[#f5e27f]/10 px-3 py-1 text-xs font-medium text-[#f9f0b6]">
                  <Sparkles className="size-3.5" />
                  Public feed detail
                </span>
                <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                  {link.voteCount} votes
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8beab]">
                  Shared by {link.createdBy}
                </p>
                <CardTitle className="max-w-4xl text-3xl leading-tight text-white md:text-5xl">
                  {link.title}
                </CardTitle>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f5e27f] transition-all hover:bg-white/10 hover:text-[#f9f0b6]"
                >
                  Open resource
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-6 py-8 md:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    <BarChart3 className="size-3.5 text-[#f5e27f]" />
                    Votes
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-white">{link.voteCount}</p>
                  <p className="mt-1 text-sm text-zinc-400">Community support</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    <ShieldCheck className="size-3.5 text-[#f5e27f]" />
                    Visibility
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-white">Public</p>
                  <p className="mt-1 text-sm text-zinc-400">Visible in the feed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    <Calendar className="size-3.5 text-[#f5e27f]" />
                    Published
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{publishedAt}</p>
                  <p className="mt-1 text-sm text-zinc-400">Added to DevLinks</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Hash className="size-4 text-[#f5e27f]" />
                  Description
                </div>
                <p className="max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                  {link.description?.trim() ? link.description : "No description provided."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Hash className="size-4 text-[#f5e27f]" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {link.tags.length > 0 ? (
                    link.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/5 px-3 py-1 text-zinc-200"
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-400">No tags</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-2">
                <UpvoteToggleButton
                  linkId={link.id}
                  initialVoteCount={link.voteCount}
                  initialHasVoted={link.hasVoted}
                  allowVoting={Boolean(session?.user)}
                />

                <Button asChild className="rounded-full bg-[#f5e27f] text-[#201c13] hover:bg-[#f8eb9b]">
                  <Link href={link.url} target="_blank" rel="noreferrer">
                    Visit Resource
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_18px_40px_rgba(30,27,22,0.08)]">
              <CardHeader className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e6f52]">
                  Resource summary
                </p>
                <CardTitle className="text-xl text-zinc-900">Quick at a glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[#ded6c2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">URL</p>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700"
                  >
                    {link.url}
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#ded6c2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Author</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">{link.createdBy}</p>
                </div>

                <div className="rounded-2xl border border-[#ded6c2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Status</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">
                    {session?.user ? "Voting enabled" : "Sign in to vote"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#d8d0bc] bg-[#f9f5ec] shadow-[0_18px_40px_rgba(30,27,22,0.08)]">
              <CardHeader className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e6f52]">
                  Related insight
                </p>
                <CardTitle className="text-xl text-zinc-900">Why this page feels better</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-zinc-600">
                <p>
                  The detail view now uses the same warm, high-contrast palette as the home page and feed, with clearer information hierarchy and stronger action buttons.
                </p>
                <p>
                  It keeps the content readable on mobile, but still gives the resource enough room to feel like a real product detail page on desktop.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
};

export default PublicLinkDetailsPage;
