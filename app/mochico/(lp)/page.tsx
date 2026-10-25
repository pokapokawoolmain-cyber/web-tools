// ============================================================
// Mochico 公開 LP（/mochico）— 検索・SNS・共有からの入口
//   アプリ本体の入口は /mochico/app。本体が未公開の環境では CTA を「近日公開」にする。
// ============================================================
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { MochicoLanding } from "@/components/mochico/lp/MochicoLanding";
import { BRAND, FAQ } from "@/lib/mochico/content";

const CANONICAL = "https://www.toolboxjp.com/mochico";
// openGraph を書くと親セグメントの opengraph-image が引き継がれないため、明示する
const OG_IMAGE = { url: "/mochico/opengraph-image", width: 1200, height: 630, alt: BRAND.title, type: "image/png" };

export const metadata: Metadata = {
  title: { absolute: BRAND.title },
  description: BRAND.description,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Mochico",
    url: CANONICAL,
    title: BRAND.title,
    description: BRAND.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.title,
    description: BRAND.description,
    images: [OG_IMAGE],
  },
};

export default function MochicoPage() {
  const appEnabled = process.env.NEXT_PUBLIC_MOCHICO_APP_ENABLED === "true";
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: BRAND.title,
            description: BRAND.description,
            url: CANONICAL,
            inLanguage: "ja",
            isPartOf: { "@type": "WebSite", name: "ToolBoxJP", url: "https://www.toolboxjp.com" },
          },
          {
            // アプリそのもの（検索で「Mochico」「モチコ」という名前の実体として認識させる）。
            // 価格・評価は掲載しない（料金表記が無く、架空の評価も載せない）
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: BRAND.name,
            alternateName: [BRAND.kana, `${BRAND.name}（${BRAND.kana}）`],
            description: BRAND.description,
            url: CANONICAL,
            image: `${CANONICAL}/opengraph-image`,
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web（iPhone・Android・パソコンのブラウザ）",
            browserRequirements: "最新のブラウザ（Safari・Chrome など）",
            inLanguage: "ja",
            featureList: [
              "ライブ・イベントごとのグッズ一覧（写真は1グッズ最大10枚・名前・価格・カテゴリ・概要）",
              "タップで取得済み・未取得を記録、個数（0〜9999）の記録、取得数と割合の表示",
              "ランダム商品（缶バッジ・トレカ等）の絵柄ごとの所持数と取得率",
              "商品名の検索・カテゴリ・並び替え、すべて・未取得・取得済みの絞り込み",
              "予約開始・予約締切・販売開始の登録と、締切までの残りの表示",
              "グッズ一覧のリンク共有（取得状況は本人だけに表示）",
              "ホーム画面への追加",
            ],
            publisher: { "@type": "Organization", name: "ToolBoxJP", url: "https://www.toolboxjp.com" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "ToolBox", item: "https://www.toolboxjp.com" },
              { "@type": "ListItem", position: 2, name: `${BRAND.name}（${BRAND.kana}）`, item: CANONICAL },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <MochicoLanding appEnabled={appEnabled} />
    </>
  );
}
