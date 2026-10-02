// ============================================================
// SNS Starter Kit LP — 流入元（クライアント専用）
//
// 着地時のURLから UTM を読み取り、sessionStorage に保持する。
// → ページ内のアンカー移動・再読み込み（UTMが消えたURL）でも同じ値を使える。
// source は src パラメータ、無ければ参照元を大分類にしたもの（URLそのものは送らない）。
// ============================================================

export interface SnsKitAttribution {
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

const KEY = "sns-kit-attribution";
const SOCIAL_HOSTS = ["x.com", "twitter.com", "t.co", "instagram.com", "threads.net", "facebook.com", "note.com", "youtube.com", "tiktok.com", "bsky.app"];
const SEARCH_HOSTS = ["google.", "bing.", "yahoo.", "duckduckgo."];

function clip(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim().slice(0, 100);
  return t || null;
}

function classifyReferrer(): string {
  try {
    if (!document.referrer) return "direct";
    const host = new URL(document.referrer).hostname;
    if (host === window.location.hostname) return "internal";
    if (SEARCH_HOSTS.some((h) => host.includes(h))) return "search";
    if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

let cached: SnsKitAttribution | null = null;

export function getSnsKitAttribution(): SnsKitAttribution {
  if (cached) return cached;
  const empty: SnsKitAttribution = { source: null, utmSource: null, utmMedium: null, utmCampaign: null };
  if (typeof window === "undefined") return empty;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: SnsKitAttribution = {
    source: clip(params.get("src")),
    utmSource: clip(params.get("utm_source")),
    utmMedium: clip(params.get("utm_medium")),
    utmCampaign: clip(params.get("utm_campaign")),
  };
  const hasUrlValues = Object.values(fromUrl).some(Boolean);

  let stored: SnsKitAttribution | null = null;
  try {
    const s = sessionStorage.getItem(KEY);
    if (s) stored = JSON.parse(s) as SnsKitAttribution;
  } catch {
    stored = null;
  }

  // URLに値があれば最新の着地として優先。無ければ同一セッションの保持値。
  const result: SnsKitAttribution = hasUrlValues
    ? { ...fromUrl, source: fromUrl.source ?? classifyReferrer() }
    : stored ?? { ...empty, source: classifyReferrer() };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(result));
  } catch {
    // プライベートブラウズ等で保存できなくても計測・送信は続ける
  }
  cached = result;
  return result;
}
