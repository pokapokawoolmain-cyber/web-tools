import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("nisa-monthly-simulation")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["新NISA 積立 シミュレーション", "新NISA 月3万 30年", "新NISA いくら積み立て", "新NISA 利回り 計算", "積立NISA 複利 計算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「毎月5万円積み立てたら30年後にいくらになるんだろう」と気になって調べても、&ldquo;複利の力はすごい&rdquo;という話ばかりで具体的な金額が出てこないことが多い。
      </p>
      <p>
        この記事では、月1万・3万・5万・7万・10万円のパターンを、利回り3%・5%・7%それぞれで10年・20年・30年後の資産額を全部計算してまとめました。あわせて、新NISAの非課税メリットが実際にどれくらいの金額になるか、いつ始めるのがいいか、暴落したときどうするかも書いています。
      </p>

      <h2>計算の前提を整理する</h2>
      <p>
        シミュレーションの前提は以下のとおりです。
      </p>
      <ul className="space-y-2">
        <li>毎月末に一定額を積み立て、運用益は再投資</li>
        <li>年率リターンは設定した利回りで固定（実際は変動します）</li>
        <li>新NISAの非課税枠を使用（課税なし）</li>
        <li>途中の取り崩しなし</li>
      </ul>
      <p>
        利回りの想定についてですが、S&P500や全世界株式インデックス（いわゆる「オルカン」）の過去20〜30年の年率リターンはおおよそ7〜10%程度です。ただし手数料・為替コスト・今後の不確実性を考えると、5〜7%が現実的な想定ラインではないかと思います。3%は債券や高配当株を混ぜた保守的なポートフォリオのイメージです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月1万円から始めた場合</h2>
      <p>
        「まず少額から試してみたい」という人向けの試算です。月1万円は年12万円で、つみたて投資枠（年120万円）の10分の1。心理的なハードルが低い分、まず始めることが目的なら十分な金額です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">120万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">140万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">155万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">173万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">240万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">328万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">411万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">519万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">360万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">583万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">833万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,207万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月1万円でも30年・利回り7%なら1,200万円を超えます。元本360万円が3倍以上になる計算です。「少額だから意味がない」ということはなく、30年という時間が複利を効かせてくれます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月3万円積み立てた場合</h2>
      <p>
        手取り20万円台の人が「手取りの10〜15%を積み立てる」と考えたときに現実的な金額です。年36万円で、30年続けると元本だけで1,080万円になります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">360万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">419万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">465万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">519万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">720万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">985万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,233万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,558万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,080万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,749万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,498万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,622万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        利回り7%・30年で3,600万円超え。元本の約3.4倍です。利回り3%でも1,749万円なので、元本の1.6倍は確保できる計算になります。利回りの想定でここまで変わるのが複利の特徴で、だからこそ「どの利回りで考えるか」を慎重に決めることが重要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月5万円積み立てた場合</h2>
      <p>
        手取り30万円前後の人が「収入の15〜20%を投資に回す」ことを目標にしたときの金額です。年60万円で、20年間続けると元本だけで1,200万円。新NISAのつみたて枠（年120万円）の半分を使う計算です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">699万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">776万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">866万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,642万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,055万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,597万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,916万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,163万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">6,037万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月5万円・30年で元本ちょうど1,800万円。これは新NISAの非課税保有限度額と同じ金額です。つまり月5万円を30年続けると、ちょうど枠を使い切れる計算になります。利回り5%なら4,163万円で、運用益だけで2,363万円。これが全額非課税なのが新NISAの最大のメリットです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月7万円積み立てた場合</h2>
      <p>
        手取り35〜40万円台で「もう少し積極的に積み立てたい」という人向けです。年84万円で、15年で元本が1,260万円になります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">840万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">979万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,086万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,212万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,680万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,299万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,877万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,636万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">21年5ヶ月後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-400">非課税枠上限</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-400">非課税枠上限</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-400">非課税枠上限</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月7万円だと約21年5ヶ月で非課税枠1,800万円を使い切ります。その後は課税口座で続けるか、枠が復活した分に追加投資するかを考える必要があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月10万円積み立てた場合</h2>
      <p>
        新NISAのつみたて投資枠（年120万円）をほぼ満額使うパターンです。15年で非課税枠を使い切り、その後は枠の復活分に追加するか課税口座を活用することになります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利回り7%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">10年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,398万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,551万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,731万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,283万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,110万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">5,194万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年後</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3,600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">5,832万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">8,325万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1億2,073万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        月10万円・利回り7%・30年で1億2,000万円超え。元本3,600万円が3.4倍になる計算です。ただしこれは非課税枠（1,800万円）を超えた分は課税口座になるため、実際にはNISA枠内外を分けて考える必要があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>非課税メリットを金額で確認する</h2>
      <p>
        シミュレーションの数字が大きくなると「でも税金は関係ないよね？NISA使ってるから」と思いがちですが、NISA非課税の価値を具体的な金額で確認しておきましょう。
      </p>
      <p>
        月5万円・利回り5%・30年のケースで比較します。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">口座の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">30年後の資産</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">税金</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手元に残る金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">新NISA</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,163万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">4,163万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">課税口座（特定口座）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">4,163万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約473万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3,690万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        同じ積立・同じ利回りでも、30年後に約470万円の差が生まれます。これが新NISAを使う最大の理由です。
      </p>
      <p>
        さらに課税口座の場合、毎年の配当・分配金にも20.315%の税金がかかるため、実質的な差はもう少し大きくなります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>始める年齢によってどれだけ変わるか</h2>
      <p>
        「もう35歳だから遅いかな」と思う人もいますが、実際にはそんなことはありません。月5万円・利回り5%で開始年齢別に比較してみます。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">開始年齢</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">65歳時の資産（利回り5%）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">25歳</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">40年</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約7,604万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30歳</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">35年</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">2,100万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約5,743万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">35歳</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">30年</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約4,163万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">40歳</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">25年</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約2,955万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">45歳</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">20年</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約2,055万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        25歳と45歳で比べると最終資産に大きな差がありますが、45歳から始めても20年で2,000万円を超えます。「遅すぎる」ということはなく、始めるなら早いほどいいですが、今日始めることが常に最善です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>積立額の選び方：現実的な目安</h2>
      <p>
        よく言われる目安は「手取りの20〜30%を積立に回す」ですが、これはあくまで参考値です。家賃・子育て・奨学金返済などの固定費によって、現実的な積立額は人によって全然違います。
      </p>
      <p>
        大事なのは「継続できる金額」を選ぶことです。月10万円を1年で諦めるより、月3万円を10年続けるほうが圧倒的に有利です。
      </p>
      <p>
        一つの考え方として、「生活費の6ヶ月分の現金を手元に残してから、余剰分を積立に回す」というアプローチがあります。緊急資金なしで積立だけ増やすと、いざというとき売却を強いられます。暴落時に売ることが最もパフォーマンスを悪化させます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>暴落したときにどうするか</h2>
      <p>
        積立投資で最も重要なのは、暴落時に売らないことです。これだけで結果がほぼ決まると言っても過言ではありません。
      </p>
      <p>
        2020年3月のコロナショック時、S&P500は約34%下落しました。月5万円積み立てていた人が半年で約100万円含み損を抱えた計算です。このタイミングで積立を止めた人、あるいは売ってしまった人は、その後の急回復（6ヶ月で全値戻し）を取り込めませんでした。
      </p>
      <p>
        暴落中は「ドルコスト平均法」の効果が最大化されます。同じ1万円で、価格が下がった分だけ多くの口数を買えるからです。長期でシミュレーションした数字の中には、数回の大きな暴落と回復が織り込まれています。暴落は計画の一部だと思っておくことが重要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAで買える商品の選び方</h2>
      <p>
        つみたて投資枠で買える商品は、金融庁の基準を満たした低コストのインデックスファンドに限定されています。選択肢としてよく比較されるのは以下の2つです。
      </p>
      <ul className="space-y-2">
        <li><strong>全世界株式インデックス（オルカン）</strong>：47カ国・約2,800銘柄に分散。日本を含む全世界に1本で投資できる。信託報酬は年0.05〜0.06%程度。</li>
        <li><strong>米国株式インデックス（S&P500）</strong>：米国の代表的な500社に投資。過去30年の実績は年率9〜10%。信託報酬は年0.09〜0.1%程度。</li>
      </ul>
      <p>
        どちらが正解かは誰にもわかりません。「全世界に分散したい」ならオルカン、「米国の成長に賭けたい」ならS&P500、というシンプルな基準で選ぶ人が多いです。どちらを選んでも、長期で積み立て続けることのほうがはるかに重要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAのよくある誤解</h2>
      <h3>「非課税枠は使い切らないといけない」は誤解</h3>
      <p>
        1,800万円の非課税枠は義務ではありません。自分のペースで使えばいいだけです。月5万円で30年かければちょうど1,800万円になります。無理して満額を追う必要はありません。
      </p>
      <h3>「NISA口座は1人1口座だけ」</h3>
      <p>
        正確には「同時に複数の金融機関でNISA口座を持てない」ということです。1年に1度は金融機関を変更できます。使いやすい証券会社を選びましょう。
      </p>
      <h3>「売却すると非課税枠が消える」は旧NISAの話</h3>
      <p>
        新NISAでは売却した分の枠が翌年に復活します（ただし翌年以降で、即時ではありません）。旧つみたてNISAと違う重要な変更点です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自分の数字で計算してみる</h2>
      <p>
        積立額・年数・利回り・開始時点の保有資産を自分の条件で入力して試算したい場合は、新NISA積立計算ツールを使ってみてください。複数パターンを並べて比較することもできます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事のシミュレーション結果は参考値です。実際の運用成績は将来を保証するものではありません。投資判断はご自身の責任でお願いします。
      </div>
    </BlogLayout>
  );
}
