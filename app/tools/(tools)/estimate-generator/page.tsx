import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { EstimateGenerator } from "./EstimateGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "見積書作成ツール",
  "見積書を無料で作成。明細追加・消費税計算・有効期限・承認欄付き。PDF保存・印刷対応。登録不要。",
  "estimate-generator",
  ["見積書 作成 無料", "見積書 テンプレ", "見積書 PDF 無料", "フリーランス 見積書", "見積書 雛形"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">見積書の作り方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        見積書には、宛先、発行者情報、見積書番号、見積日、有効期限、明細、合計金額、納期・支払条件などを記載します。本ツールでは概算見積モード・承認欄も対応しています。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。重要な見積については専門家にご確認ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="見積書作成ツール"
      description="明細・消費税計算・有効期限・承認欄付き。PDF保存・印刷OK。登録不要・ブラウザ完結。"
      icon="📊"
      slug="estimate-generator"
      seoContent={seoContent}
    >
      <EstimateGenerator />
    </ToolLayout>
  );
}
