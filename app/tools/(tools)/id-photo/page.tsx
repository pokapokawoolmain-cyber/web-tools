import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { IdPhoto } from "./IdPhoto";

export const metadata: Metadata = generateMeta({
  title: "証明写真作成ツール｜履歴書・コンビニ印刷対応【無料・登録不要】",
  description: "履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を作成。L判4枚配置でコンビニ印刷にも対応。無料・登録不要。",
  path: "/tools/id-photo",
  keywords: ["証明写真 作成", "履歴書 写真 作成", "証明写真 コンビニ", "パスポート 写真 作成", "マイナンバー 写真 作成"],
  ogImage: `/api/og?${new URLSearchParams({ title: "証明写真作成", icon: "🪪", desc: "履歴書・マイナンバー・パスポート対応。コンビニ印刷OK。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "証明写真をスマホで作る方法は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにスマホで撮影した写真をアップロードし、サイズを選択するだけで証明写真を作成できます。登録不要・無料でご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "コンビニ印刷に対応していますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。L判（89×127mm）に4枚配置した画像をダウンロードできます。この画像をコンビニのマルチコピー機でL判印刷することで、証明写真として利用できます。" },
    },
    {
      "@type": "Question",
      name: "履歴書・パスポート・マイナンバーの写真サイズはそれぞれ何ミリですか？",
      acceptedAnswer: { "@type": "Answer", text: "履歴書は縦40×横30mm、パスポートは縦45×横35mm（顔部分34mm以上）、マイナンバーカードは縦45×横35mmです。このツールでは主要なサイズをプリセットから選択できます。" },
    },
    {
      "@type": "Question",
      name: "写真データはサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。アップロードした写真がサーバーに送信・保存されることは一切ありません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="id-photo" title="証明写真作成" description="履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を自動作成。" />
      <JsonLd data={faqSchema} />
      <IdPhoto />
    </>
  );
}
