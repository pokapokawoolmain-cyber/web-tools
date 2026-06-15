"use client";
// ============================================================
// 配置プリセット（AdSlot の薄いラッパー）
// 用途ごとに余白・format・予約高さを最適化したもの。
// すべて AdSlot 経由なので、未設定/審査中は本番で何も出さない。
// ============================================================
import { AdSlot } from "./AdSlot";

/** 記事内（本文の自然な区切り）。format=fluid 推奨 */
export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="inArticle"
      format="fluid"
      reservedMinHeight={120}
      className={`mx-auto max-w-2xl ${className}`}
    />
  );
}

/** ツール操作の「十分下」に置く後置き広告 */
export function AfterToolAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="content"
      reservedMinHeight={120}
      className={`mx-auto max-w-3xl ${className}`}
    />
  );
}

/** カテゴリ/一覧のフィード区切り（カードに混ぜない・独立帯） */
export function CategoryFeedAd({ className = "" }: { className?: string }) {
  return <AdSlot placement="content" reservedMinHeight={120} className={className} />;
}

/** デスクトップのサイドバー（モバイルでは出さない側で制御） */
export function DesktopSidebarAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="sidebar"
      responsive={false}
      reservedMinHeight={250}
      className={`hidden lg:block ${className}`}
    />
  );
}

/** ページ下部のレスポンシブ広告 */
export function BottomAd({ className = "" }: { className?: string }) {
  return <AdSlot placement="bottom" reservedMinHeight={120} className={className} />;
}
