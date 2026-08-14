import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { UrlEncodeTool } from "./UrlEncodeTool";

export const metadata: Metadata = generateMeta({
  title: "URLエンコード・デコードツール｜パーセントエンコード【無料】",
  description:
    "URLやクエリ文字列をパーセントエンコード・デコードできる無料ツール。日本語や記号・スペースを含むURLの変換に。encodeURIComponent相当と、URL構造を保持する変換の両方に対応。ブラウザ完結で安全。",
  path: "/tools/url-encode",
  ogImage: `/api/og?${new URLSearchParams({ title: "URLエンコード/デコード", icon: "🔗", desc: "URLやクエリ文字列をパーセントエンコード・デコード" }).toString()}`,
  keywords: ["url エンコード", "url デコード", "パーセントエンコード", "url 変換 日本語", "encodeuricomponent ツール"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "2つの変換形式はどう違いますか？", acceptedAnswer: { "@type": "Answer", text: "「全記号」はスラッシュや疑問符などURLの区切り記号も含めてすべてエンコードします（encodeURIComponent相当）。クエリの値に使うときはこちらです。「URL構造は保持」はURLとして意味のある記号を残したままエンコードします（encodeURI相当）。用途で使い分けてください。" } },
    { "@type": "Question", name: "日本語を含むURLも変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。日本語やスペース、記号を含む文字列をパーセントエンコードして、URLで安全に使える形にできます。デコードで元に戻すこともできます。" } },
    { "@type": "Question", name: "「+」はスペースに戻りますか？", acceptedAnswer: { "@type": "Answer", text: "デコード時は、フォーム送信で使われる「+」をスペースとして復元します。パーセントエンコード（%20）のスペースも同様に戻ります。" } },
    { "@type": "Question", name: "入力したURLは送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はブラウザ内で完結し、入力したURLやパラメータが外部に送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>URLまたはクエリ文字列を入力する</li>
        <li>「URLエンコード」または「URLデコード」を押す</li>
        <li>クエリの値に使う場合は「全記号」、URL全体を扱う場合は「URL構造は保持」を選ぶ</li>
        <li>結果をコピーする</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">パーセントエンコードとは</h2>
      <p className="mb-3">
        URLで使える文字は英数字と一部の記号に限られます。日本語・スペース・<code>&amp;</code> などをそのままURLに入れると、
        区切り記号と誤解されたり壊れたりします。そこで、使えない文字を<strong>バイトに分解し、各バイトを <code>%XX</code>（16進数）で表す</strong>のがパーセントエンコードです。
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 font-mono text-[12px] text-slate-700 dark:text-zinc-200 overflow-x-auto leading-relaxed">
        あ → UTF-8で E3 81 82 → <span className="text-sky-600 dark:text-sky-400">%E3%81%82</span><br />
        （半角スペース） → <span className="text-sky-600 dark:text-sky-400">%20</span>　/　&amp; → <span className="text-sky-600 dark:text-sky-400">%26</span>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">encodeURIComponent と encodeURI の違い（最重要）</h2>
      <p className="mb-3">
        JavaScriptには2つの関数があり、<strong>取り違えるとURLが壊れます</strong>。違いは「URLの区切り記号もエンコードするか」です。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">関数（本ツール）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left"><code>/ ? : @ &amp; =</code> を</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">使う場面</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["encodeURIComponent（全記号）", "エンコードする", "クエリの「値」1つずつ。リダイレクト先URLを値に入れるとき"],
              ["encodeURI（URL構造は保持）", "残す", "URL全体をまとめて整えるとき"],
            ].map(([fn, mark, use], i) => (
              <tr key={fn as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-[12px] text-sky-600 dark:text-sky-400">{fn}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{mark}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        鉄則：<strong>「値」は encodeURIComponent（全記号）</strong>。例えば <code>?redirect=</code> の後に別のURLを入れるとき、
        構造保持で処理するとその中の <code>?</code> や <code>&amp;</code> が区切りと誤解され、パラメータが壊れます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">つまずきやすいポイント</h2>
      <ul className="space-y-1.5">
        <li>・<strong>スペースは <code>%20</code> か <code>+</code> か：</strong>URLパス・クエリの標準は <code>%20</code>。ただし <code>application/x-www-form-urlencoded</code>（フォーム送信）では <code>+</code> がスペースを表します。デコード時は文脈に注意。</li>
        <li>・<strong>二重エンコード：</strong>すでにエンコード済みの文字列を再度エンコードすると <code>%</code> 自体が <code>%25</code> になり、<code>%2520</code> のように壊れます。エンコードは1回だけ。</li>
        <li>・<strong>予約文字と非予約文字：</strong><code>- _ . ~</code> はエンコード不要（非予約文字）。それ以外の記号は用途に応じてエンコードします。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・日本語や記号を含む検索キーワードをURLに埋め込む</li>
        <li>・受け取ったURLの <code>%</code> エンコードを元に戻して内容を確認する</li>
        <li>・OAuthのリダイレクトURLやUTMパラメータを、値として安全にエンコードする</li>
        <li>・ログやWebサーバーの記録に残ったエンコード済みURLを読み解く</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・<Link href="/tools/base64" className="text-sky-600 dark:text-sky-400 hover:underline">Base64エンコード/デコード</Link></li>
        <li>・<Link href="/tools/json-formatter" className="text-sky-600 dark:text-sky-400 hover:underline">JSON整形・圧縮</Link></li>
        <li>・<Link href="/tools/qr-generator" className="text-sky-600 dark:text-sky-400 hover:underline">QRコード生成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="URLエンコード/デコード"
        description="URL・クエリ文字列をパーセントエンコード・デコード。日本語や記号を含むURLの変換に。ブラウザ完結。"
        icon="🔗"
        slug="url-encode"
        seoContent={seoContent}
      >
        <UrlEncodeTool />
      </ToolLayout>
    </>
  );
}
