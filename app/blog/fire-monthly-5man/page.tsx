import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("fire-monthly-5man")!;

export const metadata: Metadata = generateMeta({
  title: "月5万円積立でFIREは何年かかる？年利別シミュレーション【2026年版】",
  description: "月5万円の積立投資でFIREを達成するには年利5%で約36〜40年かかる試算です。生活費目標別の必要資産額・年数早見表と、達成を早める4つの方法を解説します。",
  path: `/blog/${post.slug}`,
  keywords: ["月5万 積立 FIRE 何年", "月5万円 投資 30年後 いくら", "FIRE 月5万 必要年数 シミュレーション", "積立NISA 月5万 複利", "サイドFIRE 月5万"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "月5万円の積立でFIREは達成できますか？",
      acceptedAnswer: { "@type": "Answer", text: "可能ですが長期間が必要です。生活費月20万円・年利5%のケースでは約40年かかる試算です。積立額を増やす・生活費目標を下げる・副収入を組み合わせる「サイドFIRE」にするなどで現実的な期間に短縮できます。" },
    },
    {
      "@type": "Question",
      name: "月5万円を30年積み立てるといくらになりますか？",
      acceptedAnswer: { "@type": "Answer", text: "元本は1,800万円ですが、年利5%の複利運用では約4,159万円になる試算です。年利7%なら約6,082万円になります。積立期間が長いほど複利の効果が大きくなります。" },
    },
    {
      "@type": "Question",
      name: "FIREに必要な資産額はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "一般的に年間生活費の25倍（4%ルール）が目安です。生活費月20万円（年240万円）なら6,000万円、月15万円（年180万円）なら4,500万円が目標額となります。ただし日本では社会保険料や税金も考慮した設計が必要です。" },
    },
    {
      "@type": "Question",
      name: "月5万円積立をNISAで行うと税金はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "新NISAの成長投資枠・積立投資枠を使えば運用益・分配金が非課税になります。通常は利益の約20%が税金として引かれますが、NISAなら全額手取りになります。月5万円なら年60万円で積立投資枠（年120万円）の範囲内で非課税運用できます。" },
    },
    {
      "@type": "Question",
      name: "月5万円より積立を増やせない場合はどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "サイドFIREという選択肢があります。フルFIRE（完全な労働不要）ではなく、資産収入＋週数日の仕事で生活を成り立たせる方法です。必要資産額を大幅に下げられるため、月5万円積立でも20〜25年で達成できるケースがあります。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        FIREシミュレーターを作りながら「月5万円だとどのくらいかかるんだろう」と自分でも計算してみました。正直なところ、年利5%・生活費月20万円のケースで約40年という数字が出て少し重くなりました。ただ積立額・生活費目標・サイドFIREの組み合わせ次第で現実的な期間まで縮められます。複数シナリオの計算結果をまとめました。
      </p>
      <p className="text-[13px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 my-4">
        投資はリスクを伴います。将来の運用益を保証するものではありません。余裕資金での運用をご検討ください。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">FIREシミュレーターで自分の条件を試算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">目標資産額・積立額・年利を入力して達成年数を確認できます。</p>
        <Link href="/tools/fire-simulator" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          FIREシミュレーターを使う（無料）→
        </Link>
      </div>

      <h2>月5万円積立でFIREに必要な年数（シナリオ別）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">FIRE目標（生活費）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">必要資産額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利7%</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月15万円", "4,500万円", "約44年", "約36年", "約29年"],
              ["月20万円", "6,000万円", "約51年", "約40年", "約32年"],
              ["月25万円", "7,500万円", "約57年", "約44年", "約34年"],
              ["月30万円", "9,000万円", "約62年", "約48年", "約37年"],
            ].map(([goal, assets, r3, r5, r7], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{goal}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{assets}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{r3}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{r5}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-700 dark:text-green-400">{r7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※必要資産額は年間生活費×25倍（4%ルール目安）で算出。税金・社会保険料・インフレは考慮していません。過去の実績が将来の運用成果を保証するものではありません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月5万円積立でのFIRE達成を早める方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>積立額を増やす</strong>：月5万→月10万に倍増すると必要年数が大幅に短縮されます。収入増・支出削減の両輪で積立額を増やしましょう。
        </li>
        <li>
          <strong>新NISAを最大活用する</strong>：年間最大360万円（月30万円）まで非課税で運用できます。<Link href="/tools/nisa-calculator">NISAシミュレーター</Link>で非課税効果を試算できます。
        </li>
        <li>
          <strong>生活費の目標を下げる</strong>：FIRE後の生活費を月20万→15万円にするだけで必要資産額が1,500万円減ります。
        </li>
        <li>
          <strong>サイドFIREも選択肢に</strong>：資産からの収入＋週数日の仕事を組み合わせるサイドFIREなら、必要資産額をさらに低く設定できます。
        </li>
      </ul>

      <h2>月5万円積立の資産推移（年利5%想定）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立年数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">運用後の資産（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["10年", "600万円", "約779万円"],
              ["20年", "1,200万円", "約2,055万円"],
              ["30年", "1,800万円", "約4,159万円"],
              ["35年", "2,100万円", "約5,810万円"],
              ["40年", "2,400万円", "約7,619万円"],
            ].map(([years, principal, assets], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{years}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{principal}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{assets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※年利5%・複利計算の試算値。実際の運用成果は市場状況により異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/fire-how-much-needed">FIREに必要な資産額はいくら？</Link></li>
        <li><Link href="/blog/fire-4percent-rule">FIRE達成後の4%ルールとは？</Link></li>
        <li><Link href="/blog/nisa-fire-strategy">新NISAでFIREを目指す戦略</Link></li>
        <li><Link href="/blog/nisa-monthly-simulation">新NISAの積立シミュレーション</Link></li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 計算してみて気づいたこと</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          月5万円だとフルFIREは厳しいと感じたのが正直なところです。ただ「完全にやめる」ではなく「週2〜3日だけ働く」サイドFIREなら、必要資産額を2,000〜3,000万円に設定できるため月5万円でも20年以内に届く計算になります。あとは新NISAで非課税枠を使い切ることで手取りが増えるので、実質的な達成スピードは上がります。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の試算値は一定の前提条件に基づく参考値です。投資はリスクを伴い、元本が保証されるものではありません。投資判断は自己責任で行い、必要に応じて専門家にご相談ください。
      </div>
    </BlogLayout>
    </>
  );
}
