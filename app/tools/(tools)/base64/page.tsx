import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Base64Tool } from "./Base64Tool";

export const metadata: Metadata = generateMeta({
  title: "Base64エンコード・デコードツール｜日本語（UTF-8）対応【無料】",
  description:
    "テキストをBase64にエンコード、Base64をテキストにデコードできる無料ツール。日本語（UTF-8）とURLセーフ形式に対応。データURIやトークンの確認に。ブラウザ内処理でデータは外部に送信されません。",
  path: "/tools/base64",
  ogImage: `/api/og?${new URLSearchParams({ title: "Base64エンコード/デコード", icon: "🔤", desc: "テキストをBase64にエンコード、Base64をテキス" }).toString()}`,
  keywords: ["base64 エンコード", "base64 デコード", "base64 変換 日本語", "base64 url safe", "base64 ツール 無料"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "日本語もBase64にできますか？", acceptedAnswer: { "@type": "Answer", text: "はい。UTF-8としてエンコードするため、日本語や絵文字を含む文字列も正しく変換・復元できます。" } },
    { "@type": "Question", name: "URLセーフ形式とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "Base64の記号「+」「/」をURLで使える「-」「_」に置き換え、末尾のパディング（=）を省いた形式です。JWTやクエリ文字列などURLに埋め込む用途で使われます。形式の切り替えに対応しています。" } },
    { "@type": "Question", name: "入力した文字列は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。トークンや認証情報など機密を含む文字列も安全に扱えます。" } },
    { "@type": "Question", name: "Base64は暗号化ですか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。Base64はデータを文字として表現するためのエンコード方式で、暗号化ではありません。誰でも元に戻せるため、秘密の保護には暗号化やハッシュを使ってください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>変換したい文字列を入力する</li>
        <li>「Base64にエンコード」または「テキストにデコード」を押す</li>
        <li>必要に応じて標準／URLセーフ形式を切り替える</li>
        <li>結果をコピーする（「入替」で入力と結果を入れ替え可能）</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Base64の仕組み — なぜ約1.33倍になるのか</h2>
      <p className="mb-3">
        Base64は、任意のバイト列を <code>A-Z a-z 0-9 + /</code> の64種類の文字だけで表す方式です。
        <strong>3バイト（24ビット）を6ビットずつ4つに区切り、4文字に変換</strong>します。3バイトが4文字になるため、データ量は約 <strong>4/3＝1.33倍</strong> に増えます。
        端数は末尾の <code>=</code>（パディング）で調整します。
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 font-mono text-[12px] text-slate-700 dark:text-zinc-200 mb-2 overflow-x-auto leading-relaxed">
        &quot;Man&quot; → 01001101 01100001 01101110 → 010011 010110 000101 101110 → <span className="text-sky-600 dark:text-sky-400">TWFu</span>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        バイナリを「テキストしか通れない経路」に安全に載せるための仕組みで、圧縮でも暗号化でもありません。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・<strong>データURI：</strong>小さな画像やフォントをHTML/CSSに <code>data:image/png;base64,...</code> として埋め込み、HTTPリクエストを減らす</li>
        <li>・<strong>Basic認証：</strong><code>Authorization: Basic</code> ヘッダの <code>ユーザー名:パスワード</code> をBase64化（＝暗号化ではないのでHTTPS必須）</li>
        <li>・<strong>メール（MIME）：</strong>添付ファイルや日本語本文をテキスト経路で送るためにエンコード</li>
        <li>・<strong>JWT：</strong>ヘッダ・ペイロードをURLセーフBase64で連結（中身は誰でもデコード可能）</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">標準形式とURLセーフ形式の違い</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">標準</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">URLセーフ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["62番目の文字", "+", "-"],
              ["63番目の文字", "/", "_"],
              ["末尾のパディング", "= を付ける", "省略することが多い"],
              ["主な用途", "メール・データURI", "URL・クエリ・JWT・ファイル名"],
            ].map(([k, a, b], i) => (
              <tr key={k as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{k}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono">{a}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        <code>+</code> や <code>/</code> はURLで特別な意味を持つため、URLに載せるときはURLセーフ形式を使います。このツールは両形式を切り替えられます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">つまずきやすいポイント</h2>
      <ul className="space-y-1.5">
        <li>・<strong>暗号化ではない：</strong>Base64は誰でも元に戻せます。パスワードやトークンの「保護」にはならず、通信の秘匿にはHTTPSや暗号化を使ってください。</li>
        <li>・<strong>日本語の文字化け：</strong>マルチバイト文字はまずUTF-8のバイト列にしてからBase64化する必要があります（このツールは自動でUTF-8処理します）。素朴な <code>btoa()</code> は日本語で例外になります。</li>
        <li>・<strong>サイズが増える：</strong>約1.33倍になるため、大きなファイルをデータURIで埋め込むとHTMLが重くなります。大画像は通常のファイル参照が有利です。</li>
        <li>・<strong>改行の混入：</strong>メール用のBase64は76文字ごとに改行が入ることがあり、そのままデコードすると失敗する場合があります。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">言語別のエンコード例</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {[
              ["JavaScript", "btoa(unescape(encodeURIComponent(s)))"],
              ["Python", "base64.b64encode(s.encode())"],
              ["PHP", "base64_encode($s)"],
              ["Linux CLI", "echo -n 'text' | base64"],
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
        <li>・<Link href="/tools/url-encode" className="text-sky-600 dark:text-sky-400 hover:underline">URLエンコード/デコード</Link></li>
        <li>・<Link href="/tools/hash" className="text-sky-600 dark:text-sky-400 hover:underline">ハッシュ生成（SHA）</Link></li>
        <li>・<Link href="/tools/json-formatter" className="text-sky-600 dark:text-sky-400 hover:underline">JSON整形・圧縮</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Base64エンコード/デコード"
        description="テキストとBase64を相互変換。日本語（UTF-8）・URLセーフ形式に対応。ブラウザ内処理で安全。"
        icon="🔤"
        slug="base64"
        seoContent={seoContent}
      >
        <Base64Tool />
      </ToolLayout>
    </>
  );
}
