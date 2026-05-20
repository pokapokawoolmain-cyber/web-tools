import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { HankoGenerator } from "./HankoGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "電子印鑑作成ツール",
  "電子印鑑（デジタルはんこ）を無料で作成。円形・角印・縦書き対応。透過PNG保存でPDF・書類にすぐ使える。登録不要。",
  "hanko-generator",
  ["電子印鑑 作成", "印鑑 作成 無料", "ハンコ PNG", "透過印鑑", "デジタル印鑑", "電子はんこ 無料"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">電子印鑑とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        電子印鑑（デジタル印鑑）とは、デジタル文書や画像として作成した印鑑データです。PDFファイルや書類に貼り付けて使用できます。本ツールでは透過PNG形式で保存できるため、どんな書類の背景色にも馴染みます。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 作成した印鑑はPDFに使えますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. はい。透過PNG形式で保存し、当サイトのPDF電子署名ツールでPDFに貼り付けることができます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 印鑑データはサーバーに保存されますか？</p><p className="text-sm text-slate-600 dark:text-slate-400">A. 一切保存されません。すべての処理はブラウザ内で完結します。</p></div>
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
