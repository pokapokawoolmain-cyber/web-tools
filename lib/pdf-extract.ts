// ============================================================
// PDFのテキスト抽出・レイアウト再構成（純関数）
//
// pdfjs の page.getTextContent().items を受け取り、
//  - 表として行・列に整形（PDF→Excel用）
//  - 段落として整形（PDF→Word用）
// する。pdfjs 自体は import しない（呼び出し側が動的 import する）。
//
// PDFは「文字＋座標」の集合で、行や表の構造情報を持たない。
// そのため x/y 座標から行・列・段落をヒューリスティックに復元する。
// テキストベースのPDFが対象。スキャン画像PDFは文字情報が無く抽出できない。
// ============================================================

export interface RawTextItem {
  str: string;
  /** 左端x（PDFユーザー空間） */
  x: number;
  /** ベースラインy（PDFは上が大きい） */
  y: number;
  /** 文字列の幅 */
  w: number;
  /** 文字の高さ（フォントサイズ相当） */
  h: number;
}

// pdfjs の TextItem 相当（transform=[a,b,c,d,e,f]）
interface PdfTextItemLike {
  str: string;
  transform: number[];
  width: number;
  height?: number;
}

/** getTextContent().items を RawTextItem[] に正規化（空白のみは除外） */
export function normalizeItems(items: unknown[]): RawTextItem[] {
  const out: RawTextItem[] = [];
  for (const raw of items) {
    const it = raw as PdfTextItemLike;
    if (typeof it.str !== "string" || it.str.trim() === "") continue;
    const t = it.transform;
    if (!Array.isArray(t) || t.length < 6) continue;
    const h = Math.abs(it.height ?? t[3]) || Math.abs(t[3]) || 10;
    out.push({ str: it.str, x: t[4], y: t[5], w: it.width || 0, h });
  }
  return out;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** アイテムを視覚的な「行」にまとめる（yが近いものを同一行に） */
export function groupIntoRows(items: RawTextItem[]): RawTextItem[][] {
  if (items.length === 0) return [];
  const medH = median(items.map((i) => i.h)) || 10;
  const tol = Math.max(2, medH * 0.6); // 同一行とみなすyの許容差
  // yの大きい順（上から下）
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const rows: RawTextItem[][] = [];
  let current: RawTextItem[] = [];
  let currentY = sorted[0].y;
  for (const it of sorted) {
    if (Math.abs(it.y - currentY) <= tol) {
      current.push(it);
    } else {
      rows.push(current);
      current = [it];
      currentY = it.y;
    }
    // 行の代表yは平均に寄せる
    currentY = (currentY + it.y) / 2;
  }
  if (current.length) rows.push(current);
  // 各行を左から右へ
  for (const r of rows) r.sort((a, b) => a.x - b.x);
  return rows;
}

/**
 * 全アイテムのx位置から列の境界（各列の左端x）を推定する。
 * 近いx同士をクラスタリングし、クラスタの最小xを列の左端とする。
 */
function detectColumnStarts(items: RawTextItem[]): number[] {
  const medH = median(items.map((i) => i.h)) || 10;
  const gap = Math.max(6, medH * 1.2); // これ以上離れたら別の列
  const xs = items.map((i) => i.x).sort((a, b) => a - b);
  const starts: number[] = [];
  let clusterMin = xs[0];
  let prev = xs[0];
  for (const x of xs) {
    if (x - prev > gap) {
      starts.push(clusterMin);
      clusterMin = x;
    }
    prev = x;
  }
  starts.push(clusterMin);
  return starts;
}

/** アイテムのxに対応する列インデックス（最も近い列） */
function columnIndexFor(x: number, starts: number[]): number {
  let idx = 0;
  let best = Infinity;
  for (let i = 0; i < starts.length; i++) {
    const d = Math.abs(x - starts[i]);
    // 左端以上の列を優先しつつ、最も近いものを選ぶ
    if (x >= starts[i] - 1) {
      if (i >= idx) idx = i;
    }
    if (d < best) best = d;
  }
  // x が最初の列より左なら 0
  return x < starts[0] ? 0 : idx;
}

/**
 * 1ページ分のアイテムを表（2次元配列）に整形する。
 * 行はy、列は全体のx分布から推定。同一セルの文字は結合。
 */
export function itemsToTable(items: RawTextItem[]): string[][] {
  if (items.length === 0) return [];
  const rows = groupIntoRows(items);
  const starts = detectColumnStarts(items);
  const table: string[][] = [];
  for (const row of rows) {
    const cells: string[] = new Array(starts.length).fill("");
    for (const it of row) {
      const ci = columnIndexFor(it.x, starts);
      cells[ci] = cells[ci] ? `${cells[ci]} ${it.str}`.replace(/\s+/g, " ").trim() : it.str.trim();
    }
    // 末尾の空セルを削らず保持（列ズレ防止）。ただし全空行はスキップ。
    if (cells.some((c) => c !== "")) table.push(cells);
  }
  // 全行末尾で共通して空の列をトリム
  return trimTrailingEmptyColumns(table);
}

function trimTrailingEmptyColumns(table: string[][]): string[][] {
  if (table.length === 0) return table;
  let maxLen = 0;
  for (const r of table) {
    let last = -1;
    for (let i = 0; i < r.length; i++) if (r[i] !== "") last = i;
    maxLen = Math.max(maxLen, last + 1);
  }
  return table.map((r) => r.slice(0, maxLen));
}

/** 1行分のアイテムを、適切な空白を挟んで1つの文字列にする */
function rowToLine(row: RawTextItem[]): string {
  if (row.length === 0) return "";
  const medH = median(row.map((i) => i.h)) || 10;
  const spaceGap = medH * 0.35; // これ以上離れていれば単語間スペース
  let line = row[0].str;
  for (let i = 1; i < row.length; i++) {
    const prev = row[i - 1];
    const cur = row[i];
    const gap = cur.x - (prev.x + prev.w);
    const needSpace = gap > spaceGap && !/\s$/.test(line) && !/^\s/.test(cur.str);
    line += (needSpace ? " " : "") + cur.str;
  }
  return line.replace(/\s+/g, " ").trim();
}

/**
 * 1ページ分のアイテムを段落配列に整形する（PDF→Word用）。
 * 行間が広いところを段落の区切りとみなす。
 */
export function itemsToParagraphs(items: RawTextItem[]): string[] {
  if (items.length === 0) return [];
  const rows = groupIntoRows(items);
  const medH = median(items.map((i) => i.h)) || 10;
  // 各行の代表y（先頭アイテムのy）
  const lines = rows.map((r) => ({ text: rowToLine(r), y: r[0].y }));
  const paragraphs: string[] = [];
  let buf: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.text === "") continue;
    if (buf.length > 0) {
      const prevY = lines[i - 1].y;
      const gap = prevY - line.y; // 上から下なので正
      // 通常の行送りより明確に広ければ段落区切り
      if (gap > medH * 1.8) {
        paragraphs.push(buf.join(" "));
        buf = [];
      }
    }
    buf.push(line.text);
  }
  if (buf.length) paragraphs.push(buf.join(" "));
  return paragraphs;
}
