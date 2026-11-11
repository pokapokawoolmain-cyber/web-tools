// SNS Starter Kit ガイド記事の OG 画像（LP と同じ中立色＋青。架空の数値や画面は載せない）
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// 旧 Safari の UA で取得すると、satori が読める woff/ttf の URL が返る（Mochico 記事の OG と同じ方式）
const FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";
const FONT_ATTEMPTS = 3;
const FONT_TIMEOUT_MS = 10_000;

/**
 * Google Fonts から Noto Sans JP（使う文字だけのサブセット）を取得する。
 * ビルド時は多数のページが同時に取りに行くため、429 や一時的な失敗が起きうる。
 * HTTP ステータスと中身を確認し、失敗したら間隔をあけて再試行する。最後まで失敗したら null。
 */
async function loadFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= FONT_ATTEMPTS; attempt++) {
    try {
      const cssRes = await fetch(cssUrl, { headers: { "User-Agent": FONT_UA }, signal: AbortSignal.timeout(FONT_TIMEOUT_MS) });
      if (!cssRes.ok) throw new Error(`css HTTP ${cssRes.status}`);
      const url = (await cssRes.text()).match(/src: url\((.+?)\)/)?.[1];
      if (!url) throw new Error("css に font の URL がない");
      const fontRes = await fetch(url, { signal: AbortSignal.timeout(FONT_TIMEOUT_MS) });
      if (!fontRes.ok) throw new Error(`font HTTP ${fontRes.status}`);
      const data = await fontRes.arrayBuffer();
      if (data.byteLength === 0) throw new Error("font が空");
      return data;
    } catch (e) {
      lastError = e;
      if (attempt < FONT_ATTEMPTS) await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
    }
  }
  console.warn(`[sns-kit og] Noto Sans JP ${weight} を取得できませんでした（${FONT_ATTEMPTS} 回試行）:`, lastError);
  return null;
}

/** kicker: 上の小さなラベル / title: 大見出し（1〜2行）/ sub: 補足の行 */
export async function snsKitOgImage({ kicker, title, sub }: { kicker: string; title: string[]; sub: string[] }) {
  const foot = "ToolBoxJP ブログ ｜ SNS Starter Kit";
  const [bold, regular] = await Promise.all([loadFont(title.join(""), 800), loadFont(kicker + sub.join("") + foot, 500)]);
  const fonts = [
    ...(bold ? [{ name: "NotoJP", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "NotoJP", data: regular, weight: 500 as const, style: "normal" as const }] : []),
  ];
  // fonts に空配列を渡すと satori が「No fonts are loaded」で落ちる。
  // 1つも取れなかったときは undefined にして next/og 同梱の既定フォント（日本語は next/og が動的に補う）で描く。
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
    { ...OG_SIZE, fonts: fonts.length > 0 ? fonts : undefined }
  );
}
