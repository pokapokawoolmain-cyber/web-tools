import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("qr-create-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["QRコード 作り方 無料", "QRコード 生成 ブラウザ", "QRコード 名刺 URL", "QR code 作成 登録不要", "QRコード PNG ダウンロード"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        URLをQRコードに変換して名刺に印刷したい、お店のInstagramアカウントをQRコードで共有したい——ブラウザから30秒で作成・ダウンロードできます。登録不要・無料です。
      </p>

      <h2>QRコードを作りたい場面</h2>
      <ul>
        <li>名刺にWebサイトやSNSのQRコードを入れたい</li>
        <li>チラシや店舗POPに予約ページやメニューのQRを掲載したい</li>
        <li>SNSのプロフィールURLをQRコードでシェアしたい</li>
        <li>Google MapsのリンクをQRコードにしてお客様に渡したい</li>
        <li>テキスト・電話番号・メールアドレスをQRコード化したい</li>
      </ul>

      <h2>QRコードの作り方</h2>

      <h3>① QRコード生成ツールにアクセスする</h3>
      <p>
        <Link href="/tools/qr-generator">QRコード生成ツール</Link>をブラウザで開きます。
      </p>

      <h3>② URLやテキストを入力する</h3>
      <p>
        入力欄にQRコード化したいURLやテキストを入力します。入力すると即座にプレビューが更新されます。
      </p>

      <h3>③ デザインをカスタマイズする（任意）</h3>
      <p>
        ドット色（前景色）と背景色をカスタマイズできます。ブランドカラーに合わせたQRコードを作成できます。
      </p>

      <h3>④ PNG・SVGでダウンロードする</h3>
      <p>
        「PNGダウンロード」または「SVGダウンロード」ボタンで保存します。
      </p>

      <h2>PNGとSVGどちらを使うべきか</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">形式</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">特徴</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["PNG", "ラスター形式・一般的", "Web・スライド・LINEシェア"],
              ["SVG", "ベクター形式・拡大しても劣化しない", "印刷物・名刺・チラシ・看板"],
            ].map(([format, feature, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{format}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{feature}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        印刷物に使う場合はSVGを強くおすすめします。名刺・チラシ・看板など、様々なサイズに拡大しても解像度が落ちません。Web・スライドで使う場合はPNGで十分です。
      </p>

      <h2>QRコードが読み取れないときの対処法</h2>
      <ul>
        <li><strong>サイズが小さすぎる</strong>：印刷する場合は最低でも2cm×2cm以上にする</li>
        <li><strong>コントラストが足りない</strong>：明暗の差が小さいカスタムカラーは読み取りにくくなる</li>
        <li><strong>URLが長すぎる</strong>：QRコードのパターンが複雑になるため、短縮URLを使うと読み取りやすくなる</li>
        <li><strong>印刷がかすれている</strong>：プリンターの品質を確認し、コントラストを上げて再印刷する</li>
      </ul>

      <h2>Wi-Fi接続用のQRコードを作りたい場合</h2>
      <p>
        お店やオフィスでゲスト向けのWi-Fi接続QRコードを作りたい場合は、<Link href="/tools/wifi-qr">Wi-Fi QRコード生成ツール</Link>を使うとSSIDとパスワードを入力するだけで専用QRコードを作成できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">有効期限について</strong>
        このツールで作成したQRコードはサーバーで管理されないため、有効期限がありません。ダウンロードしたファイルはオフラインでも使い続けられます。ただしリンク先のURL自体が変更・削除された場合は読み取っても飛べなくなります。
      </div>
    </BlogLayout>
  );
}
