import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("takehome-300")!;

export const metadata: Metadata = generateMeta({
  title: "年収300万円の手取りは月20万円（年243万）｜税金内訳・生活費シミュレーション【2026年版】",
  description: "年収300万円の手取りは年間約243万円・月20.3万円。所得税5万・住民税8万・社会保険料44万の内訳を解説。東京一人暮らし・地方別の生活費シミュレーション、ふるさと納税・iDeCoの節税効果も。",
  path: `/blog/${post.slug}`,
  keywords: ["年収300万 手取り いくら", "年収300万 月収 手取り", "年収300万 税金 内訳", "300万 手取り 2026", "年収300万 一人暮らし きつい 余裕"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収300万円の手取りはいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収300万円の手取りは年間約243万円（月平均20.3万円）が目安です。所得税約5万円・住民税約8万円・社会保険料約44万円の合計約57万円が控除されます。家族構成・加入する健康保険・各種控除により実際の金額は変わります。" },
    },
    {
      "@type": "Question",
      name: "年収300万円の月収（手取り）はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "月の手取りは約20.3万円が目安です。ボーナスがある場合は月収が少なくなりボーナス月に多くもらう形になります。ボーナスなしの月給のみの場合、毎月ほぼ均等に20万円前後が手取りになります。" },
    },
    {
      "@type": "Question",
      name: "年収300万円で東京での一人暮らしはできますか？",
      acceptedAnswer: { "@type": "Answer", text: "月手取り20.3万円での東京一人暮らしはかなり厳しいです。家賃8〜10万円を払うと残りが10〜12万円となり、食費・光熱費・通信費などで使い切ってしまい貯蓄が難しくなります。地方（家賃5〜6万円）なら月6〜9万円の余裕が生まれます。" },
    },
    {
      "@type": "Question",
      name: "年収300万円の住民税はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収300万円（独身・会社員）の住民税は概算で約8万円（月約0.7万円）です。住民税は前年の所得をもとに翌年6月から引かれます。所得税（約5万円）と合わせた税負担は年間約13万円です。" },
    },
    {
      "@type": "Question",
      name: "年収300万円から節税する方法はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "主な節税方法は①ふるさと納税（独身の場合の上限目安は約2.8万円・実質2,000円で特産品を受け取れる）②iDeCo（月2.3万円まで全額所得控除・年収300万円の10%税率で年約2〜3万円の節税）の2つです。年収300万円台は税率が低いためiDeCoより副業・スキルアップで収入を増やすことも有効です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        社会人1〜2年目、手取り20万円で一人暮らしを始めたとき、給与明細の控除欄を見て「思ったより少ない」と感じた記憶があります。年収300万円の手取りは<strong>約243万円（月20.3万円）</strong>が目安です。控除57万円の内訳と、東京・地方別の生活費シミュレーション、節税方法を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収300万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "300万円"],
              ["手取り年収（概算）", "約243万円"],
              ["月額手取り（概算）", "約20.3万円"],
              ["控除合計", "約57万円"],
              ["手取り率", "約81%"],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 font-medium text-slate-700 dark:text-zinc-300 w-1/2">{label}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・会社員・東京都在住・ボーナス2ヶ月分想定の概算値です。加入する健康保険組合・家族構成により異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の内訳（年収300万円・独身の場合）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額換算</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["健康保険料（本人負担分）", "約14万円", "約1.2万円"],
              ["厚生年金保険料", "約27万円", "約2.3万円"],
              ["雇用保険料", "約1.8万円", "約0.2万円"],
              ["社会保険料 合計", "約44万円", "約3.7万円"],
              ["所得税", "約5万円", "約0.4万円"],
              ["住民税", "約8万円", "約0.7万円"],
              ["控除 合計", "約57万円", "約4.8万円"],
            ].map(([type, annual, monthly], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium" : ""}`}>{type}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium text-rose-600 dark:text-rose-400" : ""}`}>{annual}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        年収300万円帯は手取り率が<strong>約81%</strong>と比較的高い水準です。年収が上がるほど累進課税により手取り率は下がっていきます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月手取り20.3万円の生活費シミュレーション</h2>

      <h3>一人暮らし（地方・家賃5〜6万円）の場合</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額目安</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["家賃（地方・1K）", "5〜6万円"],
              ["食費", "3〜4万円"],
              ["光熱費・通信費", "1.5〜2万円"],
              ["交通費・保険等", "1〜2万円"],
              ["固定費 合計", "10.5〜14万円"],
              ["残り（貯蓄・趣味）", "6〜9.8万円"],
            ].map(([item, cost], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        地方在住であれば月6〜10万円の余裕を作れます。東京で一人暮らしの場合は家賃8〜10万円になり、余裕が月2〜5万円程度に縮小します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収300万円から手取りを増やす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：年収300万・独身の場合の寄附上限の目安は約2.8万円。実質2,000円の自己負担で特産品がもらえます。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で正確な上限を確認できます。
        </li>
        <li>
          <strong>iDeCo（個人型確定拠出年金）</strong>：会社員の場合、月2.3万円まで所得控除。年収300万円の税率は10%のため、年間約2〜3万円の節税効果があります。
        </li>
        <li>
          <strong>副業・スキルアップ</strong>：年収300万円台は収入自体を増やすことが最も効果的です。副業収入は年20万円以下なら確定申告不要です。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収300万円からのNISA積立シミュレーション</h2>
      <p>
        月手取り20.3万円から少額でも積み立てを始めることが大切です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月の積立額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">10年後（年利5%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">20年後（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月1万円", "約155万円", "約411万円"],
              ["月2万円", "約311万円", "約822万円"],
              ["月3万円", "約466万円", "約1,233万円"],
            ].map(([amount, y10, y20], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y10}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y20}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        月1万円からでも20年で約411万円になります。新NISAのつみたて投資枠（年120万円まで非課税）を活用することで、運用益にかかる約20%の税金がゼロになります。詳しくは<Link href="/blog/nisa-monthly-simulation">新NISA積立シミュレーション</Link>をご覧ください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li>年収300万円の手取り：<strong>約243万円（月20.3万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-400">年収400万円の手取り</Link>：約318万円（月26.5万円）— 年収300万より75万円多い</li>
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）</li>
      </ul>
      <p>
        年収全体の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>でまとめて確認できます。
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 手取り20万円生活でやってみてよかったこと</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          手取り20万円で東京一人暮らしをしていた頃、毎月ほぼ使い切っていました。転機になったのはふるさと納税を始めたこと。年収300万円だと上限約2.8万円と少額ですが、お米や日用品に使えば実質的に食費が下がります。iDeCoは月5,000円から始めて所得控除の感覚を学ぶだけでも価値がありました。副業（クラウドソーシングで月2〜3万円）と組み合わせてようやく少額の積立ができた感じです。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
    </BlogLayout>
    </>
  );
}
