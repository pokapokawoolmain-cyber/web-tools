import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfDeletePages } from "./PdfDeletePages";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFページ削除ツール｜不要なページを無料で削除【登録不要】",
  description: "PDFから不要なページを選んで削除できます。複数ページ一括削除・反転選択に対応。登録不要・無料・ブラウザ完結で安全にPDFを編集できます。",
  path: "/tools/pdf-delete-pages",
  keywords: ["PDF ページ 削除", "PDF いらないページ 消す", "PDF 不要ページ 削除", "PDF 編集 ページ削除", "PDF ページ 消去 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDFページ削除", icon: "🗑️", desc: "不要なページを選択して削除。登録不要・無料。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページを無料で削除できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、完全無料でご利用いただけます。登録・インストール不要でブラウザから即利用できます。" },
    },
    {
      "@type": "Question",
      name: "1ページだけ削除できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、1ページだけでも複数ページでも削除できます。ページ一覧から削除したいページを選択し、ダウンロードしてください。" },
    },
    {
      "@type": "Question",
      name: "PDF分割ツールとの違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDF分割は「必要なページだけを取り出す」機能です。PDFページ削除は「不要なページだけを消して、残りをそのまま保存する」機能です。大半のページを残したい場合はこちらのほうが直感的に操作できます。" },
    },
    {
      "@type": "Question",
      name: "スマホでも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidともに対応しています。ページをタップして選択し、削除することができます。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。機密性の高い文書も安心してご利用いただけます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd
        slug="pdf-delete-pages"
        title="PDFページ削除ツール"
        description="PDFから不要なページを選んで削除。複数ページ一括削除・反転選択対応。登録不要・無料・ブラウザ完結。"
      />
      <JsonLd data={faqSchema} />
      <PdfDeletePages />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-delete-pages" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">ページ削除とPDF分割 — どちらを使うべきか</h2>
          <p>
            「不要なページを消したい」場合はページ削除ツール、「特定ページだけを取り出したい」場合はPDF分割ツールが適しています。操作の方向性が逆です。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ツール</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">考え方</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">ページ削除（このツール）</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">「残したいページ」が多い。邪魔なページだけを除く</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">30ページのうち2ページだけ不要</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-zinc-900">
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">PDF分割</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">「取り出したいページ」が少ない。必要ページだけ抽出する</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">30ページのうち3ページだけ必要</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">削除操作の注意点</h2>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[13px] space-y-2">
            <p className="font-semibold text-amber-800 dark:text-amber-300">元ファイルは変更されません</p>
            <p className="text-amber-700 dark:text-amber-400">
              このツールはブラウザ内で処理し、新しいPDFをダウンロードします。アップロードした元のファイルは一切変更されません。ダウンロードしたファイルが削除後のPDFです。
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] space-y-2">
            <p className="font-semibold text-slate-700 dark:text-zinc-200">重要書類は操作前にバックアップを</p>
            <p>
              ダウンロード後に元のファイルを捨てる前に、内容を確認してください。削除後のPDFを開いて目的のページが正しく除かれていることを確認してから元ファイルを整理するのが安全です。
            </p>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">ページ削除が役立つ具体的な場面</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">スキャンした表紙・裏表紙の白紙を除去</p>
              <p className="text-[13px]">書類をスキャンすると先頭や末尾に白紙ページが入ることがよくあります。共有前にこのツールで不要な白紙ページを削除してからメール添付できます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">個人情報が含まれるページを削除して共有</p>
              <p className="text-[13px]">提案書や報告書の中に住所・氏名・口座番号などが記載されたページがある場合、そのページだけを削除してから関係者に共有できます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">マニュアルPDFから不要な付録を除去</p>
              <p className="text-[13px]">製品マニュアルをPDFで配布する際、特定地域向けの付録ページや社内専用ページを削除してから顧客に送付できます。</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">よくある質問</h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{item.name}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
