import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { JsonFormatter } from "./JsonFormatter";

export const metadata: Metadata = generateMeta({
  title: "JSON整形・圧縮ツール｜構文チェック付き【無料・ブラウザ完結】",
  description:
    "JSONを見やすく整形（インデント）、または1行に圧縮（minify）できる無料ツール。構文エラーの位置も表示します。APIレスポンスの確認や設定ファイルの整理に。データはブラウザ内で処理され外部に送信されません。",
  path: "/tools/json-formatter",
  keywords: ["json 整形", "json フォーマッター", "json 圧縮 minify", "json 整形 ツール 無料", "json バリデーション"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "整形と圧縮（minify）はどう違いますか？", acceptedAnswer: { "@type": "Answer", text: "整形は改行とインデントを付けて人が読みやすい形にします。圧縮は空白や改行を取り除いて1行にまとめ、ファイルサイズや通信量を減らします。確認には整形、配信には圧縮が向いています。" } },
    { "@type": "Question", name: "構文エラーの場所はわかりますか？", acceptedAnswer: { "@type": "Answer", text: "解析に失敗した場合、エラーメッセージとおおよその文字位置を表示します。カンマ抜けや閉じ括弧の不足など、どこで崩れているかの手がかりになります。" } },
    { "@type": "Question", name: "入力したJSONは送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。APIのレスポンスや設定ファイルなど、機密を含むデータも安全に扱えます。" } },
    { "@type": "Question", name: "日本語や絵文字を含むJSONも扱えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。UTF-8の文字列をそのまま整形・圧縮できます。日本語のキーや値、絵文字も問題なく処理されます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>JSONを入力欄に貼り付ける（「サンプルを入れる」で例も試せます）</li>
        <li>「整形する」で読みやすく、「圧縮する」で1行にまとめる</li>
        <li>構文が正しくない場合はエラーと位置が表示される</li>
        <li>結果を「コピー」してそのまま使う</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・APIのレスポンスを整形して構造を確認する</li>
        <li>・設定ファイル（package.json・tsconfig など）の体裁を整える</li>
        <li>・圧縮した1行JSONを環境変数やクエリに埋め込む</li>
        <li>・コピペで崩れたJSONの構文エラーを特定する</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・<Link href="/tools/base64" className="text-sky-600 dark:text-sky-400 hover:underline">Base64エンコード/デコード</Link></li>
        <li>・<Link href="/tools/url-encode" className="text-sky-600 dark:text-sky-400 hover:underline">URLエンコード/デコード</Link></li>
        <li>・<Link href="/dev" className="text-sky-600 dark:text-sky-400 hover:underline">開発者ツール一覧</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="JSON整形・圧縮"
        description="JSONを見やすく整形、または1行に圧縮。構文エラーの位置も表示します。ブラウザ内処理で安全。"
        icon="🧩"
        slug="json-formatter"
        seoContent={seoContent}
      >
        <JsonFormatter />
      </ToolLayout>
    </>
  );
}
