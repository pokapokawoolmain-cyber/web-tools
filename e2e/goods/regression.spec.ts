// Phase 1 で修正した不具合の回帰テスト
//   R1: 高速連打時に古い状態が後から保存される問題
//   R2: DB 無応答時に約47秒 Loading のままになる問題
import { execSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";
import { goodsCard, login, uniqueEmail } from "./helpers";

test.describe.configure({ mode: "serial" });
// 通信を差し替える（page.route）テストのため Service Worker を無効化（SW 管理下では page.route が一部を捕捉できない: Playwright の仕様）
test.use({ serviceWorkers: "block" });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "回帰テストはスマホ設定で1回だけ実行");
});

const user = uniqueEmail("reg");
let eventPath = "";

async function setupEvent(page: Page) {
  if (eventPath) {
    await login(page, user, eventPath);
    return;
  }
  await login(page, user, "/mochico/events/new");
  await page.getByLabel("イベント名").fill("回帰テスト [TEST]");
  await page.getByRole("button", { name: "作成してグッズを登録" }).click();
  await page.waitForURL(/\/items\/new/);
  const names = ["連打グッズ", "失敗グッズ", "三連打グッズ"];
  for (const [i, name] of names.entries()) {
    await page.getByLabel("商品名").fill(name);
    await page.getByRole("button", { name: "保存して続けて追加" }).click();
    await expect(page.getByText(`このイベントに ${i + 1} 件追加しました`)).toBeVisible();
  }
  eventPath = new URL(page.url()).pathname.replace(/\/items\/new$/, "");
  await page.goto(eventPath);
}

/** ownerships への書き込みを記録し、1本目だけ遅延させる */
async function delayFirstWrite(page: Page, delayMs: number, failFirst = false) {
  const log: { status: string; sentAt: number; doneAt?: number }[] = [];
  await page.route("**/rest/v1/ownerships**", async (route) => {
    const req = route.request();
    if (req.method() !== "POST") return route.continue();
    const body = JSON.parse(req.postData() ?? "{}");
    const entry = { status: (Array.isArray(body) ? body[0] : body).status as string, sentAt: Date.now() } as (typeof log)[number];
    log.push(entry);
    if (log.length === 1) {
      await new Promise((r) => setTimeout(r, delayMs));
      if (failFirst) {
        entry.doneAt = Date.now();
        return route.abort("internetdisconnected");
      }
    }
    await route.continue();
    entry.doneAt = Date.now();
  });
  return log;
}

test("R1: 2連打（1本目の通信が遅い）でも最後のタップが保存される", async ({ page }) => {
  await setupEvent(page);
  const log = await delayFirstWrite(page, 1500);
  const card = goodsCard(page, "連打グッズ");
  await card.click();
  await card.click({ delay: 0 });
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => log.length, { timeout: 8000 }).toBe(2);
  await expect.poll(() => log[1].doneAt, { timeout: 8000 }).toBeTruthy();
  // 2本目は1本目の完了後に送られている（直列化）
  expect(log.map((l) => l.status)).toEqual(["owned", "unowned"]);
  expect(log[1].sentAt).toBeGreaterThanOrEqual(log[0].doneAt!);
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(goodsCard(page, "連打グッズ")).toHaveAttribute("aria-pressed", "false");
});

test("R1: 3連打でも UI と保存値が一致する", async ({ page }) => {
  await setupEvent(page);
  const log = await delayFirstWrite(page, 1200);
  const card = goodsCard(page, "三連打グッズ");
  await card.click();
  await card.click();
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => log.filter((l) => l.doneAt).length, { timeout: 8000 }).toBeGreaterThanOrEqual(2);
  // 中間状態（unowned）を送らずに最新の希望（owned）だけを送る
  await page.waitForTimeout(500);
  expect(log.at(-1)!.status).toBe("owned");
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(goodsCard(page, "三連打グッズ")).toHaveAttribute("aria-pressed", "true");
});

test("R1: 連打中に1本目が失敗しても UI と保存値が一致する", async ({ page }) => {
  await setupEvent(page);
  const log = await delayFirstWrite(page, 1200, true);
  const card = goodsCard(page, "失敗グッズ");
  const clicks: number[] = [];
  for (let i = 0; i < 3; i++) {
    await card.click();
    clicks.push(Date.now());
  }
  await expect(page.getByRole("alert").filter({ hasText: "更新できませんでした" })).toBeVisible({ timeout: 8000 });
  const shown = await card.getAttribute("aria-pressed");
  await page.waitForTimeout(800);
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(goodsCard(page, "失敗グッズ")).toHaveAttribute("aria-pressed", shown!);
  // 失敗後に古い値を自動で送り直さない（失敗後のPOSTは、失敗後にユーザーが押した回数以下）
  const failedAt = log[0].doneAt!;
  expect(log.filter((l) => l.sentAt > failedAt).length).toBeLessThanOrEqual(clicks.filter((c) => c > failedAt).length);
});

test("R2: DB が応答しないとき、Loading のまま待たせずに前回データへ切り替わる", async ({ page }) => {
  test.setTimeout(120_000);
  await setupEvent(page);
  await expect(page.getByRole("progressbar")).toBeVisible();
  await page.waitForTimeout(800); // IndexedDB スナップショット保存（400ms デバウンス）

  const docker = (cmd: string) =>
    execSync(`docker ${cmd}`, { env: { ...process.env, PATH: `/Applications/Docker.app/Contents/Resources/bin:${process.env.PATH}` } });
  docker("stop supabase_rest_toolboxjp-goods");
  try {
    const t0 = Date.now();
    await page.reload();
    await expect(page.getByText("閲覧のみ")).toBeVisible({ timeout: 20_000 });
    const elapsed = Date.now() - t0;
    console.warn(`[R2] fallback shown after ${elapsed}ms`);
    expect(elapsed).toBeLessThan(15_000);
    // 閲覧専用なので切替はできない
    await goodsCard(page, "連打グッズ").click({ force: true }); // aria-disabled のため強制クリック
    await expect(page.getByRole("alert").filter({ hasText: "変更できません" })).toBeVisible();
  } finally {
    docker("start supabase_rest_toolboxjp-goods");
  }
  // 復旧後は通常表示に戻る
  await expect
    .poll(async () => (await fetch("http://127.0.0.1:55321/rest/v1/", { headers: { apikey: "x" } }).catch(() => null))?.status ?? 0, {
      timeout: 30_000,
    })
    .not.toBe(0);
  await page.waitForTimeout(2000);
  await page.reload();
  await expect(page.getByText("閲覧のみ")).toHaveCount(0);
  await expect(page.getByRole("progressbar")).toBeVisible();
});
