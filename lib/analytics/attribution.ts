// ============================================================
// Revenue Experiment 流入元判定
//
// GA4の標準アトリビューションに頼らず、Revenue LP独自の意味で
// 「note経由か」「既存ツール内導線経由か」を判定する。
// ToolBoxJPには現状ログイン機構が無く、判定はすべてクライアント側の
// URL・documentから行う（サーバー側の記録は持たない）。
// ============================================================
import type { RevenueEntryPoint } from "./events";

export interface RevenueAttribution {
  entryPoint: RevenueEntryPoint;
  /** internal_tool なら遷移元ツールID、note ならnote記事スラッグ等の補足情報。 */
  sourceDetail: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  /** document.referrer をホスト名まで丸めたもの。長いクエリ付きURLをそのまま送らない。 */
  referrerHost: string | null;
}

const SEARCH_ENGINE_HOSTS = ["google.", "bing.", "yahoo.", "duckduckgo.", "search.yahoo."];

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * 既存ツール内バナーからLPへ遷移する際に付与するクエリ。
 * referrer判定より確実（同一オリジン内遷移はreferrerが常に残るとは限らないため）。
 */
export function buildInternalToolLinkParams(toolId: string): string {
  return `src=tool:${toolId}`;
}

/** LPページのマウント時に一度だけ呼ぶ。searchParamsはuseSearchParams()の戻り値。 */
export function resolveRevenueAttribution(searchParams: URLSearchParams): RevenueAttribution {
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");
  const src = searchParams.get("src"); // 例: "tool:image-compress"

  const referrer = typeof document !== "undefined" ? document.referrer : "";
  const referrerHost = referrer ? hostnameOf(referrer) : null;

  let entryPoint: RevenueEntryPoint;
  let sourceDetail: string | null = null;

  if (src?.startsWith("tool:")) {
    entryPoint = "internal_tool";
    sourceDetail = src.slice("tool:".length);
  } else if (utmSource?.toLowerCase() === "note" || referrerHost?.includes("note.com")) {
    entryPoint = "note";
    sourceDetail = utmCampaign ?? referrerHost;
  } else if (!referrer && !utmSource) {
    entryPoint = "direct";
  } else if (referrerHost && SEARCH_ENGINE_HOSTS.some((h) => referrerHost.includes(h))) {
    entryPoint = "organic";
  } else {
    entryPoint = "other";
    sourceDetail = utmSource ?? referrerHost;
  }

  return { entryPoint, sourceDetail, utmSource, utmMedium, utmCampaign, referrerHost };
}
