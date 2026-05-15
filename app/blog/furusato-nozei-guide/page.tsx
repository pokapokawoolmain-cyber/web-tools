import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("furusato-nozei-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ふるさと納税 仕組み", "ふるさと納税 控除上限 年収", "ふるさと納税 やり方", "ふるさと納税 早見表", "ふるさと納税 ワンストップ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        ふるさと納税は「寄付するとお得になる制度」という認識は広まっていますが、「実際にどういう仕組みなのか」「自分はいくらまで使えるのか」がよくわからないまま使っている人も多い印象があります。
      </p>
      <p>
        この記事では、仕組みの本質から年収別の控除上限額、手続きの選び方、返礼品の賢い選び方まで一通りまとめました。
      </p>

      <h2>ふるさと納税の仕組み：税金を「どこに払うか」を変える制度</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        ふるさと納税は「寄付」という名前がついていますが、実態は「翌年払う住民税・所得税の一部を、今年好きな自治体に前払いする」に近い制度です。
      </p>
      <p>
        通常、住民税は住んでいる市区町村に払います。ふるさと納税は、その一部を別の自治体に「ふるさと納税（寄付）」という形で先に払い、翌年の住民税から差し引いてもらう仕組みです。自己負担は2,000円だけで、残りは控除されます。
      </p>
      <p>
        そして寄付を受けた自治体は、集めた税収の一部を使ってお礼の品（返礼品）を送ってくれます。返礼品の価値は寄付額の30%以下というルールがあるため、1万円の寄付に対して最大3,000円相当の返礼品が受け取れます。自己負担2,000円に対して3,000円相当の品が手に入れば、実質的に1,000円のプラスです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の計算式を理解する</h2>
      <p>
        ふるさと納税の節税効果は「控除」によって生まれます。寄付金額から2,000円を引いた金額が、所得税の還付と住民税の減額によって戻ってきます。
      </p>
      <p>
        具体的には：
      </p>
      <ul className="space-y-2">
        <li>所得税の還付：（寄付金額 − 2,000円）× 所得税率</li>
        <li>住民税の控除（基本分）：（寄付金額 − 2,000円）× 10%</li>
        <li>住民税の控除（特例分）：住民税所得割額の20%を上限に残りを補填</li>
      </ul>
      <p>
        これらを合計すると「寄付金額 − 2,000円」がほぼそのまま戻ってくる計算になります。ただし控除上限額を超えた分は戻ってこないため、上限を把握しておくことが重要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別・控除上限額早見表（最新版）</h2>
      <p>
        以下は給与所得者・独身（扶養なし）を前提にした目安です。配偶者・扶養家族がいる場合は上限額が下がります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身・扶養なし</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配偶者あり</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配偶者＋子1人</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">300万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約28,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約19,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約15,000円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約42,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約33,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約29,000円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約61,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約49,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約44,000円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約77,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約69,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約60,000円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">700万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約108,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約86,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約78,000円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約129,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約120,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約110,000円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">900万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約151,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約141,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約132,000円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約176,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約166,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約157,000円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約242,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約232,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約221,000円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約355,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約343,000円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約334,000円</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        この表はあくまで目安です。住宅ローン控除・医療費控除・iDeCoなど他の控除を使っている場合は上限額が変わります。正確な金額は当サイトのシミュレーターか、各ふるさと納税ポータルサイトの計算ツールで確認することをおすすめします。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ワンストップ特例 vs 確定申告：どちらを使うか</h2>
      <p>
        ふるさと納税の手続き方法は2種類あります。どちらを使うかで手続きの手間が大きく変わります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">比較項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ワンストップ特例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">確定申告</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">手続きの手間</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">少ない（申請書を郵送するだけ）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">やや多い（2〜3月に申告）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">利用できる条件</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">寄付先が5自治体以内、確定申告不要の人</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">誰でも可</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">控除の反映先</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">翌年の住民税のみ</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">所得税（還付）＋翌年住民税</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">申請期限</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">翌年1月10日必着</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">翌年3月15日まで</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">マイナンバー</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">申請書に記載・コピー添付が必要</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">確定申告書に記載</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        会社員でふるさと納税先が5自治体以内ならワンストップ特例が断然楽です。ただし6自治体以上に寄付した場合や、医療費控除・住宅ローン控除などで確定申告をする予定がある場合は確定申告でまとめて申請するほうが確実です。
      </p>
      <p>
        注意点として、ワンストップ特例の申請後に確定申告を行うと、ワンストップ特例の申請は無効になります。確定申告をする予定が少しでもある場合は、最初から確定申告でふるさと納税も申告するようにしましょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>返礼品の選び方と賢い使い方</h2>
      <h3>食料品・日用品が最もコスパが高い</h3>
      <p>
        返礼品は寄付額の30%以内という上限があります。1万円の寄付で3,000円相当の品が受け取れます。自己負担2,000円に対して3,000円相当の品なら、金銭的なメリットは1,000円です。
      </p>
      <p>
        もっともコスパが高いのは、普段から消費する食料品・飲料・日用品です。特に米・牛肉・魚介類・果物などの食料品は還元率が高い傾向があり、普段のスーパーでの買い物を置き換えることで実質的な節約になります。
      </p>
      <h3>高額寄付で体験型返礼品も</h3>
      <p>
        年収700万円以上の方は上限額が10万円を超えてきます。一度の大きな寄付で宿泊券・農業体験・工芸品など体験型の返礼品を選ぶのも一つの使い方です。
      </p>
      <h3>「ふるさとチョイス」「楽天ふるさと納税」などのポータルを活用</h3>
      <p>
        楽天ふるさと納税は楽天ポイントが付与されるため、楽天経済圏を使っている方には特にメリットがあります。ただしポイント目的で控除上限額を大きく超えた寄付をすると、超過分が単純な持ち出しになるため注意が必要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ふるさと納税でやってはいけないこと</h2>
      <h3>控除上限額を超えた寄付</h3>
      <p>
        上限を超えた分は控除されません。1万円超過して寄付すれば、その1万円は単純な支出です。上限の把握は最重要事項です。
      </p>
      <h3>年末ギリギリの申し込み</h3>
      <p>
        12月31日までの「入金完了」が当年の控除対象になります。サイトの混雑・決済エラーなどのリスクがあるため、12月中旬〜20日頃までに余裕をもって手続きするのが安全です。
      </p>
      <h3>住民税非課税世帯は控除がない</h3>
      <p>
        ふるさと納税の控除は住民税・所得税から引かれます。収入が少なく住民税が非課税の世帯は控除がゼロになるため、実質的に2,000円の自己負担だけが残ります。自分が住民税を払っているかどうかを事前に確認しましょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>2024年の制度変更：ポイント付与の禁止</h2>
      <p>
        2023年10月より、ふるさと納税ポータルサイトが独自に付与するポイント・キャッシュバックなどが禁止されました（仲介サイト側のポイント付与の禁止）。楽天ふるさと納税でのポイント付与は継続されているなど、各サービスによって対応が異なります。寄付前に最新情報を確認することをおすすめします。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自分の控除上限額を正確に計算する</h2>
      <p>
        年収・配偶者の有無・扶養家族の人数・他の控除の状況によって上限額は変わります。当サイトのふるさと納税シミュレーターに条件を入力すると、自分の目安上限額を無料で計算できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の控除上限額は概算です。実際の金額は個人の状況により異なります。正確な計算は税理士にご相談いただくか、各ポータルサイトの計算ツールをご利用ください。
      </div>
    </BlogLayout>
  );
}
