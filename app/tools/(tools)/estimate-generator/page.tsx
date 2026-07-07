import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { EstimateGenerator } from "./EstimateGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "見積書作成ツール【無料・登録不要】明細・消費税を自動計算してPDF見積書を即発行",
  description:
    "見積書を無料で作成。明細行の追加・消費税の自動計算・有効期限・承認欄に対応し、PDF保存・印刷までブラウザで完結。フリーランス・個人事業主の見積書テンプレートとして登録不要ですぐ使えます。",
  path: "/tools/estimate-generator",
  keywords: [
    "見積書 作成 無料",
    "見積書 テンプレート 無料",
    "見積書 PDF 作成",
    "フリーランス 見積書",
    "見積書 雛形 エクセル不要",
    "見積書 書き方",
    "個人事業主 見積書",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "見積書作成ツール", icon: "📊", desc: "明細・消費税自動計算・有効期限・承認欄付きの見積書を無料作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "見積書の有効期限はどのくらいに設定すべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的には発行日から2週間〜1ヶ月程度が目安です。材料費や為替の変動が大きい業種では短め（1〜2週間）に設定します。有効期限を明記しておくことで、古い見積金額での発注を防ぎ、価格改定時のトラブルを避けられます。本ツールでは有効期限欄を自由に設定できます。",
      },
    },
    {
      "@type": "Question",
      name: "見積書に印鑑（社判）は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "法律上、見積書に印鑑は必須ではなく、押印がなくても有効です。ただし商習慣として角印を押すことが多く、押印があると信頼感が増します。本ツールは電子印鑑作成ツールで保存した印鑑の表示に対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "見積書にもインボイスの登録番号は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "インボイス制度で登録番号の記載が必要なのは適格請求書（請求書・領収書など仕入税額控除の証憑）であり、見積書への記載は義務ではありません。ただし取引先への案内として記載する事業者も多く、記載しても問題ありません。",
      },
    },
    {
      "@type": "Question",
      name: "入力した見積書のデータはサーバーに保存されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "保存されません。すべての処理はお使いのブラウザ内で完結し、入力内容が外部サーバーに送信されることはありません。自社の単価情報や取引先情報を含む見積書でも安心してご利用いただけます。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">見積書の作り方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        見積書には、宛先、発行者情報、見積書番号、見積日、有効期限、明細、合計金額、納期・支払条件などを記載します。本ツールでは概算見積モード・承認欄も対応しています。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 見積書の有効期限はどのくらいに設定すべきですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 一般的には発行日から2週間〜1ヶ月程度が目安です。材料費や為替の変動が大きい業種では短め（1〜2週間）に設定します。有効期限を明記しておくことで、古い見積金額での発注を防ぎ、価格改定時のトラブルを避けられます。本ツールでは有効期限欄を自由に設定できます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 見積書に印鑑（社判）は必要ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 法律上、見積書に印鑑は必須ではなく、押印がなくても有効です。ただし商習慣として角印を押すことが多く、押印があると信頼感が増します。本ツールは電子印鑑作成ツールで保存した印鑑の表示に対応しています。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 見積書にもインボイスの登録番号は必要ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. インボイス制度で登録番号の記載が必要なのは適格請求書（請求書・領収書など仕入税額控除の証憑）であり、見積書への記載は義務ではありません。ただし取引先への案内として記載する事業者も多く、記載しても問題ありません。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 入力した見積書のデータはサーバーに保存されますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 保存されません。すべての処理はお使いのブラウザ内で完結し、入力内容が外部サーバーに送信されることはありません。自社の単価情報や取引先情報を含む見積書でも安心してご利用いただけます。</p></div>
      </div>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。重要な見積については専門家にご確認ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="見積書作成ツール"
        description="明細・消費税計算・有効期限・承認欄付き。PDF保存・印刷OK。登録不要・ブラウザ完結。"
        icon="📊"
        slug="estimate-generator"
        seoContent={seoContent}
      >
        <EstimateGenerator />
      </ToolLayout>
    </>
  );
}
