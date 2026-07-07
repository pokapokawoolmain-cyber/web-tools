import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { HankoGenerator } from "./HankoGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "電子印鑑作成ツール【無料】透過PNGのデジタル印鑑を即作成・PDFにそのまま押印",
  description:
    "電子印鑑（デジタルはんこ）を無料で作成。丸印・角印・縦書きに対応し、透過PNG保存でPDFや請求書・領収書にすぐ押印できます。PDF電子署名ツールと連携。登録不要・ブラウザ完結。",
  path: "/tools/hanko-generator",
  keywords: [
    "電子印鑑 作成 無料",
    "電子印鑑 透過PNG",
    "デジタル印鑑 作り方",
    "印鑑 PDF 押印",
    "電子はんこ 無料",
    "角印 作成 無料",
    "電子印鑑 フリー",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "電子印鑑作成ツール", icon: "🔴", desc: "丸印・角印・縦書き対応の電子印鑑を透過PNGで無料作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "電子印鑑は法的に有効ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本では多くの契約は押印がなくても成立し、印影画像としての電子印鑑も社内文書・請求書・見積書などでは広く使われています。ただし、電子印鑑（画像）は本人性・非改ざん性を証明する電子署名とは異なるため、重要な契約では電子署名法に対応した電子契約サービスの利用を検討してください。",
      },
    },
    {
      "@type": "Question",
      name: "電子印鑑とシャチハタの違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "シャチハタ（浸透印）はインク内蔵のゴム印で、印影が均一のため銀行印・実印としては使えず、書類でも「シャチハタ不可」とされることがあります。電子印鑑はデジタル画像としての印影で、紙のシャチハタとは別物です。請求書・社内承認などシャチハタで済む場面であれば、電子印鑑でも同様に受け入れられるのが一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "作成した印鑑をPDFに押印するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「PDFツールで使うために保存」ボタンで保存後、PDF電子署名ツールを開き「印鑑」モードを選択すると、保存した印鑑が表示されます。クリックでPDF上に配置でき、位置・サイズ・回転・透明度を調整して押印できます。",
      },
    },
    {
      "@type": "Question",
      name: "請求書・領収書に印鑑を使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。請求書作成ツール・領収書作成ツールの印鑑セクションから保存済み印鑑を選択するだけで、プレビューと印刷に印鑑が表示されます。",
      },
    },
    {
      "@type": "Question",
      name: "印鑑データはサーバーに保存されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一切保存されません。すべての処理はブラウザ内で完結し、印鑑データはお使いのデバイスのLocalStorageにのみ保存されます。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">電子印鑑とは・PDFへの押印方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        電子印鑑（デジタル印鑑）とは、デジタル文書や画像として作成した印鑑データです。本ツールで作成した印鑑は「PDFツールで使うために保存」ボタンで保存し、<a href="/tools/pdf-signature" className="text-blue-600 hover:underline">PDF電子署名ツール</a>の「印鑑」モードからPDFに直接押印できます。請求書・領収書・契約書への印鑑押印に便利です。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 電子印鑑は法的に有効ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 日本では多くの契約は押印がなくても成立し、印影画像としての電子印鑑も社内文書・請求書・見積書などでは広く使われています。ただし、電子印鑑（画像）は本人性・非改ざん性を証明する電子署名とは異なるため、重要な契約では電子署名法に対応した電子契約サービスの利用を検討してください。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 電子印鑑とシャチハタの違いは何ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. シャチハタ（浸透印）はインク内蔵のゴム印で、印影が均一のため銀行印・実印としては使えず、書類でも「シャチハタ不可」とされることがあります。電子印鑑はデジタル画像としての印影で、紙のシャチハタとは別物です。請求書・社内承認などシャチハタで済む場面であれば、電子印鑑でも同様に受け入れられるのが一般的です。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 作成した印鑑をPDFに押印するには？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 「PDFツールで使うために保存」ボタンで保存後、PDF電子署名ツールを開き「🔴 印鑑」モードを選択すると、保存した印鑑が表示されます。クリックでPDF上に配置でき、位置・サイズ・回転・透明度を調整して押印できます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 請求書・領収書に印鑑を使えますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. はい。請求書作成ツール・領収書作成ツールの印鑑セクションから保存済み印鑑を選択するだけで、プレビューと印刷に印鑑が表示されます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 印鑑データはサーバーに保存されますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 一切保存されません。すべての処理はブラウザ内で完結し、印鑑データはお使いのデバイスのLocalStorageにのみ保存されます。</p></div>
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="電子印鑑作成ツール"
        description="円形・角印・縦書き対応の電子印鑑を無料作成。透過PNG・SVG保存でPDFや書類にすぐ使える。"
        icon="🔴"
        slug="hanko-generator"
        seoContent={seoContent}
      >
        <HankoGenerator />
      </ToolLayout>
    </>
  );
}
