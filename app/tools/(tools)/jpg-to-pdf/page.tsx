import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { JpgToPdf } from "./JpgToPdf";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "JPGをPDFに変換｜画像をまとめてPDF化【無料】",
  description: "JPGやPNG画像をまとめてPDFへ変換。ドラッグで順番変更・スマホ・PC両対応。登録不要・ブラウザ完結。",
  path: "/tools/jpg-to-pdf",
  keywords: ["JPG PDF 変換", "画像 PDF まとめる", "写真 PDF 変換 無料", "image to pdf", "JPG PDF 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "JPGからPDF変換は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "スマホの写真もPDFにできますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhoneのHEIC画像も含め、スマホで撮影した写真をそのままPDFに変換できます。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="jpg-to-pdf" title="JPG→PDF変換ツール" description="JPGやPNG画像をまとめてPDFへ変換。ドラッグで順番変更・スマホ・PC両対応。" />
      <JsonLd data={faqSchema} />
      <JpgToPdf />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/jpg-to-pdf" />
      </div>
    </>
  );
}
