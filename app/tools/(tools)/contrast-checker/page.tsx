import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ContrastChecker } from "./ContrastChecker";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "コントラストチェッカー（WCAG対応）",
  "文字色と背景色のコントラスト比をWCAG 2.1基準（AA/AAA）で即チェック。Webアクセシビリティ対応に必須の無料ツール。",
  "contrast-checker",
  ["コントラスト比 チェック WCAG", "アクセシビリティ 色 チェック", "color contrast checker 無料", "WCAG AA AAA 判定", "文字色 背景色 コントラスト"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "WCAGのコントラスト比とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "WCAG（Web Content Accessibility Guidelines）は、Webコンテンツのアクセシビリティ基準です。コントラスト比とは文字色と背景色の明るさの差を数値化したもので、通常テキストはAA基準4.5:1以上、AAA基準7:1以上が推奨されます。" },
    },
    {
      "@type": "Question",
      name: "AA基準とAAA基準の違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "AA基準（コントラスト比4.5:1以上）は法的要件になる場合もある標準的な基準です。AAA基準（7:1以上）はさらに高い基準で、視覚障害のある方にも読みやすいレベルです。多くのWebサイトはAA準拠を目標にします。" },
    },
    {
      "@type": "Question",
      name: "大きなテキストの基準はなぜ異なりますか？",
      acceptedAnswer: { "@type": "Answer", text: "文字が大きいほど読みやすくなるため、18px以上の通常テキストまたは14px以上の太字テキスト（大きなテキスト）は3:1以上でAA合格となります。視認性が高い分、コントラスト要件が緩和されています。" },
    },
    {
      "@type": "Question",
      name: "コントラスト比が低いとどんな問題がありますか？",
      acceptedAnswer: { "@type": "Answer", text: "コントラスト比が低いと、弱視・色覚異常・高齢者などのユーザーが文字を読みにくくなります。また、明るい日差しの下でスマートフォンを見る際も視認性が下がります。アクセシビリティ法規制がある国では法的リスクにもなりえます。" },
    },
    {
      "@type": "Question",
      name: "コントラスト比の計算方法を教えてください",
      acceptedAnswer: { "@type": "Answer", text: "相対輝度（Relative Luminance）を使って計算します。コントラスト比 = (L1 + 0.05) / (L2 + 0.05)（L1が明るい方、L2が暗い方）。このツールはWCAG 2.1仕様に準拠した計算式を使用しています。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      コントラストチェッカーの使い方
    </h2>
    <p>
      文字色（Foreground）と背景色（Background）のHEXカラーコードを入力するか、カラーピッカーで色を選ぶと、
      コントラスト比が即座に計算されWCAG 2.1基準に基づく合否判定が表示されます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      Webアクセシビリティとコントラスト
    </h3>
    <p>
      WCAG 2.1 AA基準（コントラスト比4.5:1以上）は、政府系サイト・企業サイトで広く求められる標準です。
      日本のJIS X 8341-3やEUのEN 301 549、米国のSection 508でも参照されています。
      デザイン段階でコントラストを確認することで、後から修正する手間を省けます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      チェックすべき主な箇所
    </h3>
    <p>
      本文テキスト・リンクテキスト・ボタンラベル・プレースホルダー・アイコンラベルなどは特に重要です。
      背景画像の上のテキストは動的に変化するため、最も暗い部分と最も明るい部分の両方でチェックを推奨します。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/hex-rgb-converter" className="text-violet-600 dark:text-violet-400 hover:underline mx-1">HEX・RGB変換</Link>・
      <Link href="/tools/color-palette" className="text-violet-600 dark:text-violet-400 hover:underline mx-1">カラーパレット生成</Link>
    </p>
  </div>
);

export default function ContrastCheckerPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="コントラストチェッカー（WCAG対応）"
        description="文字色と背景色のコントラスト比をWCAG 2.1基準（AA/AAA）で即チェック。Webアクセシビリティ対応に必須の無料ツール。"
        icon="🔍"
        slug="contrast-checker"
        seoContent={seoContent}
      >
        <ContrastChecker />
      </ToolLayout>
    </>
  );
}
