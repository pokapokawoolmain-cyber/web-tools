import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ColorPalette } from "./ColorPalette";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "カラーパレット生成",
  "ベースカラーから補色・類似色・トライアドなど5種類の配色パターンを自動生成。CSS変数でまとめてコピー可能。",
  "color-palette",
  ["カラーパレット生成", "配色ツール", "補色", "類似色", "トライアド", "Webデザイン配色"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "補色とはどんな配色ですか？",
      acceptedAnswer: { "@type": "Answer", text: "色相環で正反対に位置する色の組み合わせです。青と橙、赤と緑などが代表例です。高いコントラストで視覚的なメリハリが生まれ、CTAボタンや重要な要素を目立たせるのに効果的です。" },
    },
    {
      "@type": "Question",
      name: "類似色配色はどんな場面に向いていますか？",
      acceptedAnswer: { "@type": "Answer", text: "色相環で隣り合う色（±30〜60°）を使う配色です。統一感のある柔らかい印象になります。コーポレートサイト・ナチュラル系ECサイト・ポートフォリオなどに適しています。" },
    },
    {
      "@type": "Question",
      name: "生成したパレットをCSSで使うには？",
      acceptedAnswer: { "@type": "Answer", text: "「CSS変数としてコピー」ボタンで全色を --color-1: #xxx; の形式でコピーできます。CSSファイルの :root {} ブロックに貼り付けると、color: var(--color-1); で利用できます。" },
    },
    {
      "@type": "Question",
      name: "Tailwind CSSでカスタムカラーを使いたい場合は？",
      acceptedAnswer: { "@type": "Answer", text: "tailwind.config.jsのtheme.extend.colorsに生成したHEXカラーを追加します。例：colors: { primary: '#667eea', secondary: '#764ba2' } のように設定します。" },
    },
    {
      "@type": "Question",
      name: "モノクロ配色はどんな場合に使いますか？",
      acceptedAnswer: { "@type": "Answer", text: "同じ色相で明度だけを変化させた配色です。洗練されたモダンな印象を与えます。メインカラーにアクセントカラーを1色だけ加えるデザインと相性が良いです。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      カラーパレット生成ツールの使い方
    </h2>
    <p>
      ベースカラーをカラーピッカーまたはHEXコードで入力し、配色パターンを選ぶだけでパレットが自動生成されます。
      生成された各色はワンクリックでコピー可能。CSS変数としてまとめてコピーもできます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      5種類の配色パターン
    </h3>
    <p>
      <strong>補色</strong>は対角線上の色でメリハリある配色に。<strong>類似色</strong>は統一感のある柔らかい印象。
      <strong>トライアド</strong>は3色で豊かな表現。<strong>分裂補色</strong>は補色より穏やかな対比。
      <strong>モノクロ</strong>は明度5段階でシックな配色に。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/hex-rgb-converter" className="text-pink-600 dark:text-pink-400 hover:underline mx-1">HEX・RGB変換</Link>・
      <Link href="/tools/contrast-checker" className="text-pink-600 dark:text-pink-400 hover:underline mx-1">コントラストチェッカー</Link>
    </p>
  </div>
);

export default function ColorPalettePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="カラーパレット生成"
        description="ベースカラーから補色・類似色・トライアドなど5種類の配色パターンを自動生成。CSS変数でまとめてコピー可能。"
        icon="🖌️"
        slug="color-palette"
        seoContent={seoContent}
      >
        <ColorPalette />
      </ToolLayout>
    </>
  );
}
