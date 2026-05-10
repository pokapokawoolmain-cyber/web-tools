import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("salary-takehome-table")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収 手取り", "年収400万 手取り", "年収600万 手取り", "年収1000万 手取り", "手取り計算 2024"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「年収600万円って手取りいくら？」と聞かれると、意外と答えられない人が多い。給料明細を毎月見ているはずなのに、年収ベースの手取りを把握している人は少ないと思います。
      </p>
      <p>
        ここでは年収400〜1,000万円の手取り早見表と、何にどれだけ引かれているのかの内訳をまとめました。
      </p>

      <h2>年収別・手取り早見表（2024年版）</h2>
      <p>
        以下は給与所得者（会社員・正社員）、独身、東京都在住の場合を前提にした概算です。扶養家族の有無・居住地・加入している健康保険組合によって数万円単位で変わることがあります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額手取り</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約318万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約26.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約82万円（20.5%）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約393万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約32.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約107万円（21.4%）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約462万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約38.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約138万円（23.0%）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">700万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約528万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約44.0万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約172万円（24.6%）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約594万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約49.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約206万円（25.8%）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">900万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約658万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約54.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約242万円（26.9%）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約718万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約59.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約282万円（28.2%）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        年収が上がるほど控除率が上がっていく（税負担が重くなる）のは累進課税の仕組みによるものです。年収400万円で約20%引かれるのが、1,000万円になると28%を超えます。
      </p>

      <h2>何にどれだけ引かれているのか</h2>
      <p>
        給与から引かれるのは大きく分けて「社会保険料」と「税金」の2種類です。
      </p>

      <h3>社会保険料（年収600万円の場合）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">本人負担額（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">料率（本人分）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">健康保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約30万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約5.0%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">厚生年金</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約55万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">9.15%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">雇用保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.6%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">社会保険料合計</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約88万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約14.7%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        社会保険料は会社と折半（介護保険は40歳以上から）。給与明細に載っている金額は自分の負担分だけですが、会社も同じくらい払っています。つまり会社から見ると、年収600万円の社員を雇うのに社会保険料の会社負担分も含めると実質700万円以上のコストがかかっています。
      </p>

      <h3>税金（年収600万円の場合）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">メモ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">所得税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約23万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">課税所得に応じて5〜45%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">住民税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約27万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">所得の約10%（均等割含む）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        所得税と住民税の違いで混乱しやすい点があります。所得税は毎月の給与から源泉徴収され、年末調整で精算されます。住民税は前年の所得に基づいて翌年6月から徴収されます。つまり転職・退職した翌年に前職の収入に対する住民税が来ることがあり、タイミングによっては手元資金が想定より減ることがあります。
      </p>

      <h2>年収1,000万円の「思ったより手取りが少ない」問題</h2>
      <p>
        「年収1,000万円なのに手取りが700万円ちょっとしかない」と感じる人は多いです。理由はいくつかあります。
      </p>
      <p>
        一つは所得税の税率が上がること。年収1,000万円の課税所得は約770万円程度で、この部分には23%の税率がかかります（695万円超900万円以下の部分）。さらに高い部分には33%がかかります。
      </p>
      <p>
        もう一つは厚生年金の保険料が上限に達していること。標準報酬月額の上限（2024年時点で65万円）があるため、年収1,000万円と800万円で厚生年金の保険料はほぼ同じです。逆に言えば、高収入になるほど「払った保険料に対してもらえる年金の比率」は下がります。
      </p>

      <h2>手取りを合法的に増やす方法</h2>
      <h3>iDeCo（個人型確定拠出年金）</h3>
      <p>
        掛金が全額所得控除になります。年収600万円で毎月2万3,000円（会社員の上限）積み立てると、年間で約8万円程度の節税効果があります（所得税＋住民税）。引き出しは60歳以降ですが、老後資金と節税を同時に進められます。
      </p>
      <h3>ふるさと納税</h3>
      <p>
        年収600万円の独身なら、約7〜8万円程度が実質2,000円の自己負担で寄付できる目安です。食品・日用品の返礼品をもらえる分、実質的な節約になります。ワンストップ特例を使えば確定申告も不要。
      </p>
      <h3>住宅ローン控除</h3>
      <p>
        住宅を購入している場合、最大13年間にわたって所得税（＋住民税）が控除されます。控除しきれない分は住民税からも引かれます。年収に対してかなり大きな節税効果があります。
      </p>

      <h2>自分の手取りを正確に計算する</h2>
      <p>
        扶養家族の人数・加入している健康保険組合・各種控除の状況によって、ここに載せた数字とは異なる場合があります。より正確な計算をしたい場合は手取り計算ツールで自分の条件を入力してみてください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は2024年時点の税率・社会保険料率に基づく概算です。個人の状況により実際の手取りは異なります。正確な金額は税理士・社会保険労務士にご相談ください。
      </div>
    </BlogLayout>
  );
}
