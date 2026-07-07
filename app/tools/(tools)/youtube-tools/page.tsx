import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { YoutubeTools } from "./YoutubeTools";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "YouTube SEOチェックツール【無料】タイトル文字数・サムネ比率・ハッシュタグを一括確認",
  description: "YouTubeのタイトル文字数（全角28文字目安）、サムネイルの16:9比率、ハッシュタグの最適化をまとめてチェック。投稿前のセルフチェックに。無料・登録不要・ブラウザ完結。",
  path: "/tools/youtube-tools",
  keywords: ["YouTube タイトル 文字数","YouTube SEO ツール","YouTube サムネイル サイズ 確認","YouTube ハッシュタグ 付け方","YouTube 投稿 チェック"],
  ogImage: `/api/og?${new URLSearchParams({ title: "YouTube SEOチェックツール", icon: "🎥", desc: "タイトル・サムネ・タグを投稿前に確認" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "YouTubeのタイトルは何文字が最適ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PC検索結果では60〜70文字、スマホでは45〜50文字で切れることが多いです。重要なキーワードは必ず前半30文字以内に入れ、クリックしたくなる言葉で締めるのが基本です。長すぎるタイトルはスパム判定のリスクもあるため、100文字以内を目安にしましょう。" },
    },
    {
      "@type": "Question",
      name: "ハッシュタグは何個つけるべきですか？",
      acceptedAnswer: { "@type": "Answer", text: "YouTubeのガイドラインでは最大60個まで設定できますが、15個を超えると全てのタグが無効になるペナルティがあります。実際には3〜5個を厳選するのが効果的です。説明欄の最初の3つのハッシュタグはタイトル下に表示されるため、最も重要なキーワードを最初に置きましょう。" },
    },
    {
      "@type": "Question",
      name: "サムネイルのおすすめ解像度とアスペクト比は？",
      acceptedAnswer: { "@type": "Answer", text: "推奨は1280×720px（HD）で、アスペクト比は16:9です。ファイルサイズは2MB以下、形式はJPG・PNG・GIFに対応しています。スマホの小さい画面でも読めるよう、文字は大きめ・色コントラストを強くするのがクリック率向上のコツです。" },
    },
    {
      "@type": "Question",
      name: "YouTube説明欄は何文字まで書けますか？",
      acceptedAnswer: { "@type": "Answer", text: "説明欄は最大5000文字まで入力できます。ただし検索結果に表示されるのは最初の125文字程度です。冒頭にキーワードを自然に含めた概要を書き、チャンネル登録やSNSリンクは後半に置くのが一般的です。" },
    },
    {
      "@type": "Question",
      name: "チャンネル登録者を増やすために何が一番効果的ですか？",
      acceptedAnswer: { "@type": "Answer", text: "最も効果的なのは「投稿頻度の安定」と「タイトル・サムネイルのCTR改善」です。YouTubeのアルゴリズムは視聴維持率とクリック率を重視します。検索から流入させるには、実際に検索されているキーワードをタイトルに入れること。ショート動画で露出を増やしながら長尺動画への誘導を作る方法も有効です。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      YouTube SEOツールの使い方
    </h2>
    <p>
      タイトル・説明欄・ハッシュタグを入力するだけで、文字数の過不足・ハッシュタグ数のチェック・
      サムネイル比率の確認が一画面でできます。
      投稿前のセルフチェックとして使うことで、基本的なSEOミスを防げます。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      タイトル最適化のポイント
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[12px]">
            <th className="pb-2 font-medium">表示場所</th>
            <th className="pb-2 font-medium">表示される文字数</th>
            <th className="pb-2 font-medium">対策</th>
          </tr>
        </thead>
        <tbody className="text-slate-600 dark:text-zinc-400">
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">PC検索結果</td>
            <td className="py-1.5">60〜70文字</td>
            <td className="py-1.5">キーワードを前半に</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">スマホ検索</td>
            <td className="py-1.5">45〜50文字</td>
            <td className="py-1.5">30文字以内に核心を</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">おすすめ欄</td>
            <td className="py-1.5">約35〜40文字</td>
            <td className="py-1.5">数字・感情ワードが効果的</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">通知バナー</td>
            <td className="py-1.5">約30文字</td>
            <td className="py-1.5">登録者向けに刺さる言葉を</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      ハッシュタグの正しい使い方
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>個数は3〜5個が最適</strong>：15個超でペナルティ（全タグ無効）になるため絞り込みが重要</li>
      <li><strong>説明欄の最初の3つが表示される</strong>：タイトル直下に出るため、最重要キーワードを先頭に</li>
      <li><strong>タイトル内ハッシュタグはNG</strong>：タイトルにつけると説明欄のタグが非表示になる</li>
      <li><strong>ブランド名・シリーズ名を固定</strong>：チャンネル名タグを常に入れると視聴者が関連動画を探しやすい</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      サムネイルで押さえるべき4点
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>解像度：1280×720px</strong>（16:9）が基本。最低でも640×360px以上</li>
      <li><strong>ファイルサイズ：2MB以下</strong>（JPG推奨）</li>
      <li><strong>文字は少なく・大きく</strong>：スマホの小さいサムネでも読める6〜8文字程度が目安</li>
      <li><strong>人の顔（表情）を入れる</strong>：心理学的にCTRが上がりやすい</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      投稿前チェックリスト
    </h3>
    <ul className="space-y-1 text-[14px]">
      <li>□ タイトルに検索されるキーワードが含まれているか</li>
      <li>□ タイトルが60文字以内か（PC表示で切れない）</li>
      <li>□ 説明欄の冒頭125文字に動画の概要があるか</li>
      <li>□ ハッシュタグは3〜5個か（15個未満）</li>
      <li>□ サムネイルが1280×720pxで鮮明か</li>
      <li>□ 字幕（自動生成でも可）が設定されているか</li>
    </ul>
  </div>
);

export default function YoutubeToolsPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="YouTube SEOツール"
        description="タイトル文字数・ハッシュタグ最適化・サムネイル比率確認をまとめてチェック。"
        icon="🎥"
        slug="youtube-tools"
        seoContent={seoContent}
      >
        <YoutubeTools />
      </ToolLayout>
    </>
  );
}
