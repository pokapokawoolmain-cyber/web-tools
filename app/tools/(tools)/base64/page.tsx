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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・データURI（画像などをテキストとして埋め込む）の確認</li>
        <li>・Basic認証ヘッダやトークンの中身の確認</li>
        <li>・メール（MIME）やAPIで受け取ったBase64文字列の復元</li>
      </ul>
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
