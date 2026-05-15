import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("nisa-ideco-compare")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["新NISA iDeCo 違い 比較", "NISA iDeCo どっちを優先", "iDeCo 節税効果 計算", "新NISA 年間上限 2024", "NISA iDeCo 併用"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「新NISAとiDeCoはどちらを優先すべきか」は投資を始めた人がよく直面する疑問です。どちらも非課税で運用できる制度ですが、仕組みと使い勝手が大きく異なります。
      </p>

      <h2>新NISAとiDeCoの基本的な違い</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">新NISA</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">iDeCo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["年間上限", "360万円（つみたて120万＋成長240万）", "最大81.6万円（職業による）"],
              ["生涯上限", "1,800万円", "なし"],
              ["引き出し", "いつでも可能", "原則60歳まで不可"],
              ["節税タイミング", "運用益が非課税", "掛金が所得控除＋運用益非課税"],
              ["対象者", "18歳以上の日本在住者", "20歳以上（上限年齢は加入資格・雇用形態による）"],
              ["運用商品", "株式・投信等", "投信・定期預金・保険"],
            ].map(([item, nisa, ideco], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{nisa}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{ideco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAを先に始めるべき理由</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        一般的には新NISAから始めることをおすすめします。理由は「いつでも引き出せる」からです。緊急の出費（医療費・転職期間など）が発生したときでも、NISAの資産は売却して現金化できます。iDeCoは60歳まで一切引き出せないため、生活の変化が大きい20〜30代には制約が重く感じられることがあります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iDeCoが特に有利なケース</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        iDeCoの最大の強みは「掛金が全額所得控除になる」点です。課税所得が高い人ほど節税効果が大きくなります。
      </p>
      <ul className="space-y-2">
        <li>年収500万円・月2万円掛金で年間約4〜6万円の節税（所得税率・各控除の状況による）</li>
        <li>30年間積み立てると累積で数十〜100万円超の節税効果も</li>
        <li>退職所得控除・年金控除の優遇により受取時も有利</li>
      </ul>
      <p>
        特に会社員で節税ニーズが高い人、または60歳まで引き出す必要がない余剰資金がある人はiDeCoも積極的に活用する価値があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>両方を使うのが理想</h2>
      <p>
        財政的に余裕があれば、新NISA（つみたて投資枠）＋iDeCoを両方使うのが最も効率的です。優先順位は以下を目安にしてください。
      </p>
      <ol>
        <li>まず生活防衛資金（生活費3〜6ヶ月分）を確保する</li>
        <li>新NISAのつみたて投資枠を埋める（月10万円まで）</li>
        <li>余力があればiDeCoも掛金を設定する</li>
        <li>さらに余力があれば新NISAの成長投資枠を活用する</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAのシミュレーション</h2>
      <p>
        月々の積立額と運用利回りから将来の資産額を試算できます。<Link href="/tools/nisa-calculator">NISAシミュレーターツール</Link>で実際に計算してみてください。また、FIRE（早期リタイア）を視野に入れた資産計画には<Link href="/tools/fire-simulator">FIREシミュレーター</Link>も活用できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">注意事項</strong>
        この記事は一般的な情報提供を目的としています。投資・税務に関する個別の判断については、ファイナンシャルプランナーや税理士にご相談ください。制度の詳細・上限額は変更される場合があります。
      </div>
    </BlogLayout>
  );
}
