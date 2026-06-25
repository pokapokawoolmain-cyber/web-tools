import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "お金・投資";
const SLUG = "finance";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "お金・投資の無料計算ツール｜FIRE・NISA・住宅ローン・ふるさと納税",
  description: "FIREシミュレーター・NISA積立・住宅ローン・ふるさと納税・手取り計算など、お金と投資に関する無料計算ツール集。登録不要・ブラウザ完結。",
  path: `/tools/${SLUG}`,
  keywords: ["FIRE シミュレーター", "NISA 積立 計算", "住宅ローン シミュレーション", "ふるさと納税 計算", "手取り 計算 無料"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このカテゴリのツール一覧</h2>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          { name: "FIREシミュレーター", use: "資産・生活費・利回りを入力してFIRE達成年数を試算。「あと何年働けばいいか」を数値で確認できる。" },
          { name: "新NISA積立計算", use: "月の積立額と運用期間から複利効果込みの将来額を計算。2024年新NISA制度に対応。" },
          { name: "住宅ローンシミュレーター", use: "借入金額・金利・返済期間を入力して毎月の返済額と総支払額を計算。グラフ付き。" },
          { name: "ふるさと納税シミュレーター", use: "年収と家族構成を入力して控除上限額を即計算。2,000円の自己負担でどこまで節税できるか確認。" },
          { name: "手取り計算", use: "年収を入力するだけで所得税・住民税・社会保険料の内訳と手取り額を計算。" },
        ].map(({ name, use }) => (
          <div key={name} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">{name}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">どんな場面で使う？</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>「早期退職のためにあといくら貯めればいいか」「新NISAで20年積み立てるといくらになるか」「この物件を買ったら毎月の返済はいくら？」——こうした計算をExcelや電卓でやろうとすると、複利の計算式や税率の調べ物で時間がかかります。このカテゴリのツールは、入力項目を埋めるだけで答えを出せるよう設計しています。</p>
        <p>手取り計算ツールは転職・昇給の際に「年収○○万円になったら手取りはいくら変わるか」をすぐ確認でき、ふるさと納税シミュレーターは「今年あといくら寄付できるか」の目安を家族構成込みで出します。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">計算結果の使い方と注意点</h2>
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 text-sm text-amber-800 dark:text-amber-300">
        <p className="font-semibold mb-1">あくまで参考値です</p>
        <p className="leading-relaxed">税金・社会保険料の計算は条件によって実額が変わります。投資シミュレーションは将来の市場動向を保証するものではありません。住宅ローンの実際の返済額は金融機関との契約内容によります。大きな意思決定の前には、ファイナンシャルプランナーや税理士にも相談してください。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "入力したデータはサーバーに送信されますか？", a: "送信されません。すべての計算はブラウザ内で完結します。年収や資産額などの個人情報が外部に送られることはありません。" },
          { q: "FIREシミュレーターの利回り設定はどうすればいいですか？", a: "長期の株式インデックス投資の実績は年利4〜7%程度が参考値です。保守的に見るなら3〜4%、楽観的に見るなら5〜7%で試算してみてください。" },
          { q: "ふるさと納税の控除上限を超えて寄付するとどうなりますか？", a: "上限を超えた分は自己負担となり、控除されません。本ツールの計算結果を参考に、上限内に収まるよう寄付先と金額を決めてください。" },
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
      description="FIREシミュレーター・NISA積立・住宅ローン・ふるさと納税など、お金と投資に関する無料計算ツール。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
