import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { HexRgbConverter } from "./HexRgbConverter";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "カラーコード変換【無料】HEX・RGB・HSLを相互変換｜日本の伝統色辞書付き",
  description: "HEX（#FF6B35）・RGB・HSLのカラーコードを入力した瞬間に相互変換。カラーピッカー・CSS変数コピー・日本の伝統色辞書付きで、デザインとコーディングの行き来がスムーズになります。無料・登録不要。",
  path: "/tools/hex-rgb-converter",
  keywords: ["カラーコード 変換","hex rgb 変換","rgb hsl 変換","カラーコード 調べる","16進数 カラーコード"],
  ogImage: `/api/og?${new URLSearchParams({ title: "カラーコード変換", icon: "🎨", desc: "HEX・RGB・HSLを即相互変換" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "HEXカラーコードとRGBの違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "HEX（例：#FF6B35）は16進数表記、RGBは赤・緑・青を0〜255の10進数で表します。どちらも同じ色を表現する方法です。Webデザインではどちらも広く使われます。" },
    },
    {
      "@type": "Question",
      name: "HSLとは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "Hue（色相）・Saturation（彩度）・Lightness（明度）の略です。hsl(0, 100%, 50%) のように指定します。色を直感的に調整しやすい形式で、ダークモード実装に特に便利です。" },
    },
    {
      "@type": "Question",
      name: "CSS変数としてカラーコードを使う方法は？",
      acceptedAnswer: { "@type": "Answer", text: ":root { --primary: #FF6B35; } のように定義し、color: var(--primary); で呼び出します。このツールの「CSS変数出力」からそのままコピーできます。" },
    },
    {
      "@type": "Question",
      name: "日本の伝統色とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "山吹色・萌葱色・藍色・江戸紫など、日本の文化・自然に由来する伝統的な色名とそのカラーコードです。このツールには20色の伝統色辞書が内蔵されており、クリック一発で変換できます。" },
    },
    {
      "@type": "Question",
      name: "変換結果はどうやってコピーしますか？",
      acceptedAnswer: { "@type": "Answer", text: "各フォーマット（HEX・rgb()・hsl()・CSS変数）の右側に「コピー」ボタンがあります。クリックするだけでクリップボードにコピーされます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      カラーコード変換ツールの使い方
    </h2>
    <p>
      HEXカラーコードを入力するか、カラーピッカーで色を選ぶと、RGB・HSLが即座に計算されます。
      各フォーマットのコピーボタンでCSSファイルにそのまま貼り付けられます。
      RGB・HSL側の数値を直接変更することも可能です。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      HEX・RGB・HSLの使い分け
    </h3>
    <p>
      HTMLやCSSで色を指定するなら<strong>HEX</strong>が最もシンプルです。
      透明度（alpha）が必要な場合は<strong>rgba()</strong>、
      色の明暗を動的に変えたい場合は<strong>hsl()</strong>が便利です。
      Tailwind CSSなどのフレームワークでは独自カラーをHEXで設定することが一般的です。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      日本の伝統色について
    </h3>
    <p>
      山吹色・萌葱色・藍色など、日本の文化に由来する伝統色20色のカラーコードを収録しています。
      和風デザイン・ブランドカラーの参考にご活用ください。
      各スウォッチをクリックすると即座にHEX/RGB/HSLが更新されます。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/color-palette" className="text-pink-600 dark:text-pink-400 hover:underline mx-1">カラーパレット生成</Link>・
      <Link href="/tools/contrast-checker" className="text-pink-600 dark:text-pink-400 hover:underline mx-1">コントラストチェッカー</Link>
    </p>
  </div>
);

export default function HexRgbConverterPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="カラーコード変換（HEX・RGB・HSL）"
        description="HEX・RGB・HSLカラーコードを即変換。カラーピッカー・CSS変数コピー・日本の伝統色辞書付き。"
        icon="🎨"
        slug="hex-rgb-converter"
        seoContent={seoContent}
      >
        <HexRgbConverter />
      </ToolLayout>
    </>
  );
}
