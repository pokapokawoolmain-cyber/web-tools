import type { SubsidyNewsItem, NewsCategory } from "@/data/subsidyNews";

export interface RawNewsItem {
  title: string;
  url: string;
  publishedAt?: string;
  summary?: string;
  sourceId: string;
  sourceLabel: string;
  rawCategory?: string;
}

const CATEGORY_PATTERNS: { pattern: RegExp; category: NewsCategory }[] = [
  { pattern: /公募.*開始|受付.*開始|申請.*開始/, category: "公募開始" },
  { pattern: /締切|期限.*迫|〆切/, category: "締切間近" },
  { pattern: /公募.*終了|受付.*終了|締め切り/, category: "公募終了" },
  { pattern: /採択.*結果|採択.*発表|不採択/, category: "採択結果" },
  { pattern: /新設|創設|新たに|新制度/, category: "新制度" },
  { pattern: /変更|改正|見直し|拡充|引き上げ|拡大/, category: "制度変更" },
  { pattern: /重要|緊急|速報/, category: "重要" },
];

export function inferCategory(title: string, rawCategory?: string): NewsCategory {
  if (rawCategory) {
    const matched = CATEGORY_PATTERNS.find((p) => p.pattern.test(rawCategory));
    if (matched) return matched.category;
  }
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(title)) return category;
  }
  return "重要";
}

export function normalizeDate(raw?: string): string {
  if (!raw) return new Date().toISOString().split("T")[0];
  const d = new Date(raw);
  if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
  return d.toISOString().split("T")[0];
}

export function extractTags(title: string, summary = ""): string[] {
  const text = `${title} ${summary}`;
  const keywords: Record<string, string[]> = {
    "IT導入": ["IT", "DX", "デジタル"],
    "ものづくり": ["製造", "設備"],
    "省力化": ["ロボット", "自動化", "省人化"],
    "採用": ["雇用", "採用", "正社員"],
    "賃上げ": ["賃金", "最低賃金", "給与"],
    "研修": ["人材育成", "OFF-JT", "スキル"],
    "事業承継": ["承継", "後継者", "M&A"],
    "新規事業": ["新事業", "多角化", "新分野"],
  };
  const tags: string[] = [];
  for (const [tag, patterns] of Object.entries(keywords)) {
    if (patterns.some((p) => text.includes(p)) || text.includes(tag)) {
      tags.push(tag);
    }
  }
  return [...new Set(tags)];
}

let idCounter = 0;
export function normalizeRawItem(raw: RawNewsItem): SubsidyNewsItem {
  idCounter++;
  const publishedAt = normalizeDate(raw.publishedAt);
  const now = new Date().toISOString().split("T")[0];
  const dayDiff = (new Date(now).getTime() - new Date(publishedAt).getTime()) / 86400000;

  return {
    id: `fetched-${raw.sourceId}-${idCounter}`,
    title: raw.title,
    summary: raw.summary ?? "",
    category: inferCategory(raw.title, raw.rawCategory),
    region: "全国",
    publishedAt,
    officialUrl: raw.url,
    sourceLabel: raw.sourceLabel,
    isNew: dayDiff <= 7,
    isImportant: /重要|緊急|速報|締切/.test(raw.title),
    tags: extractTags(raw.title, raw.summary),
  };
}
