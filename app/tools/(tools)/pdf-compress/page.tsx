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
    </>
  );
}
