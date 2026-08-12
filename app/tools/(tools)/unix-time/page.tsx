import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { UnixTime } from "./UnixTime";

export const metadata: Metadata = generateMeta({
  title: "Unixタイムスタンプ変換ツール｜日時⇔エポック秒【無料・ブラウザ完結】",
  description:
    "Unixタイムスタンプ（エポック秒・ミリ秒）と日時を相互変換できる無料ツール。現在のタイムスタンプをリアルタイム表示。UTC・ISO 8601表記にも対応。ログの時刻確認やAPI開発に。ブラウザ内処理で安全。",
  path: "/tools/unix-time",
  ogImage: `/api/og?${new URLSearchParams({ title: "Unixタイムスタンプ変換", icon: "🕐", desc: "Unixタイムスタンプ（エポック秒/ミリ秒）と日時を相互" }).toString()}`,
  keywords: ["unix タイムスタンプ 変換", "エポック秒 変換", "タイムスタンプ 日時 変換", "unixtime 変換", "現在 タイムスタンプ"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Unixタイムスタンプとは何ですか？", acceptedAnswer: { "@type": "Answer", text: "1970年1月1日0時0分0秒（UTC）からの経過秒数で時刻を表す方式です。プログラムやログでよく使われ、タイムゾーンに依存しない絶対的な時刻として扱えます。" } },
    { "@type": "Question", name: "秒とミリ秒はどう見分けますか？", acceptedAnswer: { "@type": "Answer", text: "一般的に10桁が秒、13桁がミリ秒です。このツールは13桁以上の入力を自動的にミリ秒として判定して変換します。" } },
    { "@type": "Question", name: "表示される日時はどのタイムゾーンですか？", acceptedAnswer: { "@type": "Answer", text: "ローカル日時はお使いの端末のタイムゾーンで表示します。あわせてUTCとISO 8601表記も表示するので、用途に応じて使い分けられます。" } },
    { "@type": "Question", name: "入力した値は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。変換はすべてブラウザ内で行われ、入力した時刻が外部に送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>タイムスタンプから日時を知りたいときは、上の欄に数字を入れて「変換」</li>
        <li>日時からタイムスタンプを知りたいときは、下の欄で日時を選んで「変換」</li>
        <li>現在のタイムスタンプは常に表示され、「現在」ボタンで入力にも使えます</li>
        <li>各結果はコピーできます</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・ログやデータベースに記録されたタイムスタンプを読める日時に直す</li>
        <li>・APIのexpや期限（例：JWTの有効期限）を確認する</li>
        <li>・特定の日時のタイムスタンプを求めてテストに使う</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・<Link href="/tools/json-formatter" className="text-sky-600 dark:text-sky-400 hover:underline">JSON整形・圧縮</Link></li>
        <li>・<Link href="/tools/base64" className="text-sky-600 dark:text-sky-400 hover:underline">Base64エンコード/デコード</Link></li>
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
        title="Unixタイムスタンプ変換"
        description="Unixタイムスタンプと日時を相互変換。現在時刻をリアルタイム表示。UTC・ISO 8601対応。"
        icon="🕐"
        slug="unix-time"
        seoContent={seoContent}
      >
        <UnixTime />
      </ToolLayout>
    </>
  );
}
