import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfRotate } from "./PdfRotate";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF回転ツール｜ページの向きを無料で変更【登録不要】",
  description: "PDFのページを90度・180度・270度に回転できます。全ページ一括・指定ページ個別対応。登録不要・無料・ブラウザ完結でスマホにも対応。",
  path: "/tools/pdf-rotate",
  keywords: ["PDF 回転", "PDF 向き 変更", "PDF 横向き 縦向き", "PDFページ 回転 無料", "PDF rotate 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF回転ツール", icon: "🔄", desc: "ページの向きを90°・180°・270°に変更。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページを90度回転できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。90°・180°・270°の3段階から選べます。全ページ回転・指定ページのみ回転の両方に対応しています。" },
    },
    {
      "@type": "Question",
      name: "スキャンしたPDFが横向きになっています。縦に直せますか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールで90°または270°回転させることで縦向きに修正できます。処理後そのままダウンロードできます。" },
    },
    {
      "@type": "Question",
      name: "回転するとPDFの画質は劣化しますか？",
      acceptedAnswer: { "@type": "Answer", text: "劣化しません。ページの回転はメタデータの変更のみで行われるため、テキスト・画像の品質は元のまま維持されます。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-rotate" title="PDFページ回転ツール" description="PDFのページを90°・180°・270°回転。全ページ・指定ページに対応。登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfRotate />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-rotate" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDFが横向きになる主な原因</h2>
          <p>
            PDFを開いたら特定ページだけ横向きになっていた、という状況は頻繁に起きます。主な原因は3パターンです。
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">スキャン時の向きが横になっていた</p>
              <p className="text-[13px]">紙をスキャナーに横向きに置いたまま取り込むと、そのままの向きでPDFに保存されます。特に複数ページをまとめてスキャンした場合に1枚だけ向きが違うことがよくあります。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">ExcelやPowerPointをPDF書き出しした際の設定</p>
              <p className="text-[13px]">Excelの横向き印刷設定がそのままPDFに反映されます。また、PowerPointのスライドサイズ（ワイド16:9 vs 標準4:3）によって向きが変わることもあります。</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">PDFを別のツールで結合・変換した際に向きがリセットされた</p>
              <p className="text-[13px]">複数PDFを結合したとき、ツールによっては元ページの回転情報が失われて向きが変わることがあります。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">全ページ回転 vs 指定ページ回転の使い分け</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">操作</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">全ページ一括回転</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">スキャン時にPDF全体が横向きで取り込まれた場合。プレゼン資料全体の向きを縦から横に統一したい場合。</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-zinc-900">
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">指定ページのみ回転</td>
                  <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">複数ページのうち特定の1ページだけ向きがおかしい場合。図表ページだけを横向きに変えたい場合。</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400">
            回転はPDFのページメタデータに保存されます。テキストや画像データは一切再生成されないため、画質の劣化はありません。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDF回転が役立つ場面</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">スキャン書類をメール送付前に修正</p>
              <p className="text-[13px]">契約書や領収書をスキャンしたら横向きになっていた。送る前にこのツールで縦向きに修正してから添付できます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">プレゼン資料の向きを統一</p>
              <p className="text-[13px]">複数のソースから集めたページを結合したPDFで、一部が縦・一部が横になっている状態を統一します。閲覧者が読む方向を変えずに済むようになります。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">スマホで縦スクロールしやすくする</p>
              <p className="text-[13px]">横向きPDFをスマホで読むと左右にスクロールが必要で読みにくい。縦向きに直すことでスクロールが1方向になり読みやすくなります。</p>
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
