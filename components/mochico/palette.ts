// ============================================================
// Mochico のドット絵キャラクター：12色パレット
//
// 単純な CSS 名前付き色ではなく、ドット絵として同じ品質になるよう
// 各色ごとに base / highlight / shadow / outline / eye / spark / cheek を設計している。
// 形・表情は全色共通（色だけを差し替える）。
// 公式（LP・ロゴ・ホーム画面アイコン）は常に purple。
// ============================================================
export type MascotColor =
  | "purple" | "red" | "orange" | "yellow" | "lime" | "green"
  | "cyan" | "blue" | "navy" | "pink" | "white" | "black";

export interface MascotPalette {
  label: string;
  base: string;
  highlight: string;
  shadow: string;
  outline: string;
  eye: string;
  spark: string;
  cheek: string;
}

export const MASCOT_PALETTES: Record<MascotColor, MascotPalette> = {
  purple: { label: "パープル", base: "#8b5cf6", highlight: "#c9b8ff", shadow: "#6a3fd6", outline: "#2a0f63", eye: "#1c0a42", spark: "#ffffff", cheek: "#f9a8d4" },
  red:    { label: "レッド",   base: "#f0525a", highlight: "#ffb7ba", shadow: "#c62f39", outline: "#580d15", eye: "#2a0609", spark: "#ffffff", cheek: "#ffc4c8" },
  orange: { label: "オレンジ", base: "#fb8a3c", highlight: "#ffd2ad", shadow: "#d8641a", outline: "#5a2307", eye: "#2b1003", spark: "#ffffff", cheek: "#ff7a88" },
  yellow: { label: "イエロー", base: "#f6cc35", highlight: "#fff1a6", shadow: "#d4a113", outline: "#574005", eye: "#2b1f02", spark: "#ffffff", cheek: "#ff8f8f" },
  lime:   { label: "ライム",   base: "#a2dd45", highlight: "#e3f9b9", shadow: "#73b622", outline: "#2c4807", eye: "#142204", spark: "#ffffff", cheek: "#ff9eab" },
  green:  { label: "グリーン", base: "#33bf78", highlight: "#aaeec8", shadow: "#1e975a", outline: "#0a3b23", eye: "#04190e", spark: "#ffffff", cheek: "#ffa6ba" },
  cyan:   { label: "シアン",   base: "#2ccbdc", highlight: "#b7f2f8", shadow: "#139fb0", outline: "#05424b", eye: "#021c20", spark: "#ffffff", cheek: "#ffa3c2" },
  blue:   { label: "ブルー",   base: "#4a8bff", highlight: "#bcd4ff", shadow: "#2c61d4", outline: "#0e2864", eye: "#07142f", spark: "#ffffff", cheek: "#ffadcc" },
  navy:   { label: "ネイビー", base: "#3d4ba0", highlight: "#93a1e8", shadow: "#283371", outline: "#0b1030", eye: "#05081d", spark: "#ffffff", cheek: "#e88fbf" },
  pink:   { label: "ピンク",   base: "#ff8ec7", highlight: "#ffd5eb", shadow: "#e262a4", outline: "#5a1137", eye: "#2a0718", spark: "#ffffff", cheek: "#ff5f9f" },
  white:  { label: "ホワイト", base: "#f5f3fc", highlight: "#ffffff", shadow: "#cdc5e6", outline: "#3b3456", eye: "#1f1a33", spark: "#ffffff", cheek: "#ffb4d2" },
  black:  { label: "ブラック", base: "#2c2938", highlight: "#545068", shadow: "#18161f", outline: "#08070c", eye: "#f3f0ff", spark: "#2c2938", cheek: "#e070a8" },
};

export const MASCOT_COLORS = Object.keys(MASCOT_PALETTES) as MascotColor[];
export const DEFAULT_MASCOT_COLOR: MascotColor = "purple";

export const isMascotColor = (v: unknown): v is MascotColor => typeof v === "string" && v in MASCOT_PALETTES;

/** CSS 変数として埋め込む（SVG の fill は var() で参照） */
export function paletteVars(color: MascotColor): Record<string, string> {
  const p = MASCOT_PALETTES[color];
  return {
    "--m-base": p.base,
    "--m-hi": p.highlight,
    "--m-shadow": p.shadow,
    "--m-outline": p.outline,
    "--m-eye": p.eye,
    "--m-spark": p.spark,
    "--m-cheek": p.cheek,
  };
}
