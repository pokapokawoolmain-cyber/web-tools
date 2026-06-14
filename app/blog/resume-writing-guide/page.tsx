import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("resume-writing-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["履歴書 書き方 転職", "職務経歴書 書き方", "志望動機 書き方", "履歴書 証明写真 サイズ", "履歴書 テンプレート"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        転職・就職活動の書類選考を突破するためには、履歴書と職務経歴書の両方をしっかり準備することが必要です。書き方のポイントと、証明写真の準備方法まで解説します。
      </p>

      <h2>履歴書と職務経歴書の違い</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">書類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">内容</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">形式</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["履歴書", "基本情報・学歴・職歴・資格・志望動機", "JIS規格などの決まった形式"],
              ["職務経歴書", "業務内容・実績・スキル・アピールポイント", "自由形式（A4サイズが一般的）"],
            ].map(([doc, content, format], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{doc}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{content}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>志望動機の書き方</h2>
      <p>
        よく言われる「志望動機は3つの要素で書く」という方法が効果的です。
      </p>
      <ol>
        <li><strong>なぜこの業界か</strong>：業界に興味を持ったきっかけや、業界に感じる可能性</li>
        <li><strong>なぜこの会社か</strong>：他社ではなくこの会社でなければならない理由（会社の強み・方向性・文化）</li>
        <li><strong>入社後に何をしたいか</strong>：具体的にやりたいことと、そのために自分が貢献できること</li>
      </ol>
      <p>
        抽象的な表現（「御社の理念に共感しました」）より、具体的なエピソードや数字を入れることで説得力が増します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>職歴・職務経歴書のポイント</h2>
      <ul className="space-y-2">
        <li><strong>数字で実績を示す</strong>：「売上向上に貢献した」より「前年比120%の売上を達成した」が具体的</li>
        <li><strong>使用ツール・技術を明記する</strong>：ExcelだけでなくVBA、SQL、特定のソフトなど</li>
        <li><strong>担当した案件のスケールを示す</strong>：チーム人数・プロジェクト規模・予算規模</li>
        <li><strong>専門用語は適度に使う</strong>：同業界の担当者が読む場合は専門用語でOK、人事担当者向けには補足を</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>証明写真の準備</h2>
      <p>
        履歴書の証明写真は縦40mm×横30mmが一般的です。スマホで撮影して証明写真ツールで加工・印刷する方法と、証明写真ボックス・写真館で撮影する方法があります。
      </p>
      <p>
        コスト重視なら<Link href="/tools/id-photo">証明写真作成ツール</Link>でスマホ撮影→コンビニ印刷（40円）が経済的です。重要な転職活動や第一希望の企業には写真館の高品質な写真を使う方法もあります。
      </p>
      <p>
        証明写真のサイズ一覧は<Link href="/blog/id-photo-size-guide">証明写真サイズ一覧</Link>を参照してください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>手書きとパソコン、どちらがいいか</h2>
      <p>
        特に指定がなければパソコン作成でも問題ありません。転職市場ではパソコン作成が主流です。ただし一部の企業・職種（公務員など）では手書きを求める場合があります。求人票や担当者に確認しましょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>提出前のチェックリスト</h2>
      <ul className="space-y-2">
        <li>誤字・脱字がないか（特に会社名・担当者名）</li>
        <li>証明写真が適切なサイズ・向きで貼れているか</li>
        <li>日付が提出日（または採用担当者が読む日）になっているか</li>
        <li>職歴に空白期間がある場合は説明できる準備ができているか</li>
        <li>連絡先（メール・電話番号）が最新のものか</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">証明写真を素早く準備したい場合</strong>
        <Link href="/tools/id-photo" className="text-blue-600 dark:text-blue-400 hover:underline">証明写真作成ツール</Link>を使えば、スマホで撮影した写真から履歴書サイズの証明写真を無料で作成できます。コンビニで40円で印刷するまでの手順は<Link href="/blog/id-photo-convenience-store" className="text-blue-600 dark:text-blue-400 hover:underline">コンビニ印刷ガイド</Link>を参照してください。
      </div>
    </BlogLayout>
  );
}
