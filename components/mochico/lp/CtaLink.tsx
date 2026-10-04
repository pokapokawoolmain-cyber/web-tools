"use client";
// ============================================================
// 「Mochicoをはじめる」リンク。押下を GA4 に1件送ってから通常のページ遷移をする
// （遷移を止めない・preventDefault しない。アプリ側の計測停止は従来どおり効く）。
// ============================================================
import type { ReactNode } from "react";
import { trackMochicoCtaClick, type MochicoCtaPlacement } from "@/lib/analytics/mochico";

export function CtaLink({
  placement,
  className,
  children,
}: {
  placement: MochicoCtaPlacement;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href="/mochico/app" className={className} onClick={() => trackMochicoCtaClick(placement)}>
      {children}
    </a>
  );
}
