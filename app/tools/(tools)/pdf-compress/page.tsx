import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfCompress } from "./PdfCompress";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF圧縮ツール｜ファイルサイズを無料で軽量化",
  description: "PDFファイルをブラウザ上で圧縮。メール添付やアップロード向けに軽量化できます。登録不要・無料・スマホ対応。",
  path: "/tools/pdf-compress",
  keywords: ["PDF圧縮", "PDF 軽くする", "PDF サイズ 縮小", "PDF compressor 無料", "PDF 容量 減らす"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF圧縮ツール", icon: "🗜️", desc: "PDFを軽量化。メール添付・アップロードに最適。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF圧縮は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "どのくらい圧縮できますか？", acceptedAnswer: { "@type": "Answer", text: "画像が多いPDFでは50〜80%の削減が見込めます。テキスト主体のPDFは効果が限定的な場合があります。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。" } },
    { "@type": "Question", name: "圧縮するとPDFの画質は劣化しますか？", acceptedAnswer: { "@type": "Answer", text: "画像が含まれるPDFは圧縮率に応じて画質が下がる場合があります。テキストや図形は劣化しません。圧縮後のプレビューで品質を確認してからダウンロードすることをお勧めします。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-compress" title="PDF圧縮ツール" description="PDFファイルをブラウザ上で圧縮。メール添付やアップロード向けに軽量化できます。" />
      <JsonLd data={faqSchema} />
      <PdfCompress />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-compress" />
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF圧縮でできること</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            PDFファイルのサイズが大きすぎて困る場面は意外と多くあります。このツールを使えば、ブラウザ上で素早くPDFを軽量化できます。
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">メール添付の容量制限を回避：</strong>GmailやOutlookのメール添付上限（10〜25MB）を超えるPDFを圧縮して送れるサイズにできます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">採用・申請書類のアップロード：</strong>採用サイトや行政窓口のオンライン申請フォームには容量制限（2〜5MB）が設けられていることが多く、圧縮で対応できます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">クラウドストレージの節約：</strong>スキャン書類や写真入りのPDFを圧縮することでGoogleドライブやDropboxの容量を有効活用できます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ウェブサイトへの掲載：</strong>サイトに掲載するカタログ・パンフレットPDFを圧縮すると、閲覧者のダウンロード時間を短縮できます。</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">圧縮できる量の目安</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            圧縮効果はPDFの内容によって大きく変わります。
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">画像が多いPDF（写真集・カタログなど）：</strong>50〜80%の削減が見込めます。圧縮の恩恵が最も大きいカテゴリです。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">テキスト主体のPDF（契約書・報告書など）：</strong>効果は限定的で、10〜20%程度の削減にとどまることが多いです。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">スキャンしたPDF：</strong>画像として保存されているため、圧縮効果が大きくなりやすいです。</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">画質と容量のバランスについて</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            PDF圧縮は主に内部画像の品質を下げることでファイルサイズを削減します。テキストや図形（ベクターデータ）は圧縮しても劣化しませんが、写真・スキャン画像は圧縮率が高いほど画質が低下します。圧縮後はプレビューで文字が読めるか・画像が許容範囲かを確認してからダウンロードすることをおすすめします。印刷用途には高画質設定、メール添付には高圧縮設定というように用途に応じて使い分けるとよいでしょう。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: "どのくらい圧縮できますか？", a: "画像が多いPDFでは50〜80%の削減が見込めます。テキスト主体のPDFは効果が限定的な場合があります。" },
              { q: "圧縮すると画質は劣化しますか？", a: "画像が含まれるPDFは圧縮率に応じて画質が下がる場合があります。テキストや図形は劣化しません。圧縮後のプレビューで品質を確認してからダウンロードすることをお勧めします。" },
              { q: "パスワード付きPDFは圧縮できますか？", a: "パスワードで保護されたPDFは圧縮できない場合があります。先にパスワード保護を解除してからご利用ください。" },
              { q: "スマホでも使えますか？", a: "はい。iPhone・Androidのブラウザからご利用いただけます。アプリのインストールは不要です。" },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
                <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
