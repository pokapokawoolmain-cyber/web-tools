// ============================================================
// 白基調を強制する画面の判定（クライアント側の ThemeProvider / Header から使う）
//
// 既存の無料ツールはサイト全体のテーマ（既定ダーク）に従う。
// 商品のLaunch Pageは白基調を前提に設計しているため、ここに列挙したパスだけ
// ライトテーマに固定し、テーマ切替ボタン（押しても変わらないUI）を出さない。
// ============================================================

const FORCED_LIGHT_PREFIXES = ["/sns-starter-kit"];
/** Mochico 関連記事（ToolBoxJP ブログ内だが Mochico の白基調で表示する）。記事を増やしたらここに足す */
export const MOCHICO_ARTICLE_PATHS = ["/blog/oshi-goods-management"];
/** 配下のページには適用しない（完全一致のみ）。Mochico は公開 LP と関連記事だけを白基調に固定する */
const FORCED_LIGHT_EXACT = ["/mochico", ...MOCHICO_ARTICLE_PATHS];

export function isForcedLightRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (FORCED_LIGHT_EXACT.includes(pathname)) return true;
  return FORCED_LIGHT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
