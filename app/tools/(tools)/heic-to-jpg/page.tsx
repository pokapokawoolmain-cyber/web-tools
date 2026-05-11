import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { HeicConverter } from "./HeicConverter";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "HEIC→JPG変換",
  "iPhoneで撮影したHEIC形式の写真をJPGに無料変換。ブラウザ完結でプライバシー安全。",
  "heic-to-jpg",
  ["HEIC変換", "HEIC JPG", "iPhone写真", "HEICをJPGに変換", "無料", "オンライン"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "HEICをJPGに変換する方法は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにHEICファイルをドラッグ＆ドロップ、またはファイル選択でアップロードするだけで自動的にJPGへ変換できます。登録不要・無料でご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "HEIC形式とはどんな画像フォーマットですか？",
      acceptedAnswer: { "@type": "Answer", text: "HEICはiOS 11以降のiPhoneで採用された画像形式です。JPGより高画質・小サイズが特徴ですが、Windowsや古いアプリでは開けないことがあります。JPGに変換することで幅広い環境で利用できます。" },
    },
    {
      "@type": "Question",
      name: "写真はサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。変換処理はすべてブラウザ内で完結します。写真データが外部サーバーに送信されることは一切ありません。プライベートな写真も安心してご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "複数のHEICファイルをまとめて変換できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。複数のHEICファイルを同時にアップロードして一括変換できます。変換後はそれぞれのJPGファイルをダウンロードできます。" },
    },
    {
      "@type": "Question",
      name: "スマホからも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザからもご利用いただけます。iPhoneで撮影したHEICをそのままブラウザ上でJPGに変換できます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      HEIC→JPG変換ツールの使い方
    </h2>
    <p>
      iPhoneで撮影した写真はHEIC形式で保存されます。このフォーマットはJPGより高画質・小サイズですが、Windowsや多くのウェブサービスでは開けないことがあります。本ツールは、ブラウザ上でHEICをJPGに変換します。写真データがサーバーに送信されることはありません。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      変換後の活用方法
    </h3>
    <p>
      JPGに変換した写真は、SNS投稿・メール添付・印刷・履歴書への貼付けなどに使えます。ファイルサイズをさらに小さくしたい場合は
      <Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">画像圧縮ツール</Link>
      も合わせてご利用ください。写真をリサイズしたい場合は
      <Link href="/tools/image-resize" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">画像リサイズツール</Link>
      が便利です。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      写真をPDFにまとめたい場合
    </h3>
    <p>
      複数枚の写真をPDFにまとめて共有・印刷したい場合は
      <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">JPG→PDF変換ツール</Link>
      をご利用ください。複数枚を1つのPDFにまとめられます。
    </p>
  </div>
);

export default function HeicToJpgPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="HEIC → JPG 変換"
        description="iPhoneの写真（HEIC形式）をJPGに変換。ブラウザ完結・サーバー送信なし・無料。"
        icon="🖼️"
        slug="heic-to-jpg"
        seoContent={seoContent}
      >
        <HeicConverter />
      </ToolLayout>
    </>
  );
}
