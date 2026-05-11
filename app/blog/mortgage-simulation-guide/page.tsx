import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("mortgage-simulation-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["住宅ローン シミュレーション", "住宅ローン 総返済額", "住宅ローン 月返済額 早見表", "住宅ローン 変動 固定 比較", "住宅ローン 繰り上げ返済"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        住宅ローンを組む前に「月々いくら返済して、最終的に総額でいくら払うのか」をしっかり把握している人は、意外と少ないです。不動産営業の説明で月返済額だけ聞いて「払えそう」と判断してしまうケースも多い。
      </p>
      <p>
        この記事では、借入額・金利・返済期間別の月返済額と総返済額を一覧にまとめ、変動金利と固定金利の比較、繰り上げ返済の効果、住宅ローン控除との関係まで解説します。
      </p>

      <h2>月返済額の早見表（元利均等返済・返済期間35年）</h2>
      <p>
        以下は借入額と金利別の月返済額（元利均等返済）の一覧です。ボーナス払いなし・返済期間35年の前提です。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">借入額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利0.4%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利0.7%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利1.5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利2.0%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利3.0%</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["2,000万円", "5.2万円", "5.5万円", "6.1万円", "6.6万円", "7.7万円"],
              ["2,500万円", "6.5万円", "6.9万円", "7.7万円", "8.3万円", "9.6万円"],
              ["3,000万円", "7.7万円", "8.2万円", "9.2万円", "9.9万円", "11.5万円"],
              ["3,500万円", "9.0万円", "9.6万円", "10.7万円", "11.6万円", "13.4万円"],
              ["4,000万円", "10.3万円", "11.0万円", "12.3万円", "13.2万円", "15.3万円"],
              ["4,500万円", "11.6万円", "12.3万円", "13.8万円", "14.9万円", "17.2万円"],
              ["5,000万円", "12.8万円", "13.7万円", "15.3万円", "16.5万円", "19.1万円"],
            ].map(([amount, r04, r07, r15, r20, r30], i) => (
              <tr key={amount} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{r04}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{r07}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{r15}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{r20}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{r30}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        金利0.4%と3.0%では、3,000万円借入の場合の月返済額が約7.7万円 vs 11.5万円と約3.8万円の差があります。35年間で積み上がると、この差がどれだけ大きくなるかは次の総返済額の表で確認できます。
      </p>

      <h2>総返済額の比較（借入3,000万・4,000万・5,000万円）</h2>
      <p>
        月返済額の差より、総返済額の差のほうが体感的にインパクトがあります。金利の違いが35年分積み重なるとどうなるか。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">借入額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">金利</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">総返済額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利息合計</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2" rowSpan={4}>3,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.4%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3,215万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約215万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">107%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.7%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3,376万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約376万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">113%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1.5%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3,856万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約856万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">129%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3.0%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約4,842万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約1,842万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">161%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2" rowSpan={4}>4,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.4%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約4,287万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約287万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">107%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.7%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約4,501万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約501万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">113%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1.5%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約5,141万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約1,141万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">129%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3.0%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約6,456万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約2,456万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">161%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        3,000万円を借りて金利3%で返済すると、35年間で元本の1.6倍を超える約4,842万円を返済することになります。一方、金利0.4%なら約3,215万円。その差は約1,600万円です。金利の差がいかに大きいかがわかります。
      </p>

      <h2>変動金利 vs 固定金利：どちらを選ぶか</h2>
      <p>
        住宅ローン選びで最初に悩むのがこの選択です。それぞれの特徴を整理します。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">比較項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">変動金利</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">全期間固定（フラット35等）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2024年時点の金利水準</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.3〜0.7%前後（主要銀行）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1.8〜2.0%前後</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">金利変動リスク</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">あり（半年ごとに見直し）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">なし（借入から完済まで固定）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">返済計画の立てやすさ</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">難しい（将来の返済額が不確定）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">立てやすい（完済まで同額）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">総返済額（金利が変わらない場合）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">低い</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">高い（現状では）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">向いている人</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">金利上昇時に対応できる余力がある人、繰り上げ返済で早期完済を狙う人</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">将来の返済額を確定させたい人、金利上昇リスクを取りたくない人</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        2024年時点では変動金利が固定を大幅に下回っており、変動を選ぶ人が多数派です。ただし日本銀行が政策金利を引き上げる方向に転換しており、今後の動向次第では変動金利が上がる可能性があります。
      </p>
      <p>
        「金利が1%上がったら月返済額がどう変わるか」を事前に計算しておくことが重要です。3,000万円・0.5%の場合と1.5%の場合では月返済額に約3,000円の差が生まれます。家計に余裕があるかどうかを確認しておきましょう。
      </p>

      <h2>繰り上げ返済の効果</h2>
      <p>
        住宅ローンは「残元本に対して利息がかかる」仕組みです。そのため、早い段階で元本を減らすほど、その後の利息負担が少なくなります。
      </p>
      <p>
        3,000万円・金利1.5%・35年返済の条件で、借入から5年後に100万円を繰り上げ返済した場合のシミュレーションです。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">繰り上げ返済のタイミング</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利息軽減額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">返済期間の短縮</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">借入から5年後（残30年）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約196万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約2年6ヶ月</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">借入から15年後（残20年）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約98万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約1年4ヶ月</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">借入から25年後（残10年）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約28万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約5ヶ月</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        同じ100万円の繰り上げ返済でも、借入5年後（残30年）と25年後（残10年）では利息軽減額に約7倍の差があります。早い段階での繰り上げ返済ほど効果が大きいことが数字で確認できます。
      </p>
      <p>
        一方、繰り上げ返済にすべての余剰資金を使いすぎると、緊急資金が枯渇するリスクがあります。生活費の半年〜1年分は手元に残しつつ、余剰資金で繰り上げ返済するのが無難な考え方です。
      </p>

      <h2>住宅ローン控除との関係</h2>
      <p>
        住宅ローンを組んで一定の要件を満たすと、住宅ローン控除（住宅借入金等特別控除）が適用されます。
      </p>
      <p>
        2022年以降に入居した場合、年末のローン残高の<strong>0.7%</strong>が所得税・住民税から控除されます（旧制度は1%）。最大で13年間適用されます。
      </p>
      <p>
        借入4,000万円の初年度の場合、残高4,000万円×0.7%＝28万円が控除の上限です。所得税で引ききれない分は住民税からも控除されます（住民税は年9.75万円が上限）。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年末ローン残高</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">最大控除額（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">13年間合計の上限</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">14万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約140万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">21万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約210万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">28万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約280万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">5,000万円（上限）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">35万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約350万円</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        注意点として、住宅ローン控除の適用期間中は繰り上げ返済のメリットが相対的に小さくなることがあります。例えば金利0.5%のローンなら、利息節約効果（0.5%相当）より控除効果（0.7%相当）のほうが大きいため、繰り上げ返済より投資に回すほうが有利なケースも出てきます。残高×金利 vs 残高×0.7%を比較して判断するのがポイントです。
      </p>

      <h2>「借りすぎ」を防ぐための考え方</h2>
      <p>
        銀行の審査で「最大4,000万円まで借りられます」と言われても、それが「借りて良い金額」とは限りません。審査基準は「返済不能にならない範囲」であって、「生活が豊かになる範囲」ではないからです。
      </p>
      <p>
        一般的に言われる目安は「年収の5〜6倍まで」ですが、金利や将来の支出（子どもの教育費・老後資金など）によって実情は変わります。月返済額が手取りの25〜30%以内に収まるかどうかが、生活への圧迫度を判断する実用的な指標になります。
      </p>
      <p>
        共働きで2人の収入を前提にローンを組む場合、どちらかが育休・病気で収入が減ったときに返済が続けられるかも確認しておくことが重要です。
      </p>

      <h2>自分の条件で試算する</h2>
      <p>
        借入額・金利・返済期間を自由に設定して月返済額・総返済額・利息合計を即計算できる住宅ローンシミュレーターを使うと、複数の条件を比較しながら計画を立てられます。金利が0.5%変わるだけで総返済額がどう変わるか、繰り上げ返済の効果がどれくらいあるかを数字で確認してから判断することをおすすめします。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は概算です。実際のローン条件は金融機関によって異なります。借入前には複数の金融機関で見積もりを取り、ファイナンシャルプランナーや銀行担当者にご相談ください。本記事は投資・借入に関するアドバイスではありません。
      </div>
    </BlogLayout>
  );
}
