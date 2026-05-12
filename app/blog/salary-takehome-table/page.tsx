import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("salary-takehome-table")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収500万 手取り", "年収600万 手取り", "年収400万 手取り", "手取り 早見表 年収別", "年収700万 手取り", "年収1000万 手取り", "手取り計算 会社員"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「年収600万円って手取りいくら？」と聞かれると、意外と即答できる人が少ない。給与明細は毎月見ているはずなのに、年収ベースで自分の手取りを正確に把握している人は多くありません。
      </p>
      <p>
        この記事では年収300万円〜1,500万円の手取り早見表をまとめ、何にどれだけ引かれているのかの内訳、年収ごとの実質的な負担率、そして手取りを合法的に増やすための方法まで解説します。
      </p>

      <h2>年収別・手取り早見表（最新版）</h2>
      <p>
        以下は給与所得者（会社員・正社員）、独身、東京都在住を前提にした概算です。扶養家族の人数・居住地・加入している健康保険組合によって数万円単位で変わります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額手取り</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除合計</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">300万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約240万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約20.0万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約60万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約80%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">350万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約279万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約23.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約71万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約80%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約318万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約26.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約82万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約79.5%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">450万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約355万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約29.6万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約95万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約79%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約393万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約32.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約107万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約78.6%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">550万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約428万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約35.7万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約122万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約77.8%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約462万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約38.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約138万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約77%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">650万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約495万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約41.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約155万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約76%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">700万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約528万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約44.0万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約172万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約75.4%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約594万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約49.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約206万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約74.3%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">900万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約658万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約54.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約242万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約73.1%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約718万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約59.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約282万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約71.8%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約831万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約69.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約369万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約69.3%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約992万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約82.7万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約508万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約66.1%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        年収が上がるにつれて手取り率が下がっていくのは、累進課税と社会保険料の仕組みによるものです。年収300万円で約80%手元に残るのに対し、1,500万円では66%まで下がります。
      </p>

      <h2>何にどれだけ引かれているのか</h2>
      <p>
        給与から引かれるものは「社会保険料」と「税金」の2種類に大別されます。それぞれがどれくらいの割合を占めているか、年収600万円を例に見てみましょう。
      </p>

      <h3>社会保険料の内訳（年収600万円・独身・東京都）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間本人負担額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">料率（本人分）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">健康保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約30万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約5.0%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">組合健保は料率が異なる</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">厚生年金</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約55万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">9.15%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">上限あり（標準報酬月額65万円）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">雇用保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3.6万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.6%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">失業給付の財源</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">社会保険料合計</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約88万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約14.7%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">会社も同額負担</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        社会保険料は会社と従業員で折半です。給与明細に書いてある金額は自分の負担分のみですが、会社も同じくらい払っています。年収600万円の社員を雇うのに、会社は社会保険料の会社負担分も含めると実質700万円以上のコストをかけています。
      </p>

      <h3>税金の内訳（年収600万円・独身）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">徴収のタイミング</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">所得税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約23万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">毎月源泉徴収→年末調整で精算</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">住民税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約27万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">翌年6月〜翌々年5月に徴収</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">税金合計</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約50万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        住民税は「前年の所得」に対してかかります。転職・退職した翌年に、前職の収入に対する住民税が来るため、タイミングによっては手元資金が想定より一時的に減ることがあります。独立やフリーランス転向時に「こんなにかかるとは思わなかった」となりやすい落とし穴です。
      </p>

      <h2>年収ごとの手取り詳細</h2>

      <h3>年収500万円の場合</h3>
      <p>
        日本の給与所得者の平均年収（国税庁2022年調査）は約460万円です。500万円はその少し上で、標準的なサラリーマン像のイメージに近い水準です。
      </p>
      <p>
        手取りは約393万円（月約32.8万円）。控除約107万円の内訳は、社会保険料が約74万円（うち厚生年金約46万円、健康保険約25万円）、所得税約13万円、住民税約20万円が目安です。
      </p>
      <p>
        月32.8万円から家賃・食費・光熱費・通信費などの固定費を引くと、可処分所得がどれくらい残るかがわかります。東京で一人暮らしなら家賃7〜10万円、生活費8〜10万円で手元に10〜15万円残るかどうかというイメージです。
      </p>

      <h3>年収700万円の場合</h3>
      <p>
        「高収入」と言われる水準ですが、手取りは約528万円（月約44万円）です。額面から約24.6%が控除されます。
      </p>
      <p>
        注目すべきは、年収500万円から700万円に増えると額面で200万円増えますが、手取りの増加は約135万円にとどまる点です。差額の約65万円が税・社会保険料として持っていかれます。昇給・転職で「年収が上がったのに思ったほど生活が変わらない」と感じる原因のひとつです。
      </p>

      <h3>年収1,000万円の場合</h3>
      <p>
        「年収1,000万円なのに手取りが700万円ちょっとしかない」と感じる人は多いです。手取り率は約71.8%で、300万円台のころの約80%と比べると大きく下がっています。
      </p>
      <p>
        所得税の税率が上がることに加え、課税所得の計算時に使える「給与所得控除」が年収850万円超で上限に達することも影響します（最大195万円）。一方、厚生年金は標準報酬月額65万円が上限なので、年収1,000万円と800万円でほぼ同額の保険料です。高収入になるほど「払った保険料に対してもらえる年金の比率」が下がる構造になっています。
      </p>

      <h2>配偶者・扶養家族がいる場合の変化</h2>
      <p>
        ここまでは独身前提でしたが、扶養家族がいると手取りは変わります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収600万円・家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">独身</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約462万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">—</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者あり（専業主婦・収入なし）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約476万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約14万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者＋子ども1人（16歳未満）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約476万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約14万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者＋子ども1人（16〜18歳）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約484万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約22万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        配偶者控除（38万円）が適用されると所得税・住民税が下がります。子どもが16歳以上になると扶養控除（38万円、高校生相当）が使えるようになります。16歳未満の子どもは扶養控除の対象外ですが、児童手当が受給できる年齢帯です。
      </p>

      <h2>配偶者の収入と「壁」の問題</h2>
      <p>
        共働き世帯で配偶者の収入がある場合、いくつかの「壁」を意識する必要があります。パート・アルバイトの収入を調整している方は特に関係します。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">収入の壁</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">超えると起きること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">103万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者の所得税が発生、主たる生計者の配偶者控除（38万円）が縮小または消滅</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">106万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">従業員101人以上の会社では社会保険加入義務が発生（2024年10月から51人以上に拡大）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">130万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">扶養から外れ、国民健康保険・国民年金の加入義務が発生（または勤め先の社会保険加入）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">150万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者特別控除の金額が段階的に減少し始める</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">201万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者特別控除が完全に消滅</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        2024年以降、政府は「103万円の壁」を引き上げる議論を進めています。最新の税制動向は適宜確認することをおすすめします。
      </p>

      <h2>ボーナスの手取り</h2>
      <p>
        ボーナスにも社会保険料と税金がかかります。ただし計算方法が月給とは少し異なります。
      </p>
      <p>
        社会保険料は月給と同じ料率が適用されます。所得税は「賞与に対する源泉徴収税額の算出率の表」を使い、前月の月給の額をもとに税率が決まります。
      </p>
      <p>
        おおよその目安として、ボーナスから引かれる税・社会保険料の合計は支給額の約20〜25%程度です。50万円のボーナスなら手取りは約37〜40万円になる計算です。
      </p>

      <h2>手取りを合法的に増やす5つの方法</h2>

      <h3>① iDeCo（個人型確定拠出年金）</h3>
      <p>
        掛金が全額所得控除になります。会社員の上限は月2万3,000円（会社に企業年金がない場合）。年収600万円でこの上限まで積み立てると、年間で約8〜9万円の節税効果があります。60歳まで引き出せないデメリットはありますが、老後資金と節税を同時に進められる制度です。
      </p>

      <h3>② ふるさと納税</h3>
      <p>
        実質2,000円の自己負担で全国の特産品が受け取れ、残りは税額控除されます。年収600万円の独身なら約7〜8万円が目安の控除上限額です。食品・日用品の返礼品を選べば生活費の節約にもなります。ワンストップ特例を使えば確定申告不要。
      </p>

      <h3>③ 住宅ローン控除</h3>
      <p>
        住宅を購入している場合、最大13年間にわたって所得税（＋一部住民税）が控除されます。年収・借入額によっては年間30〜40万円規模の節税になることもあり、会社員が使える控除の中では最大級の効果があります。
      </p>

      <h3>④ 医療費控除・セルフメディケーション税制</h3>
      <p>
        年間の医療費が10万円（または所得の5%）を超えた場合、超えた部分が所得控除の対象になります。セルフメディケーション税制は、特定のOTC医薬品の購入費が年1万2,000円を超えた場合に使える別枠の控除です。確定申告が必要ですが、手間に比べて節税効果が高いケースがあります。
      </p>

      <h3>⑤ 生命保険料控除・地震保険料控除</h3>
      <p>
        生命保険・介護保険・個人年金保険の保険料は、一定額まで所得控除の対象になります。地震保険料も同様です。すでに加入している場合は、年末調整で確実に申請しましょう。うっかり忘れている人が意外と多い控除のひとつです。
      </p>

      <h2>「年収を上げるより節税」は本当か</h2>
      <p>
        「節税より収入アップを目指すべき」という意見と「まず節税から」という意見があります。どちらが正しいかは状況次第ですが、節税の上限は収める税金の額に依存します。税金を払っていなければ節税のしようがありません。
      </p>
      <p>
        一方、iDeCoやふるさと納税は「やらないと純粋に損」に近い制度です。特にふるさと納税はすでに払っている住民税・所得税をポイントに変換するようなイメージで、返礼品を受け取れる分だけ実質的に手取りが増えます。収入アップを目指しながら並行して使うのが合理的です。
      </p>

      <h2>自分の正確な手取りを計算する</h2>
      <p>
        ここに載せた数字は概算です。扶養家族の人数・加入している健康保険組合・各種控除の状況によって実際の手取りは数万円単位で変わります。自分の年収・家族構成を入力してより正確な金額を確認できます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-2">手取りを正確に計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・各種控除を入力するだけで、あなたの手取り額を自動計算します。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収別の詳細解説記事</h2>
      <ul>
        <li><Link href="/blog/takehome-400" className="text-blue-600 dark:text-blue-400 hover:underline">年収400万円の手取りはいくら？</Link> — 月26.5万円の生活費シミュレーション</li>
        <li><Link href="/blog/takehome-500" className="text-blue-600 dark:text-blue-400 hover:underline">年収500万円の手取りはいくら？</Link> — 月32.8万円、日本の平均年収と比較</li>
        <li><Link href="/blog/takehome-600" className="text-blue-600 dark:text-blue-400 hover:underline">年収600万円の手取りはいくら？</Link> — 月38.5万円、家族持ちのケース別比較</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。制度改正・個人の状況により実際の手取りは異なります。正確な金額は税理士・社会保険労務士にご相談ください。
      </div>
    </BlogLayout>
  );
}
