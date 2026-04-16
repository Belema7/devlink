import { Bookmark, Tags, Search, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Bookmark,
    title: "Save useful dev links",
    description: "Capture docs, tools, tutorials, and snippets in one place.",
  },
  {
    icon: Tags,
    title: "Organize with tags",
    description: "Group resources into simple collections that are easy to scan.",
  },
  {
    icon: Search,
    title: "Fast search",
    description: "Find the right resource quickly, even as your library grows.",
  },
  {
    icon: UsersRound,
    title: "Share with community",
    description: "Publish links to the feed so others can discover them.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8e6f52]">Value proposition</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Built to keep your resources organized and easy to ship.
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-base">
          Everything stays focused, readable, and designed for developers who want speed without losing structure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              className="group border border-[#dcd4c1] bg-[#f9f5ec] shadow-[0_16px_36px_rgba(30,27,22,0.06)] transition-transform duration-200 hover:-translate-y-1"
            >
              <CardHeader className="space-y-4">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f]">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-lg text-zinc-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-zinc-600">
                {feature.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
