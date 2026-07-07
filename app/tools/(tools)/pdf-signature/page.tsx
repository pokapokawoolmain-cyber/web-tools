import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfSignature } from "./PdfSignature";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "PDF電子署名ツール【無料】手書きサイン・印鑑をPDFに追加｜ブラウザ完結",
  description: "PDFに手書きサインや電子印鑑を追加できる無料ツール。マウスやスマホ指先でサインを書いて、契約書・申込書のPDFに配置するだけ。ファイルはサーバーに送信されず安全です。登録不要。",
  path: "/tools/pdf-signature",
  keywords: ["PDF 電子署名 無料","PDF サイン 追加","PDF 印鑑 押す","PDF 署名 手書き","電子サイン PDF"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF電子署名ツール", icon: "✍️", desc: "PDFに手書きサイン・印鑑を追加" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "この署名に法的効力はありますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "本ツールで追加するのは画像としての手書きサイン（電子サイン）です。当事者間の合意を示す証跡にはなりますが、電子署名法上の「電子署名」（認証局による本人証明）とは異なります。重要な契約では電子契約サービスの併用をご検討ください。"
    }
  },
  {
    "@type": "Question",
    "name": "スマホでもサインを書けますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。スマートフォンやタブレットなら指先で直接サインを書けるため、マウスよりも自然な筆跡になります。"
    }
  },
  {
    "@type": "Question",
    "name": "PDFはサーバーにアップロードされますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "いいえ。PDFの読み込みも署名の合成もすべてブラウザ内で完結します。契約書などの機密文書が外部に送信されることはありません。"
    }
  },
  {
    "@type": "Question",
    "name": "印鑑画像も押せますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。手書きサインのほか、画像として用意した印鑑（電子印鑑メーカーで作成可能）をPDFに配置することもできます。"
    }
  }
],
};


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
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="PDF電子署名・押印ツール"
      description="PDFに手書き署名・テキスト署名・電子印鑑を追加してPDF保存。PDF押印・PDF印鑑追加も無料。ブラウザ完結・登録不要。"
      icon="✍️"
      slug="pdf-signature"
      seoContent={seoContent}
    >
      <PdfSignature />
    </ToolLayout>
    </>
  );
}
