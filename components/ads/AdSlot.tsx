"use client";
// ============================================================
// AdSlot — 再利用可能な広告ユニット
//
// 方針:
//  - shouldRenderUnit() が false（審査中/スロット未設定/dev）なら本番では
//    何も描画しない（空白を残さない）。dev では控えめなプレビューのみ。
//  - 「広告」ラベルを小さく明示（コンテンツ誤認防止）。
//  - reservedMinHeight で読み込み後のレイアウト移動（CLS）を抑える。
//  - 配信されない/失敗してもレイアウトを壊さない。
//  - コンテンツカードと同一デザインにしない・矢印や煽り装飾を付けない。
// ============================================================
import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, getSlotId, shouldRenderUnit, IS_PROD, type AdPlacement } from "@/lib/ads/config";

type AdSlotProps = {
  placement: AdPlacement;
  /** "auto"（レスポンシブ）/ "fluid"（記事内）など */
  format?: string;
  responsive?: boolean;
  className?: string;
  /** CLS抑制のための最小高さ（px） */
  reservedMinHeight?: number;
  /** ラベル文言 */
  label?: "広告" | "Advertisement";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  placement,
  format = "auto",
  responsive = true,
  className = "",
  reservedMinHeight = 100,
  label = "広告",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const render = shouldRenderUnit(placement);
  const slotId = getSlotId(placement);

  useEffect(() => {
    if (!render || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // 配信失敗・AdBlock等でもUIを壊さない
    }
  }, [render]);

  // 本番で出さない場合は何も描画しない（空白を残さない）
  if (!render) {
    // dev のみ、配置確認用の控えめなプレースホルダ
    if (!IS_PROD) {
      return (
        <div
          className={`my-6 flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-900/40 text-[11px] text-slate-400 dark:text-zinc-600 ${className}`}
          style={{ minHeight: reservedMinHeight }}
          aria-hidden
        >
          広告枠プレビュー（{placement} / {slotId ? "slot設定済" : "slot未設定"}）
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`my-6 ${className}`}>
      <div className="mb-1 text-center text-[10px] uppercase tracking-wide text-slate-400 dark:text-zinc-600">
        {label}
      </div>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", minHeight: reservedMinHeight }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
