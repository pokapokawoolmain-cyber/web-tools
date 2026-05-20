import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { PdfSignature } from "./PdfSignature";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "PDF電子署名・押印ツール",
  "PDFに手書き署名・テキスト署名・電子印鑑を追加してPDF保存。PDF印鑑押印・PDF署名・PDF押印を無料でブラウザ完結。契約書・NDA・請求書への押印に。登録不要。",
  "pdf-signature",
  ["PDF 電子署名", "PDF 押印", "PDF 印鑑 押印", "PDF 署名 無料", "電子印鑑 PDF 追加", "PDF 印鑑 追加 無料", "契約書 押印 オンライン"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF電子署名・押印ツールとは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        PDFファイルに手書き署名・テキスト署名・電子印鑑を直接追加できる無料ツールです。契約書・NDA・業務委託契約書・見積書・請求書などへの署名・押印をブラウザ上で完結できます。<a href="/tools/hanko-generator" className="text-blue-600 hover:underline">電子印鑑メーカー</a>で作成・保存した印鑑をPDFに押印でき、位置・サイズ・回転・透明度を自由に調整できます。アップロードしたPDFはサーバーに送信されません。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 署名したPDFは法的効力がありますか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 本ツールはPDFへの画像・テキスト追記ツールです。法的な電子署名（認定電子署名）とは異なります。重要な契約には電子契約サービスのご利用をご検討ください。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. PDFデータはサーバーに保存されますか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 一切保存されません。すべての処理はお使いのブラウザ（デバイス）内で完結します。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. スマホからも使えますか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 利用できますが、手書き署名の操作はPCでの利用が推奨です。スマートフォンではテキスト署名モードをお使いください。</p>
        </div>
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="PDF電子署名・押印ツール"
      description="PDFに手書き署名・テキスト署名・電子印鑑を追加してPDF保存。PDF押印・PDF印鑑追加も無料。ブラウザ完結・登録不要。"
      icon="✍️"
      slug="pdf-signature"
      seoContent={seoContent}
    >
      <PdfSignature />
    </ToolLayout>
  );
}
