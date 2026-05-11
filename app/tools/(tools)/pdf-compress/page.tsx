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
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF圧縮は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "どのくらい圧縮できますか？", acceptedAnswer: { "@type": "Answer", text: "画像が多いPDFでは50〜80%の削減が見込めます。テキスト主体のPDFは効果が限定的な場合があります。" } },
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
