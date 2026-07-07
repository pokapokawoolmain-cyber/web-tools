import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { WordCounter } from "./WordCounter";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "文字数カウント【無料】リアルタイムで文字数・行数・原稿用紙換算｜X・ES・レポートに",
  description: "入力した瞬間に文字数・単語数・行数・原稿用紙換算を表示する無料カウンター。スペースあり/なしの切り替えに対応し、X(Twitter)の投稿、ES・小論文・レポートの文字数確認に使えます。登録不要。",
  path: "/tools/word-counter",
  keywords: ["文字数 カウント","文字数 数える","文字数カウンター 無料","原稿用紙 換算","ES 文字数 確認","レポート 文字数"],
  ogImage: `/api/og?${new URLSearchParams({ title: "文字数カウント", icon: "✍️", desc: "文字数・行数をリアルタイム計測" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Twitterの文字数制限は何文字ですか？",
      acceptedAnswer: { "@type": "Answer", text: "Twitter/Xの文字数上限は140文字です。日本語・中国語・韓国語は1文字が1カウント、英数字・半角記号は1文字が0.5カウントとして計算されます。URLは短縮されて23文字としてカウントされます。" },
    },
    {
      "@type": "Question",
      name: "Instagramのキャプションの文字数上限は？",
      acceptedAnswer: { "@type": "Answer", text: "Instagramキャプションの上限は2,200文字です。ただし検索結果に表示されるのは最初の125文字程度なので、重要な情報や検索キーワードは前半に入れることを推奨します。" },
    },
    {
      "@type": "Question",
      name: "スペースや改行は文字数に含まれますか？",
      acceptedAnswer: { "@type": "Answer", text: "デフォルトはスペース・改行を含めてカウントします。「スペースを除く」「改行を除く」などの切り替えオプションで、実質的な文章量のみをカウントすることもできます。" },
    },
    {
      "@type": "Question",
      name: "履歴書・ESの文字数確認に使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。自己PR・志望動機など指定された文字数の欄に書く際、本ツールで文字数を確認しながら執筆できます。文字数の上限・下限が指定されている場合に特に便利です。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      文字数カウントツールの使い方
    </h2>
    <p>
      テキストボックスに文字を入力または貼り付けると、リアルタイムで文字数・行数・段落数が即座に表示されます。
      スペース有無の切り替えや、各SNS・媒体の文字数制限との比較表示も備えています。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      主なSNS・媒体の文字数制限一覧
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[12px]">
            <th className="pb-2 font-medium">媒体・サービス</th>
            <th className="pb-2 font-medium">上限文字数</th>
            <th className="pb-2 font-medium">備考</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Twitter / X（ポスト）", "140文字", "英数字は0.5カウント"],
            ["Twitter / X（DM）", "10,000文字", ""],
            ["Instagram キャプション", "2,200文字", "表示は先頭125文字程度"],
            ["Instagram ストーリーズ", "2,200文字", ""],
            ["LINE メッセージ", "1,000文字", ""],
            ["Facebook 投稿", "63,206文字", "実質無制限に近い"],
            ["メール件名", "約60〜80文字", "スマホ表示に合わせる"],
            ["SEOメタディスクリプション", "約80〜120文字", "検索結果に表示される範囲"],
          ].map(([service, limit, note]) => (
            <tr key={service} className="border-t border-slate-100 dark:border-zinc-800">
              <td className="py-1.5 text-slate-700 dark:text-zinc-300">{service}</td>
              <td className="py-1.5 font-mono text-blue-600 dark:text-blue-400">{limit}</td>
              <td className="py-1.5 text-slate-400 dark:text-zinc-500 text-[11px]">{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      活用シーン
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>SNS投稿の下書き</strong>：Twitter/Xの140文字制限、Instagramのキャプションなど、投稿前に文字数を確認。</li>
      <li><strong>就活・転職書類</strong>：履歴書・ESの自己PR・志望動機の文字数が指定されている場合に。「200〜300文字」などの範囲確認に使えます。</li>
      <li><strong>Webライティング</strong>：記事のメタディスクリプション（80〜120文字推奨）・見出し・リード文の文字数管理に。</li>
      <li><strong>メール・ビジネス文書</strong>：コンパクトに伝えるべき社外メール・プレスリリース・お知らせの文字数チェックに。</li>
      <li><strong>翻訳・文字数課金</strong>：翻訳サービスは文字数単位で料金が決まることが多く、事前に文字数を把握しておくと見積もりが立てやすくなります。</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      文字数削減のコツ
    </h3>
    <p>
      制限文字数に収めるために文字数を削る際は、① 冗長な表現（「〜することができます」→「〜できます」）を省く、② 接続詞を減らす、③ 句読点の多用を避けることが効果的です。
      文章を声に出して読んでみると、不要な箇所が見つかりやすくなります。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/chatgpt-format" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">AI文章整形</Link>・
      <Link href="/tools/x-post-preview" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">X投稿プレビュー</Link>
    </p>
  </div>
);

export default function WordCounterPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="文字数カウント"
        description="入力した瞬間にリアルタイムで文字数・行数・単語数を計測。スペース有無の切り替えも可能。"
        icon="✍️"
        slug="word-counter"
        seoContent={seoContent}
      >
        <WordCounter />
      </ToolLayout>
    </>
  );
}
