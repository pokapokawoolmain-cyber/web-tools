// Phase 1 で修正した不具合の回帰テスト
//   R1: 高速連打時に古い状態が後から保存される問題
//   R2: DB 無応答時に約47秒 Loading のままになる問題
import { execSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";
import { adminClient, goodsCard, login, uniqueEmail } from "./helpers";

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
  const names = ["連打グッズ", "失敗グッズ", "三連打グッズ", "逆転グッズ", "連続グッズ"];
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

/** ownerships への書き込みを記録し、n 本目（0始まり）を delayOf(n) ミリ秒遅らせる */
async function recordWrites(page: Page, delayOf: (n: number) => number) {
  const log: { status: string; sentAt: number; doneAt?: number }[] = [];
  await page.route("**/rest/v1/ownerships**", async (route) => {
    const req = route.request();
    if (req.method() !== "POST") return route.continue();
    const body = JSON.parse(req.postData() ?? "{}");
    const entry = { status: (Array.isArray(body) ? body[0] : body).status as string, sentAt: Date.now() } as (typeof log)[number];
    const n = log.push(entry) - 1;
    const d = delayOf(n);
    if (d > 0) await new Promise((r) => setTimeout(r, d));
    await route.continue();
    entry.doneAt = Date.now();
  });
  return log;
}

/** すべての書き込みが完了し、1秒間新しい書き込みが無い状態まで待つ */
async function settled(page: Page, log: { doneAt?: number }[]) {
  let last = -1;
  await expect
    .poll(
      async () => {
        const n = log.length;
        const done = log.every((l) => l.doneAt);
        const stable = n === last && done;
        last = n;
        if (!stable) await page.waitForTimeout(1000);
        return stable;
      },
      { timeout: 20_000, intervals: [100] }
    )
    .toBe(true);
}

/** DB に保存されている取得状況（行が無ければ unowned） */
async function savedStatus(name: string): Promise<string> {
  const admin = await adminClient();
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const uid = users.users.find((u) => u.email === user)!.id;
  const { data: g } = await admin.from("goods").select("id").eq("event_id", eventPath.split("/").pop()!).eq("name", name).single();
  const { data: o } = await admin.from("ownerships").select("status").eq("user_id", uid).eq("goods_id", g!.id).maybeSingle();
  return o?.status ?? "unowned";
}

/** 書き込みが重ならない（前の書き込みの完了後に次を送る＝応答順序が逆転しない） */
function expectSerialized(log: { sentAt: number; doneAt?: number }[]) {
  for (let i = 1; i < log.length; i++) expect(log[i].sentAt).toBeGreaterThanOrEqual(log[i - 1].doneAt!);
}

/** n 回タップ後の期待値（未取得/取得済みの切り替え） */
const afterTaps = (before: string | null, n: number) => ((before === "true") !== (n % 2 === 1) ? "owned" : "unowned");

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

// 3連打（1本目の通信が遅い）: 最終的な表示と DB の保存値が一致し、期待どおり（3回 = 切り替わる）であること。
// 送信回数は検証しない: 通信中に希望が「取得済み → 未取得 → 取得済み」と戻った場合、1本目の完了時点で
// 保存値と希望が一致するため2本目は送らない（意図どおり）。タップの間隔次第で 1〜3 本になる。
test("R1: 3連打でも UI と保存値が一致する", async ({ page }) => {
  await setupEvent(page);
  const card = goodsCard(page, "三連打グッズ");
  const before = await card.getAttribute("aria-pressed");
  const log = await recordWrites(page, (n) => (n === 0 ? 1200 : 0));
  for (let i = 0; i < 3; i++) await card.click();
  const expected = afterTaps(before, 3);
  await expect(card).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
  await settled(page, log);
  expect(log.length).toBeGreaterThanOrEqual(1);
  expectSerialized(log);
  expect(log.at(-1)!.status).toBe(expected); // 最後に送った値 = 最終的な希望
  expect(await savedStatus("三連打グッズ")).toBe(expected);
  await expect(card).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(goodsCard(page, "三連打グッズ")).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
});

// 応答順序の逆転: 先に送った書き込みほど遅く返る設定（1500ms → 900ms → 300ms → 即時）で、
// 間をあけてタップして複数の書き込みを発生させる。直列化により古い応答が新しい値を上書きしない
test("R1: 応答が遅い順に返る設定でも、最後の操作が保存され UI と一致する", async ({ page }) => {
  await setupEvent(page);
  const card = goodsCard(page, "逆転グッズ");
  const before = await card.getAttribute("aria-pressed");
  const log = await recordWrites(page, (n) => [1500, 900, 300][n] ?? 0);
  const taps = 4;
  for (let i = 0; i < taps; i++) {
    await card.click();
    await page.waitForTimeout(700); // 1本目の通信中・完了後の両方にタップが入る
  }
  const expected = afterTaps(before, taps);
  await settled(page, log);
  expect(log.length).toBeGreaterThanOrEqual(2); // 間隔をあけたので複数の書き込みが発生している（逆転の条件が成立）
  expectSerialized(log);
  expect(log.at(-1)!.status).toBe(expected);
  await expect(card).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
  expect(await savedStatus("逆転グッズ")).toBe(expected);
  await page.unroute("**/rest/v1/ownerships**");
  await page.reload();
  await expect(goodsCard(page, "逆転グッズ")).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
});

// 短時間の連続操作: 毎回ばらばらの遅延（50〜400ms）で、5回連打 → 4回連打。どちらも最終状態が一致
test("R1: 短時間に5回・4回連打しても、最終的な表示と保存値が一致する", async ({ page }) => {
  await setupEvent(page);
  const card = goodsCard(page, "連続グッズ");
  const delays = [400, 50, 250, 120, 380, 60, 300, 90, 200, 350];
  for (const taps of [5, 4]) {
    const before = await card.getAttribute("aria-pressed");
    const log = await recordWrites(page, (n) => delays[n % delays.length]);
    for (let i = 0; i < taps; i++) await card.click();
    const expected = afterTaps(before, taps);
    await expect(card).toHaveAttribute("aria-pressed", expected === "owned" ? "true" : "false");
    await settled(page, log);
    expectSerialized(log);
    if (log.length) expect(log.at(-1)!.status).toBe(expected);
    expect(await savedStatus("連続グッズ")).toBe(expected);
    await page.unroute("**/rest/v1/ownerships**");
  }
  await page.reload();
  const final = await savedStatus("連続グッズ");
  await expect(goodsCard(page, "連続グッズ")).toHaveAttribute("aria-pressed", final === "owned" ? "true" : "false");
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
