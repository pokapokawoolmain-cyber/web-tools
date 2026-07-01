import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ImageResize } from "./ImageResize";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "画像のアスペクト比を変更・リサイズ【無料オンラインツール・ブラウザ完結】",
  "写真・画像のアスペクト比変更とリサイズをブラウザで完結。16:9・1:1・9:16など主要比率に1クリック対応。X・Instagram・YouTube・TikTok・Threads等SNS別の推奨サイズ一覧付き。アプリ不要・登録不要・無料。",
  "image-resize",
  ["写真 アスペクト比 変更", "画像 アスペクト比 変換 無料", "アスペクト比 変更 ブラウザ", "画像 リサイズ 無料 スマホ", "画像 サイズ変更 オンライン", "アスペクト比 変更 ツール 無料", "画像 アスペクト比 変更 オンライン"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "写真のアスペクト比を変更するにはどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールに画像をアップロードし、変更したいアスペクト比（16:9・1:1・9:16など）を選択するだけで変換できます。ブラウザだけで完結し、アプリのインストールや登録は不要です。" },
    },
    {
      "@type": "Question",
      name: "SNSで使うおすすめのアスペクト比は？",
      acceptedAnswer: { "@type": "Answer", text: "X（Twitter）のアイコンは1:1（400×400px）、Instagramのフィード投稿は1:1または4:5、Storiesは9:16（1080×1920px）、YouTubeのサムネイルは16:9（1280×720px）、TikTokは9:16が推奨されます。" },
    },
    {
      "@type": "Question",
      name: "アスペクト比を変更すると画像が切り取られますか？",
      acceptedAnswer: { "@type": "Answer", text: "比率を変えるとトリミング（切り取り）または余白の追加が発生します。このツールでは中央基準でトリミングします。大切な被写体が端にある場合は、アップロード前に写真アプリで構図を調整することをおすすめします。" },
    },
    {
      "@type": "Question",
      name: "画像ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "送信されません。このツールはブラウザ内（JavaScript）で処理が完結します。アップロードした画像が外部サーバーに送られることは一切ないため、プライベートな写真も安心して使えます。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">画像のアスペクト比を変更する手順</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>「ファイルを選択」または画像をドラッグ＆ドロップでアップロード（JPG・PNG・GIF・WebPに対応）</li>
        <li>変更したいアスペクト比（例：16:9・1:1・9:16）またはカスタムサイズを選択</li>
        <li>プレビューで仕上がりを確認しながら調整</li>
        <li>「ダウンロード」ボタンでPNG/JPG形式で保存</li>
      </ol>
      <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">※ 処理はすべてブラウザ内で完結します。画像がサーバーに送信されることは一切ありません。</p>
    </section>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">アスペクト比早見表</h2>
    <p>アスペクト比とは画像の横と縦の比率のことです。用途に合わせて変更することで、SNS投稿や印刷時のトリミングを防げます。</p>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">比率</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">代表サイズ</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">主な用途</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["16:9", "1920×1080 / 1280×720", "YouTube・PC壁紙・プレゼン・X(Twitter)ヘッダー"],
            ["1:1", "1080×1080 / 400×400", "Instagramフィード・SNSアイコン・プロフィール"],
            ["4:3", "1280×960 / 800×600", "旧デジカメ・プレゼン資料・ブログ"],
            ["9:16", "1080×1920 / 720×1280", "Instagram Stories・TikTok・YouTubeショート"],
            ["3:2", "1080×720 / 3000×2000", "一眼レフ標準・Twitterカード"],
            ["2:3", "720×1080 / 1000×1500", "Pinterest縦型・ポスター"],
            ["21:9", "2560×1080", "超ワイドモニター・映画シネマスコープ"],
          ].map(([ratio, size, use], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-bold text-blue-600 dark:text-blue-400">{ratio}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">{size}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">SNS別・推奨画像サイズ一覧</h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">サービス</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">種類</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">推奨サイズ</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">比率</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["X（Twitter）", "アイコン", "400×400px", "1:1"],
            ["X（Twitter）", "ヘッダー", "1500×500px", "3:1"],
            ["Instagram", "フィード（正方形）", "1080×1080px", "1:1"],
            ["Instagram", "Stories / Reels", "1080×1920px", "9:16"],
            ["YouTube", "サムネイル", "1280×720px", "16:9"],
            ["YouTube", "チャンネルアート", "2560×1440px", "16:9"],
            ["TikTok", "動画カバー", "1080×1920px", "9:16"],
            ["Facebook", "カバー写真", "851×315px", "約2.7:1"],
            ["LINE", "プロフィール", "200×200px以上", "1:1"],
            ["Threads", "フィード投稿", "1080×1080px（推奨）", "1:1 or 4:5"],
          ].map(([service, type, size, ratio], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{service}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{type}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{size}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">{ratio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">アスペクト比を変更するシーン別ガイド</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">SNSアイコン・プロフィール写真を正方形にしたい</p>
          <p>TwitterやInstagramのアイコンは<strong>1:1（正方形）</strong>が基本です。縦長・横長の写真をアップロードして「1:1」を選ぶと、中央基準でトリミングされた正方形画像が得られます。重要な被写体が端にある場合は、事前に写真アプリでトリミングしておくと安心です。</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">YouTubeサムネイルを横長（16:9）にしたい</p>
          <p>YouTubeサムネイルは<strong>16:9（1280×720px推奨）</strong>が標準サイズです。縦長写真をアップロードして「16:9」を選ぶと自動的に横長に変換されます。サムネイルとしてテキストを重ねる場合は余白を意識してトリミング位置を調整してください。</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Instagram Stories・TikTok用に縦長（9:16）にしたい</p>
          <p>スマートフォンの縦画面に最適な<strong>9:16（1080×1920px）</strong>は、横長写真を縦型コンテンツに変換するときに使います。横長写真を9:16に変換すると上下に余白が入るか、もしくは左右が切り取られます。</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">ブログ・Webサイト用に横長（4:3 or 16:9）にしたい</p>
          <p>ブログ記事のアイキャッチ画像は<strong>16:9または4:3</strong>が一般的です。スマホで縦撮りした写真（9:16）を横長に変換するときに使います。画像の左右が切り取られるため、被写体が中央にある写真がきれいに仕上がります。</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">画像リサイズとアスペクト比変更の違い</h2>
      <p>
        「リサイズ」と「アスペクト比変更」は似ているようで異なります。
      </p>
      <div className="overflow-x-auto mt-3">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">操作</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">何が変わるか</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">主な用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["リサイズ（縮小・拡大）", "ピクセル数（解像度）が変わる。縦横比は維持", "ファイルサイズを小さくしたい・特定のpxサイズに合わせたい"],
              ["アスペクト比変更", "縦横の比率が変わる。画像がトリミングされる", "SNSに合わせてサイズを整えたい・縦横を逆にしたい"],
              ["トリミング（切り抜き）", "画像の一部を切り取る。余白を削除", "構図を整えたい・不要な部分を除きたい"],
            ].map(([op, change, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-slate-700 dark:text-zinc-200">{op}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{change}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">よくある質問</h2>
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">アスペクト比を変えると画像が切り取られますか？</p>
        <p>比率を変えると中央基準でトリミングされます。被写体が端にある場合は、事前に写真アプリで構図調整をおすすめします。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">スマホからでも使えますか？</p>
        <p>iPhone・Androidのブラウザ（Safari・Chrome）から使えます。アプリのインストールは不要です。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">何メガバイトまで対応していますか？</p>
        <p>ファイルサイズの制限はありません。ブラウザのメモリ（RAM）が許す限り処理できます。大きなファイルの場合は処理に数秒かかることがあります。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">変換後の画像の品質は落ちますか？</p>
        <p>元画像の解像度を維持したままアスペクト比を変更します。ただしJPG形式で出力する場合は若干の圧縮が入ります。品質を最大限維持したい場合はPNG形式でダウンロードしてください。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">GIF・WebPも変換できますか？</p>
        <p>GIF・WebPもアップロードして変換できます。出力形式はJPGまたはPNGになります（アニメーションGIFはアニメーションが失われます）。</p>
      </div>
    </div>
  </div>
);

export default function ImageResizePage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="画像のアスペクト比を変更・リサイズ"
      description="写真・画像のアスペクト比変更とリサイズをブラウザで完結。16:9・1:1・9:16など主要比率に対応。ファイルはサーバーに送信されません。"
      icon="✂️"
      slug="image-resize"
      seoContent={seoContent}
    >
      <ImageResize />
    </ToolLayout>
    </>
  );
}
