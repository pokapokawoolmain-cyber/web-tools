import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("url-shorten-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["URL 短縮 方法 無料", "長い URL 短くする", "URL 短縮 QRコード 同時", "short link 無料", "URL 短縮 名刺 チラシ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「https://example.com/very/long/path?param=value&...」のような長いURLは、名刺・チラシへの印刷やSNS投稿に使いにくいです。短縮URLとQRコードを同時に作る方法を解説します。
      </p>

      <h2>URL短縮が役立つ場面</h2>
      <ul>
        <li>名刺・フライヤーにURLを印刷する際にコンパクトにしたい</li>
        <li>Twitter（X）の140文字制限を活用するためURLを短くしたい</li>
        <li>メールやLINEで長いURLを短く整形して見やすくしたい</li>
        <li>Google Formsや予約ページの長いURLを共有しやすくしたい</li>
      </ul>

      <h2>URL短縮とQRコードを作る手順</h2>

      <h3>① URL短縮ツールにアクセスする</h3>
      <p>
        <Link href="/tools/short-link">URL短縮&QR生成ツール</Link>をブラウザで開きます。
      </p>

      <h3>② URLを入力する</h3>
      <p>
        短縮したいURLを入力欄に貼り付けます。入力すると短縮URLとQRコードが同時に生成されます。
      </p>

      <h3>③ 短縮URLをコピー、またはQRコードをダウンロード</h3>
      <p>
        生成された短縮URLをコピーしてSNSやメッセージに使えます。QRコードはPNGまたはSVGでダウンロードして印刷物に使えます。
      </p>

      <h2>URL短縮とQRコードを同時に使う活用例</h2>
      <ul>
        <li><strong>名刺</strong>：短縮URLをテキストで記載し、QRコードも印刷する——どちらの方法でも飛べる</li>
        <li><strong>チラシ・POP</strong>：QRコードをスキャンするだけでページにアクセスできる</li>
        <li><strong>プレゼンテーション</strong>：スライドにQRコードを入れて、参加者がスマホでアクセスできるようにする</li>
        <li><strong>SNSプロフィール</strong>：URLが長いサービスの場合、短縮URLでプロフィール欄をすっきりさせる</li>
      </ul>

      <h2>印刷物にはQRコード、テキストには短縮URL</h2>
      <p>
        同じリンクをQRコードと短縮URLの両方の形式で持っておくことで使い分けができます。
      </p>
      <ul>
        <li><strong>QRコード</strong>：スキャンするだけで飛べる——名刺・チラシ・掲示物に最適</li>
        <li><strong>短縮URL</strong>：手入力・コピーが楽——メール本文・SNS投稿・口頭説明に最適</li>
      </ul>

      <h2>QRコードのみ作成したい場合</h2>
      <p>
        URL短縮なしでQRコードだけ作りたい場合は<Link href="/tools/qr-generator">QRコード生成ツール</Link>を使うと、URLやテキストから直接QRコードを生成できます。Wi-FiのQRコードを作りたい場合は<Link href="/tools/wifi-qr">Wi-Fi QRコード生成ツール</Link>が便利です。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">関連ツール</strong>
        <Link href="/tools/qr-generator" className="text-blue-600 dark:text-blue-400 hover:underline">QRコード生成ツール</Link>でURL・テキスト・メールアドレス等からQRコードをPNG/SVGで作成できます。
      </div>
    </BlogLayout>
  );
}
