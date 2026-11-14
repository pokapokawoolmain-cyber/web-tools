import { ImageResponse } from "next/og";
import { loadNotoSansJp, ogFonts } from "@/lib/og/google-font";
import { PRODUCT } from "@/lib/sns-starter-kit/content";

// SNS Starter Kit のOG画像（白基調・テキストのみ。架空の実績や数値は載せない）
export const alt = "SNS Starter Kit｜自分のコミュニティに合うSNSを、自分の環境で。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINE1 = "自分のコミュニティに合う";
const LINE2 = "SNSを、自分の環境で。";
const SUB = `SNS Starter Kit ・ ${PRODUCT.priceLabel}（${PRODUCT.taxLabel}）・ ${PRODUCT.saleState} ・ ToolBoxJP`;

export default async function Image() {
  const font = await loadNotoSansJp(LINE1 + LINE2 + SUB, 700);
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
          <div style={{ width: 12, height: 12, borderRadius: 999, background: PRODUCT.purchasable ? "#17803d" : "#9a4d00" }} />
          {PRODUCT.saleState}
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
      fonts: ogFonts("Noto Sans JP", [{ data: font, weight: 700 }]),
    },
  );
}
