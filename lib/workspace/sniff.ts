// ============================================================
// ファイル形式の判定（ワークスペース共通・純関数）
//
// 拡張子や MIME ではなくファイル先頭のバイトで形式を判定する。
// 画像はヘッダーから縦横の画素数も読み、巨大な画像を処理前に止められるようにする。
// ブラウザ・Node のどちらでも動く（API・MCP からも使える）。
// ============================================================

export type FileKind = "jpeg" | "png" | "webp" | "gif" | "bmp" | "avif" | "heic" | "pdf" | "svg" | "unknown";

export interface SniffResult {
  kind: FileKind;
  /** 画像の幅・高さ（ヘッダーから読めた場合のみ。JPEG は EXIF の回転を反映した見た目の寸法） */
  width?: number;
  height?: number;
  /** PNG の透過チャンネルの有無（読めた場合のみ） */
  hasAlpha?: boolean;
}

/** 判定に読む先頭バイト数（JPEG は EXIF サムネイルの後ろに寸法があるため多めに読む） */
export const SNIFF_BYTES = 512 * 1024;

const ascii = (b: Uint8Array, start: number, len: number) => String.fromCharCode(...b.subarray(start, start + len));
const u16be = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1];
const u32be = (b: Uint8Array, i: number) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
const u16le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u24le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
const i32le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24);

const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs"];

/** ISO-BMFF（HEIC / AVIF）の ftyp ボックスから形式を決める */
function isoKind(b: Uint8Array): FileKind | null {
  if (b.length < 16 || ascii(b, 4, 4) !== "ftyp") return null;
  const size = Math.min(u32be(b, 0), b.length);
  const brands = [ascii(b, 8, 4)];
  for (let i = 16; i + 4 <= size; i += 4) brands.push(ascii(b, i, 4));
  if (brands.some((x) => x === "avif" || x === "avis")) return "avif";
  if (brands.some((x) => HEIC_BRANDS.includes(x))) return "heic";
  // mif1 / msf1 だけの場合は HEIF 系とみなす（AVIF は上で拾える）
  if (brands.some((x) => x === "mif1" || x === "msf1")) return "heic";
  return null;
}

/** HEIC / AVIF の画素数（最初に見つかった ispe ボックス） */
function ispeSize(b: Uint8Array): { width: number; height: number } | null {
  for (let i = 0; i + 16 <= b.length; i++) {
    if (b[i] === 0x69 && b[i + 1] === 0x73 && b[i + 2] === 0x70 && b[i + 3] === 0x65) {
      const w = u32be(b, i + 8);
      const h = u32be(b, i + 12);
      if (w > 0 && h > 0) return { width: w, height: h };
    }
  }
  return null;
}

/** JPEG の EXIF Orientation（1〜8）。見つからなければ 1 */
function jpegOrientation(b: Uint8Array): number {
  let i = 2;
  while (i + 4 < b.length && b[i] === 0xff) {
    const marker = b[i + 1];
    const len = u16be(b, i + 2);
    if (marker === 0xe1 && ascii(b, i + 4, 4) === "Exif") {
      const t = i + 10; // TIFF ヘッダーの先頭
      const little = ascii(b, t, 2) === "II";
      const r16 = (o: number) => (little ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]);
      const r32 = (o: number) => (little ? (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0 : u32be(b, o));
      const ifd = t + r32(t + 4);
      const count = r16(ifd);
      for (let k = 0; k < count; k++) {
        const e = ifd + 2 + k * 12;
        if (e + 12 > b.length) break;
        if (r16(e) === 0x0112) return r16(e + 8);
      }
      return 1;
    }
    if (marker === 0xda || len < 2) break; // 画像データの開始
    i += 2 + len;
  }
  return 1;
}

function jpegSize(b: Uint8Array): { width: number; height: number } | null {
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    if (marker === 0xff) { i++; continue; }
    const len = u16be(b, i + 2);
    // SOF0〜SOF15（DHT=C4, JPG=C8, DAC=CC を除く）に寸法がある
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: u16be(b, i + 5), width: u16be(b, i + 7) };
    }
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

function webpSize(b: Uint8Array): { width: number; height: number; hasAlpha?: boolean } | null {
  const chunk = ascii(b, 12, 4);
  if (chunk === "VP8X" && b.length >= 30) {
    return { width: u24le(b, 24) + 1, height: u24le(b, 27) + 1, hasAlpha: (b[20] & 0x10) !== 0 };
  }
  if (chunk === "VP8 " && b.length >= 30) {
    return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff, hasAlpha: false };
  }
  if (chunk === "VP8L" && b.length >= 25) {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, hasAlpha: ((bits >> 28) & 1) === 1 };
  }
  return null;
}

/** 先頭バイトから形式と寸法を判定する */
export function sniffBytes(head: Uint8Array): SniffResult {
  const b = head;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    const size = jpegSize(b);
    // EXIF で 90°/270° 回転している写真は、見た目の縦横を入れ替える
    const rotated = size && jpegOrientation(b) >= 5;
    return { kind: "jpeg", ...(size ? (rotated ? { width: size.height, height: size.width } : size) : {}), hasAlpha: false };
  }
  if (b.length >= 8 && b[0] === 0x89 && ascii(b, 1, 3) === "PNG" && b[4] === 0x0d && b[5] === 0x0a) {
    if (b.length >= 26 && ascii(b, 12, 4) === "IHDR") {
      const colorType = b[25];
      return { kind: "png", width: u32be(b, 16), height: u32be(b, 20), hasAlpha: colorType === 4 || colorType === 6 };
    }
    return { kind: "png" };
  }
  if (b.length >= 10 && (ascii(b, 0, 6) === "GIF87a" || ascii(b, 0, 6) === "GIF89a")) {
    return { kind: "gif", width: u16le(b, 6), height: u16le(b, 8) };
  }
  if (b.length >= 26 && ascii(b, 0, 2) === "BM") {
    return { kind: "bmp", width: Math.abs(i32le(b, 18)), height: Math.abs(i32le(b, 22)) };
  }
  if (b.length >= 16 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") {
    return { kind: "webp", ...(webpSize(b) ?? {}) };
  }
  const iso = isoKind(b);
  if (iso) return { kind: iso, ...(ispeSize(b) ?? {}) };
  if (b.length >= 5 && ascii(b, 0, 5) === "%PDF-") return { kind: "pdf" };
  // SVG（テキスト）。スクリプトを含みうるため画像としては扱わない
  const text = new TextDecoder("utf-8", { fatal: false }).decode(b.subarray(0, 1024)).trimStart().toLowerCase();
  if (text.startsWith("<svg") || (text.startsWith("<?xml") && text.includes("<svg"))) return { kind: "svg" };
  return { kind: "unknown" };
}

/** File（Blob）の先頭を読んで判定する */
export async function sniffFile(file: Blob): Promise<SniffResult> {
  const head = new Uint8Array(await file.slice(0, SNIFF_BYTES).arrayBuffer());
  return sniffBytes(head);
}

/** 拡張子から想定される形式（先頭バイトとの食い違いを利用者に知らせるため） */
export function kindFromName(name: string): FileKind {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const map: Record<string, FileKind> = {
    jpg: "jpeg", jpeg: "jpeg", jpe: "jpeg", png: "png", webp: "webp", gif: "gif", bmp: "bmp",
    avif: "avif", heic: "heic", heif: "heic", pdf: "pdf", svg: "svg",
  };
  return map[ext] ?? "unknown";
}

export const KIND_LABEL: Record<FileKind, string> = {
  jpeg: "JPG", png: "PNG", webp: "WebP", gif: "GIF", bmp: "BMP", avif: "AVIF", heic: "HEIC",
  pdf: "PDF", svg: "SVG", unknown: "不明",
};
