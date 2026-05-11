import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { QrGenerator } from "./QrGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "QRコード生成",
  "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。無料・登録不要。",
  "qr-generator",
  ["QRコード作成", "QR生成", "QRコード無料", "URL QR", "WiFi QR", "ダウンロード"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "QRコードを無料で作る方法は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにURLやテキストを入力するだけで即座にQRコードを生成できます。PNG・SVG形式でダウンロードでき、登録・インストール不要で完全無料です。" },
    },
    {
      "@type": "Question",
      name: "QRコードの色を変えることはできますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。前景色（QRのドット色）と背景色をそれぞれカスタマイズできます。ブランドカラーに合わせたQRコードを作成できます。ただし、コントラスト比が低いと読み取りにくくなるため注意してください。" },
    },
    {
      "@type": "Question",
      name: "WiFiのQRコードはどうやって作りますか？",
      acceptedAnswer: { "@type": "Answer", text: "「WiFi」タブに切り替え、SSIDとパスワード・セキュリティ方式を入力するだけで、スマホのカメラで読み取るとWiFiに自動接続できるQRコードを生成できます。" },
    },
    {
      "@type": "Question",
      name: "作ったQRコードはいつまで使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "生成したQRコードは期限なく使い続けられます。このツールはQRコードをサーバーで管理しないため、ダウンロード後はオフラインでも使用できます。" },
    },
    {
      "@type": "Question",
      name: "SVGとPNGどちらをダウンロードすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "印刷物やパンフレット向けにはSVG（ベクター形式、拡大しても劣化なし）が適しています。ウェブや資料への貼り付けにはPNGが汎用的で使いやすいです。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      QRコード生成ツールの使い方
    </h2>
    <p>
      URLやテキストを入力するだけで即座にQRコードを作成できます。PNG・SVG両形式でダウンロード可能。色のカスタマイズにも対応しており、ブランドカラーに合わせたQRコードを作れます。生成したQRコードは期限なく使い続けられます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      WiFi QRコードの活用
    </h3>
    <p>
      カフェ・オフィス・ゲストルームなどでWiFiのSSID・パスワードをQRコードにしておくと、訪問者がカメラで読み取るだけで接続できます。「WiFi」タブからSSIDとパスワードを入力して作成してください。専用の
      <Link href="/tools/wifi-qr" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">WiFi QRコード生成ツール</Link>
      も用意しています。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      印刷に使う場合
    </h3>
    <p>
      チラシ・名刺・パンフレットへの印刷にはSVG形式でのダウンロードを推奨します。SVGはベクター形式のため、どんなサイズに拡大・縮小しても画質が劣化しません。
    </p>
  </div>
);

export default function QrGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="QRコード生成"
        description="URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。"
        icon="📱"
        slug="qr-generator"
        seoContent={seoContent}
      >
        <QrGenerator />
      </ToolLayout>
    </>
  );
}
