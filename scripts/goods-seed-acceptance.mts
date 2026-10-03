/* eslint-disable no-console -- CLIの進捗出力 */
// ============================================================
// Phase 1 User Acceptance 用のテストデータ投入（ローカル Supabase 専用）
//
// 実行: npm run goods:seed-acceptance
//
// * 接続先が 127.0.0.1 / localhost 以外なら即中止（本番へ混入させない）
// * 何度実行しても同じ状態に戻る（Acceptance 用アカウントを作り直す）
// * 商品画像は実在ブランドを使わず、Canvas で「絵文字＋ラベル」を描いて生成する
// ============================================================
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

function env(name: string): string {
  if (process.env[name]) return process.env[name]!;
  const line = readFileSync(".env.local", "utf8").split("\n").find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1) : "";
}

const URL_ = env("NEXT_PUBLIC_GOODS_SUPABASE_URL");
const SERVICE = env("GOODS_TEST_SUPABASE_SERVICE_ROLE_KEY");
const host = new URL(URL_ || "http://invalid").hostname;
if (!["127.0.0.1", "localhost"].includes(host) || !SERVICE) {
  console.error(`中止: ローカル Supabase 以外（${host}）には投入しません。`);
  process.exit(2);
}

export const ACCEPTANCE_EMAIL = "ceo-acceptance@example.test";
/** Phase 2（共有）確認用の2人目。イベントは持たない（共有リンクから追加する側） */
export const FRIEND_EMAIL = "ceo-friend@example.test";
const BUCKET = "goods-images";
const TEST_NOTE = "※ Phase 1 Acceptance 用のテストデータです。実在のアーティスト・商品とは関係ありません。";
const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });

type Item = { name: string; price: number | null; category: string | null; emoji: string | null; color: string; desc?: string };

const SAMPLE: Item[] = [
  { name: "ツアーTシャツ（ホワイト）", price: 4500, category: "アパレル", emoji: "👕", color: "#f9a8d4" },
  { name: "ツアーTシャツ（ブラック）", price: 4500, category: "アパレル", emoji: "👕", color: "#475569" },
  { name: "ペンライト", price: 3800, category: "ライト", emoji: "🔦", color: "#a78bfa", desc: "電池別売り。会場限定カラーあり。" },
  { name: "マフラータオル", price: 2500, category: "タオル", emoji: "🧣", color: "#60a5fa" },
  { name: "フェイスタオル", price: 1800, category: "タオル", emoji: "🧺", color: "#34d399" },
  { name: "アクリルスタンド", price: 2000, category: "アクスタ", emoji: "🧍", color: "#fbbf24" },
  { name: "ランダム缶バッジ（全10種）", price: 500, category: "ランダム", emoji: "🔘", color: "#fb7185", desc: "1回500円。お一人様20個まで。" },
  { name: "トートバッグ", price: 3000, category: "バッグ", emoji: "👜", color: "#f472b6" },
  { name: "キーホルダー", price: 1200, category: null, emoji: "🔑", color: "#facc15" },
  { name: "ツアーパンフレット", price: 3500, category: null, emoji: "📖", color: "#818cf8" },
  { name: "パーカー", price: 7800, category: "アパレル", emoji: "🧥", color: "#94a3b8" },
  { name: "ステッカーセット", price: 800, category: null, emoji: "✨", color: "#2dd4bf" },
  { name: "ブランケット", price: 5500, category: null, emoji: "🛏️", color: "#c084fc" },
  // 表示の崩れ確認用
  { name: "【会場限定】スペシャルフォトブック＆メイキング映像ダウンロードカード付きプレミアムセット", price: 12000, category: "会場限定", emoji: "📸", color: "#f97316" },
  { name: "ガチャガチャ（価格未定）", price: null, category: "ランダム", emoji: "🎁", color: "#22c55e" },
  { name: "リストバンド（画像なし）", price: 1000, category: null, emoji: null, color: "" },
  { name: "ショッパー（画像なし・価格未定）", price: null, category: null, emoji: null, color: "" },
];
const OWNED_SAMPLE = new Set(["ペンライト", "マフラータオル", "アクリルスタンド", "ツアーパンフレット", "ステッカーセット"]);

async function renderImages(specs: { emoji: string; color: string; label: string; w: number; h: number }[]) {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  // tsx(esbuild) が関数に __name() を差し込みブラウザ側で落ちるため、描画処理は素の JS 文字列で渡す
  const RENDER = `async (list) => {
    const toB64 = async (c, q) => {
      const blob = await new Promise((r) => c.toBlob((b) => r(b), "image/webp", q));
      const buf = new Uint8Array(await blob.arrayBuffer());
      let s = "";
      for (const x of buf) s += String.fromCharCode(x);
      return btoa(s);
    };
    const draw = (it, w, h) => {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d");
      const g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, it.color); g.addColorStop(1, "#ffffff");
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.textAlign = "center"; x.textBaseline = "middle";
      x.font = Math.round(Math.min(w, h) * 0.42) + 'px "Apple Color Emoji", sans-serif';
      x.fillText(it.emoji, w / 2, h * 0.44);
      x.fillStyle = "rgba(15,23,42,0.75)";
      x.font = "bold " + Math.round(Math.min(w, h) * 0.07) + "px sans-serif";
      x.fillText(it.label, w / 2, h * 0.84);
      x.font = "bold " + Math.round(Math.min(w, h) * 0.045) + "px sans-serif";
      x.fillText("SAMPLE / TEST DATA", w / 2, h * 0.93);
      return c;
    };
    const res = [];
    for (const it of list) {
      res.push({ full: await toB64(draw(it, it.w, it.h), 0.82), thumb: await toB64(draw(it, Math.round(it.w * 0.3), Math.round(it.h * 0.3)), 0.8) });
    }
    return res;
  }`;
  const out = (await page.evaluate(`(${RENDER})(${JSON.stringify(specs)})`)) as { full: string; thumb: string }[];
  await browser.close();
  return out.map((o) => ({ full: Buffer.from(o.full, "base64"), thumb: Buffer.from(o.thumb, "base64") }));
}

async function upload(eventId: string, folder: string, img: { full: Buffer; thumb: Buffer }) {
  const id = crypto.randomUUID();
  const full = `${eventId}/${folder}/${id}-full.webp`;
  const thumb = `${eventId}/${folder}/${id}-thumb.webp`;
  for (const [p, b] of [[full, img.full], [thumb, img.thumb]] as const) {
    const { error } = await admin.storage.from(BUCKET).upload(p, b, { contentType: "image/webp" });
    if (error) throw new Error(`upload ${p}: ${error.message}`);
  }
  return { full, thumb };
}

async function resetUser(email = ACCEPTANCE_EMAIL, displayName = "CEO（テスト）"): Promise<string> {
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const old = data.users.find((u) => u.email === email);
  if (old) {
    const { data: evs } = await admin.from("events").select("id").eq("owner_id", old.id);
    for (const e of evs ?? []) {
      const { data: files } = await admin.storage.from(BUCKET).list(e.id, { limit: 1000 });
      for (const f of files ?? []) {
        const { data: inner } = await admin.storage.from(BUCKET).list(`${e.id}/${f.name}`, { limit: 1000 });
        const paths = (inner ?? []).map((x) => `${e.id}/${f.name}/${x.name}`);
        if (paths.length) await admin.storage.from(BUCKET).remove(paths);
      }
    }
    await admin.auth.admin.deleteUser(old.id);
  }
  const { data: created, error } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (error || !created.user) throw new Error(`createUser: ${error?.message}`);
  await admin.from("profiles").update({ display_name: displayName }).eq("id", created.user.id);
  return created.user.id;
}

async function createEvent(ownerId: string, title: string, start: string, end: string | null, desc: string) {
  const { data, error } = await admin
    .from("events")
    .insert({ owner_id: ownerId, title, start_date: start, end_date: end, description: desc })
    .select("id")
    .single();
  if (error || !data) throw new Error(`event: ${error?.message}`);
  // service role での作成でも owner membership はトリガーで作られる
  return data.id as string;
}

async function main() {
  console.log("Acceptance 用テストデータを作成します（ローカル専用）");
  const userId = await resetUser();
  await resetUser(FRIEND_EMAIL, "友だち（テスト）");

  const withImg = SAMPLE.filter((s) => s.emoji);
  const imgs = await renderImages([
    { emoji: "🎤", color: "#ec4899", label: "Sample Live 2026", w: 1600, h: 640 },
    ...withImg.map((s) => ({ emoji: s.emoji!, color: s.color, label: s.name.slice(0, 14), w: 1200, h: 1200 })),
  ]);
  const [coverImg, ...goodsImgs] = imgs;

  // 1. メインのサンプルイベント（17商品・一部取得済み・崩れ確認用データ入り）
  const ev1 = await createEvent(userId, "Sample Live 2026 [テストデータ]", "2026-12-12", "2026-12-13",
    `Sample Arena（架空の会場）。物販は各日 10:00〜。\n${TEST_NOTE}`);
  const cover = await upload(ev1, "cover", coverImg);
  await admin.from("events").update({ cover_image_path: cover.full }).eq("id", ev1);
  let k = 0;
  const ev1Goods: { id: string; name: string }[] = [];
  for (const [i, s] of SAMPLE.entries()) {
    const id = crypto.randomUUID();
    const img = s.emoji ? await upload(ev1, id, goodsImgs[k++]) : null;
    const { error } = await admin.from("goods").insert({
      id, event_id: ev1, name: s.name, price: s.price, category: s.category, description: s.desc ?? null,
      sort_order: i, image_path: img?.full ?? null, thumb_path: img?.thumb ?? null,
    });
    if (error) throw new Error(`goods: ${error.message}`);
    ev1Goods.push({ id, name: s.name });
  }
  await admin.from("ownerships").insert(
    ev1Goods.filter((g) => OWNED_SAMPLE.has(g.name)).map((g) => ({ user_id: userId, goods_id: g.id, status: "owned" }))
  );

  // 2. 大量表示の確認用（120商品）
  const ev2 = await createEvent(userId, "Sample 大量テスト 120商品 [テストデータ]", "2027-01-20", null, `100商品以上の表示・スクロール確認用。\n${TEST_NOTE}`);
  const rows = [];
  for (let i = 0; i < 120; i++) {
    const id = crypto.randomUUID();
    const src = i % 5 === 4 ? null : goodsImgs[i % goodsImgs.length];
    const img = src ? await upload(ev2, id, src) : null;
    rows.push({ id, event_id: ev2, name: `サンプル商品 No.${i + 1}`, price: 500 + (i % 12) * 250, category: ["A", "B", "C", null][i % 4],
      sort_order: i, image_path: img?.full ?? null, thumb_path: img?.thumb ?? null });
  }
  await admin.from("goods").insert(rows);
  await admin.from("ownerships").insert(rows.filter((_, i) => i % 3 === 0).map((r) => ({ user_id: userId, goods_id: r.id, status: "owned" })));

  // 3. コンプリート表示の確認用（全て取得済み）
  const ev3 = await createEvent(userId, "Sample コンプリート済み [テストデータ]", "2026-08-01", null, `100% 表示の確認用。\n${TEST_NOTE}`);
  const done = [];
  for (let i = 0; i < 4; i++) {
    const id = crypto.randomUUID();
    const img = await upload(ev3, id, goodsImgs[i]);
    done.push({ id, event_id: ev3, name: SAMPLE[i].name, price: SAMPLE[i].price, category: SAMPLE[i].category, sort_order: i, image_path: img.full, thumb_path: img.thumb });
  }
  await admin.from("goods").insert(done);
  await admin.from("ownerships").insert(done.map((d) => ({ user_id: userId, goods_id: d.id, status: "owned" })));

  console.log(`完了: ${ACCEPTANCE_EMAIL}`);
  console.log(`  - Sample Live 2026: ${SAMPLE.length}商品（取得済み ${OWNED_SAMPLE.size}）`);
  console.log("  - Sample 大量テスト: 120商品（取得済み 40）");
  console.log("  - Sample コンプリート済み: 4商品（全取得）");
  console.log(`共有確認用の2人目: ${FRIEND_EMAIL}（イベントなし）`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
