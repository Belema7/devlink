import Link from "next/link";
import { ArrowUpRight, Layers3, Sparkles, Tags, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    title: "Organized tags",
    description: "Group links into clean collections with a quiet, high-contrast surface.",
    icon: Tags,
  },
  {
    title: "Calm overview",
    description: "Keep your workspace readable with subtle cards, rounded corners, and teal accents.",
    icon: PanelTop,
  },
  {
    title: "Fast actions",
    description: "Jump into your dashboard, add a link, or refine filters without losing context.",
    icon: Layers3,
  },
];

const LinksPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-0 py-0">
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-300">
              <Sparkles className="size-3.5" />
              Links workspace
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">A darker, calmer dashboard surface for your links.</h1>
              <p className="max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                The palette comes straight from the reference: muted slate panels, soft borders, and teal highlights that make the interface feel focused instead of noisy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="border border-zinc-800 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
                <Link href="/links/new">Add a link</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-zinc-800 text-zinc-200">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-medium text-zinc-50">{card.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LinksPage;
