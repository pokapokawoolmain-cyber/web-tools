import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfSplit } from "./PdfSplit";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF分割ツール｜ページ抽出・分割を無料で実行",
  description: "PDFをページごとに分割。必要なページだけ抽出して保存できます。登録不要・ブラウザ完結・スマホ対応。",
  path: "/tools/pdf-split",
  keywords: ["PDF分割", "PDF ページ 抽出", "PDF 一部 保存", "PDF splitter 無料", "PDF 特定ページ"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF分割ツール", icon: "✂️", desc: "必要なページだけ抽出・保存。登録不要・無料。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF分割は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "特定のページだけ取り出せますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「1, 3, 5-8」のようにページ番号を指定して抽出できます。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。" } },
    { "@type": "Question", name: "PDFページ削除ツールとの違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "PDF分割は「必要なページを取り出して別ファイルにする」ツールです。PDFページ削除は「不要なページだけ消して残りを保存する」ツールです。目的に応じて使い分けてください。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-split" title="PDF分割ツール" description="PDFをページごとに分割。必要なページだけ抽出して保存できます。" />
      <JsonLd data={faqSchema} />
      <PdfSplit />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-split" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDF分割・ページ削除・ページ抽出の違い</h2>
          <p>
            似たような操作に見えますが、目的によって使うツールが変わります。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">操作</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">何をするか</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている場面</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["PDF分割（このツール）", "指定ページを「取り出して」別ファイルを作る", "必要なページだけを抽出・配布したい"],
                  ["PDFページ削除", "不要なページを「消して」残りを保存する", "大半は残して一部だけ除きたい"],
                  ["PDF分割（全ページ1枚ずつ）", "全ページを個別のPDFファイルに分解する", "ページを完全に別々のファイルに切り離したい"],
                ] as string[][]).map(([op, what, when], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">{op}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{what}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400">
            元のファイルはどちらの操作でも変更されません。分割・削除後に作られるのは常に新しいダウンロードファイルです。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">ページ番号の指定方法</h2>
          <p>
            分割したいページは「<code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded text-[13px]">1, 3, 5-8</code>」の形式で指定します。カンマで個別ページ、ハイフンで連続範囲を表します。
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] space-y-2">
            <p><code className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">1, 3</code> → 1ページ目と3ページ目のみを抽出</p>
            <p><code className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">2-5</code> → 2〜5ページ目の連続4ページを抽出</p>
            <p><code className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">1, 4-6, 9</code> → 1ページ、4〜6ページ、9ページを抽出（合計5ページ）</p>
          </div>
          <p>
            指定したページは1つのPDFとしてまとめてダウンロードされます。ページの順番はPDF内の元の順番に従います。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDF分割が役立つ具体的な場面</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">契約書から特定条項だけ抽出して確認依頼</p>
              <p className="text-[13px]">20ページある契約書のうち、第3条〜第5条（3〜5ページ）だけを弁護士に送りたいとき。全文を共有せず必要部分だけ渡せます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">書籍・レポートの特定章だけ同僚と共有</p>
              <p className="text-[13px]">100ページの調査レポートのうち、関係するセクション（例：22〜35ページ）だけを抜き出してチャットに添付。相手が全文を探す手間をなくせます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">申請書類の提出ページだけ送付</p>
              <p className="text-[13px]">マニュアル込みでダウンロードした申請書PDFから、実際に記入・提出するページ（1, 4, 7ページなど）だけを取り出して提出できます。</p>
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
