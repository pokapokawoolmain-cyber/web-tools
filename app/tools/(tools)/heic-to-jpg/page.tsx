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
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">HEICとは何か？なぜ変換が必要なのか</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        HEICはiOS 11（2017年）以降のiPhoneで採用された画像フォーマットです。同じ画質のJPGと比べてファイルサイズが約半分になる点が特徴で、iPhoneのストレージを節約するために設計されています。しかし、WindowsのエクスプローラーやPhotoshop（古いバージョン）、多くのウェブサービスのアップロードフォームはHEICに対応していないため、JPGに変換する必要が生じます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">どんな時に変換が必要か</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">Windowsに写真を送るとき：</strong>WindowsはデフォルトでHEICを開けないため、メールやUSBでWindowsユーザーに写真を渡す場合はJPGに変換しておく必要があります。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">履歴書や申請書に写真を貼り付けるとき：</strong>WordやGoogleドキュメントでHEIC写真が正しく表示されない場合があります。JPGに変換してから使うと確実です。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ブログやSNSにアップロードするとき：</strong>WordPressや一部のSNSはHEICのアップロードに対応していません。JPGに変換することで幅広いサービスで利用できます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">印刷を注文するとき：</strong>コンビニプリントや写真プリントサービスでHEICが受け付けられないことがあります。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">iPhoneの設定でJPEGに変える方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        毎回変換するのが手間な場合は、iPhoneのカメラ設定を変更することでHEICではなくJPGで撮影できます。「設定」→「カメラ」→「フォーマット」→「互換性優先」を選択すると、以降の写真がJPG形式で保存されます。ただし、ファイルサイズはHEICより大きくなる点に注意してください。すでに撮影済みのHEIC写真は変換ツールをお使いください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">プライバシーと安全性について</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        このツールでの変換処理はすべてお使いのブラウザ内で完結します。アップロードした写真が外部サーバーに送信されることは一切ありません。旅行の写真や子どもの写真など、プライベートな画像も安心してご利用いただけます。変換後はページを閉じるとデータは残りません。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">変換後の活用方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        JPGに変換した写真は、SNS投稿・メール添付・印刷・履歴書への貼り付けなどに使えます。ファイルサイズをさらに小さくしたい場合は
        <Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">画像圧縮ツール</Link>
        も合わせてご利用ください。写真をリサイズしたい場合は
        <Link href="/tools/image-resize" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">画像リサイズツール</Link>
        が便利です。複数枚の写真をPDFにまとめたい場合は
        <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">JPG→PDF変換ツール</Link>
        をご利用ください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "HEICをJPGに変換できる枚数に制限はありますか？", a: "このツールでは複数のHEICファイルを同時にアップロードして一括変換できます。枚数の上限はありませんが、大量の高解像度写真を処理するとブラウザのメモリに負荷がかかることがあります。" },
          { q: "変換後の画質は変わりますか？", a: "JPG変換時にわずかな画質低下が生じる場合があります。ただし、通常の用途（SNS・印刷・メール添付）では目視での違いはほとんどわかりません。" },
          { q: "iPhoneの設定でJPEGに変えられますか？", a: "はい。「設定」→「カメラ」→「フォーマット」→「互換性優先」を選択すると、以降の写真がJPG形式で保存されます。ただし既存のHEICファイルは変換されません。" },
          { q: "変換後のファイルサイズはどうなりますか？", a: "JPGはHEICより同じ画質でもファイルサイズが大きくなる傾向があります。目安として1.5〜2倍程度になることがあります。サイズを小さくしたい場合は変換後に画像圧縮ツールをご利用ください。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
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
