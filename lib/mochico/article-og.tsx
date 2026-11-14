// ============================================================
// Mochico ガイド記事の OG 画像（LP・第1弾記事と同じ白基調・公式 purple。架空の数値は載せない）
//   各記事の opengraph-image.tsx から呼ぶ。見た目は app/blog/oshi-goods-management/opengraph-image.tsx と同じ。
// ============================================================
import { ImageResponse } from "next/og";
import { loadNotoSansJp, ogFonts } from "@/lib/og/google-font";
import { MascotSvg } from "@/lib/mochico/icon-render";

export const MOCHICO_OG_SIZE = { width: 1200, height: 630 };
const FOOT = "ToolBoxJP ブログ ｜ Mochico ガイド";

export async function renderMochicoArticleOg({
  kicker = "推し活・グッズ管理",
  title,
  subLines,
}: {
  kicker?: string;
  /** 大きく出す見出し（1〜2行に収まる長さ） */
  title: string;
  /** 見出しの下の説明（行ごとに改行） */
  subLines: string[];
}) {
  const [bold, regular] = await Promise.all([loadNotoSansJp(title, 800), loadNotoSansJp(kicker + subLines.join("") + FOOT, 500)]);
  const fonts = ogFonts("NotoJP", [
    { data: bold, weight: 800 },
    { data: regular, weight: 500 },
  ]);
  const titleSize = title.length > 12 ? 60 : 72;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 88px",
          background: "linear-gradient(135deg, #ffffff 0%, #f6f1ff 45%, #fdeef6 100%)",
          fontFamily: "NotoJP",
          color: "#1b1430",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 32 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 26,
              fontWeight: 500,
              color: "#5a2fd2",
              background: "#efe9ff",
              borderRadius: 999,
              padding: "8px 22px",
            }}
          >
            {kicker}
          </div>
          <div style={{ marginTop: 34, fontSize: titleSize, fontWeight: 800, lineHeight: 1.2, color: "#1b1430" }}>{title}</div>
          <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, lineHeight: 1.5, color: "#3e3756", display: "flex", flexDirection: "column" }}>
            {subLines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div style={{ marginTop: 52, fontSize: 22, fontWeight: 500, color: "#625b7c" }}>{FOOT}</div>
        </div>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #f4efff 0%, #e4d9ff 100%)",
          }}
        >
          <MascotSvg size={200} />
        </div>
      </div>
    ),
    { ...MOCHICO_OG_SIZE, fonts }
  );
}
