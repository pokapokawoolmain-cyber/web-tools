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
