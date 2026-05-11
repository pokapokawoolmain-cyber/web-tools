import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfPassword } from "./PdfPassword";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFパスワード設定ツール｜PDFに無料でロックを追加【登録不要】",
  description: "PDFにパスワードを設定して保護できます。AES-256暗号化でブラウザ完結。登録不要・無料・サーバー保存なし。設定したパスワードで解除も可能。",
  path: "/tools/pdf-password",
  keywords: ["PDF パスワード", "PDF 暗号化", "PDF ロック", "PDF 保護", "PDF password 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "このツールで設定したパスワードはAcrobatやプレビューで使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。このツールはAdobeのPDF暗号化規格ではなく、独自のAES-256暗号化を使用しています。設定したパスワードの解除には、このツール（ToolBox）の「解除する」タブのみを使用してください。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。PDFファイルや設定したパスワードが外部サーバーに送信されることは一切ありません。" },
    },
    {
      "@type": "Question",
      name: "パスワードを忘れた場合はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "パスワードを紛失した場合、ファイルを復元する手段はありません。AES-256暗号化は非常に強力であり、総当たり攻撃での解読は現実的ではありません。パスワードは必ず安全な場所に保管してください。" },
    },
    {
      "@type": "Question",
      name: "保護を解除するにはどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "「解除する」タブに切り替え、このツールで保護したファイル（.pdfまたは.encrypted）をアップロードし、設定時と同じパスワードを入力してください。元のPDFを復元できます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-password" title="PDFパスワード設定ツール" description="PDFにAES-256パスワード保護を追加。ブラウザ完結・登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfPassword />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-password" />
      </div>
    </>
  );
}
