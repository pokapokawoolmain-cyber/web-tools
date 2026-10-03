// Mochico の OG 画像（白基調・公式 purple のキャラクター。架空の実績や数値は載せない）
import { ImageResponse } from "next/og";
import { MascotSvg } from "@/lib/mochico/icon-render";

export const alt = "Mochico（モチコ）｜推しグッズを見やすく管理・共有";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const L1 = "推しグッズ、ぜんぶここに。";
const L2 = "リストはみんなで。持ってるものは、自分だけ。";
const L3 = "Mochico モチコ ｜ 推しグッズを見やすく管理・共有";

async function loadFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`,
      {
        headers: {
          // satori は woff/ttf を要求するため、旧 Safari の UA で取得する（SNS LP と同じ方式）
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      }
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([loadFont(L1 + "Mochico", 800), loadFont(L2 + L3, 500)]);
  const fonts = [
    ...(bold ? [{ name: "NotoJP", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "NotoJP", data: regular, weight: 500 as const, style: "normal" as const }] : []),
  ];
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
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 800, color: "#1b1430" }}>
            Mochico
            <span style={{ fontSize: 24, fontWeight: 500, color: "#625b7c" }}>モチコ</span>
          </div>
          <div style={{ marginTop: 36, fontSize: 64, fontWeight: 800, lineHeight: 1.25, color: "#1b1430", display: "flex", flexDirection: "column" }}>
            {L1.split("、").map((t, i, a) => (
              <span key={i}>{i < a.length - 1 ? `${t}、` : t}</span>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, fontWeight: 500, color: "#5a2fd2" }}>{L2}</div>
          <div style={{ marginTop: 48, fontSize: 22, fontWeight: 500, color: "#625b7c" }}>{L3}</div>
        </div>
        <div
          style={{
            width: 330,
            height: 330,
            borderRadius: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #f4efff 0%, #e4d9ff 100%)",
          }}
        >
          <MascotSvg size={240} />
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
