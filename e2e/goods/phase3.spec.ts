// Phase 3（検索・カテゴリ・所持数量・複数画像・ランダム商品）の E2E
//   A = オーナー / B = 共有から参加したメンバー。カタログはテスト用に管理クライアントで用意する
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { adminClient, goodsCard, login, uniqueEmail, E2E_BASE } from "./helpers";

test.describe.configure({ mode: "serial" });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "スマホ設定で1回だけ実行");
});

const emailA = uniqueEmail("p3-a");
const emailB = uniqueEmail("p3-b");
let ctxA: BrowserContext, ctxB: BrowserContext;
let pageA: Page, pageB: Page;
let eventId = "";
let eventPath = "";
let userA = "";
let userB = "";
const ids: Record<string, string> = {};
const cats: Record<string, string> = {};

async function newMobileContext(browser: Browser) {
  const { devices } = await import("@playwright/test");
  return browser.newContext({ ...devices["iPhone 13"], baseURL: E2E_BASE, serviceWorkers: "block" });
}
const progress = (p: Page) => p.getByRole("progressbar");
const qtyInDb = async (userId: string, goodsId: string, variantId: string | null = null) => {
  const admin = await adminClient();
  let q = admin.from("ownerships").select("quantity").eq("user_id", userId).eq("goods_id", goodsId);
  q = variantId ? q.eq("variant_id", variantId) : q.is("variant_id", null);
  return (await q.maybeSingle()).data?.quantity ?? 0;
};
async function openDetail(p: Page, name: string) {
  await p.getByRole("button", { name: `${name}の詳細` }).click();
  await expect(p.getByRole("dialog")).toBeVisible();
}
async function closeDetail(p: Page) {
  await p.getByRole("dialog").getByRole("button", { name: "閉じる" }).first().click();
  await expect(p.getByRole("dialog")).toHaveCount(0);
}

test.beforeAll(async ({ browser }) => {
  ctxA = await newMobileContext(browser);
  ctxB = await newMobileContext(browser);
  pageA = await ctxA.newPage();
  pageB = await ctxB.newPage();
});
test.afterAll(async () => {
  await ctxA?.close();
  await ctxB?.close();
});

test("準備: A がログインしてカタログを用意、B が共有から参加", async () => {
  await login(pageA, emailA);
  await login(pageB, emailB);
  const admin = await adminClient();
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  userA = users.users.find((u) => u.email === emailA)!.id;
  userB = users.users.find((u) => u.email === emailB)!.id;
  const { data: ev } = await admin.from("events").insert({ owner_id: userA, title: "P3 E2E ライブ [TEST]" }).select("id").single();
  eventId = ev!.id;
  eventPath = `/mochico/events/${eventId}`;
  for (const [i, name] of ["缶バッジ", "タオル", "アクリルスタンド"].entries()) {
    const { data } = await admin.from("goods_categories").insert({ event_id: eventId, name, sort_order: i }).select("id").single();
    cats[name] = data!.id;
  }
  const rows: [string, number | null, string | null][] = [
    ["ペンライト", 3800, null],
    ["フェイスタオル", 1500, "タオル"],
    ["マフラータオル", 2500, "タオル"],
    ["アクスタ A", 2000, "アクリルスタンド"],
    ["アクスタ B", 2000, "アクリルスタンド"],
    ["Tシャツ 黒", 4500, null],
    ["Tシャツ 白", 4500, null],
    ["パンフレット", 3000, null],
    ["キーホルダー", 1200, null],
    ["ステッカー", 500, null],
    ["トートバッグ", 3000, null],
    ["価格未定グッズ", null, null],
  ];
  for (const [i, [name, price, cat]] of rows.entries()) {
    const { data } = await admin.from("goods").insert({ event_id: eventId, name, price, sort_order: i, category_id: cat ? cats[cat] : null }).select("id").single();
    ids[name] = data!.id;
  }
  const { data: rnd } = await admin.from("goods").insert({ event_id: eventId, name: "ランダム缶バッジ", price: 500, sort_order: 20, kind: "random", category_id: cats["缶バッジ"] }).select("id").single();
  ids["ランダム缶バッジ"] = rnd!.id;
  for (let i = 1; i <= 8; i++) {
    const { data } = await admin.from("goods_variants").insert({ goods_id: rnd!.id, event_id: eventId, name: `No.${i}`, sort_order: i }).select("id").single();
    ids[`No.${i}`] = data!.id;
  }
  const { data: link } = await admin.from("share_links").insert({ event_id: eventId }).select("token").single();
  await pageB.goto(`/mochico/s/${link!.token}`);
  await pageB.waitForURL(/\/mochico\/s\/view$/);
  await pageB.getByRole("button", { name: "自分の管理に追加" }).click();
  await pageB.waitForURL(new RegExp(`${eventPath}\\?added=1$`), { timeout: 20_000 });
  await pageA.goto(eventPath);
  await expect(progress(pageA)).toHaveAttribute("aria-label", "取得状況 0 / 13（0%）");
});

test("FEATURE 1: 商品名検索（ひらがな/カタカナの違いを無視）・0件の空状態・クリア", async () => {
  const search = pageA.getByRole("searchbox", { name: "商品名で検索" });
  await search.fill("ぺんらいと");
  await expect(goodsCard(pageA, "ペンライト")).toBeVisible();
  await expect(goodsCard(pageA, "フェイスタオル")).toHaveCount(0);
  await search.fill("たおる");
  await expect(goodsCard(pageA, "フェイスタオル")).toBeVisible();
  await expect(goodsCard(pageA, "マフラータオル")).toBeVisible();
  await expect(goodsCard(pageA, "ペンライト")).toHaveCount(0);
  await search.fill("存在しないグッズ");
  await expect(pageA.getByText("条件に合うグッズはありません")).toBeVisible();
  // 取得率はイベント全体のまま
  await expect(progress(pageA)).toHaveAttribute("aria-label", "取得状況 0 / 13（0%）");
  await pageA.getByRole("button", { name: "検索・カテゴリの条件をクリア" }).click();
  await expect(search).toHaveValue("");
  await expect(goodsCard(pageA, "ペンライト")).toBeVisible();
});

test("FEATURE 2: カテゴリタブ・未分類・検索との併用", async () => {
  const catTabs = pageA.getByRole("tablist", { name: "カテゴリ" });
  await catTabs.getByRole("tab", { name: /^タオル/ }).click();
  await expect(goodsCard(pageA, "フェイスタオル")).toBeVisible();
  await expect(goodsCard(pageA, "アクスタ A")).toHaveCount(0);
  await pageA.getByRole("searchbox", { name: "商品名で検索" }).fill("マフラー");
  await expect(goodsCard(pageA, "マフラータオル")).toBeVisible();
  await expect(goodsCard(pageA, "フェイスタオル")).toHaveCount(0);
  await pageA.getByRole("searchbox", { name: "商品名で検索" }).fill("");
  await catTabs.getByRole("tab", { name: /^未分類/ }).click();
  await expect(goodsCard(pageA, "ペンライト")).toBeVisible();
  await expect(goodsCard(pageA, "フェイスタオル")).toHaveCount(0);
  await catTabs.getByRole("tab", { name: /^すべて/ }).click();
});

test("FEATURE 1: 並び替え（価格の安い順・高い順・名前順・登録順）", async () => {
  const sort = pageA.getByRole("combobox", { name: "並び替え" });
  const firstName = async () => (await pageA.locator("ul.grid > li").first().getByRole("button").first().getAttribute("aria-label"))?.split("、")[0];
  await sort.selectOption("price-asc");
  // 500円が2つ（ステッカー・ランダム缶バッジ）。同額は名前順なので ステッカー（ス）が先
  expect(await firstName()).toBe("ステッカー");
  await sort.selectOption("price-desc");
  expect(["Tシャツ 黒", "Tシャツ 白"]).toContain(await firstName());
  // 価格未定は常に最後
  const last = async () => (await pageA.locator("ul.grid > li").last().getByRole("button").first().getAttribute("aria-label"))?.split("、")[0];
  expect(await last()).toBe("価格未定グッズ");
  await sort.selectOption("registered");
  expect(await firstName()).toBe("ペンライト");
});

test("FEATURE 3: 数量 0→1（タップ）→2→1（シート）→0（タップ）、2個以上はタップで減らない", async () => {
  const card = goodsCard(pageA, "ペンライト");
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => qtyInDb(userA, ids["ペンライト"])).toBe(1);
  await openDetail(pageA, "ペンライト");
  await pageA.getByRole("button", { name: "ペンライトの所持数を1増やす" }).click();
  await expect.poll(() => qtyInDb(userA, ids["ペンライト"])).toBe(2);
  await closeDetail(pageA);
  const card2 = goodsCard(pageA, "ペンライト");
  await expect(card2).toHaveAttribute("aria-label", /取得済み2個/);
  // 2個以上: タップしても数を変えず、数量シートが開く
  await card2.click();
  await expect(pageA.getByRole("dialog")).toBeVisible();
  await pageA.waitForTimeout(500);
  expect(await qtyInDb(userA, ids["ペンライト"])).toBe(2);
  await pageA.getByRole("button", { name: "ペンライトの所持数を1減らす" }).click();
  await expect.poll(() => qtyInDb(userA, ids["ペンライト"])).toBe(1);
  await closeDetail(pageA);
  await goodsCard(pageA, "ペンライト").click();
  await expect.poll(() => qtyInDb(userA, ids["ペンライト"])).toBe(0);
  await expect(goodsCard(pageA, "ペンライト")).toHaveAttribute("aria-pressed", "false");
});

test("FEATURE 3: 連打しても最後の値が保存される・直接入力・不正値は保存しない", async () => {
  await openDetail(pageA, "パンフレット");
  const plus = pageA.getByRole("button", { name: "パンフレットの所持数を1増やす" });
  for (let i = 0; i < 6; i++) await plus.click();
  await expect.poll(() => qtyInDb(userA, ids["パンフレット"]), { timeout: 10_000 }).toBe(6);
  const input = pageA.getByRole("textbox", { name: "パンフレットの所持数" });
  await input.fill("12");
  await input.press("Enter");
  await expect.poll(() => qtyInDb(userA, ids["パンフレット"])).toBe(12);
  for (const bad of ["-1", "1.5", "abc", "10000"]) {
    await input.fill(bad);
    await input.press("Enter");
    await expect(pageA.getByText("0〜9999 の整数で入力してください")).toBeVisible();
    await expect(input).toHaveValue("12");
  }
  expect(await qtyInDb(userA, ids["パンフレット"])).toBe(12);
  await closeDetail(pageA);
  await expect(progress(pageA)).toHaveAttribute("aria-label", "取得状況 1 / 13（8%）");
});

test("FEATURE 3: 通信失敗時は正しい数量へ戻る", async () => {
  await pageA.route("**/rest/v1/ownerships**", (r) => (r.request().method() === "GET" ? r.continue() : r.abort("internetdisconnected")));
  await openDetail(pageA, "パンフレット");
  await pageA.getByRole("button", { name: "パンフレットの所持数を1増やす" }).click();
  await expect(pageA.getByText(/更新できませんでした|オフラインのため/)).toBeVisible();
  await expect(pageA.getByRole("textbox", { name: "パンフレットの所持数" })).toHaveValue("12");
  await pageA.unroute("**/rest/v1/ownerships**");
  expect(await qtyInDb(userA, ids["パンフレット"])).toBe(12);
  await closeDetail(pageA);
});

test("FEATURE 4: ランダム商品の絵柄ごとの数量・合計・種類数", async () => {
  const card = goodsCard(pageA, "ランダム缶バッジ");
  await expect(card).toHaveAttribute("aria-label", /全8種のうち0種取得/);
  await card.click(); // ランダム商品はタップで絵柄一覧
  await expect(pageA.getByRole("heading", { name: "絵柄ごとの所持数" })).toBeVisible();
  await pageA.getByRole("button", { name: "No.1の所持数を1増やす" }).click();
  await pageA.getByRole("button", { name: "No.1の所持数を1増やす" }).click();
  await pageA.getByRole("button", { name: "No.2の所持数を1増やす" }).click();
  await expect.poll(() => qtyInDb(userA, ids["ランダム缶バッジ"], ids["No.1"])).toBe(2);
  await expect.poll(() => qtyInDb(userA, ids["ランダム缶バッジ"], ids["No.2"])).toBe(1);
  await expect(pageA.getByText("2/8種・合計3個")).toBeVisible();
  await closeDetail(pageA);
  await expect(goodsCard(pageA, "ランダム缶バッジ")).toHaveAttribute("aria-label", /全8種のうち2種取得・合計3個/);
  await expect(progress(pageA)).toHaveAttribute("aria-label", "取得状況 2 / 13（15%）");
  await pageA.reload();
  await expect(goodsCard(pageA, "ランダム缶バッジ")).toHaveAttribute("aria-label", /2種取得・合計3個/);
});

test("所持フィルター × カテゴリ", async () => {
  await pageA.getByRole("tab", { name: /^取得済み/ }).click();
  await expect(goodsCard(pageA, "パンフレット")).toBeVisible();
  await expect(goodsCard(pageA, "ランダム缶バッジ")).toBeVisible();
  await pageA.getByRole("tablist", { name: "カテゴリ" }).getByRole("tab", { name: /^缶バッジ/ }).click();
  await expect(goodsCard(pageA, "ランダム缶バッジ")).toBeVisible();
  await expect(goodsCard(pageA, "パンフレット")).toHaveCount(0);
  await pageA.getByRole("tablist", { name: "カテゴリ" }).getByRole("tab", { name: /^すべて/ }).click();
  await pageA.getByRole("tab", { name: /^すべて/ }).first().click();
});

test("共有メンバー B: 同じカテゴリ・絵柄が見え、数量は A と分離、カテゴリは編集できない", async () => {
  await pageB.goto(eventPath);
  await expect(pageB.getByRole("tablist", { name: "カテゴリ" }).getByRole("tab", { name: /^タオル/ })).toBeVisible();
  await expect(pageB.getByRole("button", { name: /カテゴリを編集|カテゴリを追加/ })).toHaveCount(0);
  await expect(goodsCard(pageB, "ランダム缶バッジ")).toHaveAttribute("aria-label", /全8種のうち0種取得/);
  await expect(goodsCard(pageB, "パンフレット")).toHaveAttribute("aria-pressed", "false");
  await goodsCard(pageB, "ランダム缶バッジ").click();
  await pageB.getByRole("button", { name: "No.5の所持数を1増やす" }).click();
  await expect.poll(() => qtyInDb(userB, ids["ランダム缶バッジ"], ids["No.5"])).toBe(1);
  await expect(pageB.getByRole("link", { name: "このグッズを編集" })).toHaveCount(0);
  await closeDetail(pageB);
  await pageA.reload();
  await expect(goodsCard(pageA, "ランダム缶バッジ")).toHaveAttribute("aria-label", /2種取得・合計3個/);
  expect(await qtyInDb(userA, ids["ランダム缶バッジ"], ids["No.5"])).toBe(0);
});

test("カテゴリ編集（オーナー）: 候補から追加・名前変更・削除してもグッズは未分類で残る", async () => {
  await pageA.getByRole("button", { name: "カテゴリを編集" }).click();
  const sheet = pageA.getByRole("dialog", { name: "カテゴリを編集" });
  await sheet.getByRole("button", { name: "ぬいぐるみ" }).click();
  await expect(pageA.getByText("「ぬいぐるみ」を追加しました")).toBeVisible();
  const name = sheet.getByRole("textbox", { name: "タオルの名前" });
  await name.fill("タオル類");
  await name.press("Enter");
  await expect(pageA.getByText("名前を変更しました")).toBeVisible();
  await sheet.getByRole("button", { name: "タオル類を削除" }).click();
  await pageA.getByRole("dialog", { name: /「タオル類」を削除しますか/ }).getByRole("button", { name: "削除する" }).click();
  await expect(pageA.getByText(/グッズは「未分類」になりました/)).toBeVisible();
  await sheet.getByRole("button", { name: "閉じる" }).click();
  await expect(goodsCard(pageA, "フェイスタオル")).toBeVisible();
  const admin = await adminClient();
  const g = (await admin.from("goods").select("category_id, deleted_at").eq("id", ids["フェイスタオル"]).single()).data;
  expect(g?.category_id).toBeNull();
  expect(g?.deleted_at).toBeNull();
});

test("FEATURE 4: フォームでランダム商品（全3種）＋写真2枚を登録し、2枚目を代表にする", async () => {
  // テスト用の画像（画面のスクリーンショットを使う。実際の前処理を通す）
  const img1 = await pageA.screenshot({ clip: { x: 0, y: 0, width: 300, height: 300 } });
  const img2 = await pageA.screenshot({ clip: { x: 0, y: 300, width: 300, height: 300 } });
  await pageA.goto(`${eventPath}/items/new`);
  await pageA.locator('input[type="file"][multiple]').setInputFiles([
    { name: "a.png", mimeType: "image/png", buffer: img1 },
    { name: "b.png", mimeType: "image/png", buffer: img2 },
  ]);
  await expect(pageA.getByRole("img", { name: "写真2" })).toBeVisible({ timeout: 20_000 });
  await pageA.getByRole("button", { name: "写真2を代表にする" }).click();
  await expect(pageA.getByRole("img", { name: "写真1（代表）" })).toBeVisible();
  await pageA.getByLabel("商品名").fill("ランダムアクスタ");
  await pageA.getByText("ランダム商品", { exact: true }).click();
  await pageA.getByLabel("全").fill("3");
  await pageA.getByRole("button", { name: "まとめて追加" }).click();
  await expect(pageA.getByRole("textbox", { name: "絵柄3の名前" })).toHaveValue("No.3");
  await pageA.getByRole("button", { name: "缶バッジ" }).click();
  await pageA.getByRole("button", { name: "保存して一覧へ" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`), { timeout: 30_000 });
  await expect(goodsCard(pageA, "ランダムアクスタ")).toHaveAttribute("aria-label", /全3種/);
  const admin = await adminClient();
  const { data: g } = await admin.from("goods").select("id, kind, image_path, category_id").eq("event_id", eventId).eq("name", "ランダムアクスタ").single();
  const { data: imgs } = await admin.from("goods_images").select("image_path, sort_order").eq("goods_id", g!.id).order("sort_order");
  const { data: vs } = await admin.from("goods_variants").select("name").eq("goods_id", g!.id).order("sort_order");
  expect(g?.kind).toBe("random");
  expect(g?.category_id).toBe(cats["缶バッジ"]);
  expect(imgs?.length).toBe(2);
  expect(g?.image_path).toBe(imgs![0].image_path);
  expect((vs ?? []).map((v) => v.name)).toEqual(["No.1", "No.2", "No.3"]);
  // Storage には登録した2枚（full+thumb）だけが残る
  const { data: files } = await admin.storage.from("goods-images").list(`${eventId}/${g!.id}`, { limit: 100 });
  expect((files ?? []).length).toBe(4);
});

test("FEATURE 4: 通常 → ランダムへの変換は確認してから行い、数量を1つ目の絵柄へ引き継ぐ", async () => {
  await pageA.goto(`${eventPath}/items/${ids["パンフレット"]}/edit`);
  await pageA.getByText("ランダム商品", { exact: true }).click();
  await pageA.getByRole("button", { name: "絵柄を追加" }).click();
  await pageA.getByRole("textbox", { name: "絵柄1の名前" }).fill("通常版");
  await pageA.getByRole("button", { name: "保存する" }).click();
  const confirm = pageA.getByRole("dialog", { name: "この内容で保存しますか？" });
  await expect(confirm).toContainText("1つ目の絵柄の所持数として引き継がれます");
  await confirm.getByRole("button", { name: "保存する" }).click();
  await pageA.waitForURL(new RegExp(`${eventPath}$`), { timeout: 30_000 });
  const admin = await adminClient();
  const { data: v } = await admin.from("goods_variants").select("id, name").eq("goods_id", ids["パンフレット"]).single();
  expect(v?.name).toBe("通常版");
  expect(await qtyInDb(userA, ids["パンフレット"], v!.id)).toBe(12);
  expect(await qtyInDb(userA, ids["パンフレット"])).toBe(0);
});

test("iPhone 幅: イベント画面・登録フォームで横はみ出しなし", async () => {
  await pageA.setViewportSize({ width: 390, height: 844 });
  for (const path of [eventPath, `${eventPath}/items/new`, `${eventPath}/items/${ids["ランダム缶バッジ"]}/edit`]) {
    await pageA.goto(path);
    await pageA.waitForLoadState("networkidle");
    const w = await pageA.evaluate(() => document.documentElement.scrollWidth);
    expect(w, path).toBeLessThanOrEqual(390);
  }
});
