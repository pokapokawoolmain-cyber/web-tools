import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfReorder } from "./PdfReorder";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF並び替えツール｜ページ順番を無料で変更【登録不要】",
  description: "PDFのページ順をドラッグ操作で並び替えできます。スマホは上下ボタンにも対応。サムネイルで確認しながら並び替え。登録不要・無料・ブラウザ完結。",
  path: "/tools/pdf-reorder",
  keywords: ["PDF 並び替え", "PDF ページ 順番 変更", "PDF 順番 入れ替え", "PDF ページ 入れ替え 無料", "PDF reorder"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF並び替え", icon: "↕️", desc: "ドラッグでページ順を自由に変更。スマホも対応。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページ順を無料で並び替えられますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、完全無料でご利用いただけます。登録・インストール不要でブラウザから即利用できます。" },
    },
    {
      "@type": "Question",
      name: "スマホでもページ順を変更できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。スマホでは各ページ右側の▲▼ボタンで順番を入れ替えられます。PCではドラッグ＆ドロップにも対応しています。" },
    },
    {
      "@type": "Question",
      name: "ページのサムネイルは表示されますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。PDFをアップロードするとページのプレビュー画像が順次表示されます。サムネイルを見ながら並び替えができるので、どのページか確認しやすいです。" },
    },
    {
      "@type": "Question",
      name: "PDF結合ツールとの違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDF並び替えは1つのPDF内のページ順を変更するツールです。PDF結合は複数のPDFファイルをまとめて1つにするツールです。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。サムネイル生成も含めてすべてローカルで処理されます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd
        slug="pdf-reorder"
        title="PDF並び替えツール"
        description="PDFのページ順をドラッグ操作で並び替え。スマホは上下ボタンにも対応。登録不要・無料・ブラウザ完結。"
      />
      <JsonLd data={faqSchema} />
      <PdfReorder />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-reorder" />
      </div>
    </>
  );
}
