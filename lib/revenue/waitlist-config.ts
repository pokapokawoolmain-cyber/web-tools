// ============================================================
// Waitlist送信先（Google Form 無音送信）
//
// app/contact/ContactForm.tsx と全く同じパターンを踏襲する
// （このリポジトリで既に本番実績のある「バックエンドを持たずにフォーム
// 送信を受け取る」唯一の方法。新規DB・新規APIを増やさない）。
//
// 差分はGoogle Form自体をCEOが作成する必要がある点。未設定の間は
// WaitlistFormがメール入力欄を出さない設計にしており、「送信したのに
// どこにも届いていない」という事故を防ぐ。
// ============================================================

export const WAITLIST_FORM_URL = process.env.NEXT_PUBLIC_WAITLIST_FORM_URL?.trim() || "";
export const WAITLIST_ENTRY_EMAIL = process.env.NEXT_PUBLIC_WAITLIST_ENTRY_EMAIL?.trim() || "";
export const WAITLIST_ENTRY_PRODUCT = process.env.NEXT_PUBLIC_WAITLIST_ENTRY_PRODUCT?.trim() || "";

export function isWaitlistConfigured(): boolean {
  return !!WAITLIST_FORM_URL && !!WAITLIST_ENTRY_EMAIL && !!WAITLIST_ENTRY_PRODUCT;
}
