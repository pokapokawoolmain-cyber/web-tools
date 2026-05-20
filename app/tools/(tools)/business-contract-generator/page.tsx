import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { BusinessContractGenerator } from "./BusinessContractGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "業務委託契約書作成ツール",
  "業務委託契約書を無料で作成。テンプレート選択・PDF保存対応。Web制作・動画編集・システム開発など対応。登録不要。",
  "business-contract-generator",
  ["業務委託契約書 無料", "業務委託 テンプレ", "フリーランス 契約書", "業務委託 雛形", "契約書 作成 無料"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">業務委託契約書とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        業務委託契約書は、発注者（クライアント）と受注者（フリーランス・外注先）が業務内容・報酬・納期・権利関係などを明確にするための書類です。口頭契約のトラブルを防ぎ、双方の権利を守る重要な書類です。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 印紙税はかかりますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 業務委託契約書は原則として印紙税の対象外ですが、請負契約として認定される場合は必要になることがあります。税理士にご確認ください。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 電子契約でも有効ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 電子文書も法的に有効ですが、電子署名の方法によって効力が異なります。重要な契約は電子契約サービスの利用を検討してください。</p></div>
      </div>
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
      title="業務委託契約書作成ツール"
      description="テンプレートを選んで入力するだけで業務委託契約書を無料作成。PDF保存・印刷対応。登録不要・ブラウザ完結。"
      icon="📋"
      slug="business-contract-generator"
      seoContent={seoContent}
    >
      <BusinessContractGenerator />
    </ToolLayout>
  );
}
