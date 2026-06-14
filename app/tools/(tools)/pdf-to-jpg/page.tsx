import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToJpg } from "./PdfToJpg";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "PDFをJPGに変換｜PDFページを画像保存【無料】",
  description: "PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。スマホ・PC両対応。",
  path: "/tools/pdf-to-jpg",
  keywords: ["PDF JPG 変換", "PDF 画像 変換 無料", "PDF to image", "PDF ページ 画像保存", "PDF JPEG 変換"],
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
        <RelatedArticles
          toolId="pdf-to-jpg"
          className="pt-10 mb-10 border-t border-slate-200 dark:border-zinc-800"
        />
        <RelatedPdfTools currentHref="/tools/pdf-to-jpg" />
      </div>
    </>
  );
}
