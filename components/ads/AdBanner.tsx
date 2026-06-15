"use client";
// ========================================
// AdBanner（後方互換ラッパー）
// 旧APIを保持しつつ、内部は新しい AdSlot 基盤に委譲する。
// 既存の <AdBanner slot="sidebar" /> 等はそのまま動作する。
// 新規実装では components/ads/presets.tsx を直接使うこと。
// ========================================
import { AdSlot } from "./AdSlot";
import type { AdPlacement } from "@/lib/ads/config";

type AdBannerProps = {
  slot: "header" | "sidebar" | "in-article" | "footer";
  className?: string;
};

const SLOT_MAP: Record<AdBannerProps["slot"], { placement: AdPlacement; minH: number; responsive: boolean }> = {
  header: { placement: "top", minH: 120, responsive: true },
  sidebar: { placement: "sidebar", minH: 250, responsive: false },
  "in-article": { placement: "inArticle", minH: 120, responsive: true },
  footer: { placement: "bottom", minH: 120, responsive: true },
};

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const cfg = SLOT_MAP[slot];
  return (
    <AdSlot
      placement={cfg.placement}
      reservedMinHeight={cfg.minH}
      responsive={cfg.responsive}
      format={slot === "in-article" ? "fluid" : "auto"}
      className={className}
    />
  );
}
