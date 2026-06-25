import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "生活・副業";
const SLUG = "lifestyle";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "生活・副業の無料ツール｜副業利益計算・YouTube・SNSリンク",
  description: "副業の手取り収入計算・YouTube SEOチェック・SNSリンクまとめページ作成など、生活と副業を支援する無料ツール集。",
  path: `/tools/${SLUG}`,
  keywords: ["副業 利益計算", "YouTube SEO", "SNS リンクまとめ", "副業 税金", "無料ツール"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">副業の税金はいくらかかる？</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>会社員が副業で得た収入は「雑所得」として確定申告が必要になる場合があります。年間の副業所得が20万円を超えると、本業の年末調整とは別に自分で申告する必要があります。ただし所得とは「収入から必要経費を引いた金額」なので、機材・通信費・交通費などの経費を正しく計上すれば課税される金額を減らせます。</p>
        <p>副業利益・税金計算ツールでは、収入と経費を入力することで手取り額と所得税・住民税の概算を確認できます。確定申告前の事前確認や、副業の採算チェックに使えます。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">SNS発信をもっと効率化する</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>SNSで複数のアカウントを運用していると「プロフィールにすべてのリンクを載せたい」と思う場面があります。しかし多くのSNSはプロフィールに1つしかリンクを貼れません。SNSリンクまとめツールを使うと、自分のリンク集ページをすぐに生成してそのURLを1つプロフィールに貼るだけで、フォロワーに全SNSへ誘導できます。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "副業の確定申告は必ず必要ですか？", a: "年間の副業所得（収入−経費）が20万円以下の場合、所得税の確定申告は不要です。ただし住民税の申告は必要な場合があるので、住んでいる市区町村の窓口で確認してください。" },
          { q: "YouTubeのタイトルは何文字が最適ですか？", a: "PC・スマホ両方で表示が途切れない目安は30〜40文字程度です。検索で上位表示されやすいキーワードをタイトルの前半に入れると効果的です。YouTube SEOツールで文字数をリアルタイム確認できます。" },
          { q: "SNSリンクまとめページはどこかに保存されますか？", a: "ToolBoxのSNSリンクまとめツールはブラウザ内で動作します。データが外部サーバーに送信・保存されることはありません。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="副業利益計算・YouTubeツール・SNSリンクまとめなど、生活や副業に役立つ無料ツール。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
