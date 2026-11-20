import type { Metadata } from "next";
import { SELLER } from "@/lib/sns-starter-kit/commerce";
import { LegalShell } from "@/components/sns-starter-kit/legal/LegalShell";

export const metadata: Metadata = {
  title: { absolute: "ご購入ありがとうございます｜SNS Starter Kit | ToolBoxJP" },
  robots: { index: false, follow: false },
};

// Stripe の支払いが終わったあとに戻る画面（支払いの成否は Stripe の通知で判定し、この画面では判定しない）
export default function PurchaseCompletePage() {
  return (
    <LegalShell title="ご購入ありがとうございます">
      <p>
        お支払いの手続きが終わりました。ご入力のメールアドレスへ、ダウンロードの方法を自動でお送りします（通常は数分以内に届きます）。
      </p>
      <p>
        メールが届かない場合は、迷惑メールのフォルダもご確認ください。それでも見つからない場合は、{SELLER.email}{" "}
        へご連絡ください。お送りします。
      </p>
      <p>Stripe からは、別に領収書のメールが届きます。</p>
    </LegalShell>
  );
}
