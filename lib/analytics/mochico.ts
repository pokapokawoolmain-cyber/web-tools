import { sendGAEvent } from "@next/third-parties/google";

// ============================================================
// Mochico 公開LP（/mochico）の計測。
//
// 対象は公開LPだけ。アプリ内部（/mochico/app・events・settings・login・auth・s・account・internal）
// では PrivateAppGuard が GA4 を無効化しており、その方針は変えない。
// このファイルの関数も LP の CTA からしか呼ばない。
//
// 送るのは「どの CTA が押されたか（placement）」だけ。個人情報・共有トークン・
// 入力内容は受け取れない signature にしてある。
//
// events.ts / track.ts とは別ファイルにしている（Product #01 の未統合作業と
// 同じファイルを触らないため）。統合時に EVENT_REGISTRY へ寄せてよい。
// ============================================================

/** hero = ファーストビュー / final = ページ末尾の CTA */
export type MochicoCtaPlacement = "hero" | "final";

export const MOCHICO_EVENT_REGISTRY = {
  mochico_cta_click: {
    eventName: "mochico_cta_click",
    category: "conversion",
    description:
      "Mochico 公開LPの「Mochicoをはじめる」（/mochico/app へのリンク）の押下。placement のみ付与。遷移直前に送るため、ごく一部は送信前にページが閉じて欠ける可能性がある。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
} as const;

/** 例外は投げない（計測の失敗で CTA の遷移を止めない）。 */
export function trackMochicoCtaClick(placement: MochicoCtaPlacement): void {
  try {
    if (typeof window === "undefined") return;
    sendGAEvent("event", "mochico_cta_click", { placement, transport_type: "beacon" });
  } catch (e) {
    console.warn("[analytics] mochico_cta_click send failed:", e instanceof Error ? e.message : e);
  }
}
