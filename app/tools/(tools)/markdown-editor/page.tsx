import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { MarkdownEditor } from "./MarkdownEditor";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "Markdownエディタ【無料・ブラウザ完結】リアルタイムプレビュー付き｜GitHub対応",
  description: "左に書いて右で即プレビューできるオンラインMarkdownエディタ。GitHub方言（GFM）対応で、表・コードブロック・チェックリストも確認しながら書けます。コピー・ダウンロード対応。無料・登録不要。",
  path: "/tools/markdown-editor",
  keywords: ["markdown エディタ オンライン","マークダウン プレビュー","markdown 練習","md エディタ 無料","markdown 表 プレビュー"],
  ogImage: `/api/og?${new URLSearchParams({ title: "Markdownエディタ", icon: "📝", desc: "リアルタイムプレビュー付きMDエディタ" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Markdownとは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "Markdownは、プレーンテキストで書いてHTMLに変換できる軽量マークアップ言語です。「# 見出し」「**太字**」「- リスト」などの記号を使い、読みやすい文書を素早く作れます。GitHub・Notion・Qiita・はてなブログなど、多くのサービスで採用されています。" },
    },
    {
      "@type": "Question",
      name: "GitHub READMEに使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。このエディタはGitHub Flavored Markdown（GFM）に対応しており、テーブル記法・チェックボックス・コードブロックのシンタックスハイライトなどGitHubの表示と同じプレビューで確認できます。作成後にコピーしてGitHubに貼り付けるだけです。" },
    },
    {
      "@type": "Question",
      name: "書いたMarkdownはどうやって保存しますか？",
      acceptedAnswer: { "@type": "Answer", text: "「コピー」ボタンでクリップボードに書き込むか、「ダウンロード」ボタンで.mdファイルとして保存できます。ブラウザを閉じると内容は消えるため、こまめに保存することをおすすめします。" },
    },
    {
      "@type": "Question",
      name: "Notionでも同じMarkdownが使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "Notionは独自のMarkdown的記法を採用しているため、完全な互換性はありません。見出し・太字・リスト・コードブロックなどの基本記法は使えますが、テーブルやHTML要素は一部対応していません。貼り付け後に軽微な修正が必要な場合があります。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      Markdownエディタの使い方
    </h2>
    <p>
      左ペインにMarkdownを書くと、右ペインにリアルタイムでプレビューが表示されます。
      GitHub Flavored Markdown（GFM）に対応しているので、テーブル・チェックボックス・シンタックスハイライトもそのまま確認できます。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      よく使うMarkdown記法チートシート
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full font-mono">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[11px] font-sans">
            <th className="pb-2 font-medium w-1/2">書き方</th>
            <th className="pb-2 font-medium">表示</th>
          </tr>
        </thead>
        <tbody className="text-slate-600 dark:text-zinc-400 text-[12px]">
          {[
            ["# 見出し1 / ## 見出し2", "大・中見出し"],
            ["**太字** / *斜体*", "太字 / 斜体"],
            ["- リスト / 1. 番号付き", "箇条書き"],
            ["`コード` / ```ブロック```", "インライン / コードブロック"],
            ["[テキスト](URL)", "リンク"],
            ["![alt](画像URL)", "画像挿入"],
            ["| A | B | / |---|---|", "テーブル"],
            ["- [ ] タスク / - [x] 完了", "チェックボックス"],
            ["---", "水平線"],
            ["> 引用文", "ブロック引用"],
          ].map(([syntax, result]) => (
            <tr key={syntax} className="border-t border-slate-100 dark:border-zinc-800">
              <td className="py-1.5 text-blue-700 dark:text-blue-400">{syntax}</td>
              <td className="py-1.5 font-sans text-slate-500 dark:text-zinc-400">{result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      Markdownが使えるサービス・場面
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>GitHub / GitLab</strong>：README・Issue・Pull Requestの説明文で標準使用</li>
      <li><strong>Notion</strong>：基本記法は対応。ドキュメント管理に最適</li>
      <li><strong>Qiita / Zenn</strong>：技術記事の執筆。コードブロックにシンタックスハイライト</li>
      <li><strong>はてなブログ</strong>：Markdownモードに切り替えると使用可能</li>
      <li><strong>Slack / Discord</strong>：一部記法（**太字**、`コード`など）に対応</li>
      <li><strong>VSCode</strong>：プレビュー機能内蔵。ドキュメント管理にも活用</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      GitHub READMEをきれいに書くコツ
    </h3>
    <ul className="space-y-1 text-[14px]">
      <li>冒頭にプロジェクト概要を1〜2行で書く（検索でもヒットしやすい）</li>
      <li>バッジ（shields.io）でビルド状態・ライセンスを視覚化</li>
      <li>インストール手順はコードブロックに言語指定（```bash、```npm）</li>
      <li>スクリーンショット・デモGIFを入れると格段に伝わりやすくなる</li>
      <li>テーブルでオプション一覧・APIリファレンスを整理する</li>
    </ul>
  </div>
);

export default function MarkdownEditorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Markdownエディタ"
        description="左に書いて右でプレビュー。GitHub対応MDをリアルタイム確認・コピー・ダウンロード。"
        icon="📝"
        slug="markdown-editor"
        seoContent={seoContent}
      >
        <MarkdownEditor />
      </ToolLayout>
    </>
  );
}
