import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-rotate-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 横向き 直す 無料 スマホ", "PDF 回転 アプリ不要 ブラウザ", "PDF 向き 変更 縦向き 方法", "スキャン PDF 横向き 修正 簡単", "PDF 180度 回転 逆向き 直す"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        スキャンしたPDFを開いたら横向きになっていた——よくあることです。スキャナーの設定や原稿の向きによって、PDFのページが意図しない向きで保存されることがあります。この問題は専用ソフトなしで無料で修正できます。
      </p>

      <h2>PDFが横向きになる主な原因</h2>
      <ul className="space-y-2">
        <li>原稿を横向きにセットしてスキャンしてしまった</li>
        <li>スキャナーの自動回転設定がうまく働かなかった</li>
        <li>Wordなど横向き設定のドキュメントをPDF化した</li>
        <li>スマホで撮影した書類をPDF化した際に向きが反映されなかった</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFの向きを直す手順</h2>

      <h3>① PDF回転ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-rotate">PDF回転ツール</Link>をブラウザで開きます。スマホ・PCどちらからでも使えます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」でPDFを読み込みます。アップロードするとページのプレビューが表示されます。
      </p>

      <h3>③ 回転方向を選ぶ</h3>
      <p>
        回転角度を選択します。
      </p>
      <ul className="space-y-2">
        <li><strong>90°（右回転）</strong>：左を向いているページを正面に向ける場合</li>
        <li><strong>180°</strong>：逆さまになっているページを直す場合</li>
        <li><strong>270°（左回転）</strong>：右を向いているページを正面に向ける場合</li>
      </ul>
      <p>
        全ページ一括回転、または特定ページのみ個別回転が選べます。
      </p>

      <h3>④ ダウンロードする</h3>
      <p>
        「回転して保存」ボタンを押すと修正済みPDFをダウンロードできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>画質は劣化しますか？</h2>
      <p>
        PDFの回転はページの「表示方向」を変更するメタデータの操作です。テキスト・画像・図形の内容そのものは変更されないため、画質が劣化することはありません。
      </p>
      <p>
        これはJPGを回転させるのとは異なります。JPEG画像を回転・保存すると再圧縮で画質が劣化しますが、PDF内のページ回転は内容を書き換えないため安全です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スキャンしたPDFに多い問題</h2>
      <p>
        スキャンPDFにありがちな問題と、それぞれ対応するツールをまとめます。
      </p>
      <ul className="space-y-2">
        <li><strong>向きが横になっている</strong>：<Link href="/tools/pdf-rotate">PDF回転ツール</Link>で修正</li>
        <li><strong>ファイルサイズが大きすぎる</strong>：<Link href="/tools/pdf-compress">PDF圧縮ツール</Link>で軽量化</li>
        <li><strong>不要なページが含まれている</strong>：<Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>で除去</li>
        <li><strong>複数ファイルになっている</strong>：<Link href="/tools/pdf-merge">PDF結合ツール</Link>でまとめる</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
