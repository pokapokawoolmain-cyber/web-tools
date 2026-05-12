import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("video-compress-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["動画 圧縮 無料 ブラウザ", "MP4 ファイルサイズ 小さく", "動画 LINE 送れない 解決", "動画 圧縮 画質 劣化しない", "video compress 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        スマホで撮影した動画をLINEで送ろうとしたら「ファイルが大きすぎます」と表示された、メールで送れない——動画ファイルの容量問題はよくある悩みです。アプリなしでブラウザから解決できます。
      </p>

      <h2>動画が送れない・重い場面</h2>
      <ul>
        <li>LINEの動画送信でサイズ制限（通常5分・200MB）を超えてしまう</li>
        <li>メール添付の上限（25MB前後）を超える</li>
        <li>SNSのアップロードに時間がかかりすぎる</li>
        <li>クラウドストレージの空き容量が足りない</li>
        <li>会社の申請フォームで動画のサイズ制限に引っかかる</li>
      </ul>

      <h2>動画を圧縮する手順</h2>

      <h3>① 動画圧縮ツールにアクセスする</h3>
      <p>
        <Link href="/tools/video-compress">動画圧縮ツール</Link>をブラウザで開きます。スマホ・PCどちらからでも使えます。
      </p>

      <h3>② 動画ファイルをアップロードする</h3>
      <p>
        「ファイルを選択」またはドラッグ&ドロップで動画を読み込みます。MP4・MOV・AVI・MKV等の主要フォーマットに対応しています。iPhoneで撮影したMOV動画もそのままアップロードできます。
      </p>

      <h3>③ 圧縮設定を選ぶ</h3>
      <p>
        品質・解像度を設定して圧縮します。
      </p>
      <ul>
        <li><strong>品質のみを下げる</strong>：解像度はそのまま、ファイルサイズを削減</li>
        <li><strong>解像度を下げる</strong>：1080p→720p→480pと小さくするほど大幅に軽量化</li>
      </ul>

      <h3>④ ダウンロードする</h3>
      <p>
        圧縮完了後に圧縮前後のサイズと削減率が表示されます。問題なければダウンロードしてください。
      </p>

      <h2>圧縮設定の目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨解像度</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">容量の目安</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["LINEで送る", "720p", "1分あたり30〜50MB程度"],
              ["SNS投稿（X・Instagram）", "720p〜1080p", "1分あたり50〜100MB程度"],
              ["メール添付", "480p", "1分あたり10〜20MB程度"],
              ["保存・アーカイブ", "1080p", "1分あたり100〜200MB程度"],
            ].map(([use, res, size], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{res}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>圧縮しても画質はきれいに保てる？</h2>
      <p>
        解像度を下げずに品質のみを調整した場合、通常の視聴では大きな劣化は感じにくいです。ただし元の動画のビットレートや内容によって差があります。
      </p>
      <p>
        スマートフォンの小さな画面で見る場合は720p（HD）でも十分きれいに見えます。大きなテレビやモニターで視聴する場合は1080p（フルHD）を維持することをおすすめします。
      </p>

      <h2>関連ツール</h2>
      <ul>
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：JPG・PNG画像のファイルサイズを小さくする</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>：iPhoneの写真をJPGに変換する</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        圧縮処理はブラウザ内で完結します。アップロードした動画ファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
