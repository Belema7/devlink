export type FeedSort = "all" | "trending";

export const normalizeFeedSearchQuery = (value?: string | null) => value?.trim() ?? "";

export const normalizeFeedTag = (value?: string | null) => value?.trim().toLowerCase() ?? "";

export const isFeedSort = (value?: string | null): value is FeedSort =>
  value === "all" || value === "trending";

export const buildFeedHref = (pathname: string, params: URLSearchParams) => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};
