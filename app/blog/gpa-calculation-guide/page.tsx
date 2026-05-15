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
  keywords: ["GPA とは", "GPA 平均", "GPA 計算方法", "GPA 就活 目安", "GPA どれくらい"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        <strong>GPAとは</strong>大学の成績を数値化した指標（Grade Point Average）で、<strong>4.0満点</strong>が一般的です。日本の大学のGPA平均は<strong>2.5〜3.0前後</strong>。就活で「GPAはどれくらいですか？」と聞かれた時の答え方から計算方法・上げ方まで解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分のGPAを今すぐ計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">科目・単位数・成績を入力するだけで自動計算。就活の準備に活用してください。</p>
        <Link href="/tools/gpa" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          GPA計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>GPAとは</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        GPA（Grade Point Average）は各科目の成績を点数化し、単位数で加重平均した値です。<strong>4.0満点</strong>が最も一般的で、S・A・B・C・D（不可）の成績をそれぞれ4・3〜3.5・2〜2.5・1〜1.5・0点に換算して計算します。大学・学部・学年を問わず同じ基準で学力水準を比較できるため、就職活動や大学院進学の際に使われます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>日本の大学のGPA平均はどれくらい？</h2>
      <p>
        大学や学部によって差がありますが、日本の大学生のGPA平均の目安は以下のとおりです。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">GPAの水準</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">どれくらいの学生か</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">就活・進学での評価</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["3.5〜4.0", "上位5〜10%程度。ほぼ全科目でA以上", "外資・コンサルで強い武器になる"],
              ["3.0〜3.5", "上位20〜30%程度。A・B中心", "外資・金融の足切り通過ライン目安"],
              ["2.5〜3.0（平均的）", "中間層。B中心でCも混在", "多くの日系企業では問題なし"],
              ["2.0〜2.5", "やや低め。B・C混在", "大学院進学に影響が出やすい"],
              ["2.0未満", "要注意。不可・再履修が多い", "卒業要件の確認が先決"],
            ].map(([gpa, desc, eval_], i) => (
              <tr key={i} className={i === 2 ? "bg-blue-50 dark:bg-blue-950/20" : i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-bold text-blue-600 dark:text-blue-400">{gpa}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{desc}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400 text-xs">{eval_}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※大学・学部により差があります。理工系は文系より平均が低くなる傾向があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>GPAの計算式</h2>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 font-mono text-sm">
        GPA ＝ Σ（成績点 × 単位数）÷ 総単位数
      </div>

      <h3>計算例</h3>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">科目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">単位数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">成績</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">成績点</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">成績点×単位数</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["英語", "2", "A", "3.5", "7.0"],
              ["統計学", "4", "B", "2.5", "10.0"],
              ["経済学", "4", "S", "4.0", "16.0"],
              ["合計", "10", "—", "—", "33.0"],
            ].map(([subject, units, grade, pt, total], i) => (
              <tr key={i} className={i === 3 ? "bg-blue-50 dark:bg-blue-950/30 font-bold" : i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{subject}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{units}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{grade}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 text-sm font-mono">
        GPA ＝ 33.0 ÷ 10単位 ＝ <strong>3.30</strong>
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>成績とGPA換算表（4.0満点・5.0満点）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">成績</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目安点数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">4.0満点（一般的）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">5.0満点（一部大学）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["S・秀・AA", "90〜100点", "4.0", "5.0"],
              ["A・優", "80〜89点", "3.0〜3.5", "4.0"],
              ["B・良", "70〜79点", "2.0〜2.5", "3.0"],
              ["C・可", "60〜69点", "1.0〜1.5", "2.0"],
              ["D・不可", "60点未満", "0", "0〜1.0"],
            ].map(([grade, score, pt4, pt5], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{grade}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{score}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{pt4}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※大学によって評価基準が異なります。成績証明書に記載の換算方式を確認してください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>GPA水準の目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">GPA（4.0満点）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">水準の目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">就活での評価</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["3.5〜4.0", "ほとんどA以上", "外資系・コンサルで高評価"],
              ["3.0〜3.5", "A・B中心", "外資系・金融の足切り通過ライン目安"],
              ["2.5〜3.0", "B中心", "多くの日系企業では問題なし"],
              ["2.0〜2.5", "B・C混在", "就活よりも大学院進学に影響が出やすい"],
              ["2.0未満", "C・D混在", "再履修・卒業要件の確認が先決"],
            ].map(([gpa, level, eval_], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-bold text-blue-600 dark:text-blue-400">{gpa}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{level}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{eval_}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>就活でGPAはどのくらい重要か</h2>
      <ul className="space-y-2">
        <li><strong>外資系・コンサル・投資銀行</strong>：GPA3.0〜3.5以上を条件にしている企業が多い。書類選考で足切りに使われることがある</li>
        <li><strong>日系大手メーカー・商社</strong>：参考程度に聞く場合が多いが、3.0を下回ると印象が悪くなるケースも</li>
        <li><strong>IT・ベンチャー</strong>：GPAよりもポートフォリオや実績・経験を重視する傾向が強い</li>
        <li><strong>大学院進学</strong>：研究室配属や大学院の選抜に直接影響することが多い</li>
        <li><strong>海外大学院進学</strong>：GPA3.0以上が多くの大学院の出願要件になっている</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>GPAを効率的に上げる5つの戦略</h2>
      <ul className="space-y-2">
        <li>
          <strong>単位数の多い必修科目で高成績を狙う</strong>：GPA計算では単位数が大きいほど影響が大きい。4単位の科目でAを取ることは2単位×2科目でAを取るより効果的
        </li>
        <li>
          <strong>不可・再履修を徹底して避ける</strong>：0点科目はGPAを大きく引き下げる。苦手科目は早めに先生に相談し、取れる単位を確保
        </li>
        <li>
          <strong>楽に高成績が取れる選択科目を活用する</strong>：得意分野や関心の高い分野の選択科目でSやAを積み重ねることでGPAが上がる
        </li>
        <li>
          <strong>授業の評価方式を事前に確認する</strong>：試験のみの科目より、出席・レポート・発表など複数要素で評価する科目のほうが得点しやすい場合がある
        </li>
        <li>
          <strong>先輩から過去問・授業傾向を入手する</strong>：試験の特徴を知ることで対策しやすくなる。サークルや研究室の先輩に聞いてみよう
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>4.0満点と5.0満点の違い・換算方法</h2>
      <p>
        日本の大学では4.0満点が最も多いですが、一部の大学では5.0満点を採用しています。就職活動やグローバルな場面での提出時は、成績証明書に記載の換算式を使うか、以下を参考にしてください。
      </p>
      <p className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 text-sm font-mono my-3">
        5.0満点のGPAを4.0換算 ＝ GPA（5.0満点）× 4.0 ÷ 5.0
      </p>
      <p>
        例：GPA 4.2（5.0満点）→ 4.2 × 4.0 ÷ 5.0 ＝ <strong>3.36（4.0換算）</strong>
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自分のGPAを計算する</h2>
      <p>
        履修している全科目の成績と単位数を入力してGPAを自動計算したい場合は<Link href="/tools/gpa">GPA計算ツール</Link>を使ってみてください。科目数に制限なく、複数セメスター分もまとめて計算できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">大学によって計算方法が異なります</strong>
        成績点の割り当て方や計算方法は大学ごとに異なります。就活でGPAを提出する際は、自分の大学の成績証明書に記載の計算方式を確認してください。
      </div>
    </BlogLayout>
  );
}
