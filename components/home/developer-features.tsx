import { Globe, LayoutDashboard, LockKeyhole, SearchCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const developerFeatures = [
  {
    icon: SearchCheck,
    title: "Blazing fast search",
    description: "Filter by title, tag, or visibility without losing your place.",
  },
  {
    icon: LayoutDashboard,
    title: "Clean dashboard UI",
    description: "A focused workspace built to keep saved links readable at a glance.",
  },
  {
    icon: Globe,
    title: "Bookmarking system",
    description: "Save resources for later and revisit the best ones across sessions.",
  },
  {
    icon: LockKeyhole,
    title: "Public/private control",
    description: "Choose what stays personal and what gets shared with the community.",
  },
];

export default function DeveloperFeatures() {
  return (
    <section className="py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">Developer-focused</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
          Sharp tools for builders who care about speed and clarity.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {developerFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title} className="border border-zinc-800 bg-zinc-900/80">
              <CardHeader className="space-y-4">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-lg text-zinc-100">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-zinc-400">
                {feature.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
