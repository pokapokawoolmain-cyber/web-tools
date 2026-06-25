import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "学生向け";
const SLUG = "student";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "学生向け無料ツール｜GPA計算・就活・大学生の作業効率化",
  description: "GPA計算ツールなど、大学生・高校生の学習・就活・単位管理に役立つ無料ツール。登録不要・ブラウザ完結。",
  path: `/tools/${SLUG}`,
  keywords: ["GPA 計算 無料", "大学 GPA 算出", "就活 成績 換算", "単位 GPA 計算機"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">GPAの計算方法</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>GPAは「Grade Point Average」の略で、成績の平均値を4点満点（または3点満点）で表した指標です。単純な成績平均ではなく、科目の単位数で加重平均するのが特徴です。</p>
        <p>例えば2単位の科目でAを取った場合と4単位の科目でAを取った場合では、4単位のほうがGPAへの影響が大きくなります。そのため単位数の多い必修科目で高い成績を維持することが、GPA向上のカギになります。</p>
        <div className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-3 font-mono text-xs">
          GPA = Σ（グレードポイント × 単位数）÷ 総単位数
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">GPAが必要な場面</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "大学院進学", desc: "内部・外部進学の選考基準にGPAが使われることが多い" },
          { label: "留学申請", desc: "海外大学・交換留学プログラムの選考でGPAの足切りがある場合も" },
          { label: "就職活動", desc: "外資系企業などでGPAの提出を求めるケースがある" },
          { label: "奨学金申請", desc: "成績上位者向けの給付型奨学金ではGPAが評価される" },
        ].map(({ label, desc }) => (
          <div key={label} className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3">
            <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">{label}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "大学によってGPAのスケールが違うのですが？", a: "多くの日本の大学は4.0スケール（A=4, B=3, C=2, D=1, F=0）を採用していますが、3.0スケールや独自の換算表を使う大学もあります。本ツールでは各成績に対してグレードポイントを自由に設定できるので、自分の大学の換算表に合わせて入力してください。" },
          { q: "不合格・単位なしの科目はGPA計算に含めますか？", a: "ポリシーは大学によって異なります。F（不合格）を0ポイントとしてGPAに含める大学もあれば、単位未取得の科目は除外する大学もあります。自分の大学の成績評価規定を確認してください。" },
          { q: "就活でGPAを聞かれたらどう答えますか？", a: "成績証明書に記載されているGPAをそのまま伝えましょう。記載がない場合はGPA計算ツールで算出した値を「自己計算値」として使えますが、面接では「大学の成績証明書に記載がなかったため自身で計算しました」と正直に伝えてください。" },
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
      description="GPA計算など、大学生・高校生の学習・就活に役立つ無料ツール。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
