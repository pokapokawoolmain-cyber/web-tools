import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfMetadataRemover } from "./PdfMetadataRemover";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFメタデータ削除ツール｜作成者・日付を無料で消去【登録不要】",
  description: "PDFに埋め込まれた作成者・作成日・使用ソフト名などのメタデータを削除。共有前のプライバシー保護に。ブラウザ完結・登録不要・無料。",
  path: "/tools/pdf-metadata-remover",
  keywords: ["PDF メタデータ 削除", "PDF 作成者 削除", "PDF 個人情報 削除", "PDF プロパティ 削除", "PDF metadata remover"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのメタデータとは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDFには文書の内容以外に、タイトル・作成者名・作成日時・使用したソフトウェア名・キーワードなどの「メタデータ」が自動的に記録されます。これらはファイルプロパティから確認できます。" },
    },
    {
      "@type": "Question",
      name: "本文テキストや画像は削除されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。このツールは文書プロパティ（メタデータ）のみを削除します。本文テキスト・画像・レイアウト・注釈などの内容は一切変更されません。" },
    },
    {
      "@type": "Question",
      name: "ファイルは安全ですか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。すべての処理はブラウザ内で完結します。アップロードしたPDFが外部サーバーに送信されることは一切ありません。" },
    },
    {
      "@type": "Question",
      name: "デジタル署名や暗号化は影響を受けますか？",
      acceptedAnswer: { "@type": "Answer", text: "デジタル署名が付いたPDFは、メタデータ削除後に署名が無効になる場合があります。暗号化されたPDFはそのままでは処理できません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-metadata-remover" title="PDFメタデータ削除ツール" description="PDFの作成者・日付・使用ソフト名などのメタデータを削除。ブラウザ完結・登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfMetadataRemover />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-metadata-remover" />
      </div>
    </>
  );
}
