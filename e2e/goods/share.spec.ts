// Phase 2 共有機能の E2E（Product Lead 指定の FLOW 1〜12）
//   A = オーナー / B = 共有リンクから参加 / C = 連打確認用 / anonymous = 未ログイン
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { adminClient, fetchOtp, goodsCard, login, uniqueEmail, E2E_BASE } from "./helpers";

test.describe.configure({ mode: "serial" });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "共有フローはスマホ設定で1回だけ実行");
});

const emailA = uniqueEmail("share-a");
const emailB = uniqueEmail("share-b");
const emailC = uniqueEmail("share-c");
let shareUrl = "";
let token = "";
let eventPath = "";
let ctxA: BrowserContext, ctxB: BrowserContext;
let pageA: Page, pageB: Page;

async function newMobileContext(browser: Browser, extra: Record<string, unknown> = {}) {
  const { devices } = await import("@playwright/test");
  return browser.newContext({ ...devices["iPhone 13"], baseURL: E2E_BASE, ...extra });
}

/** 共有ページの CTA から遷移したログイン画面でログインする（ページ遷移は呼び出し側で待つ） */
async function loginHere(page: Page, email: string) {
  await page.getByLabel("メールアドレス").fill(email);
  const sentAt = Date.now();
  await page.getByRole("button", { name: "ログインコードを送る" }).click();
  await expect(page.getByLabel("ログインコード")).toBeVisible();
  await page.getByLabel("ログインコード").fill(await fetchOtp(email, sentAt));
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
}

test.beforeAll(async ({ browser }) => {
  ctxA = await newMobileContext(browser, { permissions: ["clipboard-read", "clipboard-write"] });
  ctxB = await newMobileContext(browser);
  pageA = await ctxA.newPage();
  pageB = await ctxB.newPage();
});
test.afterAll(async () => {
  await ctxA?.close();
  await ctxB?.close();
});

test("FLOW 1: A がイベントを開き、共有リンクを作成してコピーする", async () => {
  await login(pageA, emailA, "/mochico/events/new");
  await pageA.getByLabel("イベント名").fill("共有E2Eライブ [TEST]");
  await pageA.getByRole("button", { name: "作成してグッズを登録" }).click();
  await pageA.waitForURL(/\/items\/new/);
  for (const [i, name] of ["Goods A", "Goods B", "Goods C"].entries()) {
    await pageA.getByLabel("商品名").fill(name);
    await pageA.getByLabel("価格（円）").fill(String((i + 1) * 1000));
    await pageA.getByRole("button", { name: "保存して続けて追加" }).click();
    await expect(pageA.getByText(`このイベントに ${i + 1} 件追加しました`)).toBeVisible();
  }
  eventPath = new URL(pageA.url()).pathname.replace(/\/items\/new$/, "");
  await pageA.goto(eventPath);

  await pageA.getByRole("button", { name: "共有" }).click();
  const dialog = pageA.getByRole("dialog", { name: "グッズリストを共有" });
  await expect(dialog.getByRole("button", { name: "共有リンクを作成" })).toBeVisible();
  await dialog.getByRole("button", { name: "共有リンクを作成" }).click();
  const urlInput = dialog.getByLabel("共有URL");
  await expect(urlInput).toHaveValue(/\/mochico\/s\/[A-Za-z0-9_-]{43}$/);
  shareUrl = await urlInput.inputValue();
  token = shareUrl.split("/").pop()!;
  expect(shareUrl).not.toContain(eventPath.split("/").pop()!); // event ID をURLに使わない
  await expect(dialog.getByText("期限なし")).toBeVisible();
  await dialog.getByRole("button", { name: "コピー" }).click();
  await expect(pageA.getByText("共有リンクをコピーしました")).toBeVisible();
  expect(await pageA.evaluate(() => navigator.clipboard.readText())).toBe(shareUrl);
  await dialog.getByRole("button", { name: "閉じる" }).first().click();
});

test("FLOW 2: 未ログインで共有URLを開く → イベント・グッズが見え、所持状態は見えない", async ({ browser }) => {
  // 先に A が Goods A を取得済みにしておく（漏れないことを確認するため）
  await goodsCard(pageA, "Goods A").click();
  await expect(goodsCard(pageA, "Goods A")).toHaveAttribute("aria-pressed", "true");

  const ctx = await newMobileContext(browser);
  const page = await ctx.newPage();
  await page.goto(shareUrl);
  await page.waitForURL(/\/mochico\/s\/view$/);
  expect(page.url()).not.toContain(token); // 表示中の URL にトークンが残らない（解析・Referer 対策）
  await expect(page.getByRole("heading", { name: "共有E2Eライブ [TEST]" })).toBeVisible();
  for (const n of ["Goods A", "Goods B", "Goods C"]) await expect(page.getByText(n, { exact: true }).first()).toBeVisible();
  await expect(page.getByText("¥1,000")).toBeVisible();
  await expect(page.locator("[aria-pressed]")).toHaveCount(0);
  await expect(page.getByText(/取得済み|未取得/)).toHaveCount(0);
  const html = await page.content();
  expect(html).not.toContain(token);
  expect(html).not.toContain(emailA);
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
  expect(await page.locator('meta[name="referrer"]').getAttribute("content")).toBe("no-referrer");
  await expect(page.getByRole("link", { name: "ログインして自分の管理に追加" })).toBeVisible();
  await ctx.close();
});

test("FLOW 3: B が共有URL → ログイン → 同じ共有イベントへ戻る → 追加 → マイイベントに表示", async () => {
  await pageB.goto(shareUrl);
  await pageB.waitForURL(/\/mochico\/s\/view$/);
  await pageB.getByRole("link", { name: "ログインして自分の管理に追加" }).click();
  await pageB.waitForURL(/\/mochico\/login/);
  await expect(pageB.getByText("共有されたグッズリストを自分の管理に追加できます")).toBeVisible();
  await loginHere(pageB, emailB);
  // ログイン → /mochico/s/view?join=1 → 自動で追加 → 自分の Event Detail へ
  await pageB.waitForURL(new RegExp(`${eventPath}\\?added=1$`), { timeout: 20_000 });
  await expect(pageB.getByText("マイイベントに追加しました")).toBeVisible();
  await expect(pageB.getByText("共有されたリスト")).toBeVisible();
  await pageB.goto("/mochico/events");
  const card = pageB.getByRole("link", { name: /共有E2Eライブ \[TEST\]/ });
  await expect(card).toBeVisible();
  await expect(card.getByText("共有", { exact: true })).toBeVisible();
});

test("FLOW 4: B が Goods A を取得済みに → reload 後も保持", async () => {
  await pageB.goto(eventPath);
  await expect(pageB.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 0 / 3（0%）"); // A の取得済みは見えない
  await goodsCard(pageB, "Goods B").click();
  await expect(goodsCard(pageB, "Goods B")).toHaveAttribute("aria-pressed", "true");
  await goodsCard(pageB, "Goods A").click();
  await expect(goodsCard(pageB, "Goods A")).toHaveAttribute("aria-pressed", "true");
  await pageB.reload();
  await expect(goodsCard(pageB, "Goods A")).toHaveAttribute("aria-pressed", "true");
  await expect(goodsCard(pageB, "Goods B")).toHaveAttribute("aria-pressed", "true");
});

test("FLOW 5 / 11: A の状態は独立しており、A は B の所持状態を見られない", async () => {
  await pageA.reload();
  await expect(goodsCard(pageA, "Goods A")).toHaveAttribute("aria-pressed", "true");
  await expect(goodsCard(pageA, "Goods B")).toHaveAttribute("aria-pressed", "false"); // B の取得は A に出ない
  await expect(pageA.getByRole("progressbar")).toHaveAttribute("aria-label", "取得状況 1 / 3（33%）");
  const admin = await adminClient();
  const { data: owners } = await admin.from("ownerships").select("user_id, status, goods!inner(name, event_id)").eq("goods.name", "Goods A").eq("goods.event_id", eventPath.split("/").pop()!);
  expect((owners ?? []).filter((o) => o.status === "owned").length).toBe(2); // A と B がそれぞれ独立に保持
});

test("FLOW 6 / 7: A の商品追加・編集が B に反映、B の取得状態は変わらない", async () => {
  await pageA.goto(`${eventPath}/items/new`);
  await pageA.getByLabel("商品名").fill("Goods D");
  await pageA.getByLabel("価格（円）").fill("500");
  await pageA.getByRole("button", { name: "保存して一覧へ" }).click();
  await pageA.waitForURL(eventPath);

  await pageB.reload();
  await expect(goodsCard(pageB, "Goods D")).toBeVisible();
  await expect(goodsCard(pageB, "Goods D")).toHaveAttribute("aria-pressed", "false"); // 未取得が初期値
  await goodsCard(pageB, "Goods D").click();
  await expect(goodsCard(pageB, "Goods D")).toHaveAttribute("aria-pressed", "true");

  // A が Goods D を編集
  await pageA.getByRole("button", { name: "Goods Dの詳細" }).click();
  await pageA.getByRole("link", { name: "このグッズを編集" }).click();
  await pageA.getByLabel("商品名").fill("ツアーTシャツ D");
  await pageA.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(eventPath);

  await pageB.reload();
  await expect(goodsCard(pageB, "ツアーTシャツ D")).toHaveAttribute("aria-pressed", "true");
  await expect(goodsCard(pageB, "Goods D")).toHaveCount(0);
});

test("FLOW 12: B は A のイベントを編集できない", async () => {
  await pageB.goto(eventPath);
  await expect(pageB.getByRole("button", { name: "共有" })).toHaveCount(0);
  await expect(pageB.getByRole("link", { name: "イベントを編集" })).toHaveCount(0);
  await expect(pageB.getByRole("link", { name: /グッズ追加/ })).toHaveCount(0);
  await pageB.goto(`${eventPath}/edit`);
  await expect(pageB.getByText("編集する権限がありません")).toBeVisible();
  await pageB.goto(`${eventPath}/items/new`);
  await expect(pageB.getByText("編集する権限がありません")).toBeVisible();
});

test("FLOW 8: A がリンクを失効 → 新規アクセスは拒否、B の既存リストは使える", async ({ browser }) => {
  await pageA.goto(eventPath);
  await pageA.getByRole("button", { name: "共有" }).click();
  const dialog = pageA.getByRole("dialog", { name: "グッズリストを共有" });
  await dialog.getByRole("button", { name: "共有を停止（リンクを失効）" }).click();
  await pageA.getByRole("button", { name: "停止する" }).click();
  await expect(pageA.getByText("共有リンクを停止しました")).toBeVisible();
  await expect(dialog.getByText("以前のリンクは停止済みです")).toBeVisible();

  const ctx = await newMobileContext(browser);
  const page = await ctx.newPage();
  await page.goto(shareUrl);
  await expect(page.getByText("この共有リンクは共有が終了しています")).toBeVisible();
  await expect(page.getByText("Goods A")).toHaveCount(0);
  await ctx.close();

  await pageB.goto(eventPath);
  await expect(goodsCard(pageB, "Goods A")).toHaveAttribute("aria-pressed", "true");
  await goodsCard(pageB, "Goods C").click();
  await expect(goodsCard(pageB, "Goods C")).toHaveAttribute("aria-pressed", "true");
  await pageB.reload();
  await expect(goodsCard(pageB, "Goods C")).toHaveAttribute("aria-pressed", "true");
});

test("FLOW 9: 期限切れリンクは拒否される", async ({ browser }) => {
  const admin = await adminClient();
  const eventId = eventPath.split("/").pop()!;
  const expiredToken = `T${Date.now()}`.padEnd(43, "z").slice(0, 43);
  // FLOW 8 で有効リンクは失効済み（1イベント1本の制約に当たらない）
  const { error } = await admin.from("share_links").insert({ event_id: eventId, token: expiredToken, expires_at: new Date(Date.now() - 60_000).toISOString() });
  expect(error).toBeNull();
  const ctx = await newMobileContext(browser);
  const page = await ctx.newPage();
  await page.goto(`/mochico/s/${expiredToken}`);
  await expect(page.getByText("この共有リンクは期限切れです")).toBeVisible();
  await page.goto("/mochico/s/" + "Q".repeat(43));
  await expect(page.getByText("この共有リンクは利用できません")).toBeVisible();
  await page.goto("/mochico/s/" + eventId); // event UUID では開けない
  await expect(page.getByText("この共有リンクは利用できません")).toBeVisible();
  await ctx.close();
  await admin.from("share_links").update({ status: "revoked" }).eq("token", expiredToken);
});

test("FLOW 10: 「自分の管理に追加」を連打しても membership は1件", async ({ browser }) => {
  // A が新しいリンクを発行
  await pageA.goto(eventPath);
  await pageA.getByRole("button", { name: "共有" }).click();
  const dialog = pageA.getByRole("dialog", { name: "グッズリストを共有" });
  await dialog.getByRole("button", { name: "新しい共有リンクを作成" }).click();
  const newUrl = await dialog.getByLabel("共有URL").inputValue();
  expect(newUrl).not.toBe(shareUrl);

  const ctx = await newMobileContext(browser);
  const page = await ctx.newPage();
  await login(page, emailC, "/mochico/events");
  await page.goto(newUrl);
  await page.waitForURL(/\/mochico\/s\/view$/);
  const add = page.getByRole("button", { name: "自分の管理に追加" });
  await expect(add).toBeVisible();
  // 連打（ボタン無効化前のクリックも含めて複数回）
  await Promise.all([add.click({ force: true }), add.click({ force: true }), add.dblclick({ force: true }).catch(() => undefined)]);
  await page.waitForURL(new RegExp(`${eventPath}\\?(added|already)=1$`), { timeout: 20_000 });
  const admin = await adminClient();
  const eventId = eventPath.split("/").pop()!;
  const { data: u } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const cId = u.users.find((x) => x.email === emailC)!.id;
  const { count } = await admin.from("event_memberships").select("*", { count: "exact", head: true }).eq("event_id", eventId).eq("user_id", cId);
  expect(count).toBe(1);
  // 追加済みで共有URLを開き直すと「追加済み」表示
  await page.goto(newUrl);
  await expect(page.getByText("マイイベントに追加済みです")).toBeVisible();
  await ctx.close();
});

test("CACHE: 同じ端末でユーザーが切り替わっても、オフライン表示に他人の取得状況が出ない", async ({ browser }) => {
  test.setTimeout(120_000);
  const { execSync } = await import("node:child_process");
  const docker = (cmd: string) =>
    execSync(`docker ${cmd}`, { env: { ...process.env, PATH: `/Applications/Docker.app/Contents/Resources/bin:${process.env.PATH}` } });
  const ctx = await newMobileContext(browser);
  const page = await ctx.newPage();
  const progress = () => page.getByRole("progressbar").getAttribute("aria-label");

  // B → A の順に同じ共有イベントを表示（端末内に2人分のスナップショット。最新は A）
  await login(page, emailB, eventPath);
  const bProgress = await progress();
  await page.waitForTimeout(800);
  await ctx.clearCookies(); // ログアウト操作をせずにセッションが切れた想定（キャッシュは残る）
  await login(page, emailA, eventPath);
  const aProgress = await progress();
  expect(aProgress).not.toBe(bProgress);
  await page.waitForTimeout(800);
  await ctx.clearCookies();
  await login(page, emailB, "/mochico/events");

  docker("stop supabase_rest_toolboxjp-goods");
  try {
    await page.goto(eventPath);
    await expect(page.getByText("閲覧のみ")).toBeVisible({ timeout: 20_000 });
    // 最新のスナップショット（A）ではなく、ログイン中の B 本人のものが出る
    expect(await progress()).toBe(bProgress);
  } finally {
    docker("start supabase_rest_toolboxjp-goods");
  }
  await expect
    .poll(async () => (await fetch("http://127.0.0.1:55321/rest/v1/", { headers: { apikey: "x" } }).catch(() => null))?.status ?? 0, { timeout: 30_000 })
    .not.toBe(0);
  await page.waitForTimeout(1500);
  await ctx.close();
});
