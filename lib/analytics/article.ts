import { sendGAEvent } from "@next/third-parties/google";

// ============================================================
// ブログ記事からの送客の計測（記事 → Mochico / ツール / ほかの記事 / 公式サイト）
//
// 送るのは「どの記事から」「どの種類のリンクへ」「どこへ（パス、外部はホスト名だけ）」だけ。
// 検索語・入力内容・個人情報・クエリ文字列は送らない。
// 「記事閲覧」は GA4 の page_view（自動）で取れるため、ここでは送らない。
// Mochico アプリ内（/mochico/app など）は PrivateAppGuard で GA4 を止めているため、
// 登録・利用開始は GA4 では取れない（LP の mochico_cta_click までが計測の終点）。
// ============================================================

export const ARTICLE_EVENT_REGISTRY = {
  article_link_click: {
    eventName: "article_link_click",
    category: "conversion",
    description:
      "ブログ記事内のリンクの押下。article_slug・link_type（mochico / tool / workspace / blog / official）・link_target（内部はパス、外部はホスト名）・placement（自社サービス枠の top / bottom、本文は body）のみ付与。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
} as const;

export type ArticleLinkType = "mochico" | "tool" | "workspace" | "blog" | "official";

/** リンク先から種類と送る値を決める（送らないリンクは null） */
export function classifyArticleLink(href: string, origin: string, currentPath = ""): { type: ArticleLinkType; target: string } | null {
  let url: URL;
  try {
    url = new URL(href, origin + currentPath);
  } catch {
    return null;
  }
  // 目次などのページ内リンク（同じページの #...）は送らない
  if (url.origin === origin && url.pathname === currentPath) return null;
  if (url.origin !== origin) {
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return { type: "official", target: url.hostname };
  }
  const path = url.pathname;
  if (path === "/mochico" || path.startsWith("/mochico/")) return { type: "mochico", target: path === "/mochico" ? path : "/mochico/*" };
  if (path.startsWith("/tools/")) return { type: "tool", target: path };
  if (path.startsWith("/workspace/")) return { type: "workspace", target: path };
  if (path.startsWith("/blog/")) return { type: "blog", target: path };
  return null;
}

/** 例外は投げない（計測の失敗でリンクの遷移を止めない） */
export function trackArticleLinkClick(articleSlug: string, type: ArticleLinkType, target: string, placement: "top" | "bottom" | "body" = "body"): void {
  try {
    if (typeof window === "undefined") return;
    sendGAEvent("event", "article_link_click", { article_slug: articleSlug, link_type: type, link_target: target, placement, transport_type: "beacon" });
  } catch (e) {
    console.warn("[analytics] article_link_click send failed:", e instanceof Error ? e.message : e);
  }
}
