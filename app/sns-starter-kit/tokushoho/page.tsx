import type { Metadata } from "next";
import { SELLER, TERMS_EFFECTIVE_DATE, TEXT } from "@/lib/sns-starter-kit/commerce";
import { LegalShell, TermTable } from "@/components/sns-starter-kit/legal/LegalShell";

export const metadata: Metadata = {
  title: { absolute: "特定商取引法に基づく表記｜SNS Starter Kit | ToolBoxJP" },
  description: "SNS Starter Kit の販売に関する、特定商取引法に基づく表記です。",
  alternates: { canonical: "https://www.toolboxjp.com/sns-starter-kit/tokushoho" },
};

export default function TokushohoPage() {
  return (
    <LegalShell title="特定商取引法に基づく表記" updated={TERMS_EFFECTIVE_DATE}>
      <TermTable
        rows={[
          ["販売事業者", SELLER.name],
          ["運営統括責任者", SELLER.representative],
          ["所在地", SELLER.addressNote],
          ["電話番号", SELLER.phoneNote],
          ["メールアドレス", <a key="m" href={`mailto:${SELLER.email}`} className="underline underline-offset-2">{SELLER.email}</a>],
          ["商品名", TEXT.product],
          ["販売価格", TEXT.price],
          ["商品代金以外の必要料金", <>インターネットの接続料金・通信料金。{TEXT.external}</>],
          ["支払方法", TEXT.payMethod],
          ["支払時期", TEXT.payTiming],
          ["商品の引渡時期", TEXT.deliveryTiming],
          ["引渡方法", TEXT.deliveryMethod],
          ["動作環境", TEXT.env],
          ["返品・返金（返品特約）", TEXT.refund],
          ["購入の確定前のキャンセル", TEXT.cancelBeforeConfirm],
          ["サポート", TEXT.support],
          ["更新（アップデート）", <>{TEXT.form}{TEXT.update}</>],
          ["ライセンス", TEXT.license],
          ["別売りの商品", TEXT.separate],
        ]}
      />
    </LegalShell>
  );
}
