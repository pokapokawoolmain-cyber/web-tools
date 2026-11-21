import type { Metadata } from "next";
import { TEXT } from "@/lib/sns-starter-kit/commerce";
import { LegalShell } from "@/components/sns-starter-kit/legal/LegalShell";

export const metadata: Metadata = {
  title: { absolute: "ご購入ありがとうございます｜SNS Starter Kit | ToolBoxJP" },
  robots: { index: false, follow: false },
};

// Stripe の支払いが終わったあとに戻る画面（支払いの成否は Stripe の通知で判定し、この画面では判定しない）
export default function PurchaseCompletePage() {
  return (
    <LegalShell title="ご購入ありがとうございます">
      <p>お支払いの手続きが終わりました。</p>
      <p>{TEXT.deliveryTiming}</p>
      <p>メールが届かない場合は、迷惑メールのフォルダもご確認ください。</p>
      <p>Stripe からは、別に領収書のメールが届きます。</p>
    </LegalShell>
  );
}
