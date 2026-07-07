import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { GradientGenerator } from "./GradientGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "CSSグラデーション作成【無料】linear・radial・conicをプレビューしながら生成",
  description: "CSSグラデーション（linear-gradient・radial-gradient・conic-gradient）をビジュアル操作で作成し、コードをワンクリックでコピー。プリセット20種以上。Web制作・バナー背景に。無料・登録不要。",
  path: "/tools/gradient-generator",
  keywords: ["CSS グラデーション 作成","linear-gradient ジェネレーター","グラデーション CSS コピー","背景 グラデーション css","グラデーションカラー 作成"],
  ogImage: `/api/og?${new URLSearchParams({ title: "CSSグラデーション作成", icon: "🌈", desc: "CSSグラデーションを視覚的に作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "linear-gradient・radial-gradient・conic-gradientの違いは？",
      acceptedAnswer: { "@type": "Answer", text: "linear-gradientは直線方向のグラデーション、radial-gradientは中心から放射状に広がるグラデーション、conic-gradientは中心点を軸に回転するグラデーションです。用途に合わせて選びましょう。" },
    },
    {
      "@type": "Question",
      name: "グラデーションに使う色を3色以上にできますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。「追加」ボタンで最大5色までカラーストップを追加できます。各ストップの色とパーセント位置を自由に調整できます。" },
    },
    {
      "@type": "Question",
      name: "生成したCSSはどのように使いますか？",
      acceptedAnswer: { "@type": "Answer", text: "「CSSをコピー」ボタンでクリップボードにコピーし、CSSファイルの該当セレクタに貼り付けるだけです。background: linear-gradient(...); の形式でそのまま使えます。" },
    },
    {
      "@type": "Question",
      name: "プリセットとは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "サンセット・オーシャン・フォレストなど、デザインですぐ使える20種類のカラーセットです。クリックするとカラーストップが自動的に設定されます。" },
    },
    {
      "@type": "Question",
      name: "Tailwind CSSでカスタムグラデーションを使う方法は？",
      acceptedAnswer: { "@type": "Answer", text: "tailwind.config.jsのtheme.extendにbacgroundImageを追加し、生成したCSS文字列を値として設定します。または`style`プロパティに直接background値を渡すインラインスタイルでも使えます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      CSSグラデーション生成ツールの使い方
    </h2>
    <p>
      グラデーションタイプ（Linear・Radial・Conic）を選び、カラーストップの色と位置を調整するだけでCSS文字列が即座に生成されます。
      コピーボタンでクリップボードにコピーし、CSSファイルにそのまま貼り付けて使えます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      3種類のグラデーション
    </h3>
    <p>
      <strong>Linear（線形）</strong>は角度を指定して直線方向に色が変化します。ヘッダー背景やボタンに最適。
      <strong>Radial（放射状）</strong>は中心から円状に広がり、スポットライト効果や丸いアイコンに使われます。
      <strong>Conic（円錐）</strong>は回転方向の色変化で、円グラフ風のデザインやカラーホイールに活用できます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      プリセットと活用シーン
    </h3>
    <p>
      サンセット・オーシャン・ゴールドなど20種類のプリセットからすぐに始められます。
      Webバナー・SNSカバー画像・UIカード・ボタンのホバーエフェクトなど、様々な場面で活用できます。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/hex-rgb-converter" className="text-violet-600 dark:text-violet-400 hover:underline mx-1">HEX・RGB変換</Link>・
      <Link href="/tools/color-palette" className="text-violet-600 dark:text-violet-400 hover:underline mx-1">カラーパレット生成</Link>
    </p>
  </div>
);

export default function GradientGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="CSSグラデーション生成"
        description="Linear・Radial・Conicの3種類のCSSグラデーションを視覚的に作成。カラーストップ自由追加、20種プリセット付き。"
        icon="🌈"
        slug="gradient-generator"
        seoContent={seoContent}
      >
        <GradientGenerator />
      </ToolLayout>
    </>
  );
}
