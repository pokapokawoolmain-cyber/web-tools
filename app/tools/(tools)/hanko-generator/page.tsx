import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { HankoGenerator } from "./HankoGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "電子印鑑作成ツール",
  "電子印鑑（デジタルはんこ）を無料で作成。円形・角印・縦書き対応。透過PNG保存でPDF押印・書類にすぐ使える。PDF電子署名ツールと連携。登録不要。",
  "hanko-generator",
  ["電子印鑑 作成", "印鑑 PDF 押印", "PDF 印鑑 追加", "電子印鑑 PDF", "デジタル印鑑 無料", "印鑑 作成 無料", "電子はんこ 無料"]
);

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
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 作成した印鑑をPDFに押印するには？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 「PDFツールで使うために保存」ボタンで保存後、PDF電子署名ツールを開き「🔴 印鑑」モードを選択すると、保存した印鑑が表示されます。クリックでPDF上に配置でき、位置・サイズ・回転・透明度を調整して押印できます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 請求書・領収書に印鑑を使えますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. はい。請求書作成ツール・領収書作成ツールの印鑑セクションから保存済み印鑑を選択するだけで、プレビューと印刷に印鑑が表示されます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 印鑑データはサーバーに保存されますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 一切保存されません。すべての処理はブラウザ内で完結し、印鑑データはお使いのデバイスのLocalStorageにのみ保存されます。</p></div>
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="電子印鑑作成ツール"
      description="円形・角印・縦書き対応の電子印鑑を無料作成。透過PNG・SVG保存でPDFや書類にすぐ使える。"
      icon="🔴"
      slug="hanko-generator"
      seoContent={seoContent}
    >
      <HankoGenerator />
    </ToolLayout>
  );
}
