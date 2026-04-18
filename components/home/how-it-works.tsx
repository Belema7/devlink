import { ArrowRight, Tag, Bookmark, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Bookmark,
    title: "Save links",
    description: "Capture resources as soon as you find them.",
  },
  {
    icon: Tag,
    title: "Organize with tags",
    description: "Group related items into a clean, searchable system.",
  },
  {
    icon: Share2,
    title: "Discover and share",
    description: "Publish great resources to the public feed in one click.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="grid gap-8 rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            From quick capture to community-ready resources.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">
            DevLinks keeps the workflow simple so you can go from idea to organized resource hub without extra overhead.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.title}
                className="border border-zinc-800 bg-zinc-950/60 text-white shadow-none"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-3xl font-semibold text-white/20">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <ArrowRight className="size-4 text-teal-400" />
          Designed to feel lightweight on desktop and mobile.
        </div>
      </div>
    </section>
  );
}
