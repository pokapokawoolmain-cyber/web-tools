import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-to-jpg-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 画像 変換 無料", "PDF JPG 変換 方法", "PDF スクリーンショット 保存", "PDF to image 無料", "PDF JPEG 変換"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「PDFのページを画像として保存したい」「プレゼン資料の1ページをSNSに投稿したい」「PDFを開けない相手にJPGで送りたい」——こういった場合にPDFをJPG画像に変換する方法が役立ちます。
      </p>

      <h2>PDFをJPGに変換したい場面</h2>
      <ul className="space-y-2">
        <li>PDFのページをInstagramやXに画像として投稿したい</li>
        <li>PDFを開けない相手にページの内容を画像で共有したい</li>
        <li>資料の特定ページをPowerPointやWordに貼り付けたい</li>
        <li>スキャン画像を含むPDFを整理して画像として保存したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFをJPGに変換する手順</h2>

      <h3>① PDF→JPG変換ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-to-jpg">PDF→JPG変換ツール</Link>をブラウザで開きます。iPhone・Android・PCどこからでも使えます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」またはドラッグ&ドロップでPDFを読み込みます。読み込みが完了するとページ数が表示されます。
      </p>

      <h3>③ 変換してダウンロードする</h3>
      <p>
        「JPGに変換」ボタンを押すと処理が始まります。全ページが変換され、複数ページの場合はZIPファイルでまとめてダウンロードできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>変換品質について</h2>
      <p>
        このツールは高解像度（通常の2倍スケール）でJPGを生成します。文字・図表が多いビジネス文書でも、ズームして確認できる十分な品質で出力されます。
      </p>
      <p>
        SNS投稿用途なら標準設定で問題ありません。印刷目的の場合は元のPDFを直接印刷するほうが品質が高くなります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>逆の変換：JPG→PDFにしたい場合</h2>
      <p>
        写真や画像をPDFにまとめたい場合は逆方向の変換が便利です。<Link href="/tools/jpg-to-pdf">JPG→PDF変換ツール</Link>を使うと、複数枚の画像を1つのPDFにまとめられます。iPhoneで撮影した書類写真を1つのPDFにまとめる用途にもよく使われます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連するPDFツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/pdf-merge">PDF結合</Link>：複数PDFを1つにまとめる</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮</Link>：PDFのサイズを小さくする</li>
        <li><Link href="/tools/pdf-split">PDF分割</Link>：特定ページだけ取り出す</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換</Link>：iPhone写真（HEIC）をJPGに変換する</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        変換処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
