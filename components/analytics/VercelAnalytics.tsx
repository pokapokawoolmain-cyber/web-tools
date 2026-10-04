"use client";
// ============================================================
// Vercel Analytics（共通レイアウトで1回だけ）
//   Mochico アプリ内部のページビューは送らない（個人データ・識別子を計測へ渡さない）。
// ============================================================
import { Analytics } from "@vercel/analytics/next";
import { isMochicoPrivatePath } from "@/lib/mochico/private-paths";

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (isMochicoPrivatePath(new URL(event.url).pathname)) return null;
        } catch {
          return null;
        }
        return event;
      }}
    />
  );
}
