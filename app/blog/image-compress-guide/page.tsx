import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("image-compress-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["画像 圧縮 無料 スマホ アプリ不要", "JPG 軽くする ブラウザ 登録不要", "PNG 容量 減らす 方法 無料", "画像 ファイルサイズ 小さく メール", "写真 圧縮 LINE 送れない 解決"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        メールの添付制限に引っかかった、Webフォームで「ファイルサイズが大きすぎます」と弾かれた、SNSへのアップロードが遅い——画像のファイルサイズ問題はよくある悩みです。アプリなしでブラウザから無料で解決できます。
      </p>

      <h2>画像を軽くしたい場面</h2>
      <ul className="space-y-2">
        <li>メールの添付上限（一般的に5〜25MB）を超えてしまう</li>
        <li>行政や会社のWebフォームで「2MB以下のJPG」と指定されている</li>
        <li>WordやPowerPointに貼るとファイルが重くなる</li>
        <li>EC・求人サイトの商品・プロフィール画像のサイズ制限に対応したい</li>
        <li>ブログやWebサイトの画像を軽くしてページ速度を改善したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>画像を圧縮する手順</h2>

      <h3>① 画像圧縮ツールにアクセスする</h3>
      <p>
        <Link href="/tools/image-compress">画像圧縮ツール</Link>をブラウザで開きます。スマホ・PCどちらからでも使えます。
      </p>

      <h3>② 画像をアップロードする</h3>
      <p>
        「ファイルを選択」またはドラッグ&ドロップで画像を読み込みます。JPG・PNG・WebPに対応しています。複数ファイルを一度にアップロードして一括処理もできます。
      </p>

      <h3>③ 品質を設定して圧縮する</h3>
      <p>
        圧縮品質（0〜100%）を選択して「圧縮する」ボタンを押します。元のサイズと圧縮後のサイズ・削減率が表示され、ダウンロードできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>品質設定の目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">品質</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">圧縮率の目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["90%", "10〜30%削減", "印刷・高品質保存"],
              ["80%", "40〜60%削減", "メール添付・SNS投稿"],
              ["70%", "60〜70%削減", "Webサイト・ブログ"],
              ["50%", "75〜85%削減", "サムネイル・アイコン"],
            ].map(([quality, rate, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{quality}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>JPGとPNGで圧縮の特性が異なる</h2>
      <p>
        JPGは写真の圧縮に適しており、品質を大きく落とさずにファイルサイズを大幅に削減できます。PNGは透明背景があるロゴ・イラスト向きで、ロスレス圧縮のためJPGほど削減率は高くありません。
      </p>
      <p>
        写真をWebに使う場合は、PNGよりJPGやWebPの方が軽量になります。ロゴや図解など透過が必要なものはPNGのまま圧縮するのがよいでしょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮だけでなくリサイズも効果的</h2>
      <p>
        スマホで撮影した写真は4000×3000px以上の解像度があることが多く、Web用途ではそこまでの解像度は不要です。画像のサイズを1920×1080px程度にリサイズすると、圧縮と組み合わせてさらに大幅に容量を削減できます。<Link href="/tools/image-resize">画像リサイズツール</Link>も合わせて活用できます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HEICファイルの場合</h2>
      <p>
        iPhoneで撮影したHEIC形式の画像を圧縮・変換したい場合は、先に<Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>でJPGに変換してから圧縮すると良いでしょう。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        圧縮処理はすべてブラウザ内で完結します。アップロードした画像データが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
