"use client";

import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export type VisibilityFilter = "all" | "public" | "private";

type DashboardFilterBarProps = {
  tagFilter: string;
  visibility: VisibilityFilter;
  availableTags: string[];
  onTagFilterChange: (value: string) => void;
  onVisibilityChange: (value: VisibilityFilter) => void;
};

export default function DashboardFilterBar({
  tagFilter,
  visibility,
  availableTags,
  onTagFilterChange,
  onVisibilityChange,
}: DashboardFilterBarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-1">
        <p className="text-sm font-medium">Filter by tag</p>
        <Input
          list="dashboard-tags"
          placeholder="Type a tag (e.g. react)"
          value={tagFilter}
          onChange={(event) => onTagFilterChange(event.target.value)}
        />
        <datalist id="dashboard-tags">
          {availableTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">Visibility</p>
        <NativeSelect
          value={visibility}
          onChange={(event) => onVisibilityChange(event.target.value as VisibilityFilter)}
        >
          <NativeSelectOption value="all">All</NativeSelectOption>
          <NativeSelectOption value="public">Public</NativeSelectOption>
          <NativeSelectOption value="private">Private</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  );
}
