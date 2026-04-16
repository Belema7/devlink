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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="overflow-hidden rounded-[28px] border border-white/5 bg-[#232530] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22c6a4]/20 bg-[#22c6a4]/10 px-3 py-1 text-xs font-medium text-[#6fe7cf]">
              <Sparkles className="size-3.5" />
              Links workspace
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                A darker, calmer dashboard surface for your links.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                The palette comes straight from the reference: muted slate panels, soft borders, and teal highlights that make the interface feel focused instead of noisy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-[#22c6a4] text-[#07221d] shadow-[0_0_24px_rgba(34,198,164,0.2)] hover:bg-[#2ad0af]">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                <Link href="/links/new">Add a link</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="rounded-[24px] border border-white/5 bg-[#2b2d37] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#22c6a4]/10 text-[#22c6a4] ring-1 ring-inset ring-[#22c6a4]/20">
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

export default LinksPage





