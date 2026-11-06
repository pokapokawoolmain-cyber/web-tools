/* eslint-disable no-console */
// ============================================================
// 画像ワークスペースの純関数テスト（形式判定・処理計画・目的の提案）
//   実行: npm run test:workspace
// ============================================================
import assert from "node:assert/strict";
import { sniffBytes, kindFromName } from "../lib/workspace/sniff";
import { planDraw, resolveFormat, outputName, dedupeNames, DEFAULT_JOB_OPTIONS, LIMITS } from "../lib/workspace/image-plan";
import { suggest } from "../lib/workspace/suggest";

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));
const be32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const le16 = (n: number) => [n & 255, (n >> 8) & 255];
const le32 = (n: number) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];

console.log("形式の判定（先頭バイト）");
test("PNG: 寸法と透過", () => {
  const png = bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a], be32(13), "IHDR", be32(4032), be32(3024), [8, 6, 0, 0, 0]);
  assert.deepEqual(sniffBytes(png), { kind: "png", width: 4032, height: 3024, hasAlpha: true });
});
test("JPEG: SOF0 の寸法（APP1 の後ろ）", () => {
  const app1 = [0xff, 0xe1, 0x00, 0x08, 1, 2, 3, 4, 5, 6];
  const sof0 = [0xff, 0xc0, 0x00, 0x11, 8, ...[0x0b, 0xd0], ...[0x0f, 0xc0], 3];
  const r = sniffBytes(bytes([0xff, 0xd8], app1, sof0, new Array(20).fill(0)));
  assert.equal(r.kind, "jpeg");
  assert.equal(r.width, 4032);
  assert.equal(r.height, 3024);
});
test("JPEG: EXIF で90°回転した写真は縦横を入れ替える", () => {
  // APP1 Exif（ビッグエンディアン）Orientation=6
  const tiff = [..."MM".split("").map((c) => c.charCodeAt(0)), 0, 42, ...be32(8), 0, 1, 0x01, 0x12, 0, 3, ...be32(1), 0, 6, 0, 0, ...be32(0)];
  const exif = [..."Exif".split("").map((c) => c.charCodeAt(0)), 0, 0, ...tiff];
  const app1 = [0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 255, ...exif];
  const sof0 = [0xff, 0xc0, 0x00, 0x11, 8, ...[0x0b, 0xd0], ...[0x0f, 0xc0], 3];
  const r = sniffBytes(bytes([0xff, 0xd8], app1, sof0, new Array(20).fill(0)));
  assert.deepEqual([r.width, r.height], [3024, 4032]);
});
test("GIF・BMP", () => {
  assert.deepEqual(sniffBytes(bytes("GIF89a", le16(640), le16(480))), { kind: "gif", width: 640, height: 480 });
  const bmp = bytes("BM", new Array(16).fill(0), le32(800), le32(-600), new Array(4).fill(0));
  assert.deepEqual(sniffBytes(bmp), { kind: "bmp", width: 800, height: 600 });
});
test("WebP（VP8X）", () => {
  const w = bytes("RIFF", le32(100), "WEBP", "VP8X", le32(10), [0x10, 0, 0, 0], [0x7f, 0x07, 0], [0x37, 0x04, 0]);
  assert.deepEqual(sniffBytes(w), { kind: "webp", width: 1920, height: 1080, hasAlpha: true });
});
test("HEIC と AVIF（ftyp のブランド）と ispe の寸法", () => {
  const heic = bytes(be32(24), "ftyp", "heic", be32(0), "mif1", "heic", be32(20), "ispe", be32(0), be32(4032), be32(3024));
  assert.deepEqual(sniffBytes(heic), { kind: "heic", width: 4032, height: 3024 });
  const avif = bytes(be32(24), "ftyp", "avif", be32(0), "mif1", "avif");
  assert.equal(sniffBytes(avif).kind, "avif");
});
test("PDF・SVG・不明", () => {
  assert.equal(sniffBytes(bytes("%PDF-1.7\n")).kind, "pdf");
  assert.equal(sniffBytes(bytes('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>')).kind, "svg");
  assert.equal(sniffBytes(bytes("hello world")).kind, "unknown");
});
test("拡張子からの推定", () => {
  assert.equal(kindFromName("IMG_0001.HEIC"), "heic");
  assert.equal(kindFromName("photo.jpeg"), "jpeg");
});

console.log("処理計画");
const opts = (patch: Partial<typeof DEFAULT_JOB_OPTIONS>) => ({ ...DEFAULT_JOB_OPTIONS, ...patch });
test("長辺2000pxに縮小（縦長でも長辺基準）", () => {
  const p = planDraw(3024, 4032, opts({ resize: { mode: "long", value: 2000 } }));
  assert.equal(p.canvasH, 2000);
  assert.equal(p.canvasW, 1500);
});
test("元より大きくはしない", () => {
  const p = planDraw(800, 600, opts({ resize: { mode: "width", value: 1600 } }));
  assert.deepEqual([p.canvasW, p.canvasH], [800, 600]);
});
test("正方形・余白で合わせる（横長→上下に余白）", () => {
  const p = planDraw(1600, 900, opts({ aspect: { ratio: "1:1", fit: "pad" } }));
  assert.deepEqual([p.canvasW, p.canvasH, p.padded], [1600, 1600, true]);
  assert.equal(p.dy, 350);
  assert.equal(p.dh, 900);
});
test("正方形・切り抜き（横長→中央を切り抜く）", () => {
  const p = planDraw(1600, 900, opts({ aspect: { ratio: "1:1", fit: "crop" } }));
  assert.deepEqual([p.canvasW, p.canvasH, p.sx, p.sw, p.padded], [900, 900, 350, 900, false]);
});
test("縦横比と縮小の組み合わせ（16:9 切り抜き→長辺1280）", () => {
  const p = planDraw(4000, 3000, opts({ aspect: { ratio: "16:9", fit: "crop" }, resize: { mode: "long", value: 1280 } }));
  assert.deepEqual([p.canvasW, p.canvasH], [1280, 720]);
});
test("出力の一辺の上限", () => {
  const p = planDraw(20000, 2000, opts({}));
  assert.ok(p.canvasW <= LIMITS.maxOutputEdge);
});
test("形式の決定（keep のとき書き出せない形式を置き換える）", () => {
  assert.equal(resolveFormat("keep", "heic", false), "jpeg");
  assert.equal(resolveFormat("keep", "gif", true), "png");
  assert.equal(resolveFormat("keep", "webp", true), "webp");
  assert.equal(resolveFormat("png", "jpeg", false), "png");
});
test("ファイル名（拡張子の付け替え・使えない文字・重複）", () => {
  assert.equal(outputName("IMG_0001.HEIC", "jpeg"), "IMG_0001.jpg");
  assert.equal(outputName('a:b?.png', "webp"), "a_b_.webp");
  assert.deepEqual(dedupeNames(["a.jpg", "a.jpg", "b.jpg"]), ["a.jpg", "a-2.jpg", "b.jpg"]);
});

console.log("目的の提案（Smart File Entry）");
test("HEIC があれば「JPGにする」が先頭", () => {
  const s = suggest([{ kind: "heic", bytes: 3_000_000, width: 4032, height: 3024 }]);
  assert.equal(s[0].purpose.id, "jpg");
  assert.ok(s[0].reason?.includes("HEIC"));
});
test("5MB以上の画像があれば「軽くする」", () => {
  const s = suggest([{ kind: "jpeg", bytes: 8_000_000, width: 4000, height: 3000 }]);
  assert.equal(s[0].purpose.id, "lighten");
});
test("縦長の画像が複数あれば「PDFにまとめる」を上位に", () => {
  const files = [1, 2, 3].map(() => ({ kind: "jpeg" as const, bytes: 900_000, width: 1500, height: 2000 }));
  const s = suggest(files);
  assert.equal(s[0].purpose.id, "pdf");
  assert.equal(s[0].purpose.output, "pdf");
});
test("特徴がなければ既定の順番、複数枚は ZIP", () => {
  const files = [1, 2].map(() => ({ kind: "png" as const, bytes: 300_000, width: 1200, height: 800 }));
  const s = suggest(files);
  assert.equal(s[0].purpose.id, "lighten");
  assert.equal(s[0].reason, undefined);
  assert.equal(s[0].purpose.output, "zip");
  assert.equal(new Set(s.map((x) => x.purpose.id)).size, s.length);
});

console.log(`\n${passed} passed`);
