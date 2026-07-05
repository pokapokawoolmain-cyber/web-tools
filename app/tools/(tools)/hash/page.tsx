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
  keywords: ["ハッシュ 生成", "sha256 生成", "sha1 sha512 生成", "ハッシュ値 計算 ツール", "文字列 ハッシュ化"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "どのハッシュ方式に対応していますか？", acceptedAnswer: { "@type": "Answer", text: "SHA-1・SHA-256・SHA-384・SHA-512に対応しています。ブラウザ標準のWeb Crypto APIを使って計算するため、追加のインストールは不要です。複数方式を同時に表示できます。" } },
    { "@type": "Question", name: "MD5は使えますか？", acceptedAnswer: { "@type": "Answer", text: "MD5はブラウザ標準のAPIに含まれないため、このツールでは未対応です。MD5・SHA-1は衝突が見つかっており、改ざん検知やパスワード保護にはSHA-256以上の使用が推奨されます。" } },
    { "@type": "Question", name: "同じ文字列なら毎回同じ結果になりますか？", acceptedAnswer: { "@type": "Answer", text: "はい。ハッシュは同じ入力に対して必ず同じ値を返します。逆にわずかでも入力が変わると結果は大きく変わるため、内容が一致しているかの確認に使えます。" } },
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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・配布物のSHA-256チェックサムと照合して改ざんがないか確認する</li>
        <li>・2つの文字列が完全に一致するかをハッシュで比べる</li>
        <li>・APIの署名やキャッシュキーの生成ロジックを手元で確認する</li>
      </ul>
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
