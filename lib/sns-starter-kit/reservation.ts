// ============================================================
// SNS Starter Kit 先行予約 — 入力の型と検証（クライアント/サーバー共通）
//
// サーバー側でも必ず同じ validateReservationInput() を通す。
// クライアント側の検証は体験のためのもので、信頼の根拠にしない。
// ============================================================

export const EXPERIENCE_OPTIONS = [
  { value: "built_with_ai", label: "AIでWebアプリを作った経験がある" },
  { value: "has_tech_partner", label: "技術協力者がいる" },
  { value: "neither", label: "どちらでもない" },
] as const;

export const USE_WITHIN_30_DAYS_OPTIONS = [
  { value: "yes", label: "はい" },
  { value: "undecided", label: "未定" },
] as const;

export type ExperienceType = (typeof EXPERIENCE_OPTIONS)[number]["value"];
export type UseWithin30Days = (typeof USE_WITHIN_30_DAYS_OPTIONS)[number]["value"];
export type ReservationStatus = "reserved" | "notified" | "purchased" | "declined";

export const COMMUNITY_DESCRIPTION_MAX = 300;

/**
 * 同意取得時に表示していた文言・ポリシーの版。同意の記録（特定電子メール法上の記録保存を想定）
 * として予約行に保存する。プライバシーポリシーや同意文言を変えたら必ず更新する。
 * "-draft" は CEO / Legal 承認前の版であることを示す。
 */
export const RESERVATION_CONSENT_VERSION = "2026-10-01-draft";
export const EMAIL_MAX = 254;
const UTM_MAX = 100;

export interface ReservationInput {
  email: string;
  experienceType: ExperienceType;
  communityDescription: string;
  useWithin30Days: UseWithin30Days;
  purchaseNotificationConsent: true;
  marketingConsent: boolean;
  consentVersion: string;
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export type ReservationField =
  | "email"
  | "experienceType"
  | "communityDescription"
  | "useWithin30Days"
  | "purchaseNotificationConsent";

export type FieldErrors = Partial<Record<ReservationField, string>>;

// 実用上十分な形式チェック（RFC完全準拠は目指さない。到達確認は販売開始時のメールで行う）。
const EMAIL_RE = /^[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[^\s@"<>()[\]\\,;:]{2,}$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= EMAIL_MAX && EMAIL_RE.test(email);
}

function cleanOptional(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  // 制御文字を除去し、長さを制限する（UTMは任意入力なので信用しない）
  const v = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
  return v.length ? v : null;
}

/**
 * 未知の入力（リクエストボディやフォーム値）を検証する。
 * 成功時は正規化済みの値を返す。失敗時はフィールドごとの日本語メッセージを返す。
 */
export function validateReservationInput(
  raw: unknown,
): { ok: true; value: ReservationInput } | { ok: false; errors: FieldErrors } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const email = typeof r.email === "string" ? normalizeEmail(r.email) : "";
  if (!email) errors.email = "メールアドレスを入力してください。";
  else if (!isValidEmail(email)) errors.email = "メールアドレスの形式を確認してください。";

  const experienceType = r.experienceType;
  if (!EXPERIENCE_OPTIONS.some((o) => o.value === experienceType)) {
    errors.experienceType = "いずれかを選択してください。";
  }

  // 改行・タブ以外の制御文字は保存しない（表示・CSV出力時の事故を減らす）
  const communityDescription =
    typeof r.communityDescription === "string"
      ? r.communityDescription.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim()
      : "";
  if (!communityDescription) {
    errors.communityDescription = "作りたいコミュニティを入力してください。";
  } else if (communityDescription.length > COMMUNITY_DESCRIPTION_MAX) {
    errors.communityDescription = `${COMMUNITY_DESCRIPTION_MAX}文字以内で入力してください。`;
  }

  const useWithin30Days = r.useWithin30Days;
  if (!USE_WITHIN_30_DAYS_OPTIONS.some((o) => o.value === useWithin30Days)) {
    errors.useWithin30Days = "いずれかを選択してください。";
  }

  if (r.purchaseNotificationConsent !== true) {
    errors.purchaseNotificationConsent = "販売開始のご案内を受け取るには、同意が必要です。";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      email,
      experienceType: experienceType as ExperienceType,
      communityDescription,
      useWithin30Days: useWithin30Days as UseWithin30Days,
      purchaseNotificationConsent: true,
      marketingConsent: r.marketingConsent === true,
      consentVersion: RESERVATION_CONSENT_VERSION,
      source: cleanOptional(r.source, UTM_MAX),
      utmSource: cleanOptional(r.utmSource, UTM_MAX),
      utmMedium: cleanOptional(r.utmMedium, UTM_MAX),
      utmCampaign: cleanOptional(r.utmCampaign, UTM_MAX),
    },
  };
}

/**
 * API の応答。クライアントはこの形だけを前提にする。
 * 新規登録と、既に登録済みのメールアドレスは同じ "reserved" を返す
 * （応答からメールアドレスの登録有無を推測できないようにするため）。
 */
export type ReservationApiResponse =
  | { result: "reserved" }
  | { result: "invalid"; errors: FieldErrors }
  | { result: "unavailable" }
  | { result: "rate_limited" }
  | { result: "error" };
