// ============================================================
// 白基調を強制する画面の判定（クライアント側の ThemeProvider / Header から使う）
//
// 既存の無料ツールはサイト全体のテーマ（既定ダーク）に従う。
// 商品のLaunch Pageは白基調を前提に設計しているため、ここに列挙したパスだけ
// ライトテーマに固定し、テーマ切替ボタン（押しても変わらないUI）を出さない。
// ============================================================

const FORCED_LIGHT_PREFIXES = ["/sns-starter-kit"];

export function isForcedLightRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return FORCED_LIGHT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
