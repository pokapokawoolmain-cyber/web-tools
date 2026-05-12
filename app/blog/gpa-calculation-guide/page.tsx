import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("gpa-calculation-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["GPA 計算方法", "GPA 就活 影響", "大学 GPA 上げ方", "GPA 3.0 レベル", "成績 GPA 換算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        就活で「GPAを教えてください」と言われて戸惑った経験はありませんか？GPAの計算方法と、就活での重要度、効率的な上げ方を解説します。
      </p>

      <h2>GPAとは</h2>
      <p>
        GPA（Grade Point Average）は大学の成績を数値化した指標です。4.0満点が一般的で、各科目の成績を点数化して単位数で加重平均した値です。
      </p>

      <h2>GPAの計算方法</h2>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 font-mono text-sm">
        GPA ＝ Σ（成績点 × 単位数）÷ 総単位数
      </div>

      <h3>一般的な成績点の対応</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">成績</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">点数（一般的）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">点数（5段階）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["S・秀（90〜100点）", "4.0", "5.0"],
              ["A・優（80〜89点）", "3.0〜4.0", "4.0"],
              ["B・良（70〜79点）", "2.0〜3.0", "3.0"],
              ["C・可（60〜69点）", "1.0〜2.0", "2.0"],
              ["D・不可（60点未満）", "0", "0〜1.0"],
            ].map(([grade, pt4, pt5], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{grade}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt4}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※大学によって評価基準が異なります。自分の大学の評価規定を確認してください。
      </p>

      <h3>計算例</h3>
      <p>
        英語（2単位・A=3.5）、統計学（4単位・B=2.5）、経済学（4単位・S=4.0）の場合：
      </p>
      <p className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 text-sm font-mono">
        GPA ＝（3.5×2 ＋ 2.5×4 ＋ 4.0×4）÷（2＋4＋4）＝ 33 ÷ 10 ＝ 3.3
      </p>

      <h2>就活でGPAはどのくらい重要か</h2>
      <p>
        企業によって重要度は大きく異なります。
      </p>
      <ul>
        <li><strong>外資系・コンサル・金融</strong>：GPA3.0〜3.5以上を条件にしている企業が多い</li>
        <li><strong>日系大手</strong>：参考程度に聞く場合が多いが、低すぎると印象が悪くなることも</li>
        <li><strong>ベンチャー・中小企業</strong>：あまり重視しない傾向、むしろ経験・ポテンシャル重視</li>
        <li><strong>大学院進学</strong>：研究室の選択やGS入学に影響することが多い</li>
      </ul>

      <h2>GPAを効率的に上げる方法</h2>
      <ul>
        <li><strong>単位数の多い必修科目で高成績を狙う</strong>：GPA計算では単位数が大きいほど影響が大きい</li>
        <li><strong>不可・再履修を避ける</strong>：0点科目はGPAを大きく引き下げる</li>
        <li><strong>苦手科目の授業は積極的に質問・補講を活用</strong>：授業態度や出席が評価に含まれる場合も多い</li>
        <li><strong>先輩から過去問・レポートの傾向を把握する</strong>：試験の特徴を知ることで対策しやすくなる</li>
      </ul>

      <h2>GPAを計算する</h2>
      <p>
        履修している全科目の成績と単位数を入力してGPAを自動計算したい場合は<Link href="/tools/gpa">GPA計算ツール</Link>を使ってみてください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">大学によって計算方法が異なります</strong>
        成績点の割り当て方や計算方法は大学ごとに異なります。就活でGPAを提出する際は、自分の大学の成績証明書に記載の計算方式を確認してください。
      </div>
    </BlogLayout>
  );
}
