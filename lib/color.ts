// ========================================
// カラー計算ユーティリティ（新カラーツール共通）
// HEX/RGB/HSL変換・相対輝度・コントラスト比・WCAG判定・
// 色覚シミュレーション・最適文字色 など。
// ========================================

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

const clamp = (v: number, min = 0, max = 255) => Math.min(max, Math.max(min, v));

/** "#abc" / "#aabbcc" / "aabbcc" → RGB。無効なら null */
export function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => clamp(Math.round(v)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** 相対輝度（WCAG 2.1） */
export function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** コントラスト比（1〜21）。HEX2色から算出。無効なら null */
export function contrastRatio(hex1: string, hex2: string): number | null {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  if (!a || !b) return null;
  const l1 = relativeLuminance(a), l2 = relativeLuminance(b);
  const light = Math.max(l1, l2), dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export type WcagResult = {
  ratio: number;
  aa: boolean; // 通常テキスト 4.5:1
  aaa: boolean; // 通常テキスト 7:1
  aaLarge: boolean; // 大きな文字 3:1
  aaaLarge: boolean; // 大きな文字 4.5:1
};

export function wcag(ratio: number): WcagResult {
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

/** 背景色に対して見やすい文字色（黒 or 白）を返す */
export function bestTextColor(bgHex: string): "#000000" | "#FFFFFF" {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return "#000000";
  // 白と黒それぞれのコントラストを比較
  const white = contrastRatio(bgHex, "#FFFFFF") ?? 0;
  const black = contrastRatio(bgHex, "#000000") ?? 0;
  return white >= black ? "#FFFFFF" : "#000000";
}

/** 明度を調整した色（amount: -100〜100） */
export function adjustLightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.min(100, Math.max(0, hsl.l + amount));
  return rgbToHex(hslToRgb(hsl));
}

/** 色相を回転（度） */
export function rotateHue(hex: string, deg: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  hsl.h = (hsl.h + deg + 360) % 360;
  return rgbToHex(hslToRgb(hsl));
}

// ─── 色覚シミュレーション ───────────────────────
// Machado et al. (2009) ベースの近似変換行列。
export type ColorBlindType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const CVD_MATRIX: Record<Exclude<ColorBlindType, "achromatopsia">, number[]> = {
  // P型（1型・赤）
  protanopia: [0.567, 0.433, 0.0, 0.558, 0.442, 0.0, 0.0, 0.242, 0.758],
  // D型（2型・緑）
  deuteranopia: [0.625, 0.375, 0.0, 0.7, 0.3, 0.0, 0.0, 0.3, 0.7],
  // T型（3型・青）
  tritanopia: [0.95, 0.05, 0.0, 0.0, 0.433, 0.567, 0.0, 0.475, 0.525],
};

export function simulateColorBlind(hex: string, type: ColorBlindType): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  if (type === "achromatopsia") {
    // 全色盲（グレースケール・輝度ベース）
    const y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return rgbToHex({ r: y, g: y, b: y });
  }
  const m = CVD_MATRIX[type];
  return rgbToHex({
    r: clamp(rgb.r * m[0] + rgb.g * m[1] + rgb.b * m[2]),
    g: clamp(rgb.r * m[3] + rgb.g * m[4] + rgb.b * m[5]),
    b: clamp(rgb.r * m[6] + rgb.g * m[7] + rgb.b * m[8]),
  });
}

export const CVD_LABELS: Record<ColorBlindType, { label: string; desc: string }> = {
  protanopia: { label: "P型（1型・赤）", desc: "赤の感度が低い。赤と緑、赤と黒の区別が難しい" },
  deuteranopia: { label: "D型（2型・緑）", desc: "緑の感度が低い。日本人男性に最も多いタイプ" },
  tritanopia: { label: "T型（3型・青）", desc: "青の感度が低い。青と緑、黄と赤紫の区別が難しい" },
  achromatopsia: { label: "全色盲（明暗のみ）", desc: "色をほとんど識別できず明暗で見る。ごくまれ" },
};

/** HEX正規化（#付き大文字・3桁は6桁へ）。無効なら null */
export function normalizeHex(hex: string): string | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHex(rgb) : null;
}

/** Tailwindの arbitrary value 形式 */
export function toTailwind(hex: string, kind: "bg" | "text" = "bg"): string {
  return `${kind}-[${hex.toUpperCase()}]`;
}

/** rgb() 表記 */
export function toRgbString({ r, g, b }: RGB): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** hsl() 表記 */
export function toHslString({ h, s, l }: HSL): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}
