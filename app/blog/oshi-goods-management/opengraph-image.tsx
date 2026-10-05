// 記事「推しグッズの管理方法」の OG 画像（Mochico の LP と同じ白基調・公式 purple。架空の数値は載せない）
import { ImageResponse } from "next/og";
import { MascotSvg } from "@/lib/mochico/icon-render";

export const alt = "推しグッズの管理方法｜持っているものを把握して重複買いを防ぐコツ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const KICKER = "推し活・グッズ管理";
const L1 = "推しグッズの管理方法";
const L2 = "持っているものを把握して、重複買いを防ぐコツ";
const FOOT = "ToolBoxJP ブログ ｜ Mochico ガイド";

async function loadFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`,
      {
        headers: {
          // satori は woff/ttf を要求するため、旧 Safari の UA で取得する（Mochico LP の OG と同じ方式）
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
  const [bold, regular] = await Promise.all([loadFont(L1, 800), loadFont(KICKER + L2 + FOOT, 500)]);
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
            {KICKER}
          </div>
          <div style={{ marginTop: 34, fontSize: 72, fontWeight: 800, lineHeight: 1.2, color: "#1b1430" }}>{L1}</div>
          <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, lineHeight: 1.5, color: "#3e3756", display: "flex", flexDirection: "column" }}>
            <span>持っているものを把握して、</span>
            <span>重複買いを防ぐコツ</span>
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
    { ...size, fonts }
  );
}
