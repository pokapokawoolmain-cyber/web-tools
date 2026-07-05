import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// サイト既定ファビコン: ガラス風ダークタイル＋ネオンブルーの「T」
// （ツール・カテゴリページは /api/favicon が個別アイコンを提供）
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(160deg, #141a2e 0%, #0a0e1a 100%)",
          border: "1.5px solid rgba(56,189,248,0.55)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: 16, height: 3, background: "#38bdf8", borderRadius: 2 }} />
          <div style={{ width: 4, height: 11, background: "#38bdf8", borderRadius: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
