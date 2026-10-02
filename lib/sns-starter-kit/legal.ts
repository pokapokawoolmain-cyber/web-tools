// ============================================================
// 法務文書の版（プライバシーポリシーの最終更新日と、先行予約の同意の版を一致させる）
//
// ★Production 公開日と必ず一致させること。公開日がずれた場合は、デプロイ前にこの1行を更新する。
//   - app/privacy/page.tsx の「最終更新日」
//   - lib/sns-starter-kit/reservation.ts の RESERVATION_CONSENT_VERSION（DBの consent_version に保存）
//   は、どちらもこの値から作られる。
// ============================================================

/** プライバシーポリシーの施行日（= Production 公開日）。YYYY-MM-DD */
export const PRIVACY_EFFECTIVE_DATE = "2026-10-02";

/** 画面表示用（例: 2026年10月2日） */
export function privacyEffectiveDateLabel(): string {
  const [y, m, d] = PRIVACY_EFFECTIVE_DATE.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}
