import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { ReviewReplyGenerator } from "./ReviewReplyGenerator";

export const metadata: Metadata = generateMeta({
  title: "Google口コミ返信文メーカー｜飲食店向け無料自動生成",
  description: "高評価・低評価・クレームなど状況別に、そのままコピーできる自然な口コミ返信文を自動生成。丁寧・カジュアル・店主らしい文体を選択可。炎上しにくい表現で安心。",
  path: "/tools/review-reply-generator",
  keywords: ["Google口コミ 返信 飲食店", "口コミ 返信文 自動生成", "飲食店 口コミ 対応", "Google マップ 返信"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "低評価の口コミにはどう返信すればいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "①お礼→②不快にさせた点への謝罪→③事実確認と改善策→④再来店のお願い、の順が基本です。感情的な反論や言い訳は逆効果です。本ツールは評価の星数に応じた適切なトーンの返信文を生成します。"
    }
  },
  {
    "@type": "Question",
    "name": "返信はした方がいいのですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。口コミへの返信は他の閲覧者も見ています。丁寧な返信は店の印象を高め、Googleマップ上の活動シグナルにもなります。特に低評価こそ誠実な返信が重要です。"
    }
  },
  {
    "@type": "Question",
    "name": "生成された文章はそのまま使えますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "下書きとしてお使いください。お客様が指摘した具体的な内容（料理名・日時など）を一文加えるだけで、定型文ではない誠実な返信になります。"
    }
  },
  {
    "@type": "Question",
    "name": "どんな口コミサイトに使えますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Googleマップ・食べログ・ホットペッパーなど、飲食店の主要な口コミサイト全般で使えます。文字数制限がある場合は生成後に調整してください。"
    }
  }
],
};


const seoContent = (
  <div className="space-y-6">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Google口コミ返信のポイント</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>口コミへの返信はすべての評価に行うことを推奨します。閲覧者が返信を読んで来店を判断するケースは多く、適切な返信は信頼性向上につながります。</p>
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/50">
          <p className="font-semibold text-orange-800 dark:text-orange-300 mb-2">⚠️ 返信時の注意事項</p>
          <ul className="space-y-1 text-orange-700 dark:text-orange-400">
            <li>・個人情報（来店日時・注文内容・氏名）には触れない</li>
            <li>・過度な謝罪や断定的な表現を避ける</li>
            <li>・感情的な反論・言い訳はしない</li>
            <li>・虚偽の口コミへの対応は「口コミの報告」機能を活用する</li>
            <li>・法的措置をほのめかす表現は控える</li>
          </ul>
        </div>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "低評価の口コミには必ず返信すべきですか？", a: "はい。返信なしより「丁寧な返信あり」のほうが閲覧者への印象がよくなります。事実誤認がある場合も感情的にならず、穏やかに事実を伝えることが重要です。" },
          { q: "口コミの内容が明らかな嫌がらせの場合は？", a: "Googleの口コミポリシーに違反している場合は「口コミを報告する」機能を使います。返信する場合も感情的にならず、簡潔で丁寧な内容にしましょう。" },
          { q: "返信文の文字数に制限はありますか？", a: "Googleの返信には文字数制限（約4,096文字）がありますが、実際には300〜500文字程度の簡潔な返信が読まれやすい傾向があります。" },
        ].map((faq) => (
          <div key={faq.q} className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="Google口コミ返信文メーカー"
      description="高評価・低評価・クレームなど状況別に、そのままコピーできる自然な口コミ返信文を自動生成。"
      icon="⭐"
      slug="review-reply-generator"
      seoContent={seoContent}
    >
      <ReviewReplyGenerator />
    </ToolLayout>
    </>
  );
}
