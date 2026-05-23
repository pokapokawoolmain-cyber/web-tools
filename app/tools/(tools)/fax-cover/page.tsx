import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { FaxCover } from "./FaxCover";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "送付状作成ツール",
  "FAX送付状・書類送付状を無料で自動作成。日付・宛先・件名・枚数を入力するだけでPDF保存・印刷できます。",
  "fax-cover",
  ["送付状 テンプレ 無料", "FAX送付状 作成", "送付状 書き方", "書類 送付状 無料", "FAX カバーシート"]
);

export default function FaxCoverPage() {
  return (
    <ToolLayout
      title="送付状作成ツール"
      description="FAX送付状・書類送付状を無料で自動作成。宛先・件名・枚数を入力するだけでPDF保存・印刷できます。"
      icon="📠"
      slug="fax-cover"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">送付状（FAX送付状）とは</h2>
          <p>送付状は書類をFAX・郵便・メールで送る際に先頭に添付するカバー文書です。宛先・差出人・送付内容・枚数を記載することで、受取人が内容をすぐに把握できます。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">送付状に記載する主な項目</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>宛先（会社名・部署名・担当者名）</li>
            <li>差出人（自分の会社名・氏名・連絡先）</li>
            <li>送付日</li>
            <li>件名（送付する書類の内容）</li>
            <li>送付枚数（FAXの場合は本状含む）</li>
            <li>本文（一言コメント・備考）</li>
          </ul>
        </div>
      }
    >
      <FaxCover />
    </ToolLayout>
  );
}
