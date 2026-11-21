// 記事「推しグッズの管理方法」の OG 画像（Mochico の LP と同じ白基調・公式 purple。架空の数値は載せない）
import { ImageResponse } from "next/og";
import { loadNotoSansJp, ogFonts } from "@/lib/og/google-font";
import { MascotSvg } from "@/lib/mochico/icon-render";

export const alt = "推しグッズの管理方法｜持っているものを把握して重複買いを防ぐコツ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const KICKER = "推し活・グッズ管理";
const L1 = "推しグッズの管理方法";
const L2 = "持っているものを把握して、重複買いを防ぐコツ";
const FOOT = "ToolBoxJP ブログ ｜ Mochico ガイド";

export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([loadNotoSansJp(L1, 800), loadNotoSansJp(KICKER + L2 + FOOT, 500)]);
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
