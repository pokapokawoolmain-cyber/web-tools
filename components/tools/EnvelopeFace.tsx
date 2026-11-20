// ============================================================
// 香典袋・祝儀袋の縦書きの表面と中袋（プレビューと印刷で共通）
//
// 実物の袋と同じく、水引を境に
//   上段＝表書き（御霊前・寿など）を中央に縦書き1列
//   下段＝氏名を中央に縦書き。連名は右から左へ並べる（右がいちばん目上の人）
// unit は寸法の単位。プレビューは px、印刷は mm を渡す
// ============================================================
import type { CSSProperties } from "react";

const SERIF = "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif";
const vertical: CSSProperties = { writingMode: "vertical-rl", textOrientation: "upright", whiteSpace: "nowrap", fontFamily: SERIF };

interface Size {
  width: number;
  height: number;
  unit: "px" | "mm";
  omoteSize: string;
  nameSize: string;
  subSize: string;
}

export const PREVIEW_SIZE: Size = { width: 220, height: 330, unit: "px", omoteSize: "28px", nameSize: "18px", subSize: "14px" };
export const PRINT_SIZE: Size = { width: 120, height: 170, unit: "mm", omoteSize: "26pt", nameSize: "17pt", subSize: "13pt" };

export function EnvelopeFront({
  omote,
  names,
  org,
  bold,
  ink,
  size,
  bandColor = "#94a3b8",
}: {
  omote: string;
  /** 先頭がいちばん右（代表者）。空なら空欄 */
  names: string[];
  /** 会社名・肩書き（氏名の右に小さく書く） */
  org?: string;
  bold: boolean;
  /** 文字の色（薄墨は灰色） */
  ink: string;
  size: Size;
  /** 水引の位置の目安の線 */
  bandColor?: string;
}) {
  const u = (n: number) => `${n}${size.unit}`;
  const shown = names.length ? names : ["　　　　"];
  return (
    <div
      role="img"
      aria-label={`表書き「${omote}」、氏名「${names.join("・") || "未入力"}」を縦書きにした袋の表面`}
      style={{ width: u(size.width), height: u(size.height), position: "relative", background: "white", border: "1px solid #cbd5e1", boxSizing: "border-box", maxWidth: "100%" }}
    >
      {/* 上段：表書き */}
      <div style={{ position: "absolute", top: "6%", bottom: "56%", left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ ...vertical, margin: 0, fontSize: size.omoteSize, fontWeight: bold ? 700 : 400, letterSpacing: "0.25em", color: ink }}>{omote}</p>
      </div>
      {/* 水引の位置の目安 */}
      <div aria-hidden style={{ position: "absolute", top: "47%", left: "8%", right: "8%", height: "1px", background: bandColor }} />
      {/* 下段：氏名（右から左へ） */}
      <div style={{ position: "absolute", top: "53%", bottom: "5%", left: 0, right: 0, display: "flex", flexDirection: "row-reverse", justifyContent: "center", alignItems: "flex-start", gap: "0.6em" }}>
        {org && (
          <p style={{ ...vertical, margin: 0, fontSize: size.subSize, letterSpacing: "0.1em", color: ink }}>{org}</p>
        )}
        {shown.map((n, i) => (
          <p key={`${n}-${i}`} style={{ ...vertical, margin: 0, fontSize: size.nameSize, fontWeight: bold ? 600 : 400, letterSpacing: "0.15em", color: ink }}>
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}

/** 中袋の表（金額を縦書き） */
/** heightRatio: 表面に対する高さ。印刷では表面と1枚のA4に収まるよう低くする */
export function EnvelopeInner({ amount, size, ink = "#1e293b", heightRatio = 0.75 }: { amount: string; size: Size; ink?: string; heightRatio?: number }) {
  const u = (n: number) => `${n}${size.unit}`;
  return (
    <div
      role="img"
      aria-label={`中袋の表に縦書きで「${amount}」`}
      style={{ width: u(size.width * 0.7), height: u(size.height * heightRatio), position: "relative", background: "white", border: "1px solid #cbd5e1", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%" }}
    >
      <p style={{ ...vertical, margin: 0, fontSize: size.nameSize, letterSpacing: "0.2em", color: ink }}>{amount}</p>
    </div>
  );
}
