import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("video-compress-guide")!;

export const metadata: Metadata = generateMeta({
  title: "動画を圧縮して容量を小さくする方法【無料・アプリ不要・スマホ対応】",
  description: "iPhoneで撮った動画がLINEで送れない、メールに添付できない——ブラウザだけで解決。MP4・MOV対応・登録不要・無料。1GB動画を数十MBに圧縮できます。",
  path: `/blog/${post.slug}`,
  keywords: ["動画 容量 小さくする 無料", "動画圧縮 アプリ不要 ブラウザ", "MP4 圧縮 スマホ", "動画 LINE 送れない 解決", "iPhone 動画 軽くする 方法"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "LINEで動画が送れないのはなぜですか？",
      acceptedAnswer: { "@type": "Answer", text: "LINEのファイル送信は最大1GBまでですが、Keep機能やノート投稿には5分・200MBなどの制限があります。動画を圧縮してファイルサイズを小さくすることで解決できます。" },
    },
    {
      "@type": "Question",
      name: "iPhoneで撮った動画を圧縮する方法は？",
      acceptedAnswer: { "@type": "Answer", text: "アプリ不要の方法として、ブラウザから動画圧縮ツールを使うのが最も手軽です。iPhone設定の「カメラ」→「ビデオ撮影」で4Kから1080p/720pに変更するだけでも容量が1/4〜1/8になります。" },
    },
    {
      "@type": "Question",
      name: "動画圧縮で画質はどれくらい落ちますか？",
      acceptedAnswer: { "@type": "Answer", text: "スマートフォンで見る程度なら720p・圧縮率70%でも差はほぼわかりません。元動画が4K60fpsなら1080p30fpsに変換するだけで容量を1/4〜1/10にできます。" },
    },
    {
      "@type": "Question",
      name: "圧縮した動画はサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "ToolBoxの動画圧縮ツールはブラウザ内で処理が完結します。アップロードした動画が外部サーバーに送信されることは一切ありません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        iPhone 15 Proで撮った5分の動画をLINEで送ろうとしたら1.1GBあって弾かれました。動画圧縮アプリを探してもインストールが必要なものばかりで、「ブラウザだけで完結するもの」がなかったので自分で作りました。実際に圧縮したところ44MBになり、LINEで普通に送れました。この記事ではiPhone・Android・PCそれぞれの手順と、用途別のおすすめ設定をまとめています。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">今すぐ動画を圧縮する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">MP4・MOV対応・アプリ不要・完全無料。ブラウザだけで動画のファイルサイズを小さくできます。</p>
        <Link href="/tools/video-compress" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          動画圧縮ツールを使う（無料）→
        </Link>
      </div>

      <h2>動画が送れない・重い場面</h2>
      <ul className="space-y-2">
        <li>LINEの動画送信でサイズ制限（通常5分・200MB）を超えてしまう</li>
        <li>メール添付の上限（25MB前後）を超える</li>
        <li>SNSのアップロードに時間がかかりすぎる</li>
        <li>クラウドストレージの空き容量が足りない</li>
        <li>会社の申請フォームで動画のサイズ制限に引っかかる</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮前後のファイルサイズ目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">元の動画</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">圧縮後（720p・標準品質）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">圧縮後（480p・低品質）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1080p・1分（約200MB）", "約40〜60MB", "約15〜25MB"],
              ["1080p・3分（約600MB）", "約120〜180MB", "約45〜75MB"],
              ["4K・1分（約400MB）", "約60〜100MB（720p）", "約20〜40MB（480p）"],
              ["iPhoneのMOV・1分（約130MB）", "約30〜50MB", "約12〜20MB"],
            ].map(([before, mid, small], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{before}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{mid}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{small}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※動画の内容・コーデック・元のビットレートによって大きく異なります。実際の圧縮率は試してみてください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iPhoneで動画を圧縮する手順</h2>
      <ol className="list-decimal list-outside ml-6 space-y-2 my-4">
        <li>Safariで<Link href="/tools/video-compress">動画圧縮ツール</Link>を開く</li>
        <li>「ファイルを選択」をタップ →「写真ライブラリ」または「ファイル」からMOV・MP4を選ぶ</li>
        <li>解像度（720p推奨）と品質を設定</li>
        <li>「圧縮する」をタップして待つ</li>
        <li>完了したら「ダウンロード」→「ファイル」アプリまたは写真アプリに保存</li>
      </ol>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※iPhoneのSafariは大容量ファイルの処理に時間がかかることがあります。Wi-Fi環境での操作を推奨します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>Androidで動画を圧縮する手順</h2>
      <ol className="list-decimal list-outside ml-6 space-y-2 my-4">
        <li>ChromeまたはEdgeで<Link href="/tools/video-compress">動画圧縮ツール</Link>を開く</li>
        <li>「ファイルを選択」をタップ →「ファイル」アプリや「ギャラリー」から動画を選ぶ</li>
        <li>解像度と品質を設定して圧縮</li>
        <li>「ダウンロード」をタップして保存</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PC（Windows・Mac）で動画を圧縮する手順</h2>
      <ol className="list-decimal list-outside ml-6 space-y-2 my-4">
        <li>ブラウザ（Chrome・Safari・Edge）で<Link href="/tools/video-compress">動画圧縮ツール</Link>を開く</li>
        <li>動画ファイルをドラッグ&ドロップ、またはファイル選択から読み込む</li>
        <li>解像度・品質を設定してダウンロード</li>
      </ol>
      <p className="text-[14px] text-slate-600 dark:text-zinc-400">
        PCはスマホより処理が速く、大容量ファイルも安定して扱えます。1GB以上の動画はPCで圧縮することをおすすめします。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>用途別・おすすめ設定</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨解像度</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目標サイズ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["LINEで送る", "720p", "200MB以下（5分以内）", "品質より送信できることを優先"],
              ["メール添付", "480p", "25MB以下", "最大限圧縮でOK"],
              ["X（Twitter）投稿", "1080p", "512MB以下・2分20秒以内", "高品質を維持しやすい"],
              ["Instagram投稿", "1080p", "4GB以下・60秒以内", "アスペクト比に注意"],
              ["Slackで共有", "720p", "1GB以下", "チャンネルの設定による"],
              ["バックアップ保存", "1080p", "容量許す限り高品質", "画質を落とさず保存"],
            ].map(([use, res, size, tip], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{res}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500 text-xs">{tip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮しても画質はきれいに保てる？</h2>
      <p>
        解像度を下げずに品質のみを調整した場合、通常の視聴では大きな劣化は感じにくいです。ただし元の動画のビットレートや内容によって差があります。
      </p>
      <ul className="space-y-2">
        <li><strong>動きが少ない動画</strong>（料理・解説など）：圧縮してもほぼ劣化が目立たない</li>
        <li><strong>動きが多い動画</strong>（スポーツ・ゲームなど）：圧縮すると細部がぼやけることがある</li>
        <li><strong>スマホの小画面で見る場合</strong>：720pで十分きれいに見える</li>
        <li><strong>大きなテレビ・モニターで視聴する場合</strong>：1080pを維持することをおすすめ</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>LINEでまだ送れない場合</h2>
      <p>
        圧縮後もLINEで送れない場合は以下を試してください。
      </p>
      <ul className="space-y-2">
        <li><strong>解像度を480pに下げる</strong>：ファイルサイズが大幅に削減される</li>
        <li><strong>動画を分割する</strong>：長い動画は複数回に分けて送る</li>
        <li><strong>LINEのアルバム機能を使う</strong>：「タイムライン」に投稿する方法もある</li>
        <li><strong>Google DriveやiCloud経由で共有</strong>：リンクを送るとサイズ制限なし</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：JPG・PNG画像のファイルサイズを小さくする</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>：iPhoneの写真をJPGに変換する</li>
        <li><Link href="/blog/image-compress-guide">画像を軽くする方法</Link>：写真ファイルの圧縮ガイド</li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 実際に試してみた結果</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          iPhone 15 Proで撮った5分・1.1GBの動画を720p・品質70%で圧縮したところ約44MBになりました。LINEのKeep機能（200MB制限）に余裕で収まりました。画質はスマホの画面で見るぶんにはほぼ差がわかりません。ただiPhoneのSafariは大きいファイルの処理が遅く、1GB超はPCから操作するほうが早いです。Androidは同サイズでもスムーズでした。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        圧縮処理はブラウザ内で完結します。アップロードした動画ファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
    </>
  );
}
