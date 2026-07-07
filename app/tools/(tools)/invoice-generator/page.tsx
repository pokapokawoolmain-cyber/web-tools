import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "請求書作成ツール【無料・登録不要】インボイス対応の請求書をブラウザで即作成・PDF保存",
  description:
    "請求書を無料で作成。明細追加・消費税の自動計算・インボイス（適格請求書）の登録番号に対応し、PDF保存・印刷までブラウザで完結。フリーランス・個人事業主の請求書テンプレートとして登録不要ですぐ使えます。",
  path: "/tools/invoice-generator",
  keywords: [
    "請求書 作成 無料",
    "請求書 テンプレート 無料",
    "インボイス 請求書 作成",
    "請求書 PDF 作成",
    "フリーランス 請求書",
    "適格請求書 書き方",
    "個人事業主 請求書",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "請求書作成ツール", icon: "🧾", desc: "インボイス対応・消費税自動計算の請求書を無料作成・PDF保存" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "インボイス制度の登録番号は記載できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。発行者情報の欄に「T」から始まる13桁の登録番号を入力すれば、適格請求書（インボイス）の要件である登録番号を記載した請求書を作成できます。税率ごとの区分記載・消費税額の表示にも対応しています。登録番号は国税庁の適格請求書発行事業者公表サイトで確認できます。",
      },
    },
    {
      "@type": "Question",
      name: "請求書に収入印紙は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "請求書は金銭の受領を証明する文書ではないため、金額にかかわらず収入印紙は不要です。収入印紙が必要になるのは、5万円以上を受け取った際に発行する紙の領収書（金銭受取書）などです。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスの請求書で源泉徴収はどう書けばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "原稿料・デザイン料・講演料など源泉徴収の対象となる報酬を法人に請求する場合は、源泉徴収税額（原則、報酬額の10.21%）を明記しておくと取引先の処理がスムーズです。記載は義務ではありませんが、「小計−源泉徴収税額＝請求金額」の形で示すのが一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "入力した請求書のデータはサーバーに保存されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "保存されません。すべての処理はお使いのブラウザ内で完結し、入力内容が外部サーバーに送信されることはありません。取引先名や金額を含む請求書でも安心してご利用いただけます。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">請求書の作り方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        請求書には、宛先、発行者情報、請求書番号、発行日、支払期限、明細、合計金額（税込）、振込先などを記載します。2023年10月から始まったインボイス制度（適格請求書）に対応するには、適格請求書発行事業者の登録番号と税率ごとの金額・消費税額の明記が必要です。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. インボイス制度の登録番号は記載できますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. はい。発行者情報の欄に「T」から始まる13桁の登録番号を入力すれば、適格請求書（インボイス）の要件である登録番号を記載した請求書を作成できます。税率ごとの区分記載・消費税額の表示にも対応しています。登録番号は国税庁の適格請求書発行事業者公表サイトで確認できます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 請求書に収入印紙は必要ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 請求書は金銭の受領を証明する文書ではないため、金額にかかわらず収入印紙は不要です。収入印紙が必要になるのは、5万円以上を受け取った際に発行する紙の領収書（金銭受取書）などです。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. フリーランスの請求書で源泉徴収はどう書けばいいですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 原稿料・デザイン料・講演料など源泉徴収の対象となる報酬を法人に請求する場合は、源泉徴収税額（原則、報酬額の10.21%）を明記しておくと取引先の処理がスムーズです。記載は義務ではありませんが、「小計−源泉徴収税額＝請求金額」の形で示すのが一般的です。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 入力した請求書のデータはサーバーに保存されますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 保存されません。すべての処理はお使いのブラウザ内で完結し、入力内容が外部サーバーに送信されることはありません。取引先名や金額を含む請求書でも安心してご利用いただけます。</p></div>
      </div>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。税務処理については税理士等の専門家にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="請求書作成ツール"
        description="明細行の追加・消費税計算・インボイス登録番号に対応。PDF保存・印刷OK。登録不要・ブラウザ完結。"
        icon="🧾"
        slug="invoice-generator"
        seoContent={seoContent}
      >
        <InvoiceGenerator />
      </ToolLayout>
    </>
  );
}
