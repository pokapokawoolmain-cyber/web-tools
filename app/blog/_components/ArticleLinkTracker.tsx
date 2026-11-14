"use client";

// 記事本文の中のリンクの押下を計測する（記事 → Mochico・ツール・ほかの記事・公式サイト）。
// 見た目は持たない。記事を包むだけで、リンクごとの onClick を書かずに済むようにする。
import { useEffect, useRef, type ReactNode } from "react";
import { classifyArticleLink, trackArticleLinkClick } from "@/lib/analytics/article";

export function ArticleLinkTracker({ slug, children }: { slug: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || !el.contains(a)) return;
      // 目次などのページ内リンク（#...）は classify で除外される
      const hit = classifyArticleLink(a.getAttribute("href") ?? "", window.location.origin, window.location.pathname);
      if (!hit) return;
      const promo = a.closest("[data-promo]")?.getAttribute("data-promo");
      trackArticleLinkClick(slug, hit.type, hit.target, promo === "top" || promo === "bottom" ? promo : "body");
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [slug]);
  return <div ref={ref}>{children}</div>;
}
