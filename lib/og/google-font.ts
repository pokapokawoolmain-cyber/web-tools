// OG 画像（next/og）用のフォント取得。ビルド時の一時的な失敗でプリレンダーが落ちないようにする。
// 旧 Safari の UA で取得すると、satori が読める woff/ttf の URL が返る
const FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";
const FONT_ATTEMPTS = 3;
const FONT_TIMEOUT_MS = 10_000;

/**
 * Google Fonts から Noto Sans JP（使う文字だけのサブセット）を取得する。
 * ビルド時は多数のページが同時に取りに行くため、429 や一時的な失敗が起きうる。
 * HTTP ステータスと中身を確認し、失敗したら間隔をあけて再試行する。最後まで失敗したら null。
 */
export async function loadNotoSansJp(text: string, weight: number): Promise<ArrayBuffer | null> {
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
  console.warn(`[og] Noto Sans JP ${weight} を取得できませんでした（${FONT_ATTEMPTS} 回試行）:`, lastError);
  return null;
}

type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 800; style: "normal" };

/**
 * ImageResponse の fonts に渡す値を作る。
 * 空配列を渡すと satori が「No fonts are loaded」で落ちるため、1つも取れなかったときは undefined を返し、
 * next/og 同梱の既定フォント（日本語の字形は next/og が動的に補う）で描かせる。
 */
export function ogFonts(name: string, loaded: { data: ArrayBuffer | null; weight: 500 | 800 }[]): OgFont[] | undefined {
  const fonts = loaded.flatMap(({ data, weight }) => (data ? [{ name, data, weight, style: "normal" as const }] : []));
  return fonts.length > 0 ? fonts : undefined;
}
