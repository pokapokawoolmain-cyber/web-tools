import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-reorder-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF ページ 並び替え 方法", "PDF ページ順 変更 無料", "PDF 順番 入れ替え", "PDF reorder 無料", "PDF ページ 移動"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        PDFのページ順を間違えて作ってしまった、スキャンした書類のページが入れ替わっている——ページの並び替えはAcrobatなしでブラウザから無料でできます。
      </p>

      <h2>PDFのページ順を変えたい場面</h2>
      <ul>
        <li>複数枚スキャンした書類のページ順が入れ替わっている</li>
        <li>PDF結合後にページの順序が想定と違っていた</li>
        <li>提出書類の章立て・順番を修正したい</li>
        <li>表紙・目次・本文の順番を整えたい</li>
      </ul>

      <h2>PDFのページを並び替える手順</h2>

      <h3>① PDF並び替えツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-reorder">PDF並び替えツール</Link>をブラウザで開きます。スマホ・PCどちらからでも使えます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」でPDFを読み込みます。アップロードが完了すると各ページのサムネイルが表示されます。
      </p>

      <h3>③ ページを並び替える</h3>
      <p>
        PC・タブレットの場合：サムネイルをドラッグ&ドロップで移動します。
      </p>
      <p>
        スマホの場合：各サムネイルの▲▼ボタンを押してページを上下に移動します。
      </p>

      <h3>④ 保存してダウンロード</h3>
      <p>
        並び替えが完了したら「保存」ボタンを押すと、並び替え後のPDFをダウンロードできます。
      </p>

      <h2>PDF並び替えと関連ツールの使い分け</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">やりたいこと</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使うツール</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ページの順番を入れ替えたい", "PDF並び替え（このツール）"],
              ["不要なページを削除したい", "PDFページ削除ツール"],
              ["特定のページだけ取り出したい", "PDF分割ツール"],
              ["複数PDFを1つにまとめたい", "PDF結合ツール"],
              ["ページの向きを直したい", "PDF回転ツール"],
            ].map(([want, tool], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{want}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{tool}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>効率的なPDF編集の順番</h2>
      <p>
        複数の編集が必要な場合は以下の順番で進めると効率的です。
      </p>
      <ol>
        <li>まず<Link href="/tools/pdf-delete-pages">不要なページを削除</Link>する</li>
        <li>次に<Link href="/tools/pdf-reorder">ページを並び替え</Link>る</li>
        <li>必要であれば<Link href="/tools/pdf-rotate">向きを修正</Link>する</li>
        <li>最後に<Link href="/tools/pdf-compress">ファイルサイズを圧縮</Link>する</li>
      </ol>
      <p>
        全種類のPDFツールは<Link href="/pdf-tools">PDFツール一覧</Link>から確認できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
