import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { loadNotoSansJp, ogFonts } from "@/lib/og/google-font";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "ToolBox";
  const icon  = searchParams.get("icon")  ?? "🧰";
  const desc  = searchParams.get("desc")  ?? "無料Webツール集";

  const font = await loadNotoSansJp(undefined, 700);
  const fontConfig = ogFonts("Noto Sans JP", [{ data: font, weight: 700 }]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "'Noto Sans JP', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* グラデーションアクセント：右上 */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-160px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* グラデーションアクセント：左下 */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* 上部アクセントバー */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
            display: "flex",
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "80px 80px 80px 80px",
            justifyContent: "center",
            flex: 1,
            gap: "0px",
          }}
        >
          {/* アイコン */}
          <div style={{ fontSize: "88px", lineHeight: 1, marginBottom: "28px", display: "flex" }}>
            {icon}
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.25,
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* 説明 */}
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: "960px",
              display: "flex",
            }}
          >
            {desc}
          </div>
        </div>

        {/* ブランディング（右下） */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "72px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🧰
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#64748b",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            ToolBox
          </div>
        </div>

        {/* 無料バッジ */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "72px",
            display: "flex",
            alignItems: "center",
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: "999px",
            padding: "8px 20px",
          }}
        >
          <div style={{ fontSize: "18px", color: "#93c5fd", display: "flex" }}>
            無料・登録不要・ブラウザ完結
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontConfig,
      headers: {
        "cache-control": "public, immutable, no-transform, max-age=31536000",
      },
    }
  );
}
