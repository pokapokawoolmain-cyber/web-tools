import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-split-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF ページ 抽出 無料 スマホ", "PDF 分割 アプリ不要 ブラウザ", "PDF 特定ページ 取り出す 方法", "PDF 一部だけ 保存 ダウンロード", "PDF ページ 切り取り 登録不要"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「100ページある報告書から3ページだけ取り出したい」「契約書の1〜5ページ目だけ相手に送りたい」——こういった場面でPDFの分割・ページ抽出が必要になります。専用ソフト不要でブラウザから無料でできる方法を解説します。
      </p>

      <h2>PDFを分割したくなる場面</h2>
      <ul className="space-y-2">
        <li>100ページのPDFのうち特定の章だけを相手に送りたい</li>
        <li>スキャンしたPDFから必要なページだけ取り出して保存したい</li>
        <li>大きなPDFを章ごとに分けて管理したい</li>
        <li>複数人で分担して作業するためにページ範囲で分割したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFの特定ページを抽出する手順</h2>

      <h3>① PDF分割ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-split">PDF分割ツール</Link>をブラウザで開きます。スマホ・PCどちらからでも使えます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」またはドラッグ&ドロップでPDFを読み込みます。
      </p>

      <h3>③ 抽出したいページを指定する</h3>
      <p>
        ページ番号を入力します。入力形式は柔軟です。
      </p>
      <ul className="space-y-2">
        <li><strong>「3」</strong>：3ページ目のみ</li>
        <li><strong>「1,3,5」</strong>：1・3・5ページ目</li>
        <li><strong>「5-8」</strong>：5ページ目から8ページ目</li>
        <li><strong>「1,3,5-8,10」</strong>：組み合わせも可能</li>
      </ul>

      <h3>④ 抽出してダウンロードする</h3>
      <p>
        「分割する」ボタンを押すと、指定したページだけを含む新しいPDFが生成されます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDF分割とPDFページ削除の違い</h2>
      <p>
        似た機能ですが、目的が逆です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ツール</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使い方</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている場面</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">PDF分割</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">「必要なページ」を指定して取り出す</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">保存したいページが少ない場合</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">PDFページ削除</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">「不要なページ」を選んで消す</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">残したいページが多い場合</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        たとえば50ページのPDFから45ページを残したい場合は、<Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>で不要な5ページを削除するほうが楽です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>分割後にページを並び替えたい場合</h2>
      <p>
        抽出したPDFをさらにページ順序を変えたい場合は、<Link href="/tools/pdf-reorder">PDF並び替えツール</Link>が使えます。また、複数の分割PDFをまとめる場合は<Link href="/tools/pdf-merge">PDF結合ツール</Link>を使ってください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホでのPDF分割：注意点</h2>
      <ul className="space-y-2">
        <li>iPhoneのファイルアプリまたはiCloudドライブからPDFを選択できます</li>
        <li>処理がすべてブラウザ内で行われるため、通信速度に関わらず安全です</li>
        <li>処理したPDFは「ダウンロード」フォルダまたはファイルアプリに保存されます</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
