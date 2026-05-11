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
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF分割ツール", icon: "✂️", desc: "必要なページだけ抽出・保存。登録不要・無料。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF分割は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "特定のページだけ取り出せますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「1, 3, 5-8」のようにページ番号を指定して抽出できます。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。" } },
    { "@type": "Question", name: "PDFページ削除ツールとの違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "PDF分割は「必要なページを取り出して別ファイルにする」ツールです。PDFページ削除は「不要なページだけ消して残りを保存する」ツールです。目的に応じて使い分けてください。" } },
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
