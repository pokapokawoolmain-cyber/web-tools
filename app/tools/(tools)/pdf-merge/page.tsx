import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfMerge } from "./PdfMerge";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF結合ツール｜複数PDFを無料でまとめる【登録不要】",
  description: "複数のPDFファイルをブラウザ上で簡単に結合。ドラッグで順番変更・登録不要・無料・スマホ対応。ファイルはサーバーに送信されません。",
  path: "/tools/pdf-merge",
  keywords: ["PDF結合", "PDF まとめる", "PDF 複数 合体", "PDF結合 無料", "PDF merger"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF結合は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。" } },
    { "@type": "Question", name: "スマホでも使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidともに対応しています。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-merge" title="PDF結合ツール" description="複数のPDFファイルをブラウザ上で簡単に結合。登録不要・無料・スマホ対応。" />
      <JsonLd data={faqSchema} />
      <PdfMerge />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-merge" />
      </div>
    </>
  );
}
