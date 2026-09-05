import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { GrossProfitCalculator } from "./GrossProfitCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "粗利計算・粗利率計算ツール｜計算式・業種別目安・逆算に対応【無料】",
  description: "売上・原価を入力して粗利率・原価率・粗利額を即計算。粗利率の計算式や、目標粗利率から必要見積金額を逆算する機能も。建設業・飲食業・小売業など業種別の目安も掲載。登録不要・ブラウザ完結。",
  path: "/tools/gross-profit-calculator",
  ogImage: `/api/og?${new URLSearchParams({ title: "粗利計算・粗利率計算", icon: "📊", desc: "売上・原価を入力するだけで粗利率・原価率・粗利額を即計算" }).toString()}`,
  keywords: ["粗利率 計算", "粗利計算", "原価率 計算", "粗利 計算 無料", "粗利率 計算式", "業種別 粗利率 目安", "粗利 逆算", "建設 粗利率", "飲食店 原価率"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "粗利率と原価率の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "粗利率は「売上に対して粗利（利益）が占める割合」で、原価率は「売上に対して原価が占める割合」です。粗利率＋原価率＝100%になります。例えば売上100万円・原価60万円の場合、粗利率40%・原価率60%となります。",
      },
    },
    {
      "@type": "Question",
      name: "業種によって粗利率の目安はどのくらい違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "業種によって大きく異なります。飲食業は60〜70%、小売業は20〜40%、建設・リフォーム業は25〜50%、製造業は20〜35%、IT・ソフトウェア業は60〜80%が一般的な目安です。同業他社と比較する際はこの目安を参考にしてください。",
      },
    },
    {
      "@type": "Question",
      name: "粗利率と営業利益率はどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "粗利率は売上から直接原価（材料費・労務費など）を引いた粗利の割合です。営業利益率はそこからさらに販管費（人件費・家賃・広告費など）を引いた後の割合です。粗利率が高くても、固定費が多ければ営業利益は出ません。",
      },
    },
    {
      "@type": "Question",
      name: "原価には何を含めればよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に原価（売上原価）には、材料費・労務費（直接人件費）・外注費・直接経費を含めます。本社の家賃・管理部門の人件費・広告費などの販管費は含めないのが基本です。業種によって区分が異なることもあるため、自社の会計方針に合わせてください。",
      },
    },
    {
      "@type": "Question",
      name: "目標粗利率から逆算する機能はどう使いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「目標粗利率から逆算」モードでは、原価が確定していて目標粗利率を決めたときに必要な売上（見積金額）を計算できます。計算式は「必要売上 = 原価 ÷ (1 - 目標粗利率)」です。例えば原価70万円で粗利率35%を目指すなら、70万 ÷ 0.65 ≒ 107.7万円が必要見積金額です。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-10">

    {/* 計算式に即答（「粗利率 計算式」クエリ対応） */}
    <section className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">粗利計算の計算式（結論）</p>
      <p className="text-sm font-mono text-blue-700 dark:text-blue-400">粗利率（％）＝（売上 − 原価）÷ 売上 × 100</p>
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">例：売上100万円・原価60万円 →（100−60）÷100×100＝<strong>粗利率40%</strong>（粗利額40万円）。下のツールに数字を入れるだけで自動計算できます。</p>
    </section>

    {/* 使い方 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">粗利率・原価率計算ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        2つのモードを切り替えて使えます。売上と原価が分かっている場合は「売上・原価から計算」、原価から適正な見積金額を知りたい場合は「目標粗利率から逆算」を使ってください。
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            mode: "モード①：売上・原価から計算",
            desc: "売上金額と原価合計を入力 → 粗利率・原価率・粗利額を即計算。現在の案件や月次の利益率チェックに。",
            example: "売上150万・原価90万 → 粗利率40%・粗利60万",
          },
          {
            mode: "モード②：目標粗利率から逆算",
            desc: "原価と目標粗利率を入力 → 必要な見積金額（売上目標）を算出。見積作成・価格交渉の根拠づくりに。",
            example: "原価70万・目標粗利率35% → 必要見積額 約107.7万",
          },
        ].map(({ mode, desc, example }) => (
          <div key={mode} className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">{mode}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">{desc}</p>
            <p className="text-xs font-mono bg-white/60 dark:bg-zinc-900/60 rounded-lg px-3 py-1.5 text-blue-600 dark:text-blue-400">{example}</p>
          </div>
        ))}
      </div>
    </section>

    {/* 計算式 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">粗利率・原価率の計算式</h2>
      <div className="space-y-3">
        {[
          { label: "粗利額", formula: "売上金額 − 原価合計" },
          { label: "粗利率", formula: "粗利額 ÷ 売上金額 × 100（%）" },
          { label: "原価率", formula: "原価合計 ÷ 売上金額 × 100（%）　※粗利率＋原価率＝100%" },
          { label: "必要売上（逆算）", formula: "原価合計 ÷ ( 1 − 目標粗利率 )" },
        ].map(({ label, formula }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 px-4 py-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 w-32 flex-shrink-0 mt-0.5">{label}</span>
            <span className="text-sm font-mono text-slate-800 dark:text-zinc-200">{formula}</span>
          </div>
        ))}
      </div>
    </section>

    {/* 業種別テーブル */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">業種別｜粗利率の目安一覧</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">同業他社の水準と比較する際の参考にしてください。業態・規模・地域により大きく異なります。</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 text-xs">
              <th className="text-left px-4 py-2.5 font-medium">業種</th>
              <th className="text-left px-4 py-2.5 font-medium">粗利率の目安</th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">主な原価の内訳</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {[
              { industry: "IT・ソフトウェア開発", range: "60〜80%", cost: "人件費（エンジニア）", highlight: true },
              { industry: "飲食業（カフェ・レストラン）", range: "60〜70%", cost: "食材費・消耗品費", highlight: true },
              { industry: "美容・エステ・サロン", range: "50〜70%", cost: "材料費・技術者人件費", highlight: false },
              { industry: "リフォーム・外壁塗装", range: "30〜50%", cost: "材料費・職人労務費・外注費", highlight: false },
              { industry: "建設業（新築工事）", range: "25〜35%", cost: "材料費・労務費・外注費", highlight: false },
              { industry: "設備工事（電気・水道）", range: "25〜40%", cost: "部材費・技術者人件費", highlight: false },
              { industry: "小売業（アパレル）", range: "30〜50%", cost: "仕入原価", highlight: false },
              { industry: "小売業（食品スーパー）", range: "20〜30%", cost: "食品仕入原価", highlight: false },
              { industry: "製造業（機械・金属）", range: "20〜35%", cost: "原材料費・製造労務費", highlight: false },
              { industry: "卸売業", range: "10〜25%", cost: "仕入原価・物流費", highlight: false },
              { industry: "運送・物流業", range: "15〜30%", cost: "燃料費・ドライバー人件費", highlight: false },
            ].map(({ industry, range, cost, highlight }) => (
              <tr key={industry} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 text-slate-800 dark:text-zinc-200 font-medium">{industry}</td>
                <td className={`px-4 py-3 font-mono font-semibold ${highlight ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>{range}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 hidden sm:table-cell text-xs">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">※粗利率は業態・受注規模・地域・経営効率により大きく異なります。上記はあくまで一般的な参考値です。</p>
    </section>

    {/* 粗利率 vs 営業利益率 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">粗利率・原価率・営業利益率の違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        「粗利率が高いのに利益が出ない」という場合、固定費（販管費）が多すぎることが原因です。3つの指標の違いを理解しておきましょう。
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 bg-white dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">例：売上1,000万円の場合</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {[
            { label: "売上高", value: "1,000万円", note: "" },
            { label: "　− 原価（材料費・労務費・外注費）", value: "600万円", note: "" },
            { label: "＝ 粗利　→　粗利率", value: "400万円 → 40%", note: "直接原価だけを引いた利益", highlight: true },
            { label: "　− 販管費（家賃・間接人件費・広告費など）", value: "200万円", note: "" },
            { label: "＝ 営業利益　→　営業利益率", value: "200万円 → 20%", note: "固定費も含めた実質的な利益", highlight: true },
          ].map(({ label, value, note, highlight }) => (
            <div key={label} className={`flex items-center justify-between px-4 py-2.5 text-sm ${highlight ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
              <span className="text-slate-600 dark:text-zinc-400">{label}</span>
              <div className="text-right">
                <span className={`font-mono font-semibold ${highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-zinc-300"}`}>{value}</span>
                {note && <p className="text-xs text-slate-400 dark:text-zinc-500">{note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 粗利率改善のポイント */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">粗利率を改善するための5つのポイント</h2>
      <div className="space-y-3 text-sm">
        {[
          { no: "1", title: "単価を上げる（値上げ・付加価値追加）", body: "最も直接的な方法。競合より優れたポイントを明確にして価格転嫁を行う。材料費高騰を理由にした値上げ交渉も有効。" },
          { no: "2", title: "材料費・仕入れコストを下げる", body: "まとめ買いによる値引き交渉、複数業者の相見積もり、在庫ロスの削減。飲食業であればフードロスの最小化も効果的。" },
          { no: "3", title: "外注・下請けコストを見直す", body: "建設業・製造業では外注費が原価の大きな割合を占める。内製化できる工程の検討、外注先の複数化で競争原理を働かせる。" },
          { no: "4", title: "高粗利商品・サービスの比率を増やす", body: "全商品・サービスの粗利率を計算し、高粗利なものへ注力する「商品ミックス」の改善。IT業・美容業はこの観点が特に重要。" },
          { no: "5", title: "ロス・廃棄・手戻りを減らす", body: "製造・建設業での材料ロスや作業の手戻りは原価を直接押し上げる。工程管理・品質管理の改善が粗利率向上につながる。" },
        ].map(({ no, title, body }) => (
          <div key={no} className="flex gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">{no}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">{title}</p>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "税込・税抜のどちらで入力すればよいですか？", a: "売上・原価ともに税抜（本体価格）で統一してください。税込金額で入力すると消費税分が粗利に含まれてしまい、正しい粗利率が計算できません。" },
          { q: "外注費は原価に含めますか？", a: "含めます。直接工事費・直接製造費に該当する外注費（材料費・労務費・外注費・直接経費）はすべて原価です。本社の管理部門や営業担当者の人件費は販管費であり、原価には含めません。" },
          { q: "粗利率30%では利益が出ませんか？", a: "粗利率30%でも、販管費（固定費）が少なければ十分な営業利益が出ます。目安として販管費が粗利の半分以下に抑えられていれば健全です。業種や規模によって異なるため、自社の固定費率と合わせて判断してください。" },
          { q: "入力データはサーバーに送信されますか？", a: "送信されません。すべての計算はブラウザ内で完結します。金額情報が外部に漏れることはありません。" },
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

    {/* 関連ツール */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5 text-sm">
        <li>・飲食店の原価率を計算するなら<Link href="/tools/food-cost-calculator" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">食材原価計算</Link></li>
        <li>・メニュー価格の設定に迷ったら<Link href="/tools/menu-price-calculator" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">メニュー価格シミュレーター</Link></li>
        <li>・工事の見積書をそのまま作りたい場合は<Link href="/tools/construction-estimate" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">建設工事 見積書作成ツール</Link></li>
        <li>・割引・割合の計算全般は<Link href="/tools/percentage-calculator" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">パーセント計算機</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="粗利率・原価率計算ツール"
        description="売上・原価を入力して粗利率を計算。目標粗利率から必要見積金額も逆算。建設・飲食・小売など業種別目安も掲載。"
        icon="📊"
        slug="gross-profit-calculator"
        seoContent={seoContent}
      >
        <GrossProfitCalculator />
      </ToolLayout>
    </>
  );
}
