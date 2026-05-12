import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("iphone-pdf-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["iPhone PDF 編集 無料", "スマホ PDF 操作 方法", "iPhone PDF アプリ不要", "iPhone PDF 結合 分割", "Safari PDF ツール"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「iPhoneでPDFを編集したいけどAcrobatは高い」「アプリをインストールしたくない」——そんな方のために、iPhoneのSafariブラウザだけで使える無料PDFツールを操作別にまとめました。
      </p>

      <h2>iPhoneでできるPDF操作一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">やりたいこと</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使うツール</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">難易度</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["複数PDFを1つにまとめる", "PDF結合", "かんたん"],
              ["特定ページだけ取り出す", "PDF分割", "かんたん"],
              ["ファイルサイズを小さくする", "PDF圧縮", "かんたん"],
              ["横向きページを縦に直す", "PDF回転", "かんたん"],
              ["不要なページを削除する", "PDFページ削除", "かんたん"],
              ["ページの順番を入れ替える", "PDF並び替え", "かんたん"],
              ["PDFを画像（JPG）に変換する", "PDF→JPG変換", "かんたん"],
              ["写真をPDFにまとめる", "JPG→PDF変換", "かんたん"],
              ["「社外秘」などの透かしを入れる", "PDF透かし", "かんたん"],
              ["パスワードをかける", "PDFパスワード設定", "かんたん"],
            ].map(([task, tool, difficulty], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{task}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{tool}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-700 dark:text-green-400">{difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>操作別の使い方</h2>

      <h3>① PDFを結合する（複数→1つにまとめる）</h3>
      <p>
        <Link href="/tools/pdf-merge">PDF結合ツール</Link>にアクセスし、まとめたいPDFを複数選択します。iPhoneのファイルアプリから選択できます。順番をボタンで並び替えたら「結合する」を押すだけです。
      </p>

      <h3>② 特定ページだけ取り出す</h3>
      <p>
        <Link href="/tools/pdf-split">PDF分割ツール</Link>でページ番号を指定します。「1,3,5-8」のような指定も可能です。
      </p>

      <h3>③ ファイルサイズを小さくする</h3>
      <p>
        <Link href="/tools/pdf-compress">PDF圧縮ツール</Link>にアップロードするだけで自動的に圧縮されます。メール添付できない大きなPDFに有効です。
      </p>

      <h3>④ 横向きページを直す</h3>
      <p>
        <Link href="/tools/pdf-rotate">PDF回転ツール</Link>で90°・180°・270°の回転が選べます。特定ページのみの回転にも対応しています。
      </p>

      <h3>⑤ 不要なページを削除する</h3>
      <p>
        <Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>でページのサムネイルが表示されるので、削除したいページを選んでタップするだけです。
      </p>

      <h3>⑥ PDFを画像として保存する</h3>
      <p>
        <Link href="/tools/pdf-to-jpg">PDF→JPG変換ツール</Link>で各ページをJPG画像として保存できます。SNS投稿や画像が必要な場面で便利です。
      </p>

      <h2>iPhoneでのPDFファイルの場所</h2>
      <p>
        iPhoneでPDFを選択するときは以下の場所を探してみてください。
      </p>
      <ul>
        <li><strong>ファイルアプリ</strong>：「ダウンロード」フォルダやiCloudドライブに保存されることが多い</li>
        <li><strong>メールの添付ファイル</strong>：メールを開いてPDFを長押し→「ファイルに保存」でファイルアプリに移動</li>
        <li><strong>LINEの受信ファイル</strong>：「他のアプリで開く」→「ファイルに保存」</li>
        <li><strong>SafariでダウンロードしたPDF</strong>：ダウンロードマネージャーまたはファイルアプリ内</li>
      </ul>

      <h2>アプリを使わない理由</h2>
      <p>
        PDF編集アプリを使う方法もありますが、ツールによっては有料プランが必要だったり、個人情報を含む書類をクラウドにアップロードすることへの懸念があります。ToolBoxのPDFツールはすべてブラウザ内処理で、ファイルがサーバーに送信されることがないため、機密書類でも安心して使えます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">ToolBoxのPDFツール一覧</strong>
        <Link href="/pdf-tools" className="text-blue-600 dark:text-blue-400 hover:underline">PDFツール一覧ページ</Link>でToolBoxが提供する全11種類のPDFツールを確認できます。
      </div>
    </BlogLayout>
  );
}
