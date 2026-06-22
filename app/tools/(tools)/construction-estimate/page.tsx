import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ConstructionEstimate } from "./ConstructionEstimate";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "工事見積書作成ツール｜建設・リフォーム対応【無料】",
  description: "工事種別・材料費・労務費・諸経費を入力して工事見積書をPDF出力。施工会社情報は自動保存。建設業許可番号・インボイス番号対応。登録不要・ブラウザ完結。",
  path: "/tools/construction-estimate",
  keywords: ["工事見積書 作成 無料", "リフォーム 見積書 テンプレ", "建設 見積書 PDF", "工事 見積書 フォーマット", "外壁塗装 見積書 作成", "建設業 見積書 無料"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事見積書作成ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        施主情報・工事名・工事場所を入力し、工事明細に各工種の内容・数量・単価を入力してください。諸経費は工事費小計に対するパーセンテージで自動計算されます。PDFで保存・印刷は「PDFで保存・印刷」ボタンから行えます。施工会社情報は入力後に自動保存されるため、次回以降の入力が省略できます。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">工事見積書に含める主な項目</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-blue-700 dark:text-blue-400">
          {["仮設工事費", "土工事費・基礎工事費", "木工事費・大工工事費", "屋根工事費", "外壁工事費", "塗装工事費", "内装工事費", "設備工事費（電気・水道）", "外構工事費", "諸経費・現場管理費"].map((item) => (
            <span key={item}>・{item}</span>
          ))}
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース・注意点</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "諸経費は何パーセントが標準？", a: "現場管理費・一般管理費を合わせて10〜20%が一般的です。小規模工事では15%前後、大規模工事では10%前後が目安です。発注者から「内訳を明示してほしい」と言われることも多いため、諸経費の内容を説明できるようにしておきましょう。" },
          { q: "消費税はどう扱う？", a: "工事費は原則10%の消費税がかかります（食品等の軽減税率は適用されません）。インボイス制度対応のため、適格請求書発行事業者番号（T+13桁）の記載が推奨されます。" },
          { q: "見積書の有効期限はどのくらいにする？", a: "材料費の変動があるため、30日間が一般的です。資材価格が高騰している時期は14〜21日間に短縮することもあります。" },
          { q: "工事明細の数量単位が合わない", a: "塗装工事はm²、内装（クロス）はm²、木工事は式または㎡、設備は箇所または式が一般的です。発注者が理解しやすい単位を選んでください。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "建設業許可番号はどこに記載しますか？", a: "本ツールでは会社情報欄に入力すると自動的に見積書に反映されます。一般建設業・特定建設業の別と許可番号（「国土交通大臣許可（特-00）第○号」など）を正確に記載してください。" },
          { q: "入力した内容はどこかに保存されますか？", a: "施工会社情報のみブラウザのLocalStorageに自動保存されます。施主情報・明細はブラウザを閉じると消えます。重要な見積書はPDFで保存してください。" },
          { q: "見積書として法的に有効ですか？", a: "本ツールで作成した書類はひな形です。建設業法で定められた書面要件を満たすかどうかは工事内容・金額によって異なります。重要な工事では専門家にご確認ください。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ ご注意</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した見積書はひな形です。建設業法・下請法・インボイス制度等の法的要件については、必ず専門家にご確認ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="工事見積書作成ツール"
      description="工事明細・諸経費・消費税を入力して見積書をPDF出力。施工会社情報を自動保存。建設・リフォーム業向け。"
      icon="📋"
      slug="construction-estimate"
      seoContent={seoContent}
    >
      <ConstructionEstimate />
    </ToolLayout>
  );
}
