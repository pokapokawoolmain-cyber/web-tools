import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ImageCompressor } from "./ImageCompressor";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "画像圧縮ツール",
  "JPG・PNG・WebP画像をブラウザ上で高品質のまま圧縮。ファイルサイズを最大80%削減。登録不要・無料・スマホ対応。",
  "image-compress",
  ["画像圧縮 無料", "JPG 圧縮 オンライン", "PNG 軽量化", "画像 ファイルサイズ 削減", "WebP 圧縮 ブラウザ", "写真 軽くする アプリ不要"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "画像圧縮後の画質はどの程度劣化しますか？",
      acceptedAnswer: { "@type": "Answer", text: "品質設定によって異なりますが、デフォルト設定（品質80%）では目視での劣化がほぼわからない状態で、ファイルサイズを50〜80%削減できます。品質スライダーを調整して、圧縮前後を比較しながら最適な設定を探してください。" },
    },
    {
      "@type": "Question",
      name: "アップロードした画像はサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はお使いのブラウザ内で完結します。画像ファイルが外部サーバーに送信されることは一切ありません。個人の写真や機密性の高い画像も安心してご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "JPG・PNG・WebP以外のフォーマットは対応していますか？",
      acceptedAnswer: { "@type": "Answer", text: "現在はJPG・PNG・WebPに対応しています。iPhoneで撮影したHEIC形式の画像はHEIC→JPG変換ツールでJPGに変換してからご利用ください。" },
    },
    {
      "@type": "Question",
      name: "複数の画像をまとめて圧縮できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。複数ファイルを一度に選択して一括圧縮できます。各ファイルを個別にダウンロードするか、まとめてZIPでダウンロードすることもできます。" },
    },
    {
      "@type": "Question",
      name: "画像圧縮はいつ使うべきですか？",
      acceptedAnswer: { "@type": "Answer", text: "Webサイトへの画像アップロード前・メール添付前・SNS投稿前・iCloudやGoogleフォトの容量節約・WordPressへの画像アップロード前などに活用できます。とくにスマートフォンで撮影した写真は4〜8MB前後あることが多く、圧縮で1MB以下にできます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      画像圧縮ツールの使い方
    </h2>
    <p>
      「ファイルを選択」ボタンまたはドラッグ＆ドロップで画像を読み込み、品質スライダーを調整するだけで圧縮完了です。
      圧縮前後のファイルサイズと画質を比較してから、気に入った設定でダウンロードできます。
      複数ファイルを一度に選択すれば一括圧縮も可能です。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      どんな時に画像圧縮が必要？
    </h3>
    <ul className="space-y-1.5 text-[14px]">
      <li><strong>Webサイトへのアップロード前</strong>：画像が重いとページ読み込みが遅くなり、SEOと離脱率に悪影響を与えます。1MB以下を目安にしましょう。</li>
      <li><strong>WordPressブログの運用</strong>：圧縮せずに掲載し続けるとサーバー容量を圧迫し、表示速度が低下します。</li>
      <li><strong>メール添付</strong>：一般的なメールサービスの添付上限は10MB〜25MB。スマホ写真（4〜8MB）はそのまま送ると相手の容量を消費します。</li>
      <li><strong>クラウドストレージの節約</strong>：iCloud・Googleフォトの無料容量が足りない場合、圧縮することで保存可能枚数を増やせます。</li>
      <li><strong>SNS・マッチングアプリ</strong>：アップロード上限のあるサービスで高解像度の写真を送る場合に便利です。</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      フォーマット別の圧縮特性
    </h3>
    <p>
      <strong>JPG（JPEG）</strong>は写真に最適なフォーマットです。非可逆圧縮のため、圧縮率が高いほど画質が落ちますが、写真の場合は80%品質でも目視での違いはほぼわかりません。ファイルサイズを優先するなら70〜80%が実用的な範囲です。
    </p>
    <p>
      <strong>PNG</strong>は可逆圧縮のため、圧縮しても画質は劣化しません。透明（アルファ）チャンネルを持つ画像（ロゴ・アイコンなど）に向いています。ただしJPGに比べてファイルサイズが大きくなりやすい傾向があります。
    </p>
    <p>
      <strong>WebP</strong>はGoogleが開発した次世代フォーマットです。JPGやPNGより20〜35%小さいファイルサイズで同等の画質を実現できます。現代のブラウザはすべてWebPに対応しており、Web用途では積極的に使うことを推奨します。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      目安となる圧縮後のファイルサイズ
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500">
            <th className="pb-2 font-medium">用途</th>
            <th className="pb-2 font-medium">推奨サイズ</th>
          </tr>
        </thead>
        <tbody className="space-y-1">
          <tr><td className="py-1">Webブログ・記事の本文画像</td><td className="py-1 font-mono text-blue-600 dark:text-blue-400">200KB〜500KB</td></tr>
          <tr><td className="py-1">ECサイトの商品画像</td><td className="py-1 font-mono text-blue-600 dark:text-blue-400">100KB〜300KB</td></tr>
          <tr><td className="py-1">SNSアイコン・サムネイル</td><td className="py-1 font-mono text-blue-600 dark:text-blue-400">50KB〜150KB</td></tr>
          <tr><td className="py-1">メール添付</td><td className="py-1 font-mono text-blue-600 dark:text-blue-400">500KB〜1MB以下</td></tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      画質と圧縮率のバランスを取るには
    </h3>
    <p>
      品質を80%に設定した場合、多くの写真では元の50〜70%のファイルサイズに圧縮できます。品質を70%にするとさらに小さくなりますが、目視での品質差も出始めます。
      プレビュー画面で拡大表示して確認し、許容できる範囲で最も低い品質設定を選ぶのがコツです。
    </p>
    <p>
      関連ツール：
      <Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">HEIC→JPG変換</Link>・
      <Link href="/tools/image-resize" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">画像リサイズ</Link>・
      <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">JPG→PDF変換</Link>
    </p>
  </div>
);

export default function ImageCompressPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="画像圧縮ツール"
        description="JPG・PNG・WebP画像をブラウザ上で圧縮。サーバーに送信しないのでプライバシー安全。登録不要・無料・スマホ対応。"
        icon="🗜️"
        slug="image-compress"
        seoContent={seoContent}
      >
        <ImageCompressor />
      </ToolLayout>
    </>
  );
}
