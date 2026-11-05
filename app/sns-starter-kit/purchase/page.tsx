import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PAYMENT_LINK, PURCHASABLE, SELLER, TEXT } from "@/lib/sns-starter-kit/commerce";
import { LegalShell, TermTable } from "@/components/sns-starter-kit/legal/LegalShell";
import { PurchaseConsent } from "./PurchaseConsent";

export const metadata: Metadata = {
  title: { absolute: "購入内容の確認｜SNS Starter Kit | ToolBoxJP" },
  description: "SNS Starter Kit の購入内容と条件の確認画面です。",
  robots: { index: false, follow: true },
};

// 購入を確定する前の確認画面。重要な条件は、確定ボタンより前に、本文と同じ大きさで表示する。
export default function PurchasePage() {
  if (!PURCHASABLE) redirect("/sns-starter-kit");
  return (
    <LegalShell title="購入内容の確認">
      <p>購入の前に、次の内容をご確認ください。下の同意のチェックを入れると、Stripe の支払い画面へ進めます。</p>
      <TermTable
        rows={[
          ["商品", TEXT.product],
          ["数量", "1"],
          ["価格", TEXT.price],
          ["支払方法", TEXT.payMethod],
          ["支払時期", TEXT.payTiming],
          ["提供方法", TEXT.deliveryMethod],
          ["提供時期", TEXT.deliveryTiming],
          ["返品・返金", TEXT.refund],
          ["サポート", TEXT.support],
          ["ライセンス", TEXT.license],
          ["動作環境", TEXT.env],
          ["更新", <>{TEXT.form}{TEXT.update}</>],
          ["外部サービスの料金", TEXT.external],
          ["別売り", TEXT.separate],
          ["販売者", <>{SELLER.name}（運営統括責任者: {SELLER.representative}）・{SELLER.email}</>],
        ]}
      />
      <PurchaseConsent paymentLink={PAYMENT_LINK} />
      <p className="text-sm text-slate-500">{TEXT.cancelBeforeConfirm}</p>
    </LegalShell>
  );
}
