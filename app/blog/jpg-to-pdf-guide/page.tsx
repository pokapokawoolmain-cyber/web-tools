import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("jpg-to-pdf-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["写真 PDF 変換 方法", "画像 PDF まとめる 無料", "iPhone 写真 PDF 変換", "JPG PDF 変換 スマホ", "image to pdf 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        スマホで撮影した領収書・書類・写真を1つのPDFにまとめたい場面は意外と多いものです。経費申請、確定申告、提出書類の整理——こういった場面でJPGや写真をPDF化する方法をまとめました。
      </p>

      <h2>写真をPDFにまとめたい場面</h2>
      <ul className="space-y-2">
        <li>スマホで撮影した複数枚の領収書を1つのPDFにして経費申請したい</li>
        <li>書類・契約書の各ページを撮影して1つのPDFにまとめたい</li>
        <li>旅行写真などをPDFアルバムとして保存・共有したい</li>
        <li>複数の身分証・免許証の画像をPDFにまとめて提出したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>JPG・写真をPDFに変換する手順</h2>

      <h3>① JPG→PDF変換ツールにアクセスする</h3>
      <p>
        <Link href="/tools/jpg-to-pdf">JPG→PDF変換ツール</Link>をブラウザで開きます。
      </p>

      <h3>② 画像をアップロードする</h3>
      <p>
        「ファイルを選択」ボタンで画像を選びます。複数ファイルを一度に選択できます。JPG・PNG・WebP・HEICなどの形式に対応しています。iPhoneで撮影した写真（HEIC）もそのままアップロードできます。
      </p>

      <h3>③ 順番を確認する</h3>
      <p>
        アップロードされた画像は一覧表示されます。この順番がPDFのページ順になります。ドラッグ&ドロップ（PCの場合）または上下ボタン（スマホの場合）で順番を変更できます。
      </p>

      <h3>④ PDFを生成してダウンロード</h3>
      <p>
        「PDFを生成」ボタンを押すと、選択した順番で画像が1つのPDFにまとめられます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iPhoneの写真をPDFにする場合</h2>
      <p>
        iPhoneの写真はHEIC形式で保存されていることが多いですが、このツールはHEIC形式にも直接対応しています。JPGに変換する手間なく、撮影した写真をそのままPDF化できます。
      </p>
      <p>
        HEIC形式のまま他の作業に使いたい場合は、先に<Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>でJPGに変換してから使うことも可能です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>領収書をPDFにまとめる際のコツ</h2>
      <ul className="space-y-2">
        <li><strong>撮影時は書類全体が収まるように</strong>：端が切れると読み取りにくくなります</li>
        <li><strong>明るい場所で撮影する</strong>：暗い写真は文字が読みにくくなります</li>
        <li><strong>ファイル名を整理してからアップロード</strong>：順番を間違えないように、ファイル名に日付や連番をつけておくと整理しやすいです</li>
        <li><strong>大きすぎる場合は圧縮</strong>：写真枚数が多いと生成されるPDFが大きくなります。<Link href="/tools/pdf-compress">PDF圧縮ツール</Link>で軽量化できます</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/pdf-merge">PDF結合</Link>：複数のPDFを1つにまとめる</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮</Link>：PDFのサイズを小さくする</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換</Link>：iPhone写真をJPGに変換する</li>
        <li><Link href="/tools/image-compress">画像圧縮</Link>：画像ファイルのサイズを小さくする</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        変換処理はすべてブラウザ内で完結します。アップロードした写真・画像データが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
