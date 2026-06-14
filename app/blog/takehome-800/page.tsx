import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { TakehomeClusterNav } from "../_components/TakehomeClusterNav";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("takehome-800")!;

export const metadata: Metadata = generateMeta({
  title: "年収800万円の手取りは月49万円（年589万）｜税金211万の内訳・節税方法【2026年版】",
  description: "年収800万円の手取りは年間約589万円・月49.1万円。所得税65万・住民税38万・社会保険料108万、控除211万円の詳細を解説。独身と家族持ちの生活費シミュレーション、ふるさと納税・iDeCoの節税効果も。",
  path: `/blog/${post.slug}`,
  keywords: ["年収800万 手取り いくら", "年収800万 月収 手取り", "年収800万 税金 内訳", "800万 手取り 2026", "年収800万 節税 iDeCo ふるさと納税"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収800万円の手取りはいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収800万円の手取りは年間約589万円（月平均49.1万円）が目安です。所得税約65万円・住民税約38万円・社会保険料約108万円の合計約211万円が控除されます。家族構成・加入する健康保険・各種控除により実際の金額は変わります。" },
    },
    {
      "@type": "Question",
      name: "年収800万円の月収（手取り）はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "月の手取りは約49.1万円が目安です。ボーナスがある場合、基本給の月手取りはボーナス比率によって変わります。ボーナスが年収の30%を占める場合、月の基本給手取りは約41〜43万円程度になります。" },
    },
    {
      "@type": "Question",
      name: "年収800万円と700万円の手取りの差はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収700万円の手取り（約528万円）と比べると、年収800万円（約589万円）は年間約61万円多い計算です。ただし所得税の税率が高い区間にかかるため、額面の差100万円に対して手取りの差は61万円と61%になります。" },
    },
    {
      "@type": "Question",
      name: "年収800万円の所得税はなぜ高いのですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収800万円では課税所得が695万円超の部分に23%の所得税率が適用されます。年収700万円に比べて所得税が約32万円増えており、高い所得税率のブラケットにかかっています。iDeCoやふるさと納税を使うことで課税所得を下げ、節税効果が大きく出る年収帯です。" },
    },
    {
      "@type": "Question",
      name: "年収800万円から節税する方法はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "主な節税方法は①ふるさと納税（年収800万・独身で年12〜13万円が上限目安）②iDeCo（月2.3万円まで全額所得控除・年約6〜7万円節税）③住宅ローン控除（年末残高の0.7%を最大13年間税額控除）の3つです。年収800万円台は所得税率23%が適用されるため節税の効果が特に大きい年収帯です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収800万円の給与明細を初めて見たとき、控除欄の合計が211万円という数字に目を疑いました。特に所得税が65万円と年収700万円台から一気に跳ね上がっており、税率の壁を実感しました。年収800万円の手取りは<strong>約589万円（月49.1万円）</strong>が目安です。控除211万円の内訳と節税・FIRE積立の戦略を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収800万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "800万円"],
              ["手取り年収（概算）", "約589万円"],
              ["月額手取り（概算）", "約49.1万円"],
              ["控除合計", "約211万円"],
              ["手取り率", "約73.6%"],
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
      <h2>控除の内訳（年収800万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約39万円", "約3.3万円"],
              ["厚生年金保険料", "約65万円", "約5.4万円"],
              ["雇用保険料", "約4万円", "約0.3万円"],
              ["社会保険料 合計", "約108万円", "約9万円"],
              ["所得税", "約65万円", "約5.4万円"],
              ["住民税", "約38万円", "約3.2万円"],
              ["控除 合計", "約211万円", "約17.6万円"],
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
        年収800万円では所得税が<strong>65万円</strong>と大きく跳ね上がります。これは課税所得が695万円超で所得税率23%が適用されるためです。節税対策の効果が最も出やすい年収帯でもあります。
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
              ["独身", "約589万円", "—"],
              ["配偶者あり（専業主婦・収入なし）", "約608万円", "+約19万円"],
              ["配偶者＋子ども1人（16歳未満）", "約608万円", "+約19万円"],
              ["配偶者＋子ども1人（高校生以上）", "約619万円", "+約30万円"],
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
      <h2>年収800万円から手取りを増やす節税方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：年収800万・独身の場合の寄附上限の目安は約12〜13万円。税率が高いほど控除効果が大きくなります。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で正確な上限を確認できます。
        </li>
        <li>
          <strong>iDeCo</strong>：月2.3万円（年27.6万円）まで全額所得控除。年収800万円の限界税率23%なら年間約6〜7万円の節税効果。老後資金を積み立てながら節税できます。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：年収800万円台であれば所得税から最大28万円（年末残高4,000万円×0.7%）の控除が受けられます。
        </li>
        <li>
          <strong>生命保険料控除・医療費控除</strong>：生命保険・個人年金・介護保険に加入していると最大12万円の所得控除が追加されます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収800万円からのFIRE・資産形成シミュレーション</h2>
      <p>
        月手取り49.1万円は積極的な資産形成が可能な水準です。
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
              ["月15万円", "約3,982万円", "約6,166万円"],
              ["月20万円", "約5,310万円", "約8,221万円"],
              ["月25万円（NISA上限）", "約6,637万円", "約1億276万円"],
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
        月20万円積み立てると15年で約5,310万円。FIREの目安となる「年間生活費の25倍」（月20万円の生活費なら6,000万円）に近い水準です。新NISAの詳細は<Link href="/blog/nisa-monthly-simulation">新NISA積立シミュレーション</Link>、FIRE達成年数は<Link href="/tools/fire-simulator">FIREシミュレーター</Link>で計算できます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）</li>
        <li><Link href="/blog/takehome-700">年収700万円の手取り</Link>：約528万円（月44万円）</li>
        <li>年収800万円の手取り：<strong>約589万円（月49.1万円）← このページ</strong></li>
      </ul>
      <p>
        年収全体の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>でまとめて確認できます。
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 年収800万円台で節税してみて気づいたこと</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          この年収帯で一番インパクトがあったのは、ふるさと納税の上限額が思ったより大きかったことです。独身で約12〜13万円まで寄附できるので、米・肉・魚介などをまとめて選んで食費を実質カットしました。iDeCoは掛金が全額所得控除になるため、年収800万円台の23%税率で計算すると月2.3万円の掛金で年間約6万円以上の節税になります。住宅ローン控除と合わせると年間10万円以上の節税になり、手取りを実質的に増やす感覚でした。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
      <TakehomeClusterNav current={800} />
    </BlogLayout>
    </>
  );
}
