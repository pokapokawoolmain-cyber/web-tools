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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Unix時間とは — なぜ世界共通で使われるのか</h2>
      <p className="mb-3">
        Unixタイムスタンプ（エポック秒）は、<strong>1970年1月1日 00:00:00 UTC からの経過秒数</strong>で時刻を表します。
        「年・月・日・時・分・秒」やタイムゾーンの違いに悩まされず、<strong>1つの整数で世界中どこでも同じ瞬間</strong>を指せるため、
        ログ・データベース・API・分散システムで標準的に使われます。表示するときだけ各地のタイムゾーンに変換します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">秒とミリ秒 — 桁数での見分け方</h2>
      <p className="mb-3">
        最大のつまずきどころが「秒」と「ミリ秒」の取り違えです。桁数でおおよそ判別できます。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">桁数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">単位</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">例（2024年ごろ）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">主な環境</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["10桁", "秒", "1704067200", "Unix系・PHP time()・Python time()"],
              ["13桁", "ミリ秒", "1704067200000", "JavaScript Date.now()・Java"],
            ].map(([d, u, ex, env], i) => (
              <tr key={d as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-semibold">{d}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{u}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-[12px]">{ex}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{env}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        <strong>JavaScriptだけミリ秒</strong>な点に注意。<code>Date.now()</code> は13桁を返すため、10桁の秒を扱うAPIとやり取りするときは1000で割る／掛ける変換が必要です。このツールは桁数から自動判定します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2038年問題</h2>
      <p>
        32ビットの符号付き整数で秒を保持するシステムは、<strong>2038年1月19日 03:14:07 UTC</strong> を超えると値が桁あふれ（オーバーフロー）し、
        時刻が1901年などに巻き戻る不具合が起こり得ます。これが「2038年問題」です。現在の64ビット環境や主要言語では対策済みですが、
        古い組み込み機器やレガシーDBでは今も注意が必要です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・ログやデータベースに記録されたタイムスタンプを読める日時に直す</li>
        <li>・JWTの <code>exp</code>（有効期限）や <code>iat</code>（発行時刻）を確認する</li>
        <li>・cronやバッチの実行時刻、キャッシュの有効期限を計算する</li>
        <li>・特定の日時のタイムスタンプを求めてテストデータに使う</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">言語別の現在時刻の取得</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {[
              ["JavaScript（ミリ秒）", "Date.now()"],
              ["JavaScript（秒）", "Math.floor(Date.now() / 1000)"],
              ["Python", "import time; int(time.time())"],
              ["PHP", "time()"],
              ["Linux CLI", "date +%s"],
            ].map(([lang, code], i) => (
              <tr key={lang as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium whitespace-nowrap">{lang}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-[12px]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
