import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "計算ツール";
const SLUG = "calculator";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "計算ツール一覧｜メルカリ利益・ガソリン代・シフト給与・ポイント還元",
  description: "メルカリ利益・ガソリン代・シフト給与・ポイント還元など、日常の計算をかんたんに。スマホで使える無料計算ツール集。",
  path: `/tools/${SLUG}`,
  keywords: ["メルカリ 利益計算", "ガソリン代 計算", "シフト 給与計算", "ポイント還元 比較", "無料 計算ツール"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">どんな場面で役立つ？</h2>
      <div className="space-y-2 text-sm">
        {[
          { scene: "メルカリで出品前に「この価格で利益が出るか」確認したい", tool: "メルカリ利益計算" },
          { scene: "毎月のガソリン代を節約できるか試算したい", tool: "ガソリン代計算" },
          { scene: "バイトを掛け持ちしてトータル収入を確認したい", tool: "シフト給与計算" },
          { scene: "メインで使うキャッシュレス決済を還元率で選びたい", tool: "ポイント還元シミュレーター" },
        ].map(({ scene, tool }) => (
          <div key={scene} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
            <span className="text-blue-500 mt-0.5">→</span>
            <span><span className="text-slate-800 dark:text-zinc-200">{scene}：</span>{tool}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "メルカリの販売手数料は何%ですか？", a: "メルカリの販売手数料は販売価格の10%です。これに送料（出品者負担の場合）を合わせた額が差し引かれた金額が手取りになります。ツールでは自動的に手数料10%を引いた利益を計算します。" },
          { q: "深夜割増の計算はどうなりますか？", a: "労働基準法により、22時〜翌5時の深夜時間帯に勤務した場合は基本時給の25%増となります。シフト給与計算ツールでは深夜時間帯の時間数を別途入力することで、割増分を含めた正確な月収を計算できます。" },
          { q: "ポイント還元シミュレーターのデータは最新ですか？", a: "各サービスの基本還元率を参考値として使用しています。実際の還元率はキャンペーン・会員ランク・支払い方法によって異なります。最新の情報は各サービスの公式サイトでご確認ください。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="メルカリ利益・ガソリン代・シフト給与・ポイント還元など、日常の計算をかんたんに。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
