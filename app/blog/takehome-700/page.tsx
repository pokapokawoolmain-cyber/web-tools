import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { TakehomeClusterNav } from "../_components/TakehomeClusterNav";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("takehome-700")!;

export const metadata: Metadata = generateMeta({
  title: "年収700万円の手取りは月44万円（年528万）｜税金内訳・生活レベル解説【2026年版】",
  description: "年収700万円の手取りは年間約528万円・月44万円。所得税33万・住民税40万・社会保険料99万の内訳を解説。独身・家族持ちの生活シミュレーション、iDeCo・ふるさと納税の節税効果も。",
  path: `/blog/${post.slug}`,
  keywords: ["年収700万 手取り いくら", "年収700万 月収 手取り", "年収700万 税金 内訳", "700万 手取り 2026", "年収700万 生活 きつい 余裕"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収700万円の手取りはいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収700万円の手取りは年間約528万円（月平均44万円）が目安です。所得税約33万円・住民税約40万円・社会保険料約99万円の合計約172万円が控除されます。家族構成・加入する健康保険・各種控除により実際の金額は変わります。" },
    },
    {
      "@type": "Question",
      name: "年収700万円の月収（手取り）はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "月の手取りは約44万円が目安です。ただしボーナスがある場合は月収は少なくなり、ボーナス月に多くもらう形になります。ボーナスが年収の30%を占める場合、月の基本給手取りは約36〜38万円程度になります。" },
    },
    {
      "@type": "Question",
      name: "年収700万円の所得税はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収700万円（独身・会社員）の所得税は概算で約33万円です。給与所得控除・基礎控除・社会保険料控除を差し引いた後の課税所得に対して、23%の税率が適用される部分が生じます。" },
    },
    {
      "@type": "Question",
      name: "年収700万円は生活に余裕がありますか？",
      acceptedAnswer: { "@type": "Answer", text: "独身であれば月44万円の手取りで十分な余裕があります。東京でも家賃15〜20万円・生活費15万円で月10万円以上を貯蓄や投資に回せます。家族持ちの場合は教育費・住宅ローンなどで余裕感が変わります。" },
    },
    {
      "@type": "Question",
      name: "年収700万円から節税する方法はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "主な節税方法は①iDeCo（月2.3万円まで全額所得控除・年約6〜7万円の節税）②ふるさと納税（年約10〜11万円が上限目安・2,000円の自己負担で返礼品）③住宅ローン控除（年末残高の0.7%が最大13年間税額控除）の3つが効果的です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収700万円に上がったとき、初めて給与明細の控除欄をきちんと計算してみて驚きました。毎月14万円以上が引かれていて、手取りに換算すると年間172万円近く。税金と社会保険でそれだけ消えているとは思っていませんでした。年収700万円の手取りは<strong>約528万円（月44万円）</strong>が目安です。控除の内訳と、独身・家族持ちの生活シミュレーション、節税効果まで解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収700万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "700万円"],
              ["手取り年収（概算）", "約528万円"],
              ["月額手取り（概算）", "約44万円"],
              ["控除合計", "約172万円"],
              ["手取り率", "約75.4%"],
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
      <h2>控除の内訳（年収700万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約35万円", "約2.9万円"],
              ["厚生年金保険料", "約60万円", "約5万円"],
              ["雇用保険料", "約4万円", "約0.3万円"],
              ["社会保険料 合計", "約99万円", "約8.3万円"],
              ["所得税", "約33万円", "約2.8万円"],
              ["住民税", "約40万円", "約3.3万円"],
              ["控除 合計", "約172万円", "約14.3万円"],
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
        年収700万円では所得税と住民税を合わせて<strong>約73万円</strong>の税負担があります。年収500万円（約33万円）から約40万円増えます。所得税の限界税率は23%です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>家族構成による手取りの変化</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["独身", "約528万円", "—"],
              ["配偶者あり（専業主婦・収入なし）", "約545万円", "+約17万円"],
              ["配偶者＋子ども1人（16歳未満）", "約545万円", "+約17万円"],
              ["配偶者＋子ども1人（高校生以上）", "約554万円", "+約26万円"],
            ].map(([family, income, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{family}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-700 dark:text-green-400">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月手取り44万円の生活費シミュレーション</h2>
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
              ["家賃（東京・1LDK〜2LDK）", "10〜15万円"],
              ["食費", "5〜7万円"],
              ["光熱費・通信費", "2〜3万円"],
              ["保険・交通費等", "2〜3万円"],
              ["固定費 合計", "19〜28万円"],
              ["残り（貯蓄・趣味・投資）", "16〜25万円"],
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
        東京で一人暮らしでも毎月16〜25万円の余裕があります。新NISAの積立（月10万円）と十分な生活費・貯蓄を同時に確保できる水準です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収700万円からのFIRE・資産形成シミュレーション</h2>
      <p>
        月44万円の手取りはFIREを目指すうえで有利な水準です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月の積立額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">15年後（年利5%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">20年後（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月10万円", "約2,655万円", "約4,110万円"],
              ["月15万円", "約3,982万円", "約6,166万円"],
              ["月20万円", "約5,310万円", "約8,221万円"],
            ].map(([amount, y15, y20], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y15}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y20}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        月15〜20万円を積み立てると15〜20年でFIRE圏内の4,000〜6,000万円に届きます。新NISAの生涯非課税枠1,800万円（年360万円・月30万円が上限）を先に使い切る戦略が有効です。詳しくは<Link href="/blog/nisa-monthly-simulation">新NISA積立シミュレーション</Link>と<Link href="/tools/fire-simulator">FIREシミュレーター</Link>をご利用ください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収700万円から手取りを増やす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：年収700万・独身の場合の寄附上限の目安は約10〜11万円。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で正確な上限を確認できます。
        </li>
        <li>
          <strong>iDeCo</strong>：月2.3万円（年27.6万円）まで全額所得控除。年収700万円の限界税率23%なら年間約6〜7万円の節税効果です。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：マイホーム購入時に最大13年間、年末ローン残高の0.7%が税額から直接控除されます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）</li>
        <li>年収700万円の手取り：<strong>約528万円（月44万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-800">年収800万円の手取り</Link>：約589万円（月49.1万円）— 年収700万より61万円多い</li>
      </ul>
      <p>
        年収全体の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>でまとめて確認できます。
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 節税を実際にやってみた結果</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          年収700万円台のときに試した節税で一番効いたのはふるさと納税とiDeCoの組み合わせでした。ふるさと納税の上限が約10〜11万円で、実質2,000円で米や肉を受け取りながら住民税が翌年まるっと減額される感覚は想像より大きかったです。iDeCoは月2.3万円を掛けて年間約6万円ほど所得税・住民税が減りました。どちらも手続きさえ済ませれば自動的に節税が続くので、やらない理由がありません。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
      <TakehomeClusterNav current={700} />
    </BlogLayout>
    </>
  );
}
