import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { GrossProfitCalculator } from "./GrossProfitCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "原価率・粗利率計算ツール｜建設業・リフォーム業向け【無料】",
  description: "売上・原価を入力するだけで原価率・粗利率・粗利額を即計算。目標粗利率から逆算した必要見積金額も算出。建設業・リフォーム業の受注判断に。登録不要・ブラウザ完結。",
  path: "/tools/gross-profit-calculator",
  keywords: ["原価率 計算", "粗利率 計算", "粗利 計算 建設", "リフォーム 粗利率", "工事 原価計算 無料", "建設業 粗利 目安"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">原価率・粗利率計算ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        「売上・原価から計算」モードでは、売上金額と原価合計を入力するだけで粗利率・原価率・粗利額を瞬時に計算します。「目標粗利率から逆算」モードでは、原価がわかっていて目標粗利率を設定すると、必要な見積金額（売上目標）を算出します。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">入力例</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>・売上：1,500,000円 / 原価（材料費+労務費+外注費）：900,000円 → 粗利率40%</li>
          <li>・原価：700,000円 / 目標粗利率：35% → 必要見積金額：1,076,923円</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "外注に出したら思ったより利益が出なかった", a: "外注費は原価に含めて計算してください。材料費＋自社労務費＋外注費の合計が原価です。" },
          { q: "粗利率30%ではダメなのか？", a: "粗利率から諸経費・間接費（一般管理費）を差し引いた「営業利益率」が重要です。諸経費が15%かかるとすると、粗利率30%では実質15%の営業利益率になります。" },
          { q: "税込・税抜のどちらで入力すればいい？", a: "売上・原価ともに税抜（本体価格）で統一してください。税込で入力すると正しい粗利率が計算できません。" },
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
          { q: "原価には何を含めますか？", a: "直接工事費（材料費・労務費・外注費・直接経費）を含めてください。現場管理費・一般管理費は含めないのが一般的です。" },
          { q: "建設業で一般的な粗利率は？", a: "工種により異なりますが、リフォーム工事30〜45%、外壁塗装35〜50%、新築工事25〜35%が目安です。諸経費・間接費を差し引いた営業利益は10〜20%程度が多いです。" },
          { q: "入力データはどこかに保存されますか？", a: "保存されません。すべての計算はブラウザ内で行われます。" },
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
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールの計算結果はあくまで参考値です。実際の受注判断・経営判断には、自社の固定費・間接費・資金繰りを含めた総合的な検討をしてください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="原価率・粗利率計算ツール"
      description="売上・原価を入力して粗利率を計算。目標粗利率から必要見積金額も逆算。建設業・リフォーム業向け。"
      icon="📊"
      slug="gross-profit-calculator"
      seoContent={seoContent}
    >
      <GrossProfitCalculator />
    </ToolLayout>
  );
}
