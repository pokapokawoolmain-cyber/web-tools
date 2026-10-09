/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// Phase 3（カテゴリ・複数画像・ランダム商品・所持数量）の DB / RLS テスト（ローカル Supabase 専用）
//
// 実行: npm run goods:phase3-test
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

const own = async (c: SupabaseClient, goodsId: string, variantId: string | null, quantity: number) =>
  c.from("ownerships").upsert({ goods_id: goodsId, variant_id: variantId, quantity, status: quantity > 0 ? "owned" : "unowned" }, { onConflict: "user_id,goods_id,variant_id" });
const qtyOf = async (userId: string, goodsId: string, variantId: string | null) => {
  let q = admin.from("ownerships").select("quantity, status").eq("user_id", userId).eq("goods_id", goodsId);
  q = variantId ? q.eq("variant_id", variantId) : q.is("variant_id", null);
  return (await q.maybeSingle()).data;
};

async function main() {
  const A = await user("a");
  const B = await user("b");
  const C = await user("c");

  console.log("\n■ 準備: A のイベント・グッズ、B が共有から参加");
  const { data: ev } = await A.c.from("events").insert({ title: `P3 ${stamp}` }).select("id").single();
  const eventId = ev!.id as string;
  const { data: ev2 } = await C.c.from("events").insert({ title: `P3 other ${stamp}` }).select("id").single();
  const otherEventId = ev2!.id as string;
  const { data: link } = await A.c.rpc("goods_create_share_link", { p_event_id: eventId, p_expires_days: null });
  const token = (Array.isArray(link) ? link[0] : link).token;
  const { data: joined } = await B.c.rpc("goods_join_via_share", { p_token: token });
  check("B が共有から参加", (joined as { status: string }).status === "joined");

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
  check("A: 0 → 1", !(await own(A.c, goodsId, null, 1)).error && (await qtyOf(A.id, goodsId, null))?.quantity === 1);
  check("A: 1 → 2（status は owned）", !(await own(A.c, goodsId, null, 2)).error && (await qtyOf(A.id, goodsId, null))?.status === "owned");
  check("A: 2 → 1", !(await own(A.c, goodsId, null, 1)).error && (await qtyOf(A.id, goodsId, null))?.quantity === 1);
  const zero = await own(A.c, goodsId, null, 0);
  const z = await qtyOf(A.id, goodsId, null);
  check("A: 1 → 0（status は unowned）", !zero.error && z?.quantity === 0 && z?.status === "unowned");
  check("マイナスは保存できない", !!(await own(A.c, goodsId, null, -1)).error);
  check("10000 以上は保存できない", !!(await own(A.c, goodsId, null, 10000)).error);
  const { error: frac } = await A.c.from("ownerships").upsert({ goods_id: goodsId, variant_id: null, quantity: 1.5 }, { onConflict: "user_id,goods_id,variant_id" });
  check("小数は保存できない", !!frac);
  await own(A.c, goodsId, null, 3);
  await own(B.c, goodsId, null, 5);
  const { data: bSees } = await B.c.from("ownerships").select("user_id, quantity").eq("goods_id", goodsId);
  check("B には自分の数量だけが見える（A の 3 個は見えない）", (bSees ?? []).length === 1 && bSees![0].user_id === B.id && bSees![0].quantity === 5);
  const { data: aSees } = await A.c.from("ownerships").select("user_id").eq("goods_id", goodsId);
  check("オーナー A にも B の数量は見えない", (aSees ?? []).every((r) => r.user_id === A.id));
  const { data: bUpdA } = await B.c.from("ownerships").update({ quantity: 0 }).eq("user_id", A.id).eq("goods_id", goodsId).select("id");
  check("B は A の数量を変更できない", (bUpdA ?? []).length === 0 && (await qtyOf(A.id, goodsId, null))?.quantity === 3);
  const { error: cOwn } = await own(C.c, goodsId, null, 1);
  check("無関係の C は数量を記録できない", !!cOwn);
  const rows = await admin.from("ownerships").select("id", { count: "exact", head: true }).eq("user_id", A.id).eq("goods_id", goodsId);
  check("upsert を繰り返しても A の行は1つ（variant なしでも一意）", rows.count === 1);

  console.log("\n■ 旧クライアント互換（status だけ送る）");
  const { data: g0 } = await A.c.from("goods").insert({ event_id: eventId, name: "旧形式", sort_order: 1 }).select("id").single();
  const { error: legacyIns } = await A.c.from("ownerships").insert({ goods_id: g0!.id, status: "owned" });
  check("status=owned だけの INSERT → 数量 1", !legacyIns && (await qtyOf(A.id, g0!.id, null))?.quantity === 1, legacyIns);
  await A.c.from("ownerships").update({ quantity: 4 }).eq("goods_id", g0!.id);
  await A.c.from("ownerships").update({ status: "owned" }).eq("goods_id", g0!.id);
  check("数量4のまま status=owned を送っても 4 のまま", (await qtyOf(A.id, g0!.id, null))?.quantity === 4);
  await A.c.from("ownerships").update({ status: "unowned" }).eq("goods_id", g0!.id);
  check("status=unowned を送ると 0", (await qtyOf(A.id, g0!.id, null))?.quantity === 0);
  const { data: legacyCat, error: lcErr } = await A.c.from("goods").update({ category: "タオル" }).eq("id", g0!.id).select("category_id, category").single();
  check("カテゴリ文字列だけを送ると、同名カテゴリが作られて紐づく", !lcErr && !!legacyCat?.category_id && legacyCat?.category === "タオル", lcErr);

  // ---------------- 画像 ----------------
  console.log("\n■ 複数画像（代表画像・並び順・権限・パス）");
  const pathOf = (n: number) => `${eventId}/${goodsId}/${stamp}-${n}-full.jpg`;
  for (const n of [1, 2, 3]) {
    await admin.storage.from("goods-images").upload(pathOf(n), JPEG, { contentType: "image/jpeg" });
    await admin.storage.from("goods-images").upload(pathOf(n).replace("-full", "-thumb"), JPEG, { contentType: "image/jpeg" });
  }
  const img = (n: number) => ({ image_path: pathOf(n), thumb_path: pathOf(n).replace("-full", "-thumb") });
  const { data: m1, error: m1Err } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [img(1), img(2), img(3)], p_variants: null });
  check("A が画像3枚を保存", !m1Err, m1Err);
  const cover1 = (await admin.from("goods").select("image_path").eq("id", goodsId).single()).data?.image_path;
  check("goods.image_path = 先頭（代表）の画像", cover1 === pathOf(1));
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
  const { error: trav } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: [{ image_path: `${eventId}/${goodsId}/../../${otherEventId}/a-full.jpg` }], p_variants: null });
  check("../ を含むパスは登録できない", !!trav);
  const { error: directImg } = await A.c.from("goods").update({ image_path: pathOf(1) }).eq("id", goodsId);
  check("goods.image_path はクライアントから直接書けない（代表画像の写し）", !!directImg);
  const { error: coverForeign } = await A.c.from("events").update({ cover_image_path: `${otherEventId}/cover/x-full.jpg` }).eq("id", eventId);
  check("イベントのカバーにも他イベントの画像は指定できない", !!coverForeign);
  const eleven = Array.from({ length: 11 }, (_, i) => ({ image_path: `${eventId}/${goodsId}/many-${i}-full.jpg`, thumb_path: `${eventId}/${goodsId}/many-${i}-thumb.jpg` }));
  const { error: tooMany } = await A.c.rpc("goods_save_media", { p_goods_id: goodsId, p_images: eleven, p_variants: null });
  check("画像は11枚以上保存できない", !!tooMany);

  // ---------------- ランダム商品 ----------------
  console.log("\n■ ランダム商品（絵柄ごとの数量）");
  const { data: rg } = await A.c.from("goods").insert({ event_id: eventId, name: "ランダム缶バッジ", kind: "random", sort_order: 2 }).select("id").single();
  const rId = rg!.id as string;
  const { error: rv } = await A.c.rpc("goods_save_media", {
    p_goods_id: rId,
    p_images: [],
    p_variants: Array.from({ length: 8 }, (_, i) => ({ name: `No.${i + 1}` })),
  });
  check("絵柄8種を登録", !rv, rv);
  const { data: vs } = await A.c.from("goods_variants").select("id, name").eq("goods_id", rId).order("sort_order");
  check("絵柄は登録順に8件", (vs ?? []).length === 8 && vs![0].name === "No.1");
  const v1 = vs![0].id, v2 = vs![1].id;
  check("A: 絵柄1 を2個", !(await own(A.c, rId, v1, 2)).error);
  check("A: 絵柄2 を1個", !(await own(A.c, rId, v2, 1)).error);
  check("B: 絵柄1 を5個（A と分離）", !(await own(B.c, rId, v1, 5)).error);
  const { data: aR } = await A.c.from("ownerships").select("quantity").eq("goods_id", rId);
  check("A の合計 = 3（2+1）", (aR ?? []).reduce((s, r) => s + r.quantity, 0) === 3);
  check("ランダム商品で絵柄なしの数量は保存できない", !!(await own(A.c, rId, null, 1)).error);
  const { data: g1v } = await admin.from("goods_variants").select("id").neq("goods_id", rId).limit(1);
  const foreignVariant = (vs ?? [])[0] && g1v?.[0]?.id;
  if (foreignVariant) check("他のグッズの絵柄 ID では保存できない", !!(await own(A.c, rId, foreignVariant, 1)).error);
  check("通常商品に絵柄 ID は付けられない", !!(await own(A.c, goodsId, v1, 1)).error);
  const { error: bVar } = await B.c.from("goods_variants").insert({ goods_id: rId, event_id: eventId, name: "B" });
  check("メンバー B は絵柄を追加できない", !!bVar);
  const { error: normVar } = await A.c.from("goods_variants").insert({ goods_id: goodsId, event_id: eventId, name: "x" });
  check("通常商品には絵柄を追加できない", !!normVar);

  const { data: myEv } = await A.c.rpc("goods_my_events");
  const mine = (myEv as { id: string; owned_count: number; total_count: number }[]).find((e) => e.id === eventId);
  check("マイイベントの取得数は「グッズの数」で数える（絵柄の行で重複しない）", mine?.owned_count === 2 && mine?.total_count === 3, mine);

  // 絵柄の削除（参加者の数量も消える）
  const keep = (vs ?? []).filter((v) => v.id !== v2).map((v) => ({ id: v.id, name: v.name }));
  const { error: delV } = await A.c.rpc("goods_save_media", { p_goods_id: rId, p_images: [], p_variants: keep });
  check("絵柄2を削除", !delV && (await qtyOf(A.id, rId, v2)) === null);
  check("削除しなかった絵柄の数量は残る（A=2, B=5）", (await qtyOf(A.id, rId, v1))?.quantity === 2 && (await qtyOf(B.id, rId, v1))?.quantity === 5);

  console.log("\n■ 種類の変換（数量を失わない）");
  const { error: bConv } = await B.c.rpc("goods_convert_kind", { p_goods_id: rId, p_kind: "normal" });
  check("メンバー B は変換できない", !!bConv);
  await own(A.c, rId, vs![2].id, 4);
  const { data: toN, error: toNErr } = await A.c.rpc("goods_convert_kind", { p_goods_id: rId, p_kind: "normal" });
  check("ランダム → 通常に変換", !toNErr && (toN as { status: string }).status === "converted", toNErr);
  check("A の数量は絵柄の合計（2+4=6）", (await qtyOf(A.id, rId, null))?.quantity === 6);
  check("B の数量は絵柄の合計（5）", (await qtyOf(B.id, rId, null))?.quantity === 5);
  check("絵柄はすべて削除", ((await admin.from("goods_variants").select("id").eq("goods_id", rId)).data ?? []).length === 0);
  const { data: toR } = await A.c.rpc("goods_convert_kind", { p_goods_id: rId, p_kind: "random", p_first_variant_name: "A柄" });
  const newV = (toR as { variant_id: string }).variant_id;
  check("通常 → ランダム: 数量は1つ目の絵柄へ（A=6, B=5）", (await qtyOf(A.id, rId, newV))?.quantity === 6 && (await qtyOf(B.id, rId, newV))?.quantity === 5);
  check("通常 → ランダム: 絵柄なしの行は残らない", (await qtyOf(A.id, rId, null)) === null);
  const { error: kindDirect } = await A.c.from("goods").update({ kind: "normal" } as never).eq("id", rId);
  check("種類はクライアントから直接変えられない（変換 RPC だけ）", !!kindDirect);

  console.log("\n■ カテゴリの名前変更・削除");
  await A.c.from("goods_categories").update({ name: "缶バッジ（全種）" }).eq("id", catId);
  check("カテゴリ名の変更がグッズの写しに反映", (await admin.from("goods").select("category").eq("id", goodsId).single()).data?.category === "缶バッジ（全種）");
  await A.c.from("goods_categories").delete().eq("id", catId);
  const afterDel = (await admin.from("goods").select("id, category_id, category, deleted_at").eq("id", goodsId).single()).data;
  check("カテゴリを削除してもグッズは残り、未分類になる", !!afterDel && afterDel.category_id === null && afterDel.category === null && afterDel.deleted_at === null);

  console.log("\n■ 共有カタログ（所持情報を含まない）");
  const { data: cat2 } = await admin.rpc("goods_get_shared_catalog", { p_token: token });
  const c2 = cat2 as { categories: string[]; goods: { name: string; kind: string; variants: { name: string }[] }[] };
  const rnd = c2.goods.find((g) => g.name === "ランダム缶バッジ");
  check("カタログにランダム商品と絵柄が含まれる", rnd?.kind === "random" && rnd.variants.length === 1 && rnd.variants[0].name === "A柄");
  check("カタログにカテゴリ一覧が含まれる", Array.isArray(c2.categories) && c2.categories.includes("タオル"));
  check("カタログのグッズに所持数・ユーザー情報が含まれない", !/quantity|user_id|owner|"owned"|"unowned"|acquired/.test(JSON.stringify(c2.goods)) && !/user_id|quantity/.test(JSON.stringify(cat2)));
  const { error: anonCat2 } = await anon.rpc("goods_get_shared_catalog", { p_token: token });
  check("anon はカタログ RPC を直接呼べない", !!anonCat2);

  console.log("\n■ 退会（B）: B の数量はすべて消え、カタログは残る");
  const { error: prepB } = await admin.rpc("goods_prepare_account_deletion", { p_user: B.id });
  const { error: delB } = await admin.auth.admin.deleteUser(B.id);
  users.splice(users.indexOf(B.id), 1);
  check("B の退会処理", !prepB && !delB);
  check("B の所持数量（通常・絵柄）は残らない", ((await admin.from("ownerships").select("id").eq("user_id", B.id)).data ?? []).length === 0);
  check("A のグッズ・絵柄・画像は残る", ((await admin.from("goods_variants").select("id").eq("goods_id", rId)).data ?? []).length === 1 && ((await admin.from("goods_images").select("id").eq("goods_id", goodsId)).data ?? []).length === 2);
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
    const { data: files } = await admin.storage.from("goods-images").list("", { limit: 1000 });
    void files;
    console.log(`\n結果: ${passed} passed / ${failed} failed`);
    process.exit(failed ? 1 : 0);
  });
