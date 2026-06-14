import { SUBSIDY_NEWS, type SubsidyNewsItem } from "@/data/subsidyNews";
import { normalizeRawItem, type RawNewsItem } from "./normalize";

export interface FetchResult {
  items: SubsidyNewsItem[];
  fetchedAt: string;
  sourceId: string;
  error?: string;
}

// Swap this implementation for a real RSS/HTTP fetch in production.
// The interface (FetchResult) is stable.
async function fetchFromSource(_sourceId: string): Promise<FetchResult> {
  return {
    items: [],
    fetchedAt: new Date().toISOString(),
    sourceId: _sourceId,
  };
}

// Normalize arbitrary raw items (used by future scrapers/API adapters)
export function processRawItems(
  raw: RawNewsItem[],
  sourceId: string,
): FetchResult {
  return {
    items: raw.map(normalizeRawItem),
    fetchedAt: new Date().toISOString(),
    sourceId,
  };
}

// Primary export: returns static data now, swap for live fetch later
export async function getAllNews(): Promise<SubsidyNewsItem[]> {
  // Future: const results = await Promise.allSettled(getEnabledSources().map(s => fetchFromSource(s.id)));
  // For now: return curated static data, newest first
  return [...SUBSIDY_NEWS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export { fetchFromSource };
