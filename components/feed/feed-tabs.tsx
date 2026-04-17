"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildFeedHref } from "@/lib/feed-filters";

type FeedTabsProps = {
  activeTab: "all" | "trending";
};

export default function FeedTabs({ activeTab }: FeedTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTab = (tab: "all" | "trending") => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("sort");
    } else {
      params.set("sort", tab);
    }

    router.replace(buildFeedHref(pathname, params), { scroll: false });
  };

  const tabs = [
    { key: "all" as const, label: "All" },
    { key: "trending" as const, label: "Trending" },
  ];

  return (
    <div className="inline-flex rounded-full border border-[#d8d0bc] bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTab(tab.key)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              active
                ? "bg-[#f5e27f] text-[#201c13] shadow-[0_10px_24px_rgba(245,226,127,0.18)]"
                : "text-zinc-600 hover:bg-[#f6f1e6] hover:text-[#1f1c17]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
