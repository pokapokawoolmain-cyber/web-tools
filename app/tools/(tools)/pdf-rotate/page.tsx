import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfRotate } from "./PdfRotate";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF回転ツール｜ページの向きを無料で変更【登録不要】",
  description: "PDFのページを90度・180度・270度に回転できます。全ページ一括・指定ページ個別対応。登録不要・無料・ブラウザ完結でスマホにも対応。",
  path: "/tools/pdf-rotate",
  keywords: ["PDF 回転", "PDF 向き 変更", "PDF 横向き 縦向き", "PDFページ 回転 無料", "PDF rotate 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのページを90度回転できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。90°・180°・270°の3段階から選べます。全ページ回転・指定ページのみ回転の両方に対応しています。" },
    },
    {
      "@type": "Question",
      name: "スキャンしたPDFが横向きになっています。縦に直せますか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールで90°または270°回転させることで縦向きに修正できます。処理後そのままダウンロードできます。" },
    },
    {
      "@type": "Question",
      name: "回転するとPDFの画質は劣化しますか？",
      acceptedAnswer: { "@type": "Answer", text: "劣化しません。ページの回転はメタデータの変更のみで行われるため、テキスト・画像の品質は元のまま維持されます。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-rotate" title="PDFページ回転ツール" description="PDFのページを90°・180°・270°回転。全ページ・指定ページに対応。登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfRotate />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-rotate" />
      </div>
    </>
  );
}
