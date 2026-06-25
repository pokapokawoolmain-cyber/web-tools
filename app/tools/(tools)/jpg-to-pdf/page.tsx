import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { JpgToPdf } from "./JpgToPdf";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "JPGをPDFに変換｜画像をまとめてPDF化【無料】",
  description: "JPGやPNG画像をまとめてPDFへ変換。ドラッグで順番変更・スマホ・PC両対応。登録不要・ブラウザ完結。",
  path: "/tools/jpg-to-pdf",
  keywords: ["JPG PDF 変換", "画像 PDF まとめる", "写真 PDF 変換 無料", "image to pdf", "JPG PDF 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "JPG→PDF変換", icon: "🖼️", desc: "複数画像をまとめてPDF化。登録不要・無料。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "JPGからPDF変換は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "スマホの写真もPDFにできますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhoneのHEIC画像も含め、スマホで撮影した写真をそのままPDFに変換できます。" } },
    { "@type": "Question", name: "複数の画像を1つのPDFにまとめられますか？", acceptedAnswer: { "@type": "Answer", text: "はい。複数のJPG・PNG・WebP・HEIC画像をアップロードして1つのPDFにまとめられます。ドラッグ＆ドロップでページ順を変更することもできます。" } },
    { "@type": "Question", name: "画像はサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。アップロードした画像が外部サーバーに送信されることは一切ありません。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="jpg-to-pdf" title="JPG→PDF変換ツール" description="JPGやPNG画像をまとめてPDFへ変換。ドラッグで順番変更・スマホ・PC両対応。" />
      <JsonLd data={faqSchema} />
      <JpgToPdf />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/jpg-to-pdf" />
      </div>

      {/* ── SEO補足コンテンツ ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        {/* 複数枚まとめる手順 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">複数の写真を1つのPDFにまとめる手順</h2>
          <ol className="space-y-2 text-sm text-slate-600 dark:text-zinc-400 list-decimal list-inside">
            <li>「ファイルを選択」から複数の画像を一括選択（またはドラッグ＆ドロップ）</li>
            <li>サムネイルをドラッグして並べ替え——最初に表示したいページを先頭に</li>
            <li>用紙サイズ・余白を選択（提出書類ならA4、スキャン代わりなら「画像サイズに合わせる」）</li>
            <li>「PDFを作成」ボタンを押すと自動でダウンロードが始まる</li>
          </ol>
          <p className="mt-3 text-xs text-slate-400 dark:text-zinc-500">
            処理はすべてブラウザ内で行われるため、ファイルが外部に送信されることはありません。枚数が多いとき（20枚以上）はブラウザのメモリ次第なので、重い場合は10枚ずつに分けてください。
          </p>
        </section>

        {/* 用途別の設定 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">用途別のおすすめ設定</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">役所・会社への書類提出</p>
              <p className="text-slate-600 dark:text-zinc-400">用紙サイズ「A4」、余白「小」に設定。書類はA4が標準なので、印刷したときに全体がきれいに収まります。</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">領収書・レシートの保管</p>
              <p className="text-slate-600 dark:text-zinc-400">「画像サイズに合わせる」を選ぶと、元の写真の縦横比がそのままページに反映されます。領収書が横長でも自動でフィット。</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">写真アルバム的なまとめ</p>
              <p className="text-slate-600 dark:text-zinc-400">撮影した順に並べてからPDF化すると、時系列で見返せる記録になります。ファイル名に日付が入っていると並べ替えが楽です。</p>
            </div>
          </div>
        </section>

        {/* HEICの扱い */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">iPhoneのHEICファイルについて</h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-2">
            iPhone（iOS 11以降）で撮影した写真はデフォルトでHEIC形式で保存されます。このツールはHEICも変換対象に含まれています。ただし、一部の古いブラウザや環境ではHEICが開けない場合があります。
          </p>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            うまくいかない場合はiPhoneの「設定」→「カメラ」→「フォーマット」→「互換性優先」に変更するとJPEG撮影になります。または写真アプリからAirDropやメール共有するとJPEGに自動変換されて送られます。
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-4">よくある質問</h2>
          <dl className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">JPGからPDF変換は無料ですか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">完全無料です。登録・インストール不要でブラウザから即利用できます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">スマホの写真もPDFにできますか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">はい。iPhoneのHEIC画像も含め、スマホで撮影した写真をそのままPDFに変換できます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">複数の画像を1つのPDFにまとめられますか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">はい。複数のJPG・PNG・WebP・HEIC画像をアップロードして1つのPDFにまとめられます。ドラッグ＆ドロップでページ順を変更することもできます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">画像はサーバーに送信されますか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">いいえ。処理はすべてブラウザ内で完結します。アップロードした画像が外部サーバーに送信されることは一切ありません。</dd>
            </div>
          </dl>
        </section>

      </div>
    </>
  );
}
