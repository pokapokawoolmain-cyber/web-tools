import { ImageResponse } from "next/og";

// SNS Starter Kit のOG画像（白基調・テキストのみ。架空の実績や数値は載せない）
export const alt = "SNS Starter Kit｜自分のコミュニティに合うSNSを、自分の環境で。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINE1 = "自分のコミュニティに合うSNSを、";
const LINE2 = "自分の環境で。";
const SUB = "SNS Starter Kit ・ 49,800円（税込）・ 販売準備中 ・ ToolBoxJP";

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    // 使う文字だけを取得する（Satori は woff/ttf を要求するため旧Safari UAで取得）
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await loadFont(LINE1 + LINE2 + SUB);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fbfbf9",
          color: "#111214",
          fontFamily: font ? "Noto Sans JP" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: "#62666d" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#9a4d00" }} />
          販売準備中
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1 }}>
          <span>{LINE1}</span>
          <span>{LINE2}</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#3d4046" }}>{SUB}</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Noto Sans JP", data: font, weight: 700 as const, style: "normal" as const }] : [],
    },
  );
}
