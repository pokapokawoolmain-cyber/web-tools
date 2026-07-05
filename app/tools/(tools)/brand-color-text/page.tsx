import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { BrandColorText } from "./BrandColorText";

export const metadata: Metadata = generateMeta({
  title: "ブランドカラー×文字色 自動提案｜背景色に合う読みやすい文字色を判定【無料】",
  description:
    "ブランドカラー（背景色）を選ぶだけで、読みやすい文字色をWCAG AA / AAA基準で自動提案。コントラスト比・ライブプレビュー・アクセントカラー・HEX/RGB/CSS/Tailwind形式のコピーに対応。Webデザインの配色決めに。",
  path: "/tools/brand-color-text",
  keywords: ["ブランドカラー 文字色", "背景色 文字色 組み合わせ", "配色 文字色 読みやすい", "コントラスト 文字色 自動", "Webデザイン 配色 アクセシビリティ"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "背景色に合う文字色はどう決めればいいですか？", acceptedAnswer: { "@type": "Answer", text: "背景と文字のコントラスト比が重要です。本文はWCAG AA基準の4.5:1以上、見出しなど大きな文字は3:1以上が目安です。このツールは背景色を選ぶと、白・黒・調整トーンの候補をコントラスト比とAA/AAA判定つきで提案します。" } },
    { "@type": "Question", name: "WCAGのAAとAAAの違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "AAは一般的なWebサイトが満たすべき最低基準で、通常の文字はコントラスト比4.5:1以上です。AAAはより厳しい基準で7:1以上を求めます。公共機関や高齢者向けサイトではAAAが推奨されます。" } },
    { "@type": "Question", name: "コピーできる形式は何がありますか？", acceptedAnswer: { "@type": "Answer", text: "HEX・RGB・CSS（backgroundとcolorの記述）・Tailwind CSSの arbitrary value 形式（bg-[#...] text-[#...]）に対応しています。用途に合わせてワンタップでコピーできます。" } },
    { "@type": "Question", name: "アクセントカラーはどう選ばれていますか？", acceptedAnswer: { "@type": "Answer", text: "選んだ色の色相を回転させた補色（180度）と類似色（±30度）を提案します。ボタンやリンクなどの差し色を決めるときの出発点として使えます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>カラーピッカーまたはHEX入力でブランドカラー（背景色）を指定する</li>
        <li>ライブプレビューで見出し・本文・ボタンの見え方を確認する</li>
        <li>文字色候補のWCAG判定（AA / AAA）を見て、本文に使える色を選ぶ</li>
        <li>HEX・RGB・CSS・Tailwind形式でコピーしてそのまま使う</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">背景色と文字色の相性で読みやすさが決まる</h2>
      <p>Webサイトやバナーで「なんとなく読みにくい」と感じる原因の多くは、背景色と文字色のコントラスト不足です。濃い背景には白、明るい背景には黒が基本ですが、中間の明るさの色は白でも黒でも4.5:1に届かないことがあります。数値で確認せずに感覚で決めると、スマホの屋外や高齢者の環境で読めなくなることがあるため、コントラスト比での確認が確実です。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・2色だけ細かく確認したいときは <Link href="/tools/contrast-checker" className="text-violet-600 dark:text-violet-400 hover:underline">コントラスト比チェッカー</Link></li>
        <li>・配色全体をまとめて確認する <Link href="/tools/palette-accessibility" className="text-violet-600 dark:text-violet-400 hover:underline">配色アクセシビリティチェッカー</Link></li>
        <li>・色覚の見え方を確認する <Link href="/tools/color-blind-simulator" className="text-violet-600 dark:text-violet-400 hover:underline">色覚シミュレーター</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ブランドカラー×文字色 自動提案"
        description="背景色を選ぶだけで、読みやすい文字色をWCAG基準で自動提案。コントラスト比・プレビュー・コピーに対応。"
        icon="🎨"
        slug="brand-color-text"
        seoContent={seoContent}
      >
        <BrandColorText />
      </ToolLayout>
    </>
  );
}
