// ========================================
// 動的ファビコン生成
// - ?tool=<slug>  : ツールのガラス風ネオンアイコン（tool-icons.tsと同一デザイン）
// - ?emoji=<絵文字>&color=<hex> : カテゴリ・ブログ等の絵文字ファビコン
// generateMeta() が path から自動でこのURLを icons に設定する。
//
// 実装メモ: satoriはSVGの親→子へのstroke継承を行わないため、
// lucideコンポーネントから iconNode（パスデータ）を抽出し、
// 子要素ごとに明示的な属性を付けたインラインSVGを組み立てて描画する。
// ========================================

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createElement } from "react";
import { TOOL_ICONS } from "@/data/tool-icons";

export const runtime = "edge";

const SIZE = 64;

type IconNode = [string, Record<string, string | number>][];

/** lucideのforwardRefコンポーネントから iconNode を抽出する */
function extractIconNode(icon: unknown): IconNode | null {
  try {
    const render = (icon as { render?: (props: object, ref: null) => { props?: { iconNode?: IconNode } } }).render;
    if (typeof render !== "function") return null;
    const element = render({}, null);
    return element?.props?.iconNode ?? null;
  } catch {
    return null;
  }
}

// ガラスタイル共通スタイル（ダーク基調＋テーマ色のティント）
function tile(color: string, children: React.ReactNode) {
  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: `linear-gradient(160deg, #141a2e 0%, #0a0e1a 100%)`,
        border: `2px solid ${color}66`,
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.10), inset 0 0 18px ${color}2e`,
      }}
    >
      {children}
    </div>
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tool = searchParams.get("tool");
  const emoji = searchParams.get("emoji");
  const colorParam = searchParams.get("color");

  const headers = {
    "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
  };

  // ── ツール: lucideアイコン（輪郭のみ・ネオンカラー） ──
  if (tool && TOOL_ICONS[tool]) {
    const { icon, color } = TOOL_ICONS[tool];
    const node = extractIconNode(icon);
    if (node) {
      return new ImageResponse(
        tile(
          color,
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            {node.map(([tag, attrs], i) =>
              createElement(tag, {
                ...attrs,
                key: `n${i}`,
                fill: "none",
                stroke: color,
                strokeWidth: 2.2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            )}
          </svg>,
        ),
        { width: SIZE, height: SIZE, headers },
      );
    }
  }

  // ── 絵文字ファビコン（カテゴリ・ブログ等） ──
  if (emoji) {
    const color = /^[0-9a-fA-F]{6}$/.test(colorParam ?? "") ? `#${colorParam}` : "#38bdf8";
    return new ImageResponse(
      tile(color, <div style={{ display: "flex", fontSize: 36 }}>{emoji}</div>),
      { width: SIZE, height: SIZE, headers, emoji: "twemoji" },
    );
  }

  // ── フォールバック: ToolBoxの「T」 ──
  return new ImageResponse(
    tile(
      "#38bdf8",
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ width: 32, height: 6, background: "#38bdf8", borderRadius: 3 }} />
        <div style={{ width: 8, height: 22, background: "#38bdf8", borderRadius: 3 }} />
      </div>,
    ),
    { width: SIZE, height: SIZE, headers },
  );
}
