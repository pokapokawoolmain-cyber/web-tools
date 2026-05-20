import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { NdaGenerator } from "./NdaGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "NDA（秘密保持契約書）作成ツール",
  "NDA（秘密保持契約書）を無料で作成。正式な契約書フォーマットで自動生成。PDF保存・印刷対応。登録不要。",
  "nda-generator",
  ["NDA テンプレ 無料", "秘密保持契約書 無料", "NDA 雛形", "秘密保持 契約書 作成", "NDA 書式"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">NDA（秘密保持契約書）とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        NDA（Non-Disclosure Agreement・秘密保持契約書）は、業務上知り得た秘密情報を第三者に開示・漏洩しないことを約束する契約書です。新規取引・業務委託・M&A・採用面接などさまざまな場面で締結されます。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。実際の契約締結にあたっては弁護士等の専門家にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="NDA（秘密保持契約書）作成ツール"
      description="正式なNDAフォーマットで秘密保持契約書を無料作成。PDF保存・印刷対応。登録不要・ブラウザ完結。"
      icon="🤝"
      slug="nda-generator"
      seoContent={seoContent}
    >
      <NdaGenerator />
    </ToolLayout>
  );
}
