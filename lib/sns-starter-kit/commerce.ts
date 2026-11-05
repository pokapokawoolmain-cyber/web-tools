// ============================================================
// SNS Starter Kit — 販売条件の文言の単一の置き場所
//
// ★LP・購入ボタン付近・購入内容の確認画面・特定商取引法に基づく表記・規約は、
//   すべてこのファイルの文をそのまま表示する（文言の食い違いを作らないため）。
//   文言を変えるときは、このファイルだけを直す。
// ============================================================

/** Stripe の支払いリンク（本番）。公開してよい URL。販売を止めるときは SALE_OPEN を false にする。 */
export const PAYMENT_LINK = "https://buy.stripe.com/14AfZh4891Rif9zaCrcQU01";
export const SALE_OPEN = true;
export const PURCHASABLE = SALE_OPEN && PAYMENT_LINK.startsWith("https://buy.stripe.com/");

export const SELLER = {
  name: "akamaru Corp.（屋号）",
  representative: "𠮷田 貴由",
  email: "privacy@toolboxjp.com",
  addressNote: "ご請求があれば遅滞なく開示します（上記メールアドレスへご連絡ください）。",
  phoneNote: "ご請求があれば遅滞なく開示します。お問い合わせはメールでお願いしています。",
} as const;

/** 規約・特商法の表記の施行日（最終更新日） */
export const TERMS_EFFECTIVE_DATE = "2026年11月5日";

export const TEXT = {
  product: "SNS Starter Kit Standard 1.0.0",
  price: "49,800円（税込）",
  form: "買い切りのデジタル商品（ZIP ファイルのダウンロード）です。購入時点の版（1.0.0）を提供します。",
  update: "将来の更新（アップデート）の提供は保証しません。",
  license:
    "1購入につき、本番環境で公開する1つのプロジェクト（1 Production Project）で使用できます。手元・開発・ステージング・受け入れ確認などの非公開の検証環境は、数に含みません。第三者のための制作代行には使用できません。",
  env: "動作確認済みの環境: macOS 26（Apple シリコン）、Node.js 22.18 以上、Google Chrome。Windows・Linux は動作確認の対象外です。",
  external:
    "本商品を使うための外部サービス（Supabase・Vercel・メール送信サービス・独自ドメイン・Claude Code などの AI ツール）の利用料金は、商品代金に含みません。利用目的や規模によって、有料プランが必要になる場合があります。",
  support:
    "購入日から30日間、メールで対応します（非同期。電話・オンライン会議での対応はしません）。対象は、同梱の手順書どおりに操作しても導入できない重大な問題です。個別のカスタマイズ、購入者による改変の後の問題、外部サービスの障害・仕様変更、Standard の対象外の機能、Extension Pack・追加機能・v2、運用の代行、動作確認の対象外の環境（Windows・Linux など）は対象外です。",
  refund:
    "本商品はデジタル商品のため、ダウンロードの提供を開始した後の、お客様のご都合による返品・返金はお受けしていません。ただし、購入日から30日以内に、同梱の手順書どおりに操作しても導入できない重大な問題が生じ、サポートでも解決できない場合は、返金します。同じ商品を誤って重複して購入した場合も、重複分を返金します。",
  separate: "Extension Pack・追加機能・v2 は別売りです。",
  payMethod: "クレジットカード（Stripe による決済）",
  payTiming: "購入手続きの完了時に決済されます。",
  deliveryMethod: "ダウンロード（ZIP ファイル）。購入時にご入力いただいたメールアドレスへ、ダウンロードの方法をお送りします。",
  deliveryTiming: "決済の完了後、原則24時間以内にメールでお送りします（土日祝日・年末年始は翌営業日になる場合があります）。",
  cancelBeforeConfirm: "支払い画面で購入を確定する前であれば、料金は発生しません。",
} as const;
