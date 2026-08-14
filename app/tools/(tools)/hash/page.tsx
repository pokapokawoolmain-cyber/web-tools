import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { HashTool } from "./HashTool";

export const metadata: Metadata = generateMeta({
  title: "ハッシュ生成ツール｜SHA-1 / SHA-256 / SHA-384 / SHA-512【無料・ブラウザ完結】",
  description:
    "テキストからSHA-1・SHA-256・SHA-384・SHA-512のハッシュ値をリアルタイム生成できる無料ツール。ファイルの改ざん確認や文字列の整合性チェックに。処理はブラウザ内で完結し、入力は外部に送信されません。",
  path: "/tools/hash",
  ogImage: `/api/og?${new URLSearchParams({ title: "ハッシュ生成（SHA）", icon: "🔒", desc: "テキストからSHA-1・SHA-256・SHA-384・" }).toString()}`,
  keywords: ["ハッシュ 生成", "sha256 生成", "sha1 sha512 生成", "ハッシュ値 計算 ツール", "文字列 ハッシュ化"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "どのハッシュ方式に対応していますか？", acceptedAnswer: { "@type": "Answer", text: "SHA-1・SHA-256・SHA-384・SHA-512に対応しています。ブラウザ標準のWeb Crypto APIを使って計算するため、追加のインストールは不要です。複数方式を同時に表示できます。" } },
    { "@type": "Question", name: "MD5は使えますか？", acceptedAnswer: { "@type": "Answer", text: "MD5はブラウザ標準のAPIに含まれないため、このツールでは未対応です。MD5・SHA-1は衝突が見つかっており、改ざん検知やパスワード保護にはSHA-256以上の使用が推奨されます。" } },
    { "@type": "Question", name: "同じ文字列なら毎回同じ結果になりますか？", acceptedAnswer: { "@type": "Answer", text: "はい。ハッシュは同じ入力に対して必ず同じ値を返します。逆にわずかでも入力が変わると結果は大きく変わるため、内容が一致しているかの確認に使えます。" } },
    { "@type": "Question", name: "パスワードの保存にSHA-256を使ってよいですか？", acceptedAnswer: { "@type": "Answer", text: "推奨しません。SHAは高速なため、流出時に総当たり攻撃で破られやすくなります。パスワードの保存にはbcrypt・scrypt・Argon2など、意図的に低速でソルトを内包する専用アルゴリズムを使ってください。SHAは改ざん検知や整合性確認など速度が利点になる用途に向いています。" } },
    { "@type": "Question", name: "入力した文字列は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。計算はすべてブラウザ内で行われ、入力した文字列が外部に送信されることはありません。機密を含む値も安全に扱えます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>ハッシュ化したい文字列を入力する（入力と同時に計算されます）</li>
        <li>必要な方式（SHA-256 など）を選ぶ。複数選択も可能</li>
        <li>表示されたハッシュ値をコピーする</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ハッシュとは — 一方向の「指紋」</h2>
      <p className="mb-3">
        ハッシュ関数は、任意の長さのデータを<strong>固定長の値に変換する一方向の関数</strong>です。同じ入力からは必ず同じ値が出る一方、
        <strong>ハッシュ値から元のデータを復元することはできません</strong>。また入力が1文字でも変わると結果は全く別物になります（雪崩効果）。
        この性質から、データの「指紋」として改ざん検知や整合性確認に使われます。
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 font-mono text-[12px] text-slate-700 dark:text-zinc-200 mb-2 overflow-x-auto leading-relaxed">
        SHA-256(&quot;hello&quot;) = 2cf24dba5fb0a30e...<br />
        SHA-256(&quot;Hello&quot;) = 185f8db32271fe25...　<span className="text-slate-400">← 先頭1文字違うだけで全く別の値</span>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">SHA方式の違いと選び方</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">方式</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">出力長</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">安全性・用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["SHA-1", "160ビット（40桁）", "衝突が実証済み。新規の改ざん検知には非推奨"],
              ["SHA-256", "256ビット（64桁）", "現在の標準。証明書・チェックサム・署名に広く利用"],
              ["SHA-384", "384ビット（96桁）", "SHA-512の切り詰め版。より高い安全余裕"],
              ["SHA-512", "512ビット（128桁）", "64bit環境で高速。長期保管や高強度用途"],
            ].map(([m, len, use], i) => (
              <tr key={m as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">{m}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{len}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        迷ったら <strong>SHA-256</strong> を選べば大きく外しません。MD5・SHA-1はいずれも衝突攻撃が成立しているため、セキュリティ用途では避けてください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">⚠️ パスワード保存にSHAを「そのまま」使わない</h2>
      <p className="mb-3">
        よくある誤りが、パスワードをSHA-256でハッシュ化してDBに保存することです。SHAは<strong>高速すぎる</strong>ため、
        流出時に総当たり・辞書攻撃で短時間に破られます。パスワードの保存には、意図的に低速で塩（ソルト）を組み込む専用アルゴリズムを使ってください。
      </p>
      <ul className="space-y-1.5">
        <li>・推奨：<strong>bcrypt / scrypt / Argon2</strong>（ストレッチングとソルトを内包）</li>
        <li>・SHAが向くのは「改ざん検知・整合性確認・署名の一部」など、速度が利点になる用途</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・配布ファイルのSHA-256チェックサムと照合し、ダウンロードの破損・改ざんを確認する</li>
        <li>・2つのデータが完全一致するかをハッシュで素早く比較する</li>
        <li>・APIリクエストの署名（HMAC）やキャッシュキーの生成ロジックを手元で検証する</li>
        <li>・Gitのコミットハッシュのように、内容から一意なIDを導出する</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">コマンドでの確認例</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {[
              ["macOS / Linux", "shasum -a 256 file.zip"],
              ["Linux", "sha256sum file.zip"],
              ["Windows", "certutil -hashfile file.zip SHA256"],
              ["JavaScript", "crypto.subtle.digest('SHA-256', data)"],
            ].map(([env, code], i) => (
              <tr key={env as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium whitespace-nowrap">{env}</td>
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
        <li>・<Link href="/tools/base64" className="text-sky-600 dark:text-sky-400 hover:underline">Base64エンコード/デコード</Link></li>
        <li>・<Link href="/tools/uuid" className="text-sky-600 dark:text-sky-400 hover:underline">UUID生成</Link></li>
        <li>・<Link href="/tools/password-generator" className="text-sky-600 dark:text-sky-400 hover:underline">パスワード生成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ハッシュ生成（SHA）"
        description="テキストからSHA-1/256/384/512のハッシュ値をリアルタイム生成。改ざん確認や整合性チェックに。ブラウザ完結。"
        icon="🔒"
        slug="hash"
        seoContent={seoContent}
      >
        <HashTool />
      </ToolLayout>
    </>
  );
}
