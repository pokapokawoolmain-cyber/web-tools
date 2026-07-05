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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・日本語や記号を含む検索キーワードをURLに埋め込む</li>
        <li>・受け取ったURLの%エンコードを元に戻して内容を確認する</li>
        <li>・UTMパラメータやリダイレクト先URLを安全にエンコードする</li>
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
