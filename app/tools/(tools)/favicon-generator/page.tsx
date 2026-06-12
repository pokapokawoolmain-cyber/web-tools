import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { FaviconGenerator } from "./FaviconGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "ファビコン作成・生成ツール｜画像・文字からICO・PNG・SVGを無料作成",
  "テキスト・絵文字・画像からfavicon.ico・PNG・Apple Touch Icon・PWAアイコンを無料作成。Maskable Icon・WebManifest・HTMLコードも一括生成。ブラウザ完結・登録不要。",
  "favicon-generator",
  [
    "ファビコン 作成",
    "favicon 作成 無料",
    "favicon ico 変換 ツール",
    "ファビコン ジェネレーター",
    "Apple Touch Icon 作成",
    "PWAアイコン 生成",
    "maskable icon 作成",
  ]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ファビコンの推奨サイズは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "主要サイズは16×16、32×32、48×48px（favicon.icoに収録）です。Apple Touch Iconは180×180px、PWA用は192×192と512×512pxが推奨されます。Maskable Iconでは同じサイズで別ファイルが必要です。",
      },
    },
    {
      "@type": "Question",
      name: "ICOとPNGはどちらを使うべき？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "どちらも必要です。favicon.ico（複数サイズ入り）は旧ブラウザ対応のためルートに必須です。PNG形式はApple Touch Icon（180px）やPWAアイコン（192px・512px）に使います。現代的なサイトではfavicon.ico + PNG + WebManifestをセットで用意することを推奨します。",
      },
    },
    {
      "@type": "Question",
      name: "Maskable Iconとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Maskable IconはAndroid端末でPWAアイコンを表示する際、端末ごとに異なる形状（円形・角丸など）にマスクして表示される専用のアイコンです。コンテンツを中央80%の「安全領域」内に収め、背景を必ず不透明にする必要があります。通常版とは別ファイルとして用意します。",
      },
    },
    {
      "@type": "Question",
      name: "Google検索結果にファビコンが表示されないのはなぜ？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Googleがクロールして認識するまで数日〜数週間かかります。robots.txtやCSPでfavicon.icoへのアクセスを遮断していると表示されません。favicon.icoはサイトのルートに配置し、Googlebotがアクセスできる状態にする必要があります。また、ファビコンURLを頻繁に変更すると再認識が遅くなります。",
      },
    },
    {
      "@type": "Question",
      name: "ファビコンを変更しても更新されないのはなぜ？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ブラウザがファビコンをキャッシュしているためです。Ctrl+Shift+R（Windows）またはCmd+Shift+R（Mac）で強制リロードするか、ブラウザのキャッシュをクリアしてください。他の人のブラウザには即時反映されません。",
      },
    },
    {
      "@type": "Question",
      name: "Next.jsではfavicon.icoをどこに配置する？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Next.js App Routerでは、app/favicon.ico に配置するだけで自動認識されます（ファイルベースMetadata API）。app/icon.png でPNGアイコン、app/apple-icon.png でApple Touch Iconも自動で設定されます。",
      },
    },
    {
      "@type": "Question",
      name: "アップロードした画像はサーバーに送信されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "送信されません。このツールの画像作成処理はすべてブラウザ内（Canvas API）で完結します。サイト診断機能のみサーバー経由でURLにアクセスしますが、アップロード画像は一切サーバーに送信されません。",
      },
    },
    {
      "@type": "Question",
      name: "作成したファビコンは商用利用できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。このツールで作成したファビコンは商用利用を含むあらゆる用途に無料で利用できます。ただし、アップロードした画像に第三者の著作権がある場合はその権利に従ってください。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <p>
      サイトを公開してすぐ「ブラウザのタブにアイコンが出ない」と気になった経験がある方は多いと思います。
      ファビコンはたった1枚設定するだけですが、ICO・PNG・Apple Touch Icon・Maskable Iconと
      用途ごとにファイルが異なり、意外と手間がかかります。このツールで一括作成してください。
    </p>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">ファビコンとは</h2>
      <p>
        ファビコン（favicon）はブラウザのタブ・アドレスバー・ブックマーク・
        Google検索結果に表示されるサイトの小さなアイコンです。
        「favorites icon」の略で、サイトの認識性・ブランディングに直結します。
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">推奨ファビコンサイズ一覧</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">ファイル</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">サイズ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["favicon.ico", "16・32・48px入り", "ブラウザタブ・旧ブラウザ全般（必須）"],
              ["favicon-32x32.png", "32×32px", "通常ブラウザタブ（推奨）"],
              ["apple-touch-icon.png", "180×180px", "iPhoneホーム画面追加（必須）"],
              ["favicon-192x192.png", "192×192px", "PWA・Androidホーム画面"],
              ["favicon-512x512.png", "512×512px", "PWAスプラッシュ・Webアプリ"],
              ["favicon-192x192-maskable.png", "192×192px（maskable）", "Android適応型アイコン（推奨）"],
              ["favicon-512x512-maskable.png", "512×512px（maskable）", "Android適応型アイコン大サイズ"],
            ].map(([file, size, use], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-blue-600 dark:text-blue-400 text-[11px]">{file}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-bold">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">ICO・PNG・SVGの違い</h2>
      <div className="space-y-2">
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3">
          <p className="font-semibold text-slate-800 dark:text-slate-200">favicon.ico</p>
          <p>複数サイズを1ファイルに格納できるコンテナ形式。すべてのブラウザで動作し、サイトルートに置くだけで自動認識される最も互換性の高い形式。</p>
        </div>
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3">
          <p className="font-semibold text-slate-800 dark:text-slate-200">PNG</p>
          <p>Apple Touch IconやPWAアイコンに使用。透明背景に対応。サイズ別に個別ファイルが必要。</p>
        </div>
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3">
          <p className="font-semibold text-slate-800 dark:text-slate-200">SVG（ベクター）</p>
          <p>Chrome・Firefox・Edgeが対応し、拡大しても劣化しない。ダークモード切り替えも内部CSSで可能だが、Safari非対応のため必ずICO/PNGフォールバックが必要。</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">16pxでも見やすくするデザインのコツ</h2>
      <ul className="list-disc list-outside ml-5 space-y-1">
        <li>1〜2文字のシンプルなテキストやアイコンが最適（細かいロゴは潰れる）</li>
        <li>背景色と文字色のコントラストを高くする（明度差を確保）</li>
        <li>細い線・小さな文字は16pxで消える — 太めのウェイトを使う</li>
        <li>ライトモード・ダークモード両方で確認する</li>
        <li>余白を詰めてアイコンを大きく見せる（padding は 0〜10%程度）</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Google検索にファビコンが表示される条件</h2>
      <ul className="list-disc list-outside ml-5 space-y-1">
        <li>robots.txtやCSPでGooglebot・Googlebot-Imageがfavicon.icoにアクセスできること</li>
        <li>サイトルートに favicon.ico が存在するか、有効な<code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">&lt;link rel=&quot;icon&quot;&gt;</code>があること</li>
        <li>アイコンが正方形でサイトを象徴する画像であること（文字・数字のみも可）</li>
        <li>Googleに認識されるまで数日〜数週間かかることがある</li>
        <li>サブディレクトリごとにGoogle検索用ファビコンを変えることはできない</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        {[
          ["ファビコンの推奨サイズは？", "favicon.ico（16/32/48px）+ apple-touch-icon.png（180px）+ favicon-192x192.png・512x512.png（PWA）+ Maskable版（192/512px）のセットが現代的なWebサイトの推奨構成です。"],
          ["ファビコンを変更しても更新されないのはなぜ？", "ブラウザがファビコンをキャッシュしているためです。Ctrl+Shift+R（Win）/ Cmd+Shift+R（Mac）で強制リロードしてください。他のユーザーには即時反映されません。"],
          ["iPhoneのホーム画面用アイコンは別に必要？", "はい。<link rel=\"apple-touch-icon\">で指定する180×180pxのPNGが必要です。このツールのZIPダウンロードにapple-touch-icon.pngが含まれます。"],
          ["Next.jsではfavicon.icoをどこに配置する？", "app/favicon.ico に置くだけで自動認識されます（App Router）。app/icon.png・app/apple-icon.png も同様です。"],
          ["WordPressではどう設定する？", "「外観 → カスタマイズ → サイト基本情報 → サイトアイコン」から512×512px以上のPNGをアップロードするのが最も簡単です。"],
        ].map(([q, a], i) => (
          <div key={i}>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{q}</p>
            <p className="mt-0.5">{a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function FaviconGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ファビコン作成・生成ツール"
        description="テキスト・絵文字・画像からfavicon.ico・PNG・Apple Touch Icon・Maskable IconをブラウザだけでWEBManifestごと無料作成。登録不要・ファイル送信なし。"
        icon="🌐"
        slug="favicon-generator"
        seoContent={seoContent}
      >
        <FaviconGenerator />
      </ToolLayout>
    </>
  );
}
