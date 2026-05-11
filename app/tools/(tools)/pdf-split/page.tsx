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
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF分割は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "特定のページだけ取り出せますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「1, 3, 5-8」のようにページ番号を指定して抽出できます。" } },
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
    </>
  );
}
