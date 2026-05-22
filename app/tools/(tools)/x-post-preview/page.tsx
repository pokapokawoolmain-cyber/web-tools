import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { XPostPreview } from "./XPostPreview";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "X投稿プレビュー・改行シミュレーター",
  "X（旧Twitter）投稿の実際の表示をプレビュー。改行・文字数・ハッシュタグの見え方をポスト前に確認。スマホ表示も再現。",
  "x-post-preview",
  ["X 改行", "Twitter 改行確認", "X投稿 シミュレーター", "X 文字数 カウント", "Twitter 投稿 確認"]
);

export default function XPostPreviewPage() {
  return (
    <ToolLayout
      title="X投稿プレビュー・改行シミュレーター"
      description="X（旧Twitter）投稿の実際の見た目をプレビュー。改行・文字数・ハッシュタグをポスト前に確認できます。"
      icon="𝕏"
      slug="x-post-preview"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Xの文字数カウントの仕組み</h2>
          <p>X（旧Twitter）では日本語・英語ともに1文字として数えます。ただしURLは文字数にかかわらず23文字としてカウントされます。X Premiumなし（無料）の場合は140文字が上限です。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">改行が反映される条件</h2>
          <p>X上では改行（エンターキー）はそのまま表示に反映されます。ただし連続する空行は1つの空行に自動的に圧縮されます。投稿前にプレビューで実際の見た目を確認しましょう。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">バズる投稿の改行テクニック</h2>
          <p>スマホユーザーは長い段落を読み飛ばしがちです。1〜2行ごとに改行を入れて余白を作ることで、最後まで読んでもらいやすくなります。</p>
        </div>
      }
    >
      <XPostPreview />
    </ToolLayout>
  );
}
