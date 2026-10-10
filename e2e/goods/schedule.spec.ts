// 予約・販売スケジュールの E2E（オーナーの入力 → 一覧・見出し・カード・詳細・並び替え → 共有メンバー・共有ページ）
//   日付は「日本時間の今日」からの相対で決める（いつ実行しても状態が同じになる）
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { adminClient, goodsCard, login, uniqueEmail, E2E_BASE } from "./helpers";

test.describe.configure({ mode: "serial" });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "スマホ設定で1回だけ実行");
});

const jstDay = (offset: number) => new Date(Date.now() + 9 * 3600_000 + offset * 86400_000).toISOString().slice(0, 10);
const emailA = uniqueEmail("sch-a");
const emailB = uniqueEmail("sch-b");
let ctxA: BrowserContext, ctxB: BrowserContext;
let pageA: Page, pageB: Page;
let eventId = "";
let eventPath = "";
let token = "";

test.beforeAll(async ({ browser }) => {
  const { devices } = await import("@playwright/test");
  ctxA = await browser.newContext({ ...devices["iPhone 13"], baseURL: E2E_BASE, serviceWorkers: "block" });
  ctxB = await browser.newContext({ ...devices["iPhone 13"], baseURL: E2E_BASE, serviceWorkers: "block" });
  pageA = await ctxA.newPage();
  pageB = await ctxB.newPage();
});
test.afterAll(async () => {
  await ctxA?.close();
  await ctxB?.close();
});

async function fillSchedule(p: Page, label: "予約開始" | "予約締切" | "販売開始", date: string, time?: string) {
  await p.getByLabel(`${label}の日付`).fill(date);
  if (time) await p.getByLabel(`${label}の時刻（任意）`).fill(time);
}

test("イベント作成: 予約・販売スケジュールを入力でき、開催日とは別に保存される", async () => {
  await login(pageA, emailA, "/mochico/events/new");
  await pageA.getByLabel("イベント名").fill("予約テストライブ [TEST]");
  await pageA.getByLabel("開始日").fill(jstDay(30));
  await pageA.getByText("予約・販売スケジュール（任意）").click();
  // 終了 < 開始は保存前に止める
  await fillSchedule(pageA, "予約開始", jstDay(5));
  await fillSchedule(pageA, "予約締切", jstDay(2));
  await pageA.getByRole("button", { name: "作成してグッズを登録" }).click();
  await expect(pageA.getByRole("alert").filter({ hasText: "予約締切は予約開始より後の日時にしてください" })).toBeVisible();
  // 正しい期間に直す（予約開始は昨日、締切は3日後・日付のみ、販売開始は10日後 10:00）
  await fillSchedule(pageA, "予約開始", jstDay(-1));
  await fillSchedule(pageA, "予約締切", jstDay(3));
  await fillSchedule(pageA, "販売開始", jstDay(10), "10:00");
  await pageA.getByRole("button", { name: "作成してグッズを登録" }).click();
  await pageA.waitForURL(/\/items\/new/);
  eventPath = new URL(pageA.url()).pathname.replace(/\/items\/new$/, "");
  eventId = eventPath.split("/").pop()!;
  const admin = await adminClient();
  const { data: ev } = await admin.from("events").select("start_date, reserve_start_date, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time").eq("id", eventId).single();
  expect(ev).toMatchObject({ start_date: jstDay(30), reserve_start_date: jstDay(-1), reserve_end_date: jstDay(3), reserve_end_time: null, sale_start_date: jstDay(10), sale_start_time: "10:00:00" });
});

test("グッズ登録: 「イベントと同じ」と「このグッズだけ別に設定」の2択", async () => {
  // 1件目: イベントと同じ（既定）。イベントの期間が選択肢に表示される
  await expect(pageA.getByText("イベントと同じ")).toBeVisible();
  await expect(pageA.locator("label", { hasText: "イベントと同じ" })).toContainText("予約受付中・あと3日");
  await pageA.getByLabel("商品名").fill("通常グッズ");
  await pageA.getByRole("button", { name: "保存して続けて追加" }).click();
  await expect(pageA.getByText("このイベントに 1 件追加しました")).toBeVisible();
  // 2件目: このグッズだけ別に設定（明日 18:00 まで）
  await pageA.getByLabel("商品名").fill("個別グッズ");
  await pageA.getByText("このグッズだけ別に設定").click();
  await fillSchedule(pageA, "予約締切", jstDay(1), "18:00");
  await pageA.getByRole("button", { name: "保存して一覧へ" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`));
  const admin = await adminClient();
  const { data: rows } = await admin.from("goods").select("name, schedule_override, reserve_end_date, reserve_end_time").eq("event_id", eventId).order("sort_order");
  expect(rows).toEqual([
    { name: "通常グッズ", schedule_override: false, reserve_end_date: null, reserve_end_time: null },
    { name: "個別グッズ", schedule_override: true, reserve_end_date: jstDay(1), reserve_end_time: "18:00:00" },
  ]);
});

test("表示: 見出しに予約と販売開始（別の行）、カードは個別設定のグッズだけ、詳細に出どころ", async () => {
  const header = pageA.getByTestId("schedule-detail").first();
  await expect(header).toContainText("予約受付中・あと3日");
  await expect(header).toContainText("販売開始");
  await expect(goodsCard(pageA, "個別グッズ")).toContainText(/予約受付中・(明日まで|あと\d+時間|あと1日)/);
  await expect(goodsCard(pageA, "通常グッズ")).not.toContainText("予約");
  await pageA.getByRole("button", { name: "個別グッズの詳細" }).click();
  await expect(pageA.getByRole("dialog")).toContainText("このグッズだけの設定");
  await pageA.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
  await pageA.getByRole("button", { name: "通常グッズの詳細" }).click();
  await expect(pageA.getByRole("dialog")).toContainText("イベントの設定");
  await expect(pageA.getByRole("dialog")).toContainText("予約受付中・あと3日");
  await pageA.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
});

test("並び替え: 予約期限が近い順（個別の明日締切 → イベントの3日後締切）", async () => {
  // 8件未満では検索・並び替えが出ないため、グッズを追加して表示させる
  const admin = await adminClient();
  for (let i = 0; i < 7; i++) await admin.from("goods").insert({ event_id: eventId, name: `追加グッズ${i}`, sort_order: 10 + i, schedule_override: true, reserve_end_date: jstDay(-2) });
  await pageA.reload();
  await pageA.getByRole("combobox", { name: "並び替え" }).selectOption("deadline");
  const names = await pageA.locator("ul.grid > li > button[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")!.split("、")[0]).filter((n) => !n.endsWith("の詳細")));
  expect(names.slice(0, 2)).toEqual(["個別グッズ", "通常グッズ"]);
  expect(names.at(-1)).toMatch(/^追加グッズ/); // 受付終了は最後
  // 検索との併用
  await pageA.getByRole("searchbox", { name: "商品名で検索" }).fill("グッズ");
  await expect(goodsCard(pageA, "個別グッズ")).toBeVisible();
  await pageA.getByRole("searchbox", { name: "商品名で検索" }).fill("");
  await pageA.getByRole("combobox", { name: "並び替え" }).selectOption("registered");
});

test("イベント一覧: イベント自身の予約状態と「個別の予約期限あり」", async () => {
  await pageA.goto("/mochico/events");
  const item = pageA.getByRole("link", { name: /予約テストライブ/ });
  await expect(item).toContainText("予約受付中・あと3日");
  await expect(item).toContainText("個別の予約期限あり");
  // イベントが未設定でグッズだけ期間あり → イベントの期間として表示しない
  const admin = await adminClient();
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const uid = users.users.find((u) => u.email === emailA)!.id;
  const { data: ev2 } = await admin.from("events").insert({ owner_id: uid, title: "グッズだけ期間 [TEST]" }).select("id").single();
  await admin.from("goods").insert({ event_id: ev2!.id, name: "期間ありグッズ", sort_order: 0, schedule_override: true, reserve_end_date: jstDay(2) });
  await pageA.reload();
  const item2 = pageA.getByRole("link", { name: /グッズだけ期間/ });
  await expect(item2).toContainText("個別の予約期限あり（1件）");
  await expect(item2).not.toContainText("予約受付中");
  // 並び替え（予約期間のあるイベントがあるときだけ表示）
  await pageA.getByRole("combobox", { name: "イベントの並び替え" }).selectOption("deadline");
  await expect(pageA.locator("ul.grid > li").first()).toContainText("予約テストライブ");
});

test("編集: クリアで未設定に戻せる（iPhone の日付欄の代わり）", async () => {
  await pageA.goto(`${eventPath}/edit`);
  await expect(pageA.getByLabel("販売開始の日付")).toHaveValue(jstDay(10));
  await pageA.getByRole("button", { name: "販売開始をクリア" }).click();
  await expect(pageA.getByLabel("販売開始の日付")).toHaveValue("");
  await expect(pageA.getByLabel("販売開始の時刻（任意）")).toBeDisabled();
  await pageA.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`));
  const admin = await adminClient();
  const { data: ev } = await admin.from("events").select("sale_start_date, sale_start_time, reserve_end_date").eq("id", eventId).single();
  expect(ev).toEqual({ sale_start_date: null, sale_start_time: null, reserve_end_date: jstDay(3) });
  await expect(pageA.getByTestId("schedule-detail").first()).not.toContainText("販売開始");
});

test("共有メンバー: 予約・販売スケジュールは見えるが変更できない／共有ページにも表示", async () => {
  const admin = await adminClient();
  const { data: link } = await admin.from("share_links").insert({ event_id: eventId }).select("token").single();
  token = link!.token;
  // 未ログインの共有ページ（D4）
  const anon = await pageB.context().browser()!.newContext({ baseURL: E2E_BASE, serviceWorkers: "block" });
  const ap = await anon.newPage();
  await ap.goto(`/mochico/s/${token}`);
  await ap.waitForURL(/\/mochico\/s\/view$/);
  await expect(ap.getByTestId("schedule-detail").first()).toContainText("予約受付中・あと3日");
  await expect(ap.getByRole("button", { name: /^個別グッズ、/ })).toContainText("予約受付中");
  await anon.close();
  // 参加
  await login(pageB, emailB);
  await pageB.goto(`/mochico/s/${token}`);
  await pageB.waitForURL(/\/mochico\/s\/view$/);
  await pageB.getByRole("button", { name: "自分の管理に追加" }).click();
  await pageB.waitForURL(new RegExp(`${eventPath}\\?added=1$`), { timeout: 20_000 });
  await expect(pageB.getByTestId("schedule-detail").first()).toContainText("予約受付中・あと3日");
  await expect(pageB.getByRole("link", { name: "イベントを編集" })).toHaveCount(0);
  await pageB.goto(`${eventPath}/edit`);
  await expect(pageB.getByLabel("予約締切の日付")).toHaveCount(0); // 編集画面には入れない
});

test("iPhone 幅: 入力欄（日付・時刻・クリア）が 320〜430px で横にはみ出さない", async () => {
  for (const w of [320, 375, 390, 430]) {
    await pageA.setViewportSize({ width: w, height: 800 });
    for (const path of [`${eventPath}/edit`, `${eventPath}/items/new`]) {
      await pageA.goto(path);
      if (path.endsWith("/items/new")) await pageA.getByText("このグッズだけ別に設定").click();
      else await pageA.getByText("予約・販売スケジュール（任意）").isVisible();
      const m = await pageA.evaluate(() => {
        const clear = document.querySelector('[aria-label="予約締切をクリア"]')!.getBoundingClientRect();
        return { pageW: document.documentElement.scrollWidth, clearRight: Math.round(clear.right), clearW: Math.round(clear.width) };
      });
      expect(m.pageW, `${path} @${w}`).toBeLessThanOrEqual(w);
      expect(m.clearRight, `${path} @${w}`).toBeLessThanOrEqual(w);
      expect(m.clearW).toBeGreaterThanOrEqual(44); // タップ領域
    }
  }
  await pageA.setViewportSize({ width: 390, height: 844 });
});

test("継承: イベントの変更が継承中のグッズに反映され、個別 → 継承 → 個別で値が混ざらず復元される", async () => {
  await pageA.setViewportSize({ width: 390, height: 844 });
  // 1. イベントの締切を 5 日後 20:00 に変更 → 継承中の「通常グッズ」に反映
  await pageA.goto(`${eventPath}/edit`);
  await fillSchedule(pageA, "予約締切", jstDay(5), "20:00");
  await pageA.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`));
  await pageA.getByRole("button", { name: "通常グッズの詳細" }).click();
  await expect(pageA.getByRole("dialog")).toContainText("予約受付中・あと5日");
  await expect(pageA.getByRole("dialog")).toContainText("イベントの設定");
  await pageA.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
  // 2. 「個別グッズ」（明日 18:00 まで）を「イベントと同じ」に戻す → イベントの期間だけが表示される
  const admin = await adminClient();
  const gid = (await admin.from("goods").select("id").eq("event_id", eventId).eq("name", "個別グッズ").single()).data!.id;
  await pageA.goto(`${eventPath}/items/${gid}/edit`);
  await expect(pageA.getByLabel("予約締切の日付")).toHaveValue(jstDay(1));
  await pageA.getByText("イベントと同じ").click();
  await expect(pageA.getByLabel("予約締切の日付")).toHaveCount(0); // 個別の入力欄は隠れる
  await pageA.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`));
  await expect(goodsCard(pageA, "個別グッズ")).not.toContainText("予約"); // カードの個別表示は消える
  await pageA.getByRole("button", { name: "個別グッズの詳細" }).click();
  await expect(pageA.getByRole("dialog")).toContainText("予約受付中・あと5日");
  await expect(pageA.getByRole("dialog")).toContainText("イベントの設定");
  await expect(pageA.getByRole("dialog")).not.toContainText("18:00");
  await pageA.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
  const kept = (await admin.from("goods").select("schedule_override, reserve_end_date, reserve_end_time").eq("id", gid).single()).data;
  expect(kept).toEqual({ schedule_override: false, reserve_end_date: jstDay(1), reserve_end_time: "18:00:00" });
  // 3. 再び「このグッズだけ別に設定」→ 保存済みの値が入力欄に復元され、保存すると個別の期間に戻る
  await pageA.goto(`${eventPath}/items/${gid}/edit`);
  await pageA.getByText("このグッズだけ別に設定").click();
  await expect(pageA.getByLabel("予約締切の日付")).toHaveValue(jstDay(1));
  await expect(pageA.getByLabel("予約締切の時刻（任意）")).toHaveValue("18:00");
  await pageA.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`));
  await expect(goodsCard(pageA, "個別グッズ")).toContainText("予約受付中");
  await pageA.getByRole("button", { name: "個別グッズの詳細" }).click();
  await expect(pageA.getByRole("dialog")).toContainText("このグッズだけの設定");
  await expect(pageA.getByRole("dialog")).toContainText("18:00");
  await pageA.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
});
