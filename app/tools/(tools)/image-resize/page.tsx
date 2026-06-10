import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ImageResize } from "./ImageResize";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "画像のアスペクト比を変更・リサイズ【ブラウザ完結・無料】",
  "写真・画像のアスペクト比変更とリサイズをブラウザで完結。16:9・1:1・9:16など主要比率に1クリック対応。X・Instagram・YouTube・TikTok等SNS別の推奨サイズ一覧付き。アプリ不要・登録不要・無料。",
  "image-resize",
  ["写真 アスペクト比 変更", "画像 アスペクト比 変換 無料", "アスペクト比 変更 ブラウザ", "画像 リサイズ 無料 スマホ", "画像 サイズ変更 オンライン"]
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

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">写真のアスペクト比を変更する手順</h2>
    <ol className="list-decimal list-outside ml-5 space-y-1">
      <li>「ファイルを選択」または画像をドラッグ&ドロップでアップロード</li>
      <li>変更したいアスペクト比（例：16:9）またはカスタムサイズを選択</li>
      <li>プレビューで仕上がりを確認</li>
      <li>「ダウンロード」ボタンでPNG/JPG形式で保存</li>
    </ol>
    <p className="text-xs text-slate-500 dark:text-zinc-500">※ 処理はすべてブラウザ内で完結します。画像がサーバーに送信されることは一切ありません。</p>

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
