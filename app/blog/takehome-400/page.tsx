import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { TakehomeClusterNav } from "../_components/TakehomeClusterNav";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("takehome-400")!;

export const metadata: Metadata = generateMeta({
  title: "年収400万円の手取りは月26万円（年318万）｜税金内訳・生活費シミュレーション【2026年版】",
  description: "年収400万円の手取りは年間約318万円・月26.5万円。所得税8万・住民税16万・社会保険料58万の内訳を解説。東京一人暮らし・地方別の生活費シミュレーション、ふるさと納税・iDeCoの節税効果も。",
  path: `/blog/${post.slug}`,
  keywords: ["年収400万 手取り いくら", "手取り 400万 月収", "年収400万 税金 内訳", "400万 手取り 2026", "年収400万 住民税 いくら"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収400万円の手取りはいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収400万円の手取りは年間約318万円（月平均26.5万円）が目安です。所得税約8万円・住民税約16万円・社会保険料約58万円の合計約82万円が控除されます。家族構成・加入する健康保険・各種控除により実際の金額は変わります。" },
    },
    {
      "@type": "Question",
      name: "年収400万円の月収（手取り）はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "月の手取りは約26.5万円が目安です。ボーナスがある場合は月の基本給手取りが少なくなり、ボーナス月に多くもらう形になります。ボーナスが年収の25〜30%の場合、月の基本給手取りは約22〜24万円程度になります。" },
    },
    {
      "@type": "Question",
      name: "年収400万円の住民税はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収400万円（独身・会社員）の住民税は概算で約16万円（月約1.3万円）です。住民税は前年の所得をもとに翌年6月から引かれます。所得税（約8万円）と合わせた税負担は年間約24万円です。" },
    },
    {
      "@type": "Question",
      name: "年収400万円で東京一人暮らしはできますか？",
      acceptedAnswer: { "@type": "Answer", text: "月手取り26.5万円での東京一人暮らしはできますが余裕は多くありません。家賃8〜10万円を払うと残りが16〜18万円となり、食費・光熱費・通信費を払うと貯蓄は月3〜5万円程度になります。地方（家賃5〜6万円）なら月10〜15万円の余裕が生まれます。" },
    },
    {
      "@type": "Question",
      name: "年収400万円から節税する方法はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "主な節税方法は①ふるさと納税（独身の場合の上限目安は約4.2万円）②iDeCo（月2.3万円まで全額所得控除・年収400万円の税率で年約3〜4万円の節税）③新NISAで運用益を非課税にすること の3つです。ふるさと納税は2,000円の自己負担で食品・日用品などの返礼品を受け取れます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収400万円台になったとき、給与明細の控除欄をきちんと計算してみました。毎月6.8万円が引かれており、年間82万円。「思ったより少ない」という感覚の正体はここにありました。年収400万円の手取りは<strong>約318万円（月26.5万円）</strong>が目安です。日本の給与所得者に最も多い年収帯の控除内訳と、生活費シミュレーション、節税方法を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収400万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "400万円"],
              ["手取り年収（概算）", "約318万円"],
              ["月額手取り（概算）", "約26.5万円"],
              ["控除合計", "約82万円"],
              ["手取り率", "約79.5%"],
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
        ※独身・会社員・東京都在住・ボーナス2ヶ月分想定の概算値です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の内訳（年収400万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約20万円", "約1.7万円"],
              ["厚生年金保険料", "約36万円", "約3.0万円"],
              ["雇用保険料", "約2.4万円", "約0.2万円"],
              ["社会保険料 合計", "約58万円", "約4.8万円"],
              ["所得税", "約8万円", "約0.7万円"],
              ["住民税", "約16万円", "約1.3万円"],
              ["控除 合計", "約82万円", "約6.8万円"],
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

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月手取り26.5万円で生活できる？</h2>

      <h3>一人暮らし（地方都市）の場合</h3>
      <p>
        地方都市（家賃5〜7万円程度）なら月26.5万円の手取りで十分生活でき、毎月5〜8万円の貯蓄も可能です。新NISAの積立（月2〜3万円）を始めるには十分な水準です。
      </p>

      <h3>東京一人暮らしの場合</h3>
      <p>
        東京（家賃8〜10万円）だと固定費が月17〜19万円になりやすく、残りは7〜9万円程度。節約を意識すれば貯蓄は可能ですが、余裕はあまり多くありません。
      </p>

      <h3>パートナーと同居・共働きの場合</h3>
      <p>
        共働きで2人の手取りが合計50〜60万円以上になれば、東京でも貯蓄・住宅購入の資金作りがしやすくなります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収400万円から手取りを増やす方法</h2>
      <ul className="space-y-2">
        <li><strong>ふるさと納税</strong>：年収400万・独身の場合の寄附上限の目安は約4.2万円。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で上限を確認できます。</li>
        <li><strong>iDeCo</strong>：月2.3万円まで掛金が全額所得控除。年収400万円なら年間3〜4万円の節税効果があります。</li>
        <li><strong>新NISA</strong>：投資利益・配当が非課税。月1万円からでもコツコツ積み立てが可能です。<Link href="/tools/nisa-calculator">NISAシミュレーターで試算する</Link></li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li>年収400万円の手取り：<strong>約318万円（月26.5万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）— 年収400万より75万円多い</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）— 年収400万より144万円多い</li>
      </ul>
      <p>
        全年収の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>で確認できます。
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 年収400万円台での節税実感</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          年収400万円台でまずやってよかったのはふるさと納税です。上限約4万円分を食品（米・肉）に使うと、翌年の住民税が約4万円減額されます。実質2,000円の出費でそれだけ戻ってくる体験は一度やると毎年続けたくなります。iDeCoは月1万円から始めて、年間3〜4万円の節税効果を確認しました。手取りを増やすより「引かれる額を減らす」ほうが即効性がある年収帯だと思います。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
      <TakehomeClusterNav current={400} />
    </BlogLayout>
    </>
  );
}
