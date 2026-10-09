/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// Phase 3（カテゴリ・複数画像・ランダム商品・所持数量）の DB / RLS テスト（ローカル Supabase 専用）
//
// 実行: npm run goods:phase3-test
//   expand（20261008）だけ適用した状態で実行 → 旧アプリの書き込み（goods.image_path の直接更新など）も通ることを確認
//   contract（20261009）も適用した状態で GOODS_P3_CONTRACT=1 を付けて実行 → 列権限が絞られていることを確認
//   A = イベントオーナー / B = 共有から参加した member / C = 無関係のユーザー / anon = 未ログイン
// ============================================================
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const URL_ = process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.GOODS_TEST_SUPABASE_SERVICE_ROLE_KEY ?? "";
const CONTRACT = process.env.GOODS_P3_CONTRACT === "1";
const host = (() => {
  try {
    return new URL(URL_).hostname;
  } catch {
    return "";
  }
})();
if (!["127.0.0.1", "localhost"].includes(host) || !ANON || !SERVICE) {
  console.error(`中止: ローカル Supabase 以外（${host || "未設定"}）には接続しません。`);
  process.exit(2);
}

const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
let passed = 0;
let failed = 0;
const check = (name: string, ok: boolean, detail?: unknown) => {
  if (ok) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`, detail ?? "");
  }
};
const stamp = Date.now();
const PW = `p3-${stamp}-Pw!`;
const users: string[] = [];
const JPEG = Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64");

async function user(label: string): Promise<{ id: string; c: SupabaseClient }> {
  const email = `goods-p3-${label}-${stamp}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: PW, email_confirm: true });
  if (error || !data.user) throw new Error(error?.message);
  users.push(data.user.id);
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { error: e2 } = await c.auth.signInWithPassword({ email, password: PW });
  if (e2) throw new Error(e2.message);
  return { id: data.user.id, c };
}

// 新しいアプリと同じ書き込み方（通常商品 = ownerships / 絵柄 = ownership_variants）
const own = async (c: SupabaseClient, goodsId: string, quantity: number) =>
  c.from("ownerships").upsert({ goods_id: goodsId, quantity, status: quantity > 0 ? "owned" : "unowned" }, { onConflict: "user_id,goods_id" });
const ownV = async (c: SupabaseClient, goodsId: string, variantId: string, quantity: number) =>
  c.from("ownership_variants").upsert({ goods_id: goodsId, variant_id: variantId, quantity }, { onConflict: "user_id,variant_id" });
const qtyOf = async (userId: string, goodsId: string) =>
  (await admin.from("ownerships").select("quantity, status").eq("user_id", userId).eq("goods_id", goodsId).maybeSingle()).data;
const vQtyOf = async (userId: string, variantId: string) =>
  (await admin.from("ownership_variants").select("quantity").eq("user_id", userId).eq("variant_id", variantId).maybeSingle()).data?.quantity ?? null;

async function main() {
  const A = await user("a");
  const B = await user("b");
  const C = await user("c");

  console.log(`\n■ 準備: A のイベント・グッズ、B が共有から参加（${CONTRACT ? "contract 適用後" : "expand のみ"}）`);
  const { data: ev } = await A.c.from("events").insert({ title: `P3 ${stamp}` }).select("id").single();
  const eventId = ev!.id as string;
  const { data: ev2 } = await C.c.from("events").insert({ title: `P3 other ${stamp}` }).select("id").single();
  const otherEventId = ev2!.id as string;
  const { data: link } = await A.c.rpc("goods_create_share_link", { p_event_id: eventId, p_expires_days: null });
  const token = (Array.isArray(link) ? link[0] : link).token;
  const { data: joined } = await B.c.rpc("goods_join_via_share", { p_token: token });
  check("B が共有から参加", (joined as { status: string }).status === "joined");
  const { data: hasM } = await A.c.rpc("goods_event_has_members", { p_event_id: eventId });
  check("goods_event_has_members: 参加者のいるイベントは true", hasM === true);
  const { data: hasM2 } = await C.c.rpc("goods_event_has_members", { p_event_id: otherEventId });
  check("goods_event_has_members: 参加者のいないイベントは false", hasM2 === false);
  const { error: hasMB } = await B.c.rpc("goods_event_has_members", { p_event_id: eventId });
  check("goods_event_has_members: オーナー以外は呼べない", !!hasMB);

  // ---------------- カテゴリ ----------------
  console.log("\n■ カテゴリ（共有カタログ・編集はオーナーだけ）");
  const { data: cat, error: catErr } = await A.c.from("goods_categories").insert({ event_id: eventId, name: "缶バッジ", sort_order: 0 }).select("id").single();
  check("オーナー A はカテゴリを作れる", !catErr && !!cat, catErr);
  const catId = cat!.id as string;
  const { error: bCatIns } = await B.c.from("goods_categories").insert({ event_id: eventId, name: "B作", sort_order: 1 });
  check("メンバー B はカテゴリを作れない", !!bCatIns);
  const { data: bCatUpd } = await B.c.from("goods_categories").update({ name: "書換" }).eq("id", catId).select("id");
  check("メンバー B はカテゴリ名を変えられない", (bCatUpd ?? []).length === 0);
  const { data: bCatDel } = await B.c.from("goods_categories").delete().eq("id", catId).select("id");
  check("メンバー B はカテゴリを削除できない", (bCatDel ?? []).length === 0);
  const { data: bCats } = await B.c.from("goods_categories").select("name").eq("event_id", eventId);
  check("メンバー B にもカテゴリが見える", (bCats ?? []).some((c) => c.name === "缶バッジ"));
  const { data: cCats } = await C.c.from("goods_categories").select("id").eq("event_id", eventId);
  check("無関係の C には見えない", (cCats ?? []).length === 0);
  const { error: anonCat } = await anon.from("goods_categories").select("id").limit(1);
  check("anon はカテゴリを読めない", !!anonCat);
  const { error: dupCat } = await A.c.from("goods_categories").insert({ event_id: eventId, name: "缶バッジ", sort_order: 2 });
  check("同じイベントで同名カテゴリは作れない", dupCat?.code === "23505", dupCat);
  const { error: badCat } = await A.c.from("goods_categories").insert({ event_id: eventId, name: " 前後空白 ", sort_order: 3 });
  check("前後に空白のある名前は保存できない", !!badCat);

  // ---------------- 通常商品・数量 ----------------
  console.log("\n■ 通常商品の所持数量");
  const { data: g1, error: g1Err } = await A.c.from("goods").insert({ event_id: eventId, name: "ペンライト", category_id: catId, sort_order: 0 }).select("id, category").single();
  check("グッズにカテゴリを設定 → 文字列の写しも同期", !g1Err && g1?.category === "缶バッジ", g1Err);
  const goodsId = g1!.id as string;
  check("A: 0 → 1", !(await own(A.c, goodsId, 1)).error && (await qtyOf(A.id, goodsId))?.quantity === 1);
  check("A: 1 → 2（status は owned）", !(await own(A.c, goodsId, 2)).error && (await qtyOf(A.id, goodsId))?.status === "owned");
  check("A: 2 → 1", !(await own(A.c, goodsId, 1)).error && (await qtyOf(A.id, goodsId))?.quantity === 1);
  const zero = await own(A.c, goodsId, 0);
  const z = await qtyOf(A.id, goodsId);
  check("A: 1 → 0（status は unowned）", !zero.error && z?.quantity === 0 && z?.status === "unowned");
  check("マイナスは保存できない", !!(await own(A.c, goodsId, -1)).error);
  check("10000 以上は保存できない", !!(await own(A.c, goodsId, 10000)).error);
  const { error: frac } = await A.c.from("ownerships").upsert({ goods_id: goodsId, quantity: 1.5 }, { onConflict: "user_id,goods_id" });
  check("小数は保存できない", !!frac);
  await own(A.c, goodsId, 3);
  await own(B.c, goodsId, 5);
  const { data: bSees } = await B.c.from("ownerships").select("user_id, quantity").eq("goods_id", goodsId);
  check("B には自分の数量だけが見える（A の 3 個は見えない）", (bSees ?? []).length === 1 && bSees![0].user_id === B.id && bSees![0].quantity === 5);
  const { data: aSees } = await A.c.from("ownerships").select("user_id").eq("goods_id", goodsId);
  check("オーナー A にも B の数量は見えない", (aSees ?? []).every((r) => r.user_id === A.id));
  const { data: bUpdA } = await B.c.from("ownerships").update({ quantity: 0 }).eq("user_id", A.id).eq("goods_id", goodsId).select("id");
  check("B は A の数量を変更できない", (bUpdA ?? []).length === 0 && (await qtyOf(A.id, goodsId))?.quantity === 3);
  const { error: cOwn } = await own(C.c, goodsId, 1);
  check("無関係の C は数量を記録できない", !!cOwn);
  const rows = await admin.from("ownerships").select("id", { count: "exact", head: true }).eq("user_id", A.id).eq("goods_id", goodsId);
  check("upsert を繰り返しても A の行は1つ（一意キーは従来どおり user_id, goods_id）", rows.count === 1);
  const { error: badStatus } = await A.c.from("ownerships").update({ status: "lost" }).eq("goods_id", goodsId);
  check("未定義の status は拒否", !!badStatus);

  console.log("\n■ 旧アプリ互換（status だけ送る・カテゴリ文字列・代表画像の直接更新）");
  const { data: g0 } = await A.c.from("goods").insert({ event_id: eventId, name: "旧形式", sort_order: 1 }).select("id").single();
  const { error: legacyIns } = await A.c.from("ownerships").upsert({ goods_id: g0!.id, status: "owned" }, { onConflict: "user_id,goods_id" });
  check("status=owned だけの upsert（旧アプリと同じ）→ 数量 1", !legacyIns && (await qtyOf(A.id, g0!.id))?.quantity === 1, legacyIns);
  await A.c.from("ownerships").update({ quantity: 4 }).eq("goods_id", g0!.id);
  await A.c.from("ownerships").update({ status: "owned" }).eq("goods_id", g0!.id);
  check("数量4のまま status=owned を送っても 4 のまま", (await qtyOf(A.id, g0!.id))?.quantity === 4);
  await A.c.from("ownerships").update({ status: "unowned" }).eq("goods_id", g0!.id);
  check("status=unowned を送ると 0", (await qtyOf(A.id, g0!.id))?.quantity === 0);
  const { data: legacyCat, error: lcErr } = await A.c.from("goods").update({ category: "タオル" }).eq("id", g0!.id).select("category_id, category").single();
  check("カテゴリ文字列だけを送ると、同名カテゴリが作られて紐づく", !lcErr && !!legacyCat?.category_id && legacyCat?.category === "タオル", lcErr);
  const legacyPath = `${eventId}/${g0!.id}/legacy-full.jpg`;
  const { error: legacyImg } = await A.c.from("goods").update({ image_path: legacyPath, thumb_path: legacyPath.replace("-full", "-thumb") }).eq("id", g0!.id);
  if (CONTRACT) {
    check("contract 後: goods.image_path はクライアントから直接書けない", !!legacyImg);
  } else {
    const gi = (await admin.from("goods_images").select("image_path, sort_order").eq("goods_id", g0!.id)).data ?? [];
    check("expand 中: 旧アプリの goods.image_path 更新が画像一覧（先頭）に反映", !legacyImg && gi.length === 1 && gi[0].image_path === legacyPath && gi[0].sort_order === 0, legacyImg ?? gi);
    await A.c.from("goods").update({ image_path: null, thumb_path: null }).eq("id", g0!.id);
    check("expand 中: 旧アプリが画像を外すと画像一覧からも消える", ((await admin.from("goods_images").select("id").eq("goods_id", g0!.id)).data ?? []).length === 0);
    const { data: g0b, error: g0bErr } = await A.c.from("goods").insert({ event_id: eventId, name: "旧形式2", sort_order: 1 }).select("id").single();
    const p2 = `${eventId}/${g0b!.id}/x-full.jpg`;
    await A.c.from("goods").update({ image_path: p2, thumb_path: p2 }).eq("id", g0b!.id);
    check("expand 中: 旧アプリの新規登録→画像の設定も反映", !g0bErr && ((await admin.from("goods_images").select("id").eq("goods_id", g0b!.id)).data ?? []).length === 1);
    await A.c.from("goods").update({ deleted_at: new Date().toISOString() }).eq("id", g0b!.id);
  }
  const { error: legacyForeign } = await A.c.from("goods").update({ image_path: `${otherEventId}/x/evil-full.jpg` }).eq("id", g0!.id);
  check("goods.image_path に他イベントのパスは保存できない", !!legacyForeign);

  // ---------------- 画像 ----------------
  console.log("\n■ 複数画像（代表画像・並び順・権限・パス）");
  const pathOf = (n: number) => `${eventId}/${goodsId}/${stamp}-${n}-full.jpg`;
  for (const n of [1, 2, 3]) {
    await admin.storage.from("goods-images").upload(pathOf(n), JPEG, { contentType: "image/jpeg" });
    await admin.storage.from("goods-images").upload(pathOf(n).replace("-full", "-thumb"), JPEG, { contentType: "image/jpeg" });
  }
  const img = (n: number) => ({ image_path: pathOf(n), thumb_path: pathOf(n).replace("-full", "-thumb") });
  const { error: m1Err } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [img(1), img(2), img(3)], p_variants: null });
  check("A が画像3枚を保存", !m1Err, m1Err);
  const cover1 = (await admin.from("goods").select("image_path").eq("id", goodsId).single()).data?.image_path;
  check("goods.image_path = 先頭（代表）の画像（旧アプリもこれを表示）", cover1 === pathOf(1));
  const { data: imgs } = await A.c.from("goods_images").select("id, image_path, sort_order").eq("goods_id", goodsId).order("sort_order");
  const ids = (imgs ?? []).map((i) => i.id);
  const { data: m2 } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [{ id: ids[2] }, { id: ids[0] }], p_variants: null });
  const cover2 = (await admin.from("goods").select("image_path").eq("id", goodsId).single()).data?.image_path;
  check("並び替えで代表を3枚目に変更 → goods.image_path も変わる", cover2 === pathOf(3));
  const removed = (m2 as { removed_paths: string[] }).removed_paths;
  check("外した画像（2枚目）の Storage パスが削除対象として返る", removed.includes(pathOf(2)) && removed.includes(pathOf(2).replace("-full", "-thumb")) && removed.length === 2, removed);
  check("画像の行は2つ", ((await admin.from("goods_images").select("id").eq("goods_id", goodsId)).data ?? []).length === 2);
  const { error: bMedia } = await B.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [], p_variants: null });
  check("メンバー B は画像を変更できない", !!bMedia);
  const { error: bImgIns } = await B.c.from("goods_images").insert({ goods_id: goodsId, event_id: eventId, ...img(1) });
  check("メンバー B は画像を直接追加できない", !!bImgIns);
  const { data: bImgDel } = await B.c.from("goods_images").delete().eq("goods_id", goodsId).select("id");
  check("メンバー B は画像を直接削除できない", (bImgDel ?? []).length === 0);
  const { data: bImgs } = await B.c.from("goods_images").select("id").eq("goods_id", goodsId);
  check("メンバー B は同じ画像一覧を見られる", (bImgs ?? []).length === 2);
  const { data: cImgs } = await C.c.from("goods_images").select("id").eq("goods_id", goodsId);
  check("無関係の C は画像一覧を見られない", (cImgs ?? []).length === 0);
  const { error: foreign } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [{ image_path: `${otherEventId}/x/evil-full.jpg`, thumb_path: `${otherEventId}/x/evil-thumb.jpg` }], p_variants: null });
  check("他のイベントのフォルダの画像パスは登録できない", !!foreign);
  const { error: otherGoods } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [{ image_path: `${eventId}/${g0!.id}/a-full.jpg`, thumb_path: `${eventId}/${g0!.id}/a-thumb.jpg` }], p_variants: null });
  check("同じイベントでも別のグッズのフォルダは登録できない", !!otherGoods);
  const { error: trav } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [{ image_path: `${eventId}/${goodsId}/../../${otherEventId}/a-full.jpg` }], p_variants: null });
  check("../ を含むパスは登録できない", !!trav);
  const { error: imgForeignDirect } = await A.c.from("goods_images").insert({ goods_id: goodsId, event_id: otherEventId, image_path: `${otherEventId}/x/e-full.jpg`, thumb_path: `${otherEventId}/x/e-thumb.jpg`, sort_order: 5 });
  check("goods_images への直接 INSERT でも他イベントのパス・event_id は通らない", !!imgForeignDirect);
  const { error: coverForeign } = await A.c.from("events").update({ cover_image_path: `${otherEventId}/cover/x-full.jpg` }).eq("id", eventId);
  check("イベントのカバーにも他イベントの画像は指定できない", !!coverForeign);
  const { error: coverOk } = await A.c.from("events").update({ cover_image_path: `${eventId}/cover/ok-full.jpg` }).eq("id", eventId);
  check("自分のイベントのカバー（規約どおり）は保存できる", !coverOk, coverOk);
  const eleven = Array.from({ length: 11 }, (_, i) => ({ image_path: `${eventId}/${goodsId}/many-${i}-full.jpg`, thumb_path: `${eventId}/${goodsId}/many-${i}-thumb.jpg` }));
  const { error: tooMany } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: eleven, p_variants: null });
  check("画像は11枚以上保存できない", !!tooMany);

  // ---------------- ランダム商品 ----------------
  console.log("\n■ ランダム商品（絵柄ごとの数量は ownership_variants、ownerships は合計の写し）");
  const { data: rg } = await A.c.from("goods").insert({ event_id: eventId, name: "ランダム缶バッジ", kind: "random", sort_order: 2 }).select("id").single();
  const rId = rg!.id as string;
  const { error: rv } = await A.c.rpc("goods_save_media", { p_goods_id: rId, p_images: [], p_variants: Array.from({ length: 8 }, (_, i) => ({ name: `No.${i + 1}` })) });
  check("絵柄8種を登録", !rv, rv);
  const { data: vs } = await A.c.from("goods_variants").select("id, name").eq("goods_id", rId).order("sort_order");
  check("絵柄は登録順に8件", (vs ?? []).length === 8 && vs![0].name === "No.1");
  const v1 = vs![0].id as string, v2 = vs![1].id as string, v3 = vs![2].id as string;
  check("A: 絵柄1 を2個", !(await ownV(A.c, rId, v1, 2)).error);
  check("A: 絵柄2 を1個", !(await ownV(A.c, rId, v2, 1)).error);
  check("B: 絵柄1 を5個（A と分離）", !(await ownV(B.c, rId, v1, 5)).error);
  check("B: 絵柄2 を3個", !(await ownV(B.c, rId, v2, 3)).error);
  const aAgg = await qtyOf(A.id, rId);
  check("A の合計（ownerships）= 3、status = owned（旧アプリは取得済みと表示）", aAgg?.quantity === 3 && aAgg?.status === "owned", aAgg);
  check("B の合計 = 8", (await qtyOf(B.id, rId))?.quantity === 8);
  check("ランダム商品の ownerships を直接書くことはできない（合計がずれない）", !!(await own(A.c, rId, 9)).error && (await qtyOf(A.id, rId))?.quantity === 3);
  const { error: legacyRandom } = await A.c.from("ownerships").update({ status: "unowned" }).eq("goods_id", rId);
  check("旧アプリがランダム商品を「未取得」にしても絵柄の数量は消えない（拒否）", !!legacyRandom && (await vQtyOf(A.id, v1)) === 2);
  const { data: otherV } = await A.c.from("goods").insert({ event_id: eventId, name: "別ランダム", kind: "random", sort_order: 3 }).select("id").single();
  await A.c.rpc("goods_save_media", { p_goods_id: otherV!.id, p_images: [], p_variants: [{ name: "x" }] });
  const foreignVariant = (await admin.from("goods_variants").select("id").eq("goods_id", otherV!.id).single()).data!.id;
  check("他のグッズの絵柄 ID では保存できない", !!(await ownV(A.c, rId, foreignVariant, 1)).error);
  check("通常商品に絵柄の数量は付けられない", !!(await ownV(A.c, goodsId, v1, 1)).error);
  check("無関係の C は絵柄の数量を記録できない", !!(await ownV(C.c, rId, v1, 1)).error);
  const { data: bSeesV } = await B.c.from("ownership_variants").select("user_id").eq("goods_id", rId);
  check("B には自分の絵柄の数量だけが見える", (bSeesV ?? []).length === 2 && bSeesV!.every((r) => r.user_id === B.id));
  const { error: bVar } = await B.c.from("goods_variants").insert({ goods_id: rId, event_id: eventId, name: "B" });
  check("メンバー B は絵柄を追加できない", !!bVar);
  const { error: normVar } = await A.c.from("goods_variants").insert({ goods_id: goodsId, event_id: eventId, name: "x" });
  check("通常商品には絵柄を追加できない", !!normVar);
  const { data: hardDel } = await A.c.from("goods_variants").delete().eq("id", v2).select("id");
  check("オーナーでも絵柄を物理削除できない（参加者の数量を守る）", (hardDel ?? []).length === 0 && (await vQtyOf(B.id, v2)) === 3);

  const { data: myEv } = await A.c.rpc("goods_my_events");
  const mine = (myEv as { id: string; owned_count: number; total_count: number }[]).find((e) => e.id === eventId);
  check("マイイベントの取得数はグッズ単位（絵柄で重複しない）", mine?.owned_count === 2 && mine?.total_count === 4, mine);

  console.log("\n■ 絵柄の削除は論理削除（参加者の数量は残り、戻せる）");
  const keep = (vs ?? []).filter((v) => v.id !== v2).map((v) => ({ id: v.id, name: v.name }));
  const { error: delV } = await A.c.rpc("goods_save_media", { p_goods_id: rId, p_images: [], p_variants: keep });
  const v2row = (await admin.from("goods_variants").select("deleted_at").eq("id", v2).single()).data;
  check("絵柄2を削除 → deleted_at が入る（行は残る）", !delV && !!v2row?.deleted_at, delV);
  check("削除した絵柄の数量（A=1, B=3）は残る", (await vQtyOf(A.id, v2)) === 1 && (await vQtyOf(B.id, v2)) === 3);
  check("合計からは除かれる（A=2, B=5）", (await qtyOf(A.id, rId))?.quantity === 2 && (await qtyOf(B.id, rId))?.quantity === 5);
  check("削除した絵柄には数量を記録できない", !!(await ownV(B.c, rId, v2, 4)).error);
  const { data: catDel } = await admin.rpc("goods_get_shared_catalog", { p_token: token });
  const rndDel = (catDel as { goods: { name: string; variants: { name: string }[] }[] }).goods.find((g) => g.name === "ランダム缶バッジ");
  check("共有カタログに削除した絵柄は出ない", rndDel?.variants.length === 7 && !rndDel.variants.some((v) => v.name === "No.2"));
  const restore = [...keep.slice(0, 1), { id: v2, name: "No.2" }, ...keep.slice(1)];
  const { error: resV } = await A.c.rpc("goods_save_media", { p_goods_id: rId, p_images: [], p_variants: restore });
  check("id を含めて送ると絵柄が戻る", !resV && (await admin.from("goods_variants").select("deleted_at").eq("id", v2).single()).data?.deleted_at === null, resV);
  check("戻すと数量も合計に戻る（A=3, B=8）", (await qtyOf(A.id, rId))?.quantity === 3 && (await qtyOf(B.id, rId))?.quantity === 8);

  console.log("\n■ 種類の変換");
  const { error: kindDirect } = await A.c.from("goods").update({ kind: "normal" } as never).eq("id", rId);
  check("種類はクライアントから直接変えられない（変換 RPC だけ）", !!kindDirect && (await admin.from("goods").select("kind").eq("id", rId).single()).data?.kind === "random");
  const { error: bConv } = await B.c.rpc("goods_convert_kind", { p_goods_id: rId, p_kind: "normal" });
  check("メンバー B は変換できない", !!bConv);
  await ownV(A.c, rId, v3, 4);
  const { error: sharedConv } = await A.c.rpc("goods_convert_kind", { p_goods_id: rId, p_kind: "normal" });
  check("共有中（参加者あり）のランダム → 通常は拒否（hint: goods_convert_shared）", (sharedConv as { hint?: string } | null)?.hint === "goods_convert_shared", sharedConv);
  check("拒否後も絵柄と数量はそのまま（A: 2/1/4, B: 5/3）", (await vQtyOf(A.id, v1)) === 2 && (await vQtyOf(A.id, v2)) === 1 && (await vQtyOf(A.id, v3)) === 4 && (await vQtyOf(B.id, v1)) === 5 && (await vQtyOf(B.id, v2)) === 3);

  // 参加者のいない C のイベントで、ランダム ⇄ 通常の往復
  const { data: cr } = await C.c.from("goods").insert({ event_id: otherEventId, name: "C ランダム", kind: "random", sort_order: 0 }).select("id").single();
  const crId = cr!.id as string;
  await C.c.rpc("goods_save_media", { p_goods_id: crId, p_images: [], p_variants: [{ name: "a" }, { name: "b" }, { name: "c" }] });
  const cvs = (await admin.from("goods_variants").select("id").eq("goods_id", crId).order("sort_order")).data!.map((v) => v.id as string);
  await ownV(C.c, crId, cvs[0], 2);
  await ownV(C.c, crId, cvs[1], 4);
  await C.c.rpc("goods_save_media", { p_goods_id: crId, p_images: [], p_variants: [{ id: cvs[0], name: "a" }, { id: cvs[2], name: "c" }] });
  const { data: toN, error: toNErr } = await C.c.rpc("goods_convert_kind", { p_goods_id: crId, p_kind: "normal" });
  check("参加者のいないリストではランダム → 通常に変換できる", !toNErr && (toN as { status: string }).status === "converted", toNErr);
  check("通常商品の数量 = 表示中の絵柄の合計（2。削除済みの絵柄の4は含めない＝変換前の表示どおり）", (await qtyOf(C.id, crId))?.quantity === 2);
  check("絵柄と絵柄の数量はすべて削除", ((await admin.from("goods_variants").select("id").eq("goods_id", crId)).data ?? []).length === 0 && ((await admin.from("ownership_variants").select("id").eq("goods_id", crId)).data ?? []).length === 0);
  await own(C.c, crId, 6);
  const { data: toR } = await C.c.rpc("goods_convert_kind", { p_goods_id: crId, p_kind: "random", p_first_variant_name: "A柄" });
  const newV = (toR as { variant_id: string }).variant_id;
  check("通常 → ランダム: 数量は1つ目の絵柄へ（6）", (await vQtyOf(C.id, newV)) === 6);
  check("通常 → ランダム: 合計も 6 のまま", (await qtyOf(C.id, crId))?.quantity === 6);
  // 共有中の通常 → ランダム（参加者全員の数量が移る）
  const { data: toR2 } = await A.c.rpc("goods_convert_kind", { p_goods_id: goodsId, p_kind: "random", p_first_variant_name: "絵柄1" });
  const gv = (toR2 as { variant_id: string }).variant_id;
  check("共有中の通常 → ランダムは可能で、A=3・B=5 が1つ目の絵柄へ移る", (await vQtyOf(A.id, gv)) === 3 && (await vQtyOf(B.id, gv)) === 5 && (await qtyOf(B.id, goodsId))?.quantity === 5);

  console.log("\n■ カテゴリの名前変更・削除");
  await A.c.from("goods_categories").update({ name: "缶バッジ（全種）" }).eq("id", catId);
  check("カテゴリ名の変更がグッズの写しに反映", (await admin.from("goods").select("category").eq("id", goodsId).single()).data?.category === "缶バッジ（全種）");
  await A.c.from("goods_categories").delete().eq("id", catId);
  const afterDel = (await admin.from("goods").select("id, category_id, category, deleted_at").eq("id", goodsId).single()).data;
  check("カテゴリを削除してもグッズは残り、未分類になる", !!afterDel && afterDel.category_id === null && afterDel.category === null && afterDel.deleted_at === null);

  console.log("\n■ イベントあたりの画像ファイル数の上限（2000）");
  {
    const { data: capEv } = await C.c.from("events").insert({ title: `P3 cap ${stamp}` }).select("id").single();
    const capId = capEv!.id as string;
    let made = 0;
    for (let g = 0; g < 20; g++) {
      const { data: rgx } = await admin.from("goods").insert({ event_id: capId, name: `cap${g}`, kind: "random", sort_order: g }).select("id").single();
      const rows2 = Array.from({ length: 100 }, (_, i) => ({ goods_id: rgx!.id, event_id: capId, name: `v${i}`, sort_order: i, image_path: `${capId}/${rgx!.id}/v${i}-full.jpg`, thumb_path: `${capId}/${rgx!.id}/v${i}-thumb.jpg` }));
      const { error } = await admin.from("goods_variants").insert(rows2);
      if (error) break;
      made += 100;
    }
    check("絵柄画像 2000 件までは登録できる", made === 2000, made);
    const { data: extra } = await admin.from("goods").insert({ event_id: capId, name: "extra", sort_order: 99 }).select("id").single();
    const { error: overCap } = await admin.from("goods_images").insert({ goods_id: extra!.id, event_id: capId, image_path: `${capId}/${extra!.id}/x-full.jpg`, thumb_path: `${capId}/${extra!.id}/x-thumb.jpg`, sort_order: 0 });
    check("2001 件目（ギャラリー画像）は拒否（hint: goods_event_image_limit）", (overCap as { hint?: string } | null)?.hint === "goods_event_image_limit", overCap);
    await admin.from("events").delete().eq("id", capId);
  }

  console.log("\n■ 参照されていない画像ファイルの回収（アップロード後に保存されなかったもの）");
  {
    const orphan = `${eventId}/${goodsId}/${stamp}-orphan-full.jpg`;
    await admin.storage.from("goods-images").upload(orphan, JPEG, { contentType: "image/jpeg" });
    const { data: fresh } = await admin.rpc("goods_unreferenced_storage_paths");
    check("作成から1日未満のファイルは対象外（保存中のアップロードを消さない）", !(fresh as string[]).includes(orphan));
    const { data: all } = await admin.rpc("goods_unreferenced_storage_paths", { p_older_than: "0 seconds" });
    const list = all as string[];
    check("参照されていないファイルは対象になる", list.includes(orphan) && list.includes(pathOf(2)), list.length);
    check("代表画像・ギャラリーで参照中のファイルは対象外", !list.includes(pathOf(1)) && !list.includes(pathOf(3)) && !list.includes(pathOf(3).replace("-full", "-thumb")));
    const { error: aCall } = await A.c.rpc("goods_unreferenced_storage_paths", { p_older_than: "0 seconds" });
    check("ユーザーは呼べない（service_role 専用）", !!aCall);
    await admin.storage.from("goods-images").remove([orphan]);
  }

  console.log("\n■ 共有カタログ（所持情報を含まない）");
  const { data: cat2 } = await admin.rpc("goods_get_shared_catalog", { p_token: token });
  const c2 = cat2 as { categories: string[]; goods: { name: string; kind: string; variants: { name: string }[] }[] };
  const rnd = c2.goods.find((g) => g.name === "ランダム缶バッジ");
  check("カタログにランダム商品と絵柄が含まれる", rnd?.kind === "random" && rnd.variants.length === 8);
  check("カタログにカテゴリ一覧が含まれる", Array.isArray(c2.categories) && c2.categories.includes("タオル"));
  check("カタログのグッズに所持数・ユーザー情報が含まれない", !/quantity|user_id|owner|"owned"|"unowned"|acquired/.test(JSON.stringify(c2.goods)) && !/user_id|quantity/.test(JSON.stringify(cat2)));
  const { error: anonCat2 } = await anon.rpc("goods_get_shared_catalog", { p_token: token });
  check("anon はカタログ RPC を直接呼べない", !!anonCat2);

  if (CONTRACT) {
    console.log("\n■ contract（列権限）");
    const { error: cIns } = await A.c.from("goods").insert({ event_id: eventId, name: "新アプリ", price: 100, category_id: null, kind: "normal", sort_order: 9 }).select("id").single();
    check("新アプリの INSERT 列は書ける", !cIns, cIns);
    const { error: cUpd } = await A.c.from("goods").update({ name: "改名", price: 200, sort_order: 1 }).eq("id", g0!.id);
    check("新アプリの UPDATE 列は書ける", !cUpd, cUpd);
    const { error: cThumb } = await A.c.from("goods").update({ thumb_path: null }).eq("id", g0!.id);
    check("goods.thumb_path は直接書けない", !!cThumb);
  }

  console.log("\n■ 退会（B）: B の数量はすべて消え、カタログは残る");
  const { error: prepB } = await admin.rpc("goods_prepare_account_deletion", { p_user: B.id });
  const { error: delB } = await admin.auth.admin.deleteUser(B.id);
  users.splice(users.indexOf(B.id), 1);
  check("B の退会処理", !prepB && !delB, prepB ?? delB);
  check("B の所持数量（通常・絵柄）は残らない", ((await admin.from("ownerships").select("id").eq("user_id", B.id)).data ?? []).length === 0 && ((await admin.from("ownership_variants").select("id").eq("user_id", B.id)).data ?? []).length === 0);
  check("A のグッズ・絵柄・画像・数量は残る", ((await admin.from("goods_variants").select("id").eq("goods_id", rId)).data ?? []).length === 8 && ((await admin.from("goods_images").select("id").eq("goods_id", goodsId)).data ?? []).length === 2 && (await vQtyOf(A.id, v1)) === 2);
}

main()
  .catch((e) => {
    failed++;
    console.log("  ❌ 予期しないエラー", e);
  })
  .finally(async () => {
    for (const id of users) {
      await admin.rpc("goods_prepare_account_deletion", { p_user: id }).then(() => 0, () => 0);
      await admin.auth.admin.deleteUser(id);
    }
    console.log(`\n結果: ${passed} passed / ${failed} failed`);
    process.exit(failed ? 1 : 0);
  });
