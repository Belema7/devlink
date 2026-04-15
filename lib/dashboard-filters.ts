export type DashboardVisibility = "all" | "public" | "private";

export const normalizeSearchQuery = (value?: string | null) => value?.trim() ?? "";

export const normalizeTagList = (value?: string | string[] | null) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return [...new Set(values.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
};

export const isDashboardVisibility = (value?: string | null): value is DashboardVisibility =>
  value === "all" || value === "public" || value === "private";

export const buildDashboardHref = (pathname: string, params: URLSearchParams) => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};
