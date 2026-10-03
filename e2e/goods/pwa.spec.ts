// ホーム画面追加の案内（PWA Onboarding）の E2E
//   ※ iPhone / Android の実機・本物のインストール確認画面は自動テストでは扱えない。
//     ここでは UA と、ブラウザが発行するのと同じ形の beforeinstallprompt イベントで分岐と状態管理を検証する。
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { login, logout, uniqueEmail, E2E_BASE, E2E_BASE_IP } from "./helpers";

test.describe.configure({ mode: "serial" });

const UA = {
  iosSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
  iosChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.0.0 Mobile/15E148 Safari/604.1",
  iosLine:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/15.10.0",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
};

async function phone(browser: Browser, ua: string, extra: Record<string, unknown> = {}) {
  return browser.newContext({
    baseURL: E2E_BASE,
    userAgent: ua,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    ...extra,
  });
}
const card = (p: Page) => p.getByRole("region", { name: "ホーム画面に追加" });
const state = (p: Page) =>
  p.evaluate(() => {
    const k = Object.keys(localStorage).find((x) => x.startsWith("mochico.a2hs.v1:"));
    return k ? JSON.parse(localStorage.getItem(k)!) : null;
  });

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "UA を個別に指定するため1回だけ実行");
});

test("iPhone Safari: ログイン後のマイイベントで案内 → 3ステップのガイド → 30日抑制", async ({ browser }) => {
  const ctx = await phone(browser, UA.iosSafari);
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-ios"));
  await expect(card(p)).toBeHidden(); // 表示まで少し待つ（最初の操作を邪魔しない）
  await expect(card(p)).toBeVisible({ timeout: 5000 });
  await expect(card(p)).toContainText("次回からアプリのようにすぐ開けます");
  await expect(p.getByText(/PWA|manifest|standalone|インストールプロンプト/)).toHaveCount(0); // 専門用語を出さない
  await card(p).getByRole("button", { name: "ホーム画面に追加" }).click();
  const guide = p.getByRole("dialog", { name: "ホーム画面に追加する方法" });
  await expect(guide).toBeVisible();
  await expect(guide.locator("ol > li")).toHaveCount(3);
  await expect(guide).toContainText("共有");
  await expect(guide).toContainText("ホーム画面に追加");
  await expect(guide).toContainText("右上の「追加」");
  await guide.getByRole("button", { name: "わかりました" }).click();
  await expect(card(p)).toBeHidden();
  const s = await state(p);
  expect(s.state).toBe("snoozed");
  expect(s.until - Date.now()).toBeGreaterThan(29 * 864e5);
  await p.reload();
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden();
  await ctx.close();
});

test("あとで → 7日間は再表示しない → 期限が過ぎたら再表示 / 今後表示しない / 設定から再確認", async ({ browser }) => {
  const ctx = await phone(browser, UA.iosSafari);
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-later"));
  await card(p).getByRole("button", { name: "あとで" }).click();
  const s = await state(p);
  expect(s.state).toBe("snoozed");
  expect(Math.round((s.until - Date.now()) / 864e5)).toBe(7);
  await p.reload();
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden();
  // 7日経過を再現
  await p.evaluate(() => {
    const k = Object.keys(localStorage).find((x) => x.startsWith("mochico.a2hs.v1:"))!;
    localStorage.setItem(k, JSON.stringify({ state: "snoozed", until: Date.now() - 1000 }));
  });
  await p.reload();
  await expect(card(p)).toBeVisible({ timeout: 5000 });
  await card(p).getByRole("button", { name: "今後表示しない" }).click();
  expect((await state(p)).state).toBe("never");
  await p.reload();
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden();
  // 設定からはいつでも見られる
  await p.goto("/mochico/settings");
  await p.getByRole("button", { name: "追加方法を見る" }).click();
  await expect(p.getByRole("dialog", { name: "ホーム画面に追加する方法" })).toBeVisible();
  await ctx.close();
});

test("ホーム画面から起動中（standalone）は案内を出さない", async ({ browser }) => {
  const ctx = await phone(browser, UA.iosSafari);
  await ctx.addInitScript(() => Object.defineProperty(navigator, "standalone", { get: () => true }));
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-sa"));
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden();
  await p.goto("/mochico/settings");
  await expect(p.getByText("いまはホーム画面のアイコンから開いています")).toBeVisible();
  await ctx.close();
});

test("PC では案内を出さない", async ({ browser }) => {
  // プロジェクト設定（iPhone）を引き継がないよう、PC の UA・タッチなしを明示する
  const ctx = await browser.newContext({ baseURL: E2E_BASE, viewport: { width: 1440, height: 900 }, userAgent: UA.macChrome, isMobile: false, hasTouch: false, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-pc"));
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden();
  await ctx.close();
});

test("iPhone の Chrome / LINE 内ブラウザでは、その環境に合った案内を出す", async ({ browser }) => {
  for (const [ua, expectText] of [
    [UA.iosChrome, "アドレスバーの右側"],
    [UA.iosLine, "LINE などのアプリの中"],
  ] as const) {
    const ctx = await phone(browser, ua);
    const p = await ctx.newPage();
    await login(p, uniqueEmail("pwa-ua"));
    await card(p).getByRole("button", { name: "ホーム画面に追加" }).click({ timeout: 8000 });
    await expect(p.getByRole("dialog", { name: "ホーム画面に追加する方法" })).toContainText(expectText);
    await ctx.close();
  }
});

async function fireInstallPrompt(p: Page, outcome: "accepted" | "dismissed") {
  await p.evaluate((o) => {
    const e = new Event("beforeinstallprompt", { cancelable: true }) as Event & Record<string, unknown>;
    e.prompt = () => {
      (window as unknown as { __prompted: number }).__prompted = ((window as unknown as { __prompted?: number }).__prompted ?? 0) + 1;
      return Promise.resolve();
    };
    e.userChoice = Promise.resolve({ outcome: o, platform: "web" });
    window.dispatchEvent(e);
  }, outcome);
}

test("Android Chrome: 標準のインストール確認が出せるようになってから案内 → タップで直接確認画面（2タップ）", async ({ browser }) => {
  const ctx = await phone(browser, UA.androidChrome);
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-and"));
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden(); // 確認画面を出せない間は、メニューを探させる案内を出さない
  await fireInstallPrompt(p, "accepted");
  await expect(card(p)).toBeVisible({ timeout: 5000 });
  await card(p).getByRole("button", { name: "ホーム画面に追加" }).click();
  expect(await p.evaluate(() => (window as unknown as { __prompted?: number }).__prompted)).toBe(1); // 標準の確認画面を1回だけ呼ぶ
  await expect(p.getByRole("dialog", { name: "ホーム画面に追加する方法" })).toHaveCount(0); // ガイドは出さない
  await expect(p.getByText("ホーム画面に追加しました")).toBeVisible();
  expect((await state(p)).state).toBe("done");
  await ctx.close();
});

test("Android Chrome: 確認画面でキャンセル → 7日間抑制", async ({ browser }) => {
  const ctx = await phone(browser, UA.androidChrome);
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-and2"));
  await fireInstallPrompt(p, "dismissed");
  await card(p).getByRole("button", { name: "ホーム画面に追加" }).click({ timeout: 5000 });
  await expect(card(p)).toBeHidden();
  const s = await state(p);
  expect(s.state).toBe("snoozed");
  expect(Math.round((s.until - Date.now()) / 864e5)).toBe(7);
  await ctx.close();
});

test("ユーザー切り替え: 案内の状態はユーザーごと / ログアウト・再ログインで抑制は維持", async ({ browser }) => {
  const a = uniqueEmail("pwa-sw-a");
  const b = uniqueEmail("pwa-sw-b");
  const ctx = await phone(browser, UA.iosSafari);
  const p = await ctx.newPage();
  await login(p, a);
  await card(p).getByRole("button", { name: "あとで" }).click();
  await logout(p);
  await login(p, b);
  await expect(card(p)).toBeVisible({ timeout: 5000 }); // B にはまだ案内していない
  await logout(p);
  await login(p, a);
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden(); // A は「あとで」のまま
  await ctx.close();
});

test("共有URLからログインした直後は案内を出さず、マイイベントで出す", async ({ browser }) => {
  const owner = await phone(browser, UA.iosSafari);
  const op = await owner.newPage();
  await login(op, uniqueEmail("pwa-own"), "/mochico/events/new");
  await op.getByLabel("イベント名").fill("PWA共有テスト");
  await op.getByRole("button", { name: "作成してグッズを登録" }).click();
  await op.waitForURL(/\/items\/new/);
  const eventPath = new URL(op.url()).pathname.replace(/\/items\/new.*$/, "");
  await op.goto(eventPath);
  await op.getByRole("button", { name: "共有" }).click();
  await op.getByRole("button", { name: "共有リンクを作成" }).click();
  const url = await op.getByLabel("共有URL").inputValue();

  const ctx = await phone(browser, UA.iosSafari);
  const p = await ctx.newPage();
  await p.goto(url);
  await p.getByRole("link", { name: "ログインして自分の管理に追加" }).click();
  await p.waitForURL(/login/);
  const { fetchOtp } = await import("./helpers");
  const email = uniqueEmail("pwa-join");
  await p.getByLabel("メールアドレス").fill(email);
  const t = Date.now();
  await p.getByRole("button", { name: "ログインコードを送る" }).click();
  await p.getByLabel("ログインコード").fill(await fetchOtp(email, t));
  await p.getByRole("button", { name: "ログイン", exact: true }).click();
  await p.waitForURL(new RegExp(`${eventPath}\\?added=1$`), { timeout: 20_000 });
  await p.waitForTimeout(2500);
  await expect(card(p)).toBeHidden(); // 追加直後の操作を邪魔しない
  await p.goto("/mochico/events");
  await expect(card(p)).toBeVisible({ timeout: 5000 });
  await owner.close();
  await ctx.close();
});

test("マニフェスト: /mochico/app を起点・/mochico を範囲に、名前は Mochico", async ({ request }) => {
  const res = await request.get(`${E2E_BASE_IP}/mochico/manifest.webmanifest`);
  const m = await res.json();
  expect(m.start_url).toBe("/mochico/app");
  expect(m.scope).toBe("/mochico");
  expect(m.display).toBe("standalone");
  expect(m.short_name).toBe("Mochico");
  expect(m.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  const top = await (await request.get(`${E2E_BASE_IP}/`)).text();
  expect(top).toContain('href="/manifest.json"'); // ToolBox 本体のマニフェストは従来どおり
  expect(top).not.toContain("mochico-sw.js");
});

test("Service Worker: オフライン時は案内ページだけを返し、個人データは何もキャッシュしない", async ({ browser }) => {
  const ctx: BrowserContext = await browser.newContext({ baseURL: E2E_BASE, viewport: { width: 1280, height: 800 }, userAgent: UA.macChrome, isMobile: false, hasTouch: false });
  const p = await ctx.newPage();
  await login(p, uniqueEmail("pwa-sw"));
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  const info = await p.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration("/mochico/app");
    const keys = await caches.keys();
    const entries = (await Promise.all(keys.map(async (k) => (await (await caches.open(k)).keys()).map((r) => new URL(r.url).pathname)))).flat();
    return { scope: reg ? new URL(reg.scope).pathname : null, controlled: !!navigator.serviceWorker.controller, keys, entries };
  });
  expect(info.scope).toBe("/mochico");
  expect(info.controlled).toBe(true);
  expect(info.keys).toEqual(["mochico-offline-v1"]);
  expect(info.entries).toEqual(["/mochico-offline.html"]); // キャッシュはこの1枚だけ
  // ToolBox 本体のページは SW の管理外
  const top = await ctx.newPage();
  await top.goto("/");
  expect(await top.evaluate(() => !!navigator.serviceWorker.controller)).toBe(false);
  await top.close();

  await ctx.setOffline(true);
  await p.goto("/mochico/events").catch(() => undefined);
  await expect(p.getByRole("heading", { name: "インターネットに接続されていません" })).toBeVisible();
  expect(await p.content()).not.toContain("@example.test");
  await ctx.setOffline(false);
  await p.getByRole("button", { name: "再読み込み" }).click();
  await expect(p.getByRole("heading", { name: "マイイベント" }).or(p.getByText("最初のイベントを作りましょう"))).toBeVisible();
  await ctx.close();
});
