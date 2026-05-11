import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfWatermark } from "./PdfWatermark";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF透かし追加ツール｜ウォーターマークを無料で挿入【登録不要】",
  description: "PDFに文字の透かし（ウォーターマーク）を追加できます。「社外秘」「CONFIDENTIAL」「DRAFT」など全ページ一括対応。登録不要・無料・ブラウザ完結。",
  path: "/tools/pdf-watermark",
  keywords: ["PDF 透かし", "PDF ウォーターマーク", "PDF 文字 入れる", "PDF 透かし 追加", "PDF watermark 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFにウォーターマークを追加するには？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにPDFをアップロードし、透かしテキスト・配置・色・透明度を設定して「ダウンロード」ボタンを押すだけです。登録不要・無料でご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "「社外秘」「CONFIDENTIAL」などのテキストを使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "プリセットボタンで「CONFIDENTIAL」「社外秘」「DRAFT」「サンプル」「校正中」などをワンクリックで設定できます。独自テキストの入力も可能です。" },
    },
    {
      "@type": "Question",
      name: "透かしの透明度を調整できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。スライダーで5%〜80%の範囲で透明度を細かく設定できます。文書の可読性を維持しながら透かしを表示できます。" },
    },
    {
      "@type": "Question",
      name: "ファイルは安全ですか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。処理はすべてブラウザ内で完結します。アップロードしたPDFが外部サーバーに送信されることは一切ありません。機密文書も安心してご利用いただけます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-watermark" title="PDF透かし追加ツール" description="PDFにテキストウォーターマークを追加。色・透明度・フォントサイズを自由設定。登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfWatermark />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-watermark" />
      </div>
    </>
  );
}
