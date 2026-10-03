// ============================================================
// Mochico のドット絵（18×17 マス）。完全オリジナル。
//   O=輪郭 B=ベース H=ハイライト S=影 C=ほっぺ E=目 W=目の光
// 小さな丸い「おもち」のような宇宙生物。触角2本・短い手足。
// 目は別レイヤー（開き / 閉じ / にっこり）で表情を切り替える。
// ============================================================
export const BODY = [
  ".....OO....OO.....",
  "....OHHO..OHHO....",
  ".....OO....OO.....",
  "......O....O......",
  ".....OOOOOOOO.....",
  "....OBBBBBBBBO....",
  "...OBHHBBBBBBBO...",
  "...OBHBBBBBBBBO...",
  "...OBBBBBBBBBBO...",
  "...OBBBBBBBBBBO...",
  ".OOOCCBBOOBBCCOOO.",
  ".OBOBBBBBBBBBBOBO.",
  "..OOSBBBBBBBBSOO..",
  "...OSSBBBBBBSSO...",
  "....OSSSSSSSSO....",
  "....OSO....OSO....",
  ".....O......O.....",
];

/** 開いた目（2×2・左上に光） */
export const EYES_OPEN = [
  [5, 8, "W"], [6, 8, "E"], [5, 9, "E"], [6, 9, "E"],
  [11, 8, "W"], [12, 8, "E"], [11, 9, "E"], [12, 9, "E"],
] as const;
/** 閉じた目（まばたき・ねむり） */
export const EYES_CLOSED = [
  [5, 9, "E"], [6, 9, "E"], [11, 9, "E"], [12, 9, "E"],
] as const;
/** にっこり（へ の字を反転した弧） */
export const EYES_HAPPY = [
  [4, 9, "E"], [5, 8, "E"], [6, 8, "E"], [7, 9, "E"],
  [10, 9, "E"], [11, 8, "E"], [12, 8, "E"], [13, 9, "E"],
] as const;
/** ねむり時の Z（右上） */
export const ZZZ = [
  [16, -3], [17, -3], [18, -3], [17, -2], [16, -1], [17, -1], [18, -1],
  [19, 0], [20, 0], [20, 1], [19, 2], [20, 2],
] as const;

export const FILL: Record<string, string> = {
  O: "var(--m-outline)",
  B: "var(--m-base)",
  H: "var(--m-hi)",
  S: "var(--m-shadow)",
  C: "var(--m-cheek)",
  E: "var(--m-eye)",
  W: "var(--m-spark)",
};

/** 1行の連続した同色マスを1つの矩形にまとめる（DOM を小さく保つ） */
export function rowRuns(rows: string[]): { x: number; y: number; w: number; c: string }[] {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === c) w++;
      out.push({ x, y, w, c });
      x += w;
    }
  });
  return out;
}
