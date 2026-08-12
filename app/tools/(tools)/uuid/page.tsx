import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { UuidTool } from "./UuidTool";

export const metadata: Metadata = generateMeta({
  title: "UUID生成ツール｜v4ランダムUUIDをまとめて発行【無料・登録不要】",
  description:
    "UUID（v4・ランダム）をワンクリックで生成。1〜100個の一括生成に対応し、大文字・ハイフンなし・波括弧付きなどの形式も選べます。各行コピー・全部コピー対応。ブラウザ内で生成され外部に送信されません。",
  path: "/tools/uuid",
  ogImage: `/api/og?${new URLSearchParams({ title: "UUID生成", icon: "🆔", desc: "UUID（v4・ランダム）をワンクリックで生成" }).toString()}`,
  keywords: ["uuid 生成", "uuid v4 生成", "uuid 作成 無料", "guid 生成", "uuid まとめて 生成"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "生成されるUUIDのバージョンは何ですか？", acceptedAnswer: { "@type": "Answer", text: "v4（ランダム）です。ブラウザ標準のcrypto.randomUUIDを使い、暗号学的に安全な乱数から生成します。実用上、重複はほぼ起こりません。" } },
    { "@type": "Question", name: "何個まで一度に作れますか？", acceptedAnswer: { "@type": "Answer", text: "1個から100個まで一括生成できます。テストデータの用意やシード作成などに便利です。全部まとめてコピーもできます。" } },
    { "@type": "Question", name: "形式は変えられますか？", acceptedAnswer: { "@type": "Answer", text: "大文字化、ハイフンなし（32桁）、波括弧 {} 付きの各形式に切り替えられます。データベースや言語の慣習に合わせて選んでください。" } },
    { "@type": "Question", name: "生成した値は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。生成はすべてブラウザ内で行われ、UUIDが外部サーバーに送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>生成数（1〜100）を指定する</li>
        <li>必要なら大文字・ハイフンなし・波括弧付きを選ぶ</li>
        <li>「生成する」を押す</li>
        <li>各行をタップして個別コピー、または「全部コピー」でまとめて取得</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・データベースの主キーや識別子として利用する</li>
        <li>・APIのリクエストIDや冪等キーを用意する</li>
        <li>・テストデータのユニークな値をまとめて作る</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・<Link href="/tools/hash" className="text-sky-600 dark:text-sky-400 hover:underline">ハッシュ生成（SHA）</Link></li>
        <li>・<Link href="/tools/password-generator" className="text-sky-600 dark:text-sky-400 hover:underline">パスワード生成</Link></li>
        <li>・<Link href="/dev" className="text-sky-600 dark:text-sky-400 hover:underline">開発者ツール一覧</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="UUID生成"
        description="v4ランダムUUIDをまとめて生成。大文字・ハイフンなし・波括弧付きに対応。ブラウザ内で生成。"
        icon="🆔"
        slug="uuid"
        seoContent={seoContent}
      >
        <UuidTool />
      </ToolLayout>
    </>
  );
}
