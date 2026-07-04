// ========================================
// ツール別ファビコン生成
// ガラス風タイル + カテゴリ色背景 + 輪郭アイコン
// 各ツールの app/.../icon.tsx から呼ぶ共通ヘルパー
// ========================================
import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import type { LucideIcon } from "lucide-react";
import { TOOL_ICONS } from "@/data/tool-icons";

export const iconSize = { width: 32, height: 32 };
export const iconContentType = "image/png";

/** #RRGGBB を係数で暗くする（背景グラデ用） */
function shade(hex: string, factor: number): string {
  const m = hex.replace("#", "");
  const r = Math.round(parseInt(m.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(m.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(m.slice(4, 6), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

/** "TrendingUp" → "trending-up" */
function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}

/**
 * lucide-static の SVG（公式・ビルド時に fs で読む）を白ストロークに整形し、
 * data URI 化する。Satori は React の svg を描けないため img として埋め込む。
 */
function iconDataUri(Icon: LucideIcon): string | null {
  const name = (Icon as unknown as { displayName?: string }).displayName;
  if (!name) return null;
  try {
    const file = join(process.cwd(), "node_modules/lucide-static/icons", `${toKebab(name)}.svg`);
    const svg = readFileSync(file, "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/stroke="currentColor"/, 'stroke="#ffffff"')
      .replace(/stroke-width="2"/, 'stroke-width="2.25"');
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * ツールIDからファビコン画像を生成する。
 * TOOL_ICONS の lucide アイコン＋カテゴリ色を使い、
 * カテゴリ色の背景タイルに白い輪郭アイコンを描く（ガラス風のツヤ付き）。
 */
export function toolFavicon(toolId: string) {
  const def = TOOL_ICONS[toolId];
  const color = def?.color ?? "#38bdf8";
  const uri = def?.icon ? iconDataUri(def.icon) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          // カテゴリ色のグラデ背景（上が明るく下が暗い＝立体感）
          background: `linear-gradient(145deg, ${color} 0%, ${shade(color, 0.62)} 100%)`,
          // ガラスのツヤ（上端ハイライト）＋外周の締まり
          boxShadow:
            "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.18)",
        }}
      >
        {uri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={uri} width={20} height={20} alt="" />
        ) : (
          // マッピングが無い場合は白ドット
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#fff" }} />
        )}
      </div>
    ),
    { ...iconSize }
  );
}

/**
 * カテゴリ/セクション用ファビコン（アイコンと色を直接指定）。
 */
export function sectionFavicon(Icon: LucideIcon | undefined, color: string) {
  const uri = Icon ? iconDataUri(Icon) : null;
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: `linear-gradient(145deg, ${color} 0%, ${shade(color, 0.62)} 100%)`,
          boxShadow:
            "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.18)",
        }}
      >
        {uri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={uri} width={20} height={20} alt="" />
        ) : null}
      </div>
    ),
    { width: 32, height: 32 },
  );
}
