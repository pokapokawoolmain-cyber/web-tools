import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ColorCodes } from "./ColorCodes";

export const metadata: Metadata = generateMeta({
  title: "SNSカラーコード一覧｜TikTok・Twitter・Facebook色【無料】",
  description:
    "TikTok・Twitter（X）・Facebook・Instagram・LINE・YouTube・PayPayなど主要SNS・サービスのブランドカラーと、Web制作の基本色・日本の伝統色のカラーコード（HEX・RGB）を一覧掲載。ワンタップでコピーでき、バナー・サムネイル・資料・Webデザインの配色にそのまま使えます。無料・登録不要。",
  path: "/tools/color-codes",
  keywords: [
    "カラーコード 一覧",
    "tiktok カラーコード",
    "twitter カラーコード",
    "facebook カラーコード",
    "instagram カラーコード",
    "line カラーコード",
    "youtube カラーコード",
    "SNS ブランドカラー",
    "ブランドカラー hex",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "SNSカラーコード一覧", icon: "🎨", desc: "SNS・Webのブランドカラーをコピー" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "SNSのブランドカラーは自由に使えますか？", acceptedAnswer: { "@type": "Answer", text: "色そのものに著作権はありませんが、ロゴや商標の利用は各社のブランドガイドラインや規約に従う必要があります。「LINEで送る」ボタンなど公式のガイドがある場合はそちらを優先してください。" } },
    { "@type": "Question", name: "HEXとRGBはどちらをコピーすればいいですか？", acceptedAnswer: { "@type": "Answer", text: "Web制作（CSS）ではHEX（#RRGGBB）が一般的です。透明度を扱う場合や一部のデザインツールではRGBが便利です。このツールはどちらもワンタップでコピーできます。" } },
    { "@type": "Question", name: "掲載されているカラーコードは正確ですか？", acceptedAnswer: { "@type": "Answer", text: "各社の公開情報や実際の表示に基づく参考値です。ブランドによっては複数の色やグラデーションを使い分けているため、厳密な指定が必要な場合は公式のブランドガイドラインをご確認ください。" } },
    { "@type": "Question", name: "日本の伝統色も使えますか？", acceptedAnswer: { "@type": "Answer", text: "藍色・朱色・萌黄など代表的な和色を掲載しています。和風のデザインや落ち着いた配色にそのまま使えます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途</h2>
      <p>SNS用のバナーやサムネイル、資料、Webサイトを作るときに、各サービスのブランドカラーや定番のWebカラーをすぐコピーして使えます。色を探してスポイトで拾う手間を省けます。ブランドカラーはボタンや見出しのアクセントに、Web基本カラーは本文・背景・状態表示に向いています。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">配色を決めるときのコツ</h2>
      <p>ブランドカラーを1色決めたら、そのままでは文字が読みにくいことがあります。背景に使う場合は文字色とのコントラストを確認しましょう。ベースカラー1色・アクセント1〜2色・無彩色（黒・グレー・白）でまとめると、まとまりのある配色になります。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・背景色に合う文字色を提案する <Link href="/tools/brand-color-text" className="text-violet-600 dark:text-violet-400 hover:underline">ブランドカラー×文字色 自動提案</Link></li>
        <li>・HEX / RGB / HSL を相互変換する <Link href="/tools/hex-rgb-converter" className="text-violet-600 dark:text-violet-400 hover:underline">HEX・RGB・HSL変換</Link></li>
        <li>・配色から使える組み合わせを探す <Link href="/tools/palette-accessibility" className="text-violet-600 dark:text-violet-400 hover:underline">配色アクセシビリティチェッカー</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="SNS・Webカラーコード一覧"
        description="主要SNS・サービスのブランドカラーと、Web制作でよく使う基本色・和色のHEX・RGBを一覧でコピーできます。"
        icon="🎨"
        slug="color-codes"
        seoContent={seoContent}
      >
        <ColorCodes />
      </ToolLayout>
    </>
  );
}
