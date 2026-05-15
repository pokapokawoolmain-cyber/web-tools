import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("fire-how-much-needed")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["FIRE 必要資産", "FIRE 何億", "FIRE シミュレーション", "FIRE 年収300万", "4%ルール 日本"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「FIREするには何億必要ですか？」という質問、本当によく見かけます。SNSでは「3億あればFIREできる」とか「いや5億は必要」とか、数字が独り歩きしていて、読んでいて混乱することも多い。
      </p>
      <p>
        結論から言うと、<strong>必要額は生活費によって全然違います</strong>。年間生活費300万円なら7,500万円、500万円なら1億2,500万円。この計算の根拠である「4%ルール」と、日本で適用する際の注意点を含めて整理してみます。
      </p>

      <h2>4%ルールとは何か、そもそもの話</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        FIREコミュニティでよく使われる「4%ルール」は、1998年にアメリカのトリニティ大学が発表した研究（通称：トリニティスタディ）が元になっています。
      </p>
      <p>
        内容をざっくり言うと、「株式と債券に分散投資したポートフォリオから毎年4%ずつ取り崩しても、30年後に資産が残っている確率が95%以上だった」というもの。これを逆算すると、必要な資産額は「年間生活費 × 25倍」になります。
      </p>
      <p>
        ただしこれ、アメリカのデータです。S&P500の過去リターンを前提にしています。日本株や円建て資産で同じ前提が使えるかどうかは、正直わかりません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収・生活費別のFIRE達成シミュレーション</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        実際に数字を見ていきましょう。以下は、現在の資産500万円・毎月の積立額が手取りの20%という前提で、「何年でFIREできるか」を試算したものです。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収（手取り）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間生活費</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">必要資産</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">達成まで（利回り5%）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">300万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">240万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">6,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約31年</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">300万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">7,500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約27年</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">350万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">8,750万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約23年</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1億円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約19年</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">450万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1億1,250万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約14年</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        この数字を見て「思ったより時間かかるな」と感じた人が多いと思います。それが正直なところだと思います。
      </p>
      <p>
        注意してほしいのは、上の表の「年間生活費」が意外と低く設定されているということ。年収400万円の人が生活費300万円というのは、手取りのほぼ全額を使う計算になります。貯蓄率を上げるには生活費を削るしかなく、それがどこまで現実的かは人によります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>生活費を下げることが最大の近道</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        FIREの計算式をよく見ると、収入を増やすより生活費を減らすほうが2倍の効果があることがわかります。
      </p>
      <p>
        たとえば年収500万円の人が年間生活費を350万円から300万円に減らすと、必要資産が8,750万円から7,500万円に下がり、かつ毎年の貯蓄額も増えます。両方の効果が同時に働くので、達成時期が一気に縮まります。
      </p>
      <p>
        逆に言えば、生活費を下げずに収入だけ増やそうとしても、生活水準も一緒に上がってしまう（ライフスタイルインフレ）と、必要資産額も増えてしまいます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>日本でFIREするときに見落としがちな点</h2>
      <h3>社会保険料の問題</h3>
      <p>
        会社員を辞めると、健康保険は国民健康保険に切り替わります。これが地味に高い。扶養家族がいる場合、年間で数十万円の支出になることもあります。
      </p>
      <p>
        会社員のときは「給与から天引き」されているので見えにくいですが、FIRE後は自分で払う必要があります。この分を生活費に含めておかないと、後で試算が狂います。
      </p>

      <h3>住民税は1年遅れでくる</h3>
      <p>
        退職した翌年に、現役時代の収入に対する住民税が請求されます。これを知らないと、FIRE初年度に予期しない出費でパニックになります。
      </p>

      <h3>インフレリスク</h3>
      <p>
        日本はここ数年、物価が上がっています。年2〜3%のインフレが続くと、20年後の生活費は今より4〜8割高くなる可能性があります。4%ルールがカバーできる範囲ですが、このリスクは意識しておく必要があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>「完全FIRE」にこだわらなくていい</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        最近は「サイドFIRE」「セミFIRE」という言葉も広まっています。週2〜3日だけ仕事して、残りを自由な時間にするスタイルです。
      </p>
      <p>
        個人的には、これが現実的だと思っています。完全にリタイアして「一切収入ゼロ」にするより、好きな仕事を少しだけ続けることで、必要な資産額を大幅に減らせます。年間200万円の収入があるだけで、必要資産は1,500万円以上少なくなります。
      </p>
      <p>
        FIREは目的ではなく手段です。「お金の心配をしないで生きたい」という本来の目的のために、どのルートが自分に合っているかを考えるほうが建設的だと思います。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自分のFIREシミュレーションをやってみる</h2>
      <p>
        ここまで読んで、自分の数字を計算してみたくなった人はぜひFIREシミュレーターを使ってみてください。現在の資産・毎月の積立額・年間生活費・運用利回りを入力すると、FIRE達成年数と必要資産額が即計算できます。
      </p>
      <p>
        数字を変えながら「生活費を月2万円削ったら何年縮まるか」「利回りが3%のケースと7%のケースでどれだけ差が出るか」を確認するのが、現実的な計画を立てる第一歩になると思います。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事のシミュレーション結果は参考値です。実際の運用成績は将来を保証するものではありません。投資判断はご自身の責任でお願いします。
      </div>
    </BlogLayout>
  );
}
