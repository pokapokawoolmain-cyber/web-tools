import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfReorder } from "./PdfReorder";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF並び替えツール｜ページ順番を無料で変更【登録不要】",
  description: "PDFのページ順をドラッグ操作で並び替えできます。スマホは上下ボタンにも対応。サムネイルで確認しながら並び替え。登録不要・無料・ブラウザ完結。",
  path: "/tools/pdf-reorder",
  keywords: ["PDF 並び替え", "PDF ページ 順番 変更", "PDF 順番 入れ替え", "PDF ページ 入れ替え 無料", "PDF reorder"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF並び替え", icon: "↕️", desc: "ドラッグでページ順を自由に変更。スマホも対応。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページ順を無料で並び替えられますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、完全無料でご利用いただけます。登録・インストール不要でブラウザから即利用できます。" },
    },
    {
      "@type": "Question",
      name: "スマホでもページ順を変更できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。スマホでは各ページ右側の▲▼ボタンで順番を入れ替えられます。PCではドラッグ＆ドロップにも対応しています。" },
    },
    {
      "@type": "Question",
      name: "ページのサムネイルは表示されますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。PDFをアップロードするとページのプレビュー画像が順次表示されます。サムネイルを見ながら並び替えができるので、どのページか確認しやすいです。" },
    },
    {
      "@type": "Question",
      name: "PDF結合ツールとの違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDF並び替えは1つのPDF内のページ順を変更するツールです。PDF結合は複数のPDFファイルをまとめて1つにするツールです。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。サムネイル生成も含めてすべてローカルで処理されます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd
        slug="pdf-reorder"
        title="PDF並び替えツール"
        description="PDFのページ順をドラッグ操作で並び替え。スマホは上下ボタンにも対応。登録不要・無料・ブラウザ完結。"
      />
      <JsonLd data={faqSchema} />
      <PdfReorder />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-reorder" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">ページ順を変える必要がある場面</h2>
          <p>
            PDF内のページ順が意図と異なる状況は、いくつかのパターンで起きます。
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">製本順と読む順が逆になっているスキャンPDF</p>
              <p className="text-[13px]">両面印刷の書類をスキャナーで読み取ると、表面1・2・3…と裏面1・2・3…が交互に入ってしまうことがあります。並び替えで読む順に直せます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">複数ソースを結合したPDFの章順を変更</p>
              <p className="text-[13px]">異なる人が作った資料をPDF結合でまとめた後、章の順番を変えたくなった場合。結合後のPDFを開いて並び替えれば再結合不要です。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">プレゼン資料のスライド順を最終調整</p>
              <p className="text-[13px]">PowerPointで編集できない状態のPDFを受け取ったが、発表順を変えたい場合。このツールでページ順を調整したPDFを作れます。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">操作手順：サムネイルを見ながら並び替える</h2>
          <p>
            PDFをアップロードすると全ページがサムネイル画像で表示されます。どのページかを目で確認しながら順番を変更できます。
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] space-y-2">
            <p className="font-semibold text-slate-700 dark:text-zinc-200">PCでの操作</p>
            <p>サムネイルをドラッグして目的の位置にドロップ。離した場所に挿入されます。</p>
            <p className="font-semibold text-slate-700 dark:text-zinc-200 mt-3">スマホでの操作</p>
            <p>各ページの右側にある▲▼ボタンで1段ずつ上下に移動できます。タッチ操作での細かいドラッグよりもボタン操作の方が確実です。</p>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400">
            サムネイル生成を含む全処理はブラウザ内で完結します。PDFがサーバーに送信されることはありません。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDF並び替えとPDF結合の違い</h2>
          <p>
            混同されやすいですが、対象が異なります。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ツール</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">対象</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">PDF並び替え（このツール）</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">1つのPDF内のページ順を変更</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">既にまとまっているPDFのページ順を調整</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-zinc-900">
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">PDF結合</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">複数のPDFファイルを1つにまとめる</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">バラバラのPDFを1ファイルに統合</td>
                </tr>
              </tbody>
            </table>
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
