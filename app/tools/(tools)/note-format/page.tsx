import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { NoteFormat } from "./NoteFormat";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "note記事整形ツール【無料】ChatGPTの文章をnote向けに自動整形｜プレビュー付き",
  description: "ChatGPTなどのAI出力をnote投稿用に最適化する無料ツール。見出しの自動検出・余白の調整・記号の整理で、そのまま貼り付けられる形に整えます。note風プレビューで仕上がりを確認できます。",
  path: "/tools/note-format",
  keywords: ["note 整形","note 記事 書き方 AI","ChatGPT note 整形","note 見出し 整え方","note 執筆 ツール"],
  ogImage: `/api/og?${new URLSearchParams({ title: "note記事整形ツール", icon: "📝", desc: "AI文章をnote向けに自動整形" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "noteに貼り付けるとどう変わりますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Markdown記号（#や**）を除去し、noteの見出し・太字に合わせた形へ整えます。空行の幅も読みやすく調整されるため、貼り付け後の手直しがほぼ不要になります。"
    }
  },
  {
    "@type": "Question",
    "name": "見出しは自動で判定されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。Markdownの見出し記号や文の構造から見出し候補を検出し、note向けの見出しとして整形します。プレビューで確認しながら調整できます。"
    }
  },
  {
    "@type": "Question",
    "name": "AIで書いた記事をそのままnoteに出して大丈夫ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "noteの規約上、AI利用自体は禁止されていませんが、内容の正確性はご自身で確認してください。AIっぽい文体が気になる場合は「AI文章自然化ツール」との併用がおすすめです。"
    }
  },
  {
    "@type": "Question",
    "name": "文章は外部に送信されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "いいえ。整形はブラウザ内で完結し、記事の内容が外部サーバーに送信されることはありません。公開前の原稿も安心して使えます。"
    }
  }
],
};


export default function NoteFormatPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="note記事整形ツール"
      description="ChatGPTやAIの出力をnote向けに自動整形。見出し検出・空白調整・読みやすさを向上させます。"
      icon="📝"
      slug="note-format"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">noteでAI文章が崩れる原因</h2>
          <p>ChatGPTはMarkdown記法（#・**・-など）で出力します。noteはMarkdown記法に完全対応していないため、そのまま貼り付けると記号が文字として残り崩れます。本ツールはnoteに最適化したフォーマットに自動変換します。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">整形で行うこと</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Markdownの見出し記号（#）を除去し、前後に適切な空白を追加</li>
            <li>太字記号（**）を除去</li>
            <li>箇条書き記号（-・*）を「・」に変換</li>
            <li>3行以上の連続した空行を2行に圧縮</li>
            <li>コードブロック（` ` `）のバッククォートを除去</li>
          </ul>
        </div>
      }
    >
      <NoteFormat />

    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. noteに貼り付けるとどう変わりますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. Markdown記号（#や**）を除去し、noteの見出し・太字に合わせた形へ整えます。空行の幅も読みやすく調整されるため、貼り付け後の手直しがほぼ不要になります。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 見出しは自動で判定されますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. はい。Markdownの見出し記号や文の構造から見出し候補を検出し、note向けの見出しとして整形します。プレビューで確認しながら調整できます。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. AIで書いた記事をそのままnoteに出して大丈夫ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. noteの規約上、AI利用自体は禁止されていませんが、内容の正確性はご自身で確認してください。AIっぽい文体が気になる場合は「AI文章自然化ツール」との併用がおすすめです。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 文章は外部に送信されますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. いいえ。整形はブラウザ内で完結し、記事の内容が外部サーバーに送信されることはありません。公開前の原稿も安心して使えます。</p>
        </div>
      </div>
    </section>

    </ToolLayout>
    </>
  );
}
