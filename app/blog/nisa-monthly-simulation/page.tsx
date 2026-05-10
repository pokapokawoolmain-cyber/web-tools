import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("nisa-monthly-simulation")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["新NISA 満額 何年", "新NISA シミュレーション", "新NISA 月3万", "新NISA 利回り", "積立NISA 計算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「毎月5万円積み立てたら30年後いくらになるんだろう」と気になって、ネットで調べると&ldquo;複利の力はすごい&rdquo;みたいな話ばかりで、具体的な数字が出てこないことが多い。
      </p>
      <p>
        なので、月3万・5万・10万円のパターンを、利回り3%・5%・7%それぞれで10年・20年・30年後の資産額を計算してみました。非課税のメリットがどれくらいの金額になるかも合わせて確認します。
      </p>

      <h2>計算の前提</h2>
      <p>
        新NISAの成長投資枠＋つみたて投資枠の年間上限は360万円（月30万円）。ほとんどの人は月3〜10万円あたりで考えると思うので、その範囲で試算しています。
      </p>
      <p>
        利回りについては、S&P500や全世界株式（オルカン）の過去の年率リターンは7〜10%程度ですが、手数料・為替・今後の不確実性を考えると5〜7%が現実的な想定ではないかと思います。3%は保守的なシナリオです。
      </p>
      <p>
        計算式は毎月末積立の複利計算。途中の取り崩しなし、再投資あり、という前提です。
      </p>

      <h2>月3万円積み立てた場合</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">419万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">465万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">519万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">985万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,233万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,558万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,749万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,498万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,622万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        元本は月3万×12ヶ月×30年＝1,080万円。利回り7%なら30年で元本の約3.4倍になります。利回り3%だと約1.6倍なので、どの利回りを想定するかで結果が大きく変わることがわかります。
      </p>

      <h2>月5万円積み立てた場合</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">699万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">776万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">866万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,642万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,055万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,597万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,916万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,163万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">6,037万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月5万円・30年・利回り5%で4,000万円超えます。元本は1,800万円なので、運用益だけで2,300万円以上。この運用益部分が全額非課税になるのが新NISAの最大のメリットです。
      </p>

      <h2>月10万円積み立てた場合</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,398万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,551万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,731万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,283万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,110万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">5,194万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">5,832万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">8,325万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">12,073万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月10万円は年120万円で、新NISAのつみたて枠（年120万円）にちょうど収まります。利回り7%・30年で1.2億円。元本は3,600万円なので、差額の約8,400万円が非課税の運用益です。
      </p>

      <h2>非課税メリットを金額で確認する</h2>
      <p>
        新NISAの外（課税口座）で同じ運用をすると、売却時に利益の約20%が税金として引かれます。どれくらいの差が出るのか、月5万円・利回り5%・30年のケースで確認してみます。
      </p>
      <p>
        運用益が約2,363万円の場合、課税口座なら約473万円が税金として消えます。新NISAならこれがまるごと手元に残ります。30年で470万円以上の差というのは、なかなかインパクトのある数字だと思います。
      </p>
      <p>
        もちろん、課税口座でも途中の配当再投資には都度課税されるので、実際の差はもう少し大きくなる可能性があります。
      </p>

      <h2>「積立額をいくらにするか」の現実的な考え方</h2>
      <p>
        シミュレーションを見て「月10万積みたい！」と思っても、生活費を無視して積立額を増やしても意味がありません。
      </p>
      <p>
        よく言われるのは「手取りの20〜30%を積立に回す」という目安です。手取り30万円なら6〜9万円。最初は少なくて焦る気持ちもわかりますが、月3万円でも30年続ければ利回り5%で約2,500万円になります。
      </p>
      <p>
        もう一つ大事なのは、積立額を増やすよりも<strong>やめないこと</strong>のほうが重要だということ。2020年のコロナショックでS&P500は約34%下落しましたが、そのまま持ち続けた人は半年後に回復しています。積立を止めた人はその後の回復を取り込めませんでした。
      </p>

      <h2>満額（月30万円）を達成するまでの考え方</h2>
      <p>
        新NISAの非課税保有限度額は1,800万円。月30万円のペースなら5年で埋まります。でも月30万円積み立てられる人はかなり限られます。
      </p>
      <p>
        非課税枠は「使い切らないと損」ではなく、「使えるだけ使えばいい」ものです。月5万円でも年60万円、30年で1,800万円の枠をちょうど使い切れます。無理して満額を追わず、自分のペースで続けることが長期では勝ります。
      </p>
      <p>
        また、新NISAは売却すると翌年に枠が復活する仕組みです（旧NISAと違う点）。なのでいざというとき売れる、という安心感もあります。
      </p>

      <h2>利回りは「確約」ではない</h2>
      <p>
        このシミュレーションの数字は、設定した利回りが30年間一定で続いた場合のものです。実際にはリーマンショックやコロナのような暴落もあり、毎年7%なんてなりません。
      </p>
      <p>
        長期で見れば全世界株式・S&P500の年率リターンはおおむね5〜7%で推移してきましたが、それはあくまで過去の話。今後も同じかどうかは誰にもわかりません。
      </p>
      <p>
        だからこそ「3%・5%・7%の3パターン」で考えておくことが大事で、最悪3%でも自分の計画が成立するかを確認しておくと、相場が悪いときに焦らずに済みます。
      </p>

      <h2>自分の数字で計算してみる</h2>
      <p>
        毎月の積立額・年数・利回りを自由に設定して、より詳細なシミュレーションを見たい方はNISA計算ツールを使ってみてください。複数パターンを並べて比較することもできます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事のシミュレーション結果は参考値です。実際の運用成績は将来を保証するものではありません。投資判断はご自身の責任でお願いします。
      </div>
    </BlogLayout>
  );
}
