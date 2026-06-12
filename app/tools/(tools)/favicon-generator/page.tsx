import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { FaviconGenerator } from "./FaviconGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "ファビコン作成ツール【無料・ダウンロード即可】",
  "テキスト・絵文字・画像からファビコン（favicon.ico）を無料作成。16×16〜64×64のマルチサイズICOとPNG 256pxをブラウザ完結でダウンロード。登録不要・ファイル送信なし。",
  "favicon-generator",
  ["ファビコン 作成", "favicon ico 作成 無料", "ファビコン 生成 ツール", "favicon 作り方 サイト", "ファビコン png 変換"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ファビコン（favicon）とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ファビコンとはブラウザのタブやブックマークに表示される小さなアイコンのことです。サイトの顔ともいえる存在で、favicon.icoというファイル名でサイトのルートに置くのが一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "favicon.icoに含まれるサイズは何種類ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "このツールで作成するfavicon.icoには16×16・32×32・48×48・64×64ピクセルの4サイズが含まれます。ブラウザは表示環境に合わせて最適なサイズを自動選択します。",
      },
    },
    {
      "@type": "Question",
      name: "Apple Touch Icon（スマホのホーム画面用）にも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。「PNG 256px」ボタンでダウンロードしたファイルをApple Touch Iconとして使えます。HTMLの<head>に<link rel=\"apple-touch-icon\" href=\"/favicon-256x256.png\">と記述してください。",
      },
    },
    {
      "@type": "Question",
      name: "アップロードした画像はサーバーに送信されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "送信されません。このツールはすべてブラウザ内（JavaScript）で処理が完結します。画像データが外部サーバーに送られることは一切ありません。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <p>
      個人ブログを開設したとき、タブに表示されるアイコンが設定されていないと
      ブラウザのデフォルトアイコンになってしまいます。ファビコン1つ設定するだけで
      サイトの印象がぐっと上がるので、ぜひ試してみてください。
    </p>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">ファビコンとは</h2>
    <p>
      ファビコン（favicon）とはブラウザのタブ・アドレスバー・ブックマークに表示される
      小さなアイコンです。「favorites icon」の略で、サイトのブランドを伝える重要な
      視覚要素です。
    </p>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">ファビコンの推奨サイズ一覧</h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">サイズ</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">用途</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">備考</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["16×16px", "ブラウザタブ・アドレスバー", "最小サイズ。シンプルなデザインが◎"],
            ["32×32px", "タスクバー・ショートカット", "Windowsのタスクバーで使用"],
            ["48×48px", "Windowsデスクトップ", "アイコン表示時に使用"],
            ["64×64px", "高解像度ディスプレイ", "Retinaディスプレイで鮮明に表示"],
            ["180×180px", "Apple Touch Icon", "iPhoneホーム画面追加用"],
            ["192×192px", "Android PWA", "Progressive Web Appアイコン"],
            ["512×512px", "PWA スプラッシュ", "AndroidのPWAスプラッシュ画面"],
          ].map(([size, use, note], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-bold text-blue-600 dark:text-blue-400">{size}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">ファビコンの作り方・手順</h2>
    <ol className="list-decimal list-outside ml-5 space-y-1">
      <li>テキスト・絵文字モードで文字や絵文字を入力するか、画像をアップロード</li>
      <li>背景色・形状（四角・角丸・円形）をお好みで設定</li>
      <li>プレビューで16px・32px・64pxの仕上がりを確認</li>
      <li>「favicon.ico をダウンロード」ボタンで取得</li>
      <li>ダウンロードしたfavicon.icoをサイトのルートディレクトリに配置</li>
      <li>HTMLの<code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">&lt;head&gt;</code>内に<code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">&lt;link rel=&quot;icon&quot; href=&quot;/favicon.ico&quot;&gt;</code>を追加</li>
    </ol>

    <h2 className="text-lg font-bold text-slate-900 dark:text-white">よくある質問</h2>
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">WordPressやSHEAREAにも使えますか？</p>
        <p>はい。PNG形式でダウンロードして、各CMSのファビコン設定画面からアップロードできます。WordPressは「外観 → カスタマイズ → サイト基本情報」から設定可能です。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">16×16pxで絵文字がぼやける場合は？</p>
        <p>16pxは非常に小さいため、複雑なデザインはぼやけます。シンプルな1文字の絵文字か、コントラストの強い配色がおすすめです。プレビューの16pxで確認してからダウンロードしてください。</p>
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">ファビコンを変更してもブラウザに反映されません</p>
        <p>ブラウザはファビコンをキャッシュします。強制リロード（Windows: Ctrl+Shift+R、Mac: Cmd+Shift+R）または「キャッシュを空にして再読み込み」で解決します。</p>
      </div>
    </div>
  </div>
);

export default function FaviconGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ファビコン作成ツール"
        description="テキスト・絵文字・画像からfavicon.icoを無料作成。マルチサイズICOとPNGをブラウザ完結でダウンロード。登録不要・ファイル送信なし。"
        icon="🌐"
        slug="favicon-generator"
        seoContent={seoContent}
      >
        <FaviconGenerator />
      </ToolLayout>
    </>
  );
}
