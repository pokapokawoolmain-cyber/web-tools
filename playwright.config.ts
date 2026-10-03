// /goods の E2E テスト設定（ローカル Supabase + 本番ビルドに対して実行）
//
// 実行手順:
//   1. supabase-goods でローカル Supabase を起動（supabase start --workdir supabase-goods）
//   2. npm run build
//   3. npm run goods:e2e
// 本番DBには接続しない（e2e/goods/helpers.ts が URL を検査して中止する）。
import { defineConfig, devices } from "@playwright/test";

// 他プロジェクトの開発サーバー（3200 等）と衝突しないよう専用ポート。GOODS_E2E_PORT で変更可
export const PORT = Number(process.env.GOODS_E2E_PORT ?? 3210);

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // 追加ダウンロード不要のため、インストール済みの Chrome を使う（プロファイルは使い捨て）
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", channel: "chrome" } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // -H 127.0.0.1: ブラウザ（localhost）とサーバーの認識するホストを意図的にずらし、
    // nextUrl.origin 依存のリダイレクト不具合（LAN モードで発生）を検出できるようにする
    command: `npx next start -H 127.0.0.1 -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}/mochico/login`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
