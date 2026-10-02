import { sendGAEvent } from "@next/third-parties/google";

// ============================================================
// SNS Starter Kit LP の計測イベント
//
// 既存の track.ts と同じ方針: GA4 へ送るだけで、例外は絶対に投げない。
// 既存イベント定義（events.ts）とは別ファイルに分け、既存計測へ影響させない。
//
// ★PII禁止: email・コミュニティ説明文・氏名・個人を識別できる値は、
//   型の上でも受け取れないようにしている（許可プロパティは下記5つだけ）。
// ============================================================

export type SnsKitEventName =
  | "starter_lp_view"
  | "starter_hero_engaged"
  | "starter_problem_reached"
  | "starter_transform_reached"
  | "starter_ai_workflow_reached"
  | "starter_features_reached"
  | "starter_price_reached"
  | "starter_reserve_cta_click"
  | "starter_reservation_started"
  | "starter_reservation_completed";

export interface SnsKitEventProps {
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_category: "mobile" | "tablet" | "desktop";
}

export function deviceCategory(): SnsKitEventProps["device_category"] {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

// 同一ページ表示内での重複送信を防ぐ（到達イベントは1回だけ）
const sent = new Set<SnsKitEventName>();
const REPEATABLE: SnsKitEventName[] = ["starter_reserve_cta_click"];

// GA の初期化スクリプト（afterInteractive）より先にページのeffectが走ると、
// sendGAEvent は dataLayer が無いためイベントを黙って捨てる。
// 初期化されるまで待ち行列に積み、準備ができた時点でまとめて送る（最大10秒）。
const pending: [SnsKitEventName, SnsKitEventProps][] = [];
let waitTimer: ReturnType<typeof setInterval> | null = null;

function gaReady(): boolean {
  return Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer);
}

function flush(): void {
  while (pending.length) {
    const [name, props] = pending.shift()!;
    sendGAEvent("event", name, { ...props });
  }
}

export function trackSnsKit(name: SnsKitEventName, props: SnsKitEventProps): void {
  try {
    if (typeof window === "undefined") return;
    if (!REPEATABLE.includes(name)) {
      if (sent.has(name)) return;
      sent.add(name);
    }
    pending.push([name, props]);
    if (gaReady()) return flush();
    if (waitTimer) return;
    const startedAt = Date.now();
    waitTimer = setInterval(() => {
      if (gaReady()) {
        clearInterval(waitTimer!);
        waitTimer = null;
        flush();
      } else if (Date.now() - startedAt > 10_000) {
        // 計測が無効な環境（開発・広告ブロッカー等）。送らずに破棄する。
        clearInterval(waitTimer!);
        waitTimer = null;
        pending.length = 0;
      }
    }, 200);
  } catch (e) {
    console.warn(`[analytics] ${name} send failed:`, e instanceof Error ? e.message : e);
  }
}
