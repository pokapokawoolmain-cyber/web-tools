import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PaletteAccessibility } from "./PaletteAccessibility";

export const metadata: Metadata = generateMeta({
  title: "配色アクセシビリティチェッカー｜パレット全体のコントラストをWCAGで一括判定【無料】",
  description:
    "使用する複数の色（パレット）をまとめて登録し、すべての文字色×背景色の組み合わせをWCAG AA / AAA基準で一括チェック。コントラスト比を行列で可視化し、本文に使える安全な組み合わせがひと目でわかります。Webデザインのアクセシビリティ対応に。",
  path: "/tools/palette-accessibility",
  keywords: ["配色 アクセシビリティ チェック", "パレット コントラスト 一括", "WCAG 配色 判定", "アクセシビリティ 配色 ツール", "コントラスト比 一覧"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "コントラスト比チェッカーとの違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "コントラスト比チェッカーは2色の組み合わせを詳しく確認するツールです。こちらは3〜6色のパレットをまとめて登録し、すべての文字色×背景色の組み合わせを一度に判定します。デザインシステムやサイト全体の配色を決めるときに向いています。" } },
    { "@type": "Question", name: "行列の見方を教えてください。", acceptedAnswer: { "@type": "Answer", text: "縦が文字色、横が背景色です。各セルにコントラスト比とWCAG判定（AAA・AA・大字・不可）が表示されます。本文にはAA以上、見出しなど大きな文字は大字以上を目安にしてください。" } },
    { "@type": "Question", name: "何色まで登録できますか？", acceptedAnswer: { "@type": "Answer", text: "2色から6色まで登録できます。ブランドカラー・背景色・文字色・アクセント色など、実際に使う色をまとめて入れて確認してください。" } },
    { "@type": "Question", name: "アクセシビリティ対応はなぜ必要ですか？", acceptedAnswer: { "@type": "Answer", text: "コントラストが不足した配色は、高齢者・弱視の方・屋外のスマホ利用などで読めなくなります。日本でも公的機関のWebはWCAGへの準拠が求められており、一般サイトでも読みやすさは離脱率に直結します。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>サイトやデザインで使う色を2〜6色登録する（プリセットも利用可）</li>
        <li>コントラスト行列で、どの文字色×背景色が本文に使えるかを確認する</li>
        <li>「不可」のセルは組み合わせを避け、AA以上のセルを本文に採用する</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">パレットを先に決めると配色がぶれない</h2>
      <p>ページごとに色を場当たり的に選ぶと、サイト全体でトーンがばらつき、読みにくい箇所も生まれます。先に4〜5色のパレットを決め、その中で「本文に使える組み合わせ」を把握しておくと、どのページでも一貫した読みやすい配色になります。このツールはその「使える組み合わせ」を一目で確認するためのものです。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・背景色から文字色を提案する <Link href="/tools/brand-color-text" className="text-violet-600 dark:text-violet-400 hover:underline">ブランドカラー×文字色 自動提案</Link></li>
        <li>・2色を詳しく見る <Link href="/tools/contrast-checker" className="text-violet-600 dark:text-violet-400 hover:underline">コントラスト比チェッカー</Link></li>
        <li>・パレットを作る <Link href="/tools/color-palette" className="text-violet-600 dark:text-violet-400 hover:underline">カラーパレット生成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="配色アクセシビリティチェッカー"
        description="複数の色をまとめて登録し、全組み合わせのコントラストをWCAG基準で一括判定。本文に使える配色がひと目でわかります。"
        icon="🎨"
        slug="palette-accessibility"
        seoContent={seoContent}
      >
        <PaletteAccessibility />
      </ToolLayout>
    </>
  );
}
