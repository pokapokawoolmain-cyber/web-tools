import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfWatermark } from "./PdfWatermark";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF透かし追加ツール｜ウォーターマークを無料で挿入【登録不要】",
  description: "PDFに文字の透かし（ウォーターマーク）を追加できます。「社外秘」「CONFIDENTIAL」「DRAFT」など全ページ一括対応。登録不要・無料・ブラウザ完結。",
  path: "/tools/pdf-watermark",
  keywords: ["PDF 透かし", "PDF ウォーターマーク", "PDF 文字 入れる", "PDF 透かし 追加", "PDF watermark 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF透かし追加", icon: "🔏", desc: "社外秘・CONFIDENTIAL・DRAFTをPDFに追加。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFにウォーターマークを追加するには？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにPDFをアップロードし、透かしテキスト・配置・色・透明度を設定して「ダウンロード」ボタンを押すだけです。登録不要・無料でご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "「社外秘」「CONFIDENTIAL」などのテキストを使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "プリセットボタンで「CONFIDENTIAL」「社外秘」「DRAFT」「サンプル」「校正中」などをワンクリックで設定できます。独自テキストの入力も可能です。" },
    },
    {
      "@type": "Question",
      name: "透かしの透明度を調整できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。スライダーで5%〜80%の範囲で透明度を細かく設定できます。文書の可読性を維持しながら透かしを表示できます。" },
    },
    {
      "@type": "Question",
      name: "ファイルは安全ですか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。処理はすべてブラウザ内で完結します。アップロードしたPDFが外部サーバーに送信されることは一切ありません。機密文書も安心してご利用いただけます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-watermark" title="PDF透かし追加ツール" description="PDFにテキストウォーターマークを追加。色・透明度・フォントサイズを自由設定。登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfWatermark />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-watermark" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">ウォーターマークが必要な場面</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">社外秘・機密文書の取り扱いを明示</p>
              <p className="text-[13px]">「社外秘」「CONFIDENTIAL」の透かしを入れることで、文書を受け取った相手が取り扱い区分を一目で把握できます。印刷物にも透かしが残るため、物理的な流出時にも有効です。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">校正中・ドラフト版であることを示す</p>
              <p className="text-[13px]">「DRAFT」「校正中」の透かしを入れた版を関係者に配布することで、最終版と混同されることを防ぎます。最終確定後に透かしなしの版を再配布するフローでよく使われます。</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">サンプル・見本であることを明示</p>
              <p className="text-[13px]">有料コンテンツや納品前の成果物をプレビューとして見せる際に「サンプル」「見本」の透かしを入れて配布します。内容は確認できつつ、そのまま使用できない状態にできます。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">透明度・サイズ・角度の設定指針</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">設定</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨値</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">考え方</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["透明度", "20〜40%", "薄すぎると印刷時に消えやすい。40%以上だと本文テキストが読みにくくなる"],
                  ["フォントサイズ", "60〜100pt", "A4全体をカバーするなら大きめに。目立たせたくないなら小さめで繰り返し配置"],
                  ["角度", "−45°（斜め）", "水平より斜めの方が本文と重なりにくく、視認性を保ちやすい"],
                ] as string[][]).map(([setting, val, note], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">{setting}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px] text-blue-600 dark:text-blue-400 font-medium">{val}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400">
            印刷前にプレビューで確認することを推奨します。画面表示では薄く見えても印刷するとはっきり出る場合と、逆に薄くなる場合があります。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">透かしの限界について</h2>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[13px] space-y-2">
            <p className="font-semibold text-amber-800 dark:text-amber-300">追加した透かしは後から除去できます</p>
            <p className="text-amber-700 dark:text-amber-400">
              このツールで追加したウォーターマークはPDFの上位レイヤーとして描画されます。技術的な知識がある相手がPDF編集ソフトを使えば除去できる場合があります。本格的な著作権保護や流出防止が目的の場合は、この点を認識した上でご利用ください。
            </p>
          </div>
          <p>
            一般的な用途（社内文書の取り扱い区分表示、ドラフト版の識別、サンプル配布）では、透かしの抑止効果は十分機能します。意図的な不正使用を防ぐというよりも、「取り扱い注意」の意思表示として使うのが現実的な用途です。
          </p>
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
