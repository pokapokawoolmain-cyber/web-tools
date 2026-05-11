import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfDeletePages } from "./PdfDeletePages";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFページ削除ツール｜不要なページを無料で削除【登録不要】",
  description: "PDFから不要なページを選んで削除できます。複数ページ一括削除・反転選択に対応。登録不要・無料・ブラウザ完結で安全にPDFを編集できます。",
  path: "/tools/pdf-delete-pages",
  keywords: ["PDF ページ 削除", "PDF いらないページ 消す", "PDF 不要ページ 削除", "PDF 編集 ページ削除", "PDF ページ 消去 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページを無料で削除できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、完全無料でご利用いただけます。登録・インストール不要でブラウザから即利用できます。" },
    },
    {
      "@type": "Question",
      name: "1ページだけ削除できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、1ページだけでも複数ページでも削除できます。ページ一覧から削除したいページを選択し、ダウンロードしてください。" },
    },
    {
      "@type": "Question",
      name: "PDF分割ツールとの違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDF分割は「必要なページだけを取り出す」機能です。PDFページ削除は「不要なページだけを消して、残りをそのまま保存する」機能です。大半のページを残したい場合はこちらのほうが直感的に操作できます。" },
    },
    {
      "@type": "Question",
      name: "スマホでも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidともに対応しています。ページをタップして選択し、削除することができます。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。機密性の高い文書も安心してご利用いただけます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd
        slug="pdf-delete-pages"
        title="PDFページ削除ツール"
        description="PDFから不要なページを選んで削除。複数ページ一括削除・反転選択対応。登録不要・無料・ブラウザ完結。"
      />
      <JsonLd data={faqSchema} />
      <PdfDeletePages />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-delete-pages" />
      </div>
    </>
  );
}
