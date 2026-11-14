// SNS Starter Kit ガイド記事の OG 画像（LP と同じ中立色＋青。架空の数値や画面は載せない）
import { ImageResponse } from "next/og";
import { loadNotoSansJp, ogFonts } from "@/lib/og/google-font";

export const OG_SIZE = { width: 1200, height: 630 };

/** kicker: 上の小さなラベル / title: 大見出し（1〜2行）/ sub: 補足の行 */
export async function snsKitOgImage({ kicker, title, sub }: { kicker: string; title: string[]; sub: string[] }) {
  const foot = "ToolBoxJP ブログ ｜ SNS Starter Kit";
  const [bold, regular] = await Promise.all([loadNotoSansJp(title.join(""), 800), loadNotoSansJp(kicker + sub.join("") + foot, 500)]);
  const fonts = ogFonts("NotoJP", [
    { data: bold, weight: 800 },
    { data: regular, weight: 500 },
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "linear-gradient(135deg, #ffffff 0%, #f6f6f2 55%, #e8f0fd 100%)",
          fontFamily: "NotoJP",
          color: "#111214",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            fontSize: 26,
            fontWeight: 500,
            color: "#1a4fae",
            background: "#e8f0fd",
            borderRadius: 999,
            padding: "8px 22px",
          }}
        >
          {kicker}
        </div>
        <div style={{ marginTop: 34, fontSize: 64, fontWeight: 800, lineHeight: 1.25, display: "flex", flexDirection: "column" }}>
          {title.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 22, fontSize: 32, fontWeight: 500, lineHeight: 1.5, color: "#3d4046", display: "flex", flexDirection: "column" }}>
          {sub.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 48, fontSize: 22, fontWeight: 500, color: "#5d6168" }}>{foot}</div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}
