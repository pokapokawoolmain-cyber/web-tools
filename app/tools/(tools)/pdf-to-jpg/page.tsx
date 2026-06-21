import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToJpg } from "./PdfToJpg";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "PDFをJPGに変換｜PDFページを高画質で画像保存【無料・登録不要】",
  description: "PDFページをJPG・PNG画像に変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。全ページ一括変換・高解像度出力。スマホ・PC両対応。ファイルはサーバーに送信されません。",
  path: "/tools/pdf-to-jpg",
  keywords: ["PDF JPG 変換", "PDF 画像 変換 無料", "pdf jpg 変換 ツール", "PDF to image", "PDF ページ 画像保存", "PDF JPEG 変換", "pdf 画像変換 無料", "pdf 画像 変換"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF→JPG変換", icon: "📄", desc: "PDFページを高画質JPGへ変換。ZIP一括DL対応。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFからJPG変換は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "複数ページのPDFも変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。全ページをJPGに変換してZIPファイルでダウンロードできます。" } },
    { "@type": "Question", name: "変換した画像の画質はどのくらいですか？", acceptedAnswer: { "@type": "Answer", text: "高解像度（2倍スケール）でJPGを生成します。テキストや図表がはっきり読み取れる品質です。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-to-jpg" title="PDF→JPG変換ツール" description="PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。" />
      <JsonLd data={faqSchema} />
      <PdfToJpg />
      <div className="max-w-2xl mx-auto px-4 pb-16">

        {/* SEOガイドセクション */}
        <div className="mt-14 space-y-10 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800 pt-10">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PDFをJPGに変換する方法</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>PDFファイルをアップロードエリアにドラッグ＆ドロップ（またはクリックして選択）</li>
              <li>PDFが読み込まれ、全ページのプレビューが表示されます</li>
              <li>変換したいページを選択（全ページ or 個別ページ）</li>
              <li>「JPGに変換」ボタンを押す</li>
              <li>1ページの場合はJPGファイルを直接ダウンロード、複数ページはZIPでまとめてダウンロード</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PDFを画像に変換する用途・よくある使い方</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">具体的なシーン</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["SNS・ブログへの掲載", "PDFの資料や書類を画像に変換してTwitter・InstagramやブログにそのままアップロードしたいときはJPG変換が必要"],
                    ["WordやPowerPointへの挿入", "PDFをJPG化してOffice製品に画像として貼り付けると、レイアウトを崩さずに文書内に組み込める"],
                    ["特定ページだけ保存したい", "複数ページのPDFから必要なページだけを取り出してJPG保存。契約書・カタログの一部を切り取るときに便利"],
                    ["PDFを開けない環境での共有", "PDFビューアがない環境の相手に資料を共有するとき、JPGに変換すれば誰でも表示できる"],
                    ["OCR・AI読み取りの前処理", "スキャンPDFをJPGに変換してからAIやOCRサービスに読ませる場合に使用"],
                    ["メールの添付サイズを小さくしたい", "PDFより圧縮率の高いJPGに変換することでファイルサイズを削減できる場合がある"],
                  ].map(([use, scene], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200">{use}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{scene}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">JPG変換の画質・解像度について</h2>
            <p>
              このツールはPDFページを<strong>2倍スケール（高解像度）</strong>でJPGに変換します。スクリーン表示用（72dpi）よりも高品質な画像が生成されるため、テキストや表の細部もはっきり読み取れる仕上がりになります。
            </p>
            <p className="mt-3">
              一般的なウェブ表示では72〜96dpiで十分ですが、印刷用途には150〜300dpiが推奨されます。本ツールの2倍スケール出力は画面表示の2倍にあたるため、ウェブ掲載・Office貼り付け・SNS投稿などの用途には十分な品質です。
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px]">
              <p className="font-semibold text-slate-700 dark:text-zinc-200 mb-2">ファイルサイズの目安</p>
              <ul className="space-y-1 text-slate-500 dark:text-zinc-400">
                <li>・A4サイズ（テキスト中心のPDF）→ JPG変換後 約300KB〜1MB/ページ</li>
                <li>・写真・図表が多いPDF → 1〜3MB/ページ程度</li>
                <li>・複数ページはZIPにまとめてダウンロードされます</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">プライバシーについて</h2>
            <p>
              アップロードしたPDFファイルはサーバーに一切送信されません。すべての処理はブラウザ内のJavaScript（PDF.js）で完結しています。契約書・個人情報が含まれるPDF・機密書類も安心してご利用いただけます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
            <div className="space-y-3">
              {[
                {
                  q: "PDFから変換したJPGを再度PDFに戻せますか？",
                  a: "はい。JPGをPDFに戻すには「JPG→PDF変換ツール」をご利用ください。複数のJPGをまとめてPDFに変換できます。",
                },
                {
                  q: "スキャンしたPDFもJPGに変換できますか？",
                  a: "はい。スキャンPDF（画像埋め込み型）もJPGに変換できます。ただしスキャン品質が低い場合は変換後の画像もぼやける場合があります。",
                },
                {
                  q: "パスワード保護されたPDFは変換できますか？",
                  a: "パスワード付きPDFは変換できません。先にPDFのパスワードを解除してから変換してください。",
                },
                {
                  q: "何ページまで変換できますか？",
                  a: "ページ数の上限は設けていませんが、大きなPDF（100ページ以上）はブラウザのメモリ使用量が増えるため、動作が重くなる場合があります。",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{q}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">関連ツール・記事</h2>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline">
                  JPG→PDF変換ツール｜画像をまとめてPDFに変換
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-merge" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDF結合ツール｜複数PDFを1つにまとめる
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-compress" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDF圧縮ツール｜ファイルサイズを軽量化
                </Link>
              </li>
              <li>
                <Link href="/blog/pdf-to-jpg-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDFを画像に変換する方法｜スマホ・PC・無料ツール別ガイド
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <RelatedArticles
          toolId="pdf-to-jpg"
          className="pt-10 mb-10 border-t border-slate-200 dark:border-zinc-800"
        />
        <RelatedPdfTools currentHref="/tools/pdf-to-jpg" />
      </div>
    </>
  );
}
