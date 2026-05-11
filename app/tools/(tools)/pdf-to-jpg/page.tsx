import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToJpg } from "./PdfToJpg";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFをJPGに変換｜PDFページを画像保存【無料】",
  description: "PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。スマホ・PC両対応。",
  path: "/tools/pdf-to-jpg",
  keywords: ["PDF JPG 変換", "PDF 画像 変換 無料", "PDF to image", "PDF ページ 画像保存", "PDF JPEG 変換"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFからJPG変換は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "複数ページのPDFも変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。全ページをJPGに変換してZIPファイルでダウンロードできます。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-to-jpg" title="PDF→JPG変換ツール" description="PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。" />
      <JsonLd data={faqSchema} />
      <PdfToJpg />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-to-jpg" />
      </div>
    </>
  );
}
