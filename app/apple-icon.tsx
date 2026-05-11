import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Top bar of T */}
          <div
            style={{
              width: 100,
              height: 16,
              background: "white",
              borderRadius: 8,
            }}
          />
          {/* Stem of T */}
          <div
            style={{
              width: 22,
              height: 62,
              background: "white",
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
