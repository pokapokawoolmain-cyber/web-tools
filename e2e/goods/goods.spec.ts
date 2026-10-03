// /goods の主要フロー E2E（指示書 §15 の UI 側項目）
import { expect, test } from "@playwright/test";
import { goodsCard, login, logout, uniqueEmail } from "./helpers";

test.describe.configure({ mode: "serial" });
// 通信を差し替える（page.route）テストのため Service Worker を無効化（SW 管理下では page.route が一部を捕捉できない: Playwright の仕様）
test.use({ serviceWorkers: "block" });

const userA = uniqueEmail("a");
const userB = uniqueEmail("b");
let eventUrl = "";

test("A: イベント作成 → 10商品登録 → 3つ取得済み → reload / 再ログインで保持", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "作成フローはスマホ幅で1回だけ実行");
  await login(page, userA);

  // 空状態
  await expect(page.getByText("最初のイベントを作りましょう")).toBeVisible();
  await page.getByRole("link", { name: "イベントを作成" }).first().click();

  // 必須チェック
  await page.getByRole("button", { name: "作成してグッズを登録" }).click();
  await expect(page.getByText("イベント名を入力してください")).toBeVisible();

  await page.getByLabel("イベント名").fill("E2E ライブ 2026");
  await page.getByLabel("開始日").fill("2026-12-01");
  await page.getByRole("button", { name: "作成してグッズを登録" }).click();
  await page.waitForURL(/\/items\/new\?first=1/);
  eventUrl = page.url().replace(/\/items\/new.*$/, "");

  // 10商品（9件は「続けて追加」、最後は「一覧へ」）
  for (let i = 1; i <= 10; i++) {
    await page.getByLabel("商品名").fill(`E2Eグッズ${i}`);
    await page.getByLabel("価格（円）").fill(String(1000 + i * 100));
    if (i < 10) {
      await page.getByRole("button", { name: "保存して続けて追加" }).click();
      await expect(page.getByText(`このイベントに ${i} 件追加しました`)).toBeVisible();
    } else {
      await page.getByRole("button", { name: "保存して一覧へ" }).click();
    }
  }
  await page.waitForURL(eventUrl);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 0 / 10（0%）");

  // 3つ取得済み（確認ダイアログなしの1タップ）
  for (const n of [1, 2, 3]) {
    const card = goodsCard(page, `E2Eグッズ${n}`);
    await card.click();
    await expect(card).toHaveAttribute("aria-pressed", "true");
  }
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 3 / 10（30%）");

  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 3 / 10（30%）");
  await expect(goodsCard(page, "E2Eグッズ1")).toHaveAttribute("aria-pressed", "true");

  await logout(page);
  await login(page, userA, new URL(eventUrl).pathname);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 3 / 10（30%）");
});

test("A: 誤タップは「元に戻す」で取り消せる", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userA, new URL(eventUrl).pathname);
  const card = goodsCard(page, "E2Eグッズ5");
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "元に戻す" }).click();
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(goodsCard(page, "E2Eグッズ5")).toHaveAttribute("aria-pressed", "false");
});

test("A: 通信失敗時はロールバックしてエラーを表示", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userA, new URL(eventUrl).pathname);
  await page.route("**/rest/v1/ownerships**", (route) => route.abort("internetdisconnected"));
  const card = goodsCard(page, "E2Eグッズ6");
  await card.click();
  await expect(page.getByRole("alert").filter({ hasText: "更新できませんでした" })).toBeVisible();
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 3 / 10（30%）");
});

test("A: フィルター（取得済み / 未取得）", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userA, new URL(eventUrl).pathname);
  await page.getByRole("tab", { name: /取得済み/ }).click();
  await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(3);
  await expect(page.locator('button[aria-pressed="false"]')).toHaveCount(0);
  await page.getByRole("tab", { name: /未取得/ }).click();
  await expect(page.locator('button[aria-pressed="false"]')).toHaveCount(7);
});

test("A: 不正な画像は理由を表示して止める", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userA, `${new URL(eventUrl).pathname}/items/new`);
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: "fake.jpg", mimeType: "image/jpeg", buffer: Buffer.from("not an image") });
  await expect(page.getByRole("alert").filter({ hasText: "画像を読み込めませんでした" })).toBeVisible();
  await input.setInputFiles({ name: "x.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg/>") });
  await expect(page.getByRole("alert").filter({ hasText: "SVG形式は使えません" })).toBeVisible();
});

test("B: A のイベント・編集画面にアクセスできない（存在も明かさない）", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userB);
  const path = new URL(eventUrl).pathname;
  await page.goto(path);
  await expect(page.getByText("ページが見つかりません")).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveCount(0);
  await page.goto(`${path}/edit`);
  await expect(page.getByText("ページが見つかりません")).toBeVisible();
  await page.goto(`${path}/items/new`);
  await expect(page.getByText("ページが見つかりません")).toBeVisible();
});

test("PC幅: グリッドが5列で表示される", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  // プロジェクトごとにワーカーが分かれるため、このテストは自分でデータを作る
  await login(page, uniqueEmail("desk"), "/mochico/events/new");
  await page.getByLabel("イベント名").fill("PC幅テスト");
  await page.getByRole("button", { name: "作成してグッズを登録" }).click();
  await page.waitForURL(/\/items\/new/);
  await page.getByLabel("商品名").fill("PCグッズ");
  await page.getByRole("button", { name: "保存して一覧へ" }).click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  const cols = await page.locator("main ul.grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(cols).toBe(5);
});

test("スマホ幅: グリッドが2列・横スクロールなし", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await login(page, userA, new URL(eventUrl).pathname);
  const cols = await page.locator("main ul.grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(cols).toBe(2);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
