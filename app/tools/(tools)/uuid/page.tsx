import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { UuidTool } from "./UuidTool";

export const metadata: Metadata = generateMeta({
  title: "UUID生成ツール｜v4ランダムUUIDをまとめて発行【無料・登録不要】",
  description:
    "UUID（v4・ランダム）をワンクリックで生成。1〜100個の一括生成に対応し、大文字・ハイフンなし・波括弧付きなどの形式も選べます。各行コピー・全部コピー対応。ブラウザ内で生成され外部に送信されません。",
  path: "/tools/uuid",
  ogImage: `/api/og?${new URLSearchParams({ title: "UUID生成", icon: "🆔", desc: "UUID（v4・ランダム）をワンクリックで生成" }).toString()}`,
  keywords: ["uuid 生成", "uuid v4 生成", "uuid v7", "uuid v4 v7 違い", "uuid 作成 無料", "guid 生成", "uuid まとめて 生成", "uuid データベース 主キー"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "生成されるUUIDのバージョンは何ですか？", acceptedAnswer: { "@type": "Answer", text: "v4（ランダム）です。ブラウザ標準のcrypto.randomUUIDを使い、暗号学的に安全な乱数から生成します。実用上、重複はほぼ起こりません。" } },
    { "@type": "Question", name: "何個まで一度に作れますか？", acceptedAnswer: { "@type": "Answer", text: "1個から100個まで一括生成できます。テストデータの用意やシード作成などに便利です。全部まとめてコピーもできます。" } },
    { "@type": "Question", name: "形式は変えられますか？", acceptedAnswer: { "@type": "Answer", text: "大文字化、ハイフンなし（32桁）、波括弧 {} 付きの各形式に切り替えられます。データベースや言語の慣習に合わせて選んでください。" } },
    { "@type": "Question", name: "データベースの主キーにはv4とv7どちらが良いですか？", acceptedAnswer: { "@type": "Answer", text: "時刻順に並ぶv7が主キーに向いています。v4は完全ランダムのため、B-Tree系インデックスへの挿入位置がばらつき、断片化やキャッシュ効率低下の原因になりがちです。v7はUnix時刻が先頭に来るため昇順に挿入され、インデックスが効率的になります（RFC 9562で標準化）。" } },
    { "@type": "Question", name: "UUIDは秘密のトークンとして使えますか？", acceptedAnswer: { "@type": "Answer", text: "推奨しません。v4はランダムですが、秘密鍵として設計されたものではありません。パスワードリセットや認証トークンなど推測されて困る用途には、専用の乱数トークン生成を使ってください。" } },
    { "@type": "Question", name: "生成した値は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。生成はすべてブラウザ内で行われ、UUIDが外部サーバーに送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>生成数（1〜100）を指定する</li>
        <li>必要なら大文字・ハイフンなし・波括弧付きを選ぶ</li>
        <li>「生成する」を押す</li>
        <li>各行をタップして個別コピー、または「全部コピー」でまとめて取得</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">UUIDとは — 構造を理解する</h2>
      <p className="mb-3">
        UUID（Universally Unique Identifier）は、中央の採番サーバーを使わずに、各端末が独立して発行しても衝突しないよう設計された<strong>128ビットの識別子</strong>です。
        Microsoft系では GUID とも呼ばれますが、実体は同じものです。表記は32桁の16進数を 8-4-4-4-12 に区切った形式が標準です。
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 font-mono text-[13px] text-slate-700 dark:text-zinc-200 mb-3 overflow-x-auto">
        f47ac10b-58cc-<span className="text-sky-600 dark:text-sky-400">4</span>372-<span className="text-emerald-600 dark:text-emerald-400">a</span>567-0e02b2c3d479
      </div>
      <ul className="space-y-1.5">
        <li>・<span className="text-sky-600 dark:text-sky-400 font-mono">4</span> の位置（13桁目）が<strong>バージョン番号</strong>。v4なら 4、v7なら 7 が入ります。</li>
        <li>・<span className="text-emerald-600 dark:text-emerald-400 font-mono">a</span> の位置（17桁目）が<strong>バリアント</strong>で、通常 8・9・a・b のいずれかになります。</li>
        <li>・残りの桁が乱数やタイムスタンプなどの実データです。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">v1・v4・v7の違いと使い分け</h2>
      <p className="mb-3">
        よく使われるのは完全ランダムの<strong>v4</strong>ですが、データベースの主キーに使うなら、時刻順に並ぶ<strong>v7</strong>を検討する価値があります。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">生成元</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">並び順</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">向いている用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["v1", "時刻＋MACアドレス", "ほぼ時刻順", "レガシー互換。MAC露出に注意"],
              ["v4", "乱数（122ビット）", "ランダム", "一般的な識別子・APIキー・分散環境"],
              ["v7", "Unix時刻＋乱数", "時刻順（昇順）", "DB主キー。インデックス断片化を抑制"],
            ].map(([v, src, order, use], i) => (
              <tr key={v as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">{v}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{src}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{order}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        v4はランダムのため、主キーにするとB-Tree系インデックスへの挿入位置がばらつき、断片化やキャッシュ効率の低下を招くことがあります。
        近年は時刻が先頭に来る v7 が主キー向きとして標準化（RFC 9562）され、注目されています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">衝突（重複）は本当に起きないのか</h2>
      <p>
        v4は122ビットの乱数を持ち、組み合わせは約 5.3×10<sup>36</sup> 通りあります。
        目安として<strong>10億個のUUIDを毎秒生成し続けても、50%の確率で1回衝突するまでに約85年</strong>かかる計算です。
        現実的なアプリケーションでは重複を心配する必要はほぼありませんが、乱数の質が低い環境（安全でない乱数源）では衝突リスクが上がるため、
        このツールはブラウザ標準の暗号学的乱数（<code>crypto.randomUUID</code>）を使用しています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">言語・DBでの生成例</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {[
              ["JavaScript", "crypto.randomUUID()"],
              ["Python", "import uuid; uuid.uuid4()"],
              ["Java", "java.util.UUID.randomUUID()"],
              ["Go", "github.com/google/uuid → uuid.New()"],
              ["PostgreSQL", "gen_random_uuid()"],
              ["MySQL 8", "UUID()"],
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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使うときの注意点</h2>
      <ul className="space-y-1.5">
        <li>・<strong>推測されて困る値には単体で使わない：</strong>v4はランダムですが「秘密のトークン」として設計されたものではありません。パスワードリセット等の秘密鍵には専用の<Link href="/tools/password-generator" className="text-sky-600 dark:text-sky-400 hover:underline">乱数トークン</Link>を使ってください。</li>
        <li>・<strong>URLやログに載る前提で扱う：</strong>UUID自体に個人情報は含まれませんが、v1はMACアドレスと時刻を含むため、外部公開する識別子には向きません。</li>
        <li>・<strong>DB主キーはv7か、内部連番＋外部UUIDの併用を検討：</strong>ストレージ効率と分散耐性のバランスを取れます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・<Link href="/tools/hash" className="text-sky-600 dark:text-sky-400 hover:underline">ハッシュ生成（SHA）</Link>：値の指紋を作る</li>
        <li>・<Link href="/tools/password-generator" className="text-sky-600 dark:text-sky-400 hover:underline">パスワード生成</Link>：秘密のトークンはこちら</li>
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
        title="UUID生成"
        description="v4ランダムUUIDをまとめて生成。大文字・ハイフンなし・波括弧付きに対応。ブラウザ内で生成。"
        icon="🆔"
        slug="uuid"
        seoContent={seoContent}
      >
        <UuidTool />
      </ToolLayout>
    </>
  );
}
