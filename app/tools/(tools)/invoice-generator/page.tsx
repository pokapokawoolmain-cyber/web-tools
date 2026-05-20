import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "請求書作成ツール",
  "請求書を無料で作成。明細追加・消費税計算・インボイス登録番号対応。PDF保存・印刷可能。登録不要・ブラウザ完結。",
  "invoice-generator",
  ["請求書 作成 無料", "請求書 PDF 無料", "インボイス 請求書", "フリーランス 請求書 テンプレ", "請求書 雛形"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">請求書の作り方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        請求書には、宛先、発行者情報、請求書番号、発行日、支払期限、明細、合計金額（税込）、振込先などを記載します。2023年10月から始まったインボイス制度（適格請求書）に対応するには、適格請求書発行事業者の登録番号と税率ごとの金額・消費税額の明記が必要です。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。税務処理については税理士等の専門家にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="請求書作成ツール"
      description="明細行の追加・消費税計算・インボイス登録番号に対応。PDF保存・印刷OK。登録不要・ブラウザ完結。"
      icon="🧾"
      slug="invoice-generator"
      seoContent={seoContent}
    >
      <InvoiceGenerator />
    </ToolLayout>
  );
}
