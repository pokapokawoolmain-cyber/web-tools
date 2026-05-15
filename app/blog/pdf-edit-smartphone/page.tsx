import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-edit-smartphone")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["スマホ PDF 編集", "スマホ PDF ページ削除", "スマホ PDF 回転", "Android iPhone PDF 編集 無料", "スマホ PDF 並び替え"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        スマートフォンだけでPDFのページを削除・回転・並び替えできます。アプリのインストールは不要で、ブラウザから無料で操作できます。Android・iPhone両対応です。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">スマホのブラウザからすぐに使える</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">Android・iPhone対応・アプリ不要・無料でPDFを編集できます。</p>
        <Link href="/tools/pdf-delete-pages" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          PDFページ削除ツールを使う（無料）→
        </Link>
      </div>

      <h2>スマホでできるPDF編集の種類</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">操作</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ツール</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ページ削除", "PDFページ削除", "不要なページを取り除く"],
              ["ページ回転", "PDF回転", "横向き・逆さになったページを修正"],
              ["ページ並び替え", "PDFページ並び替え", "ページ順を変更する"],
              ["PDF結合", "PDF結合", "複数ファイルをまとめる"],
              ["PDF分割", "PDF分割", "特定ページを切り出す"],
              ["圧縮", "PDF圧縮", "メール添付できるサイズに縮小"],
            ].map(([op, tool, use], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{op}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{tool}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFのページを削除する手順（スマホ）</h2>
      <ol className="list-decimal list-outside ml-6 space-y-2 my-4">
        <li><Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>をブラウザで開く</li>
        <li>「ファイルを選択」をタップしてPDFを選ぶ（ファイルアプリ・iCloud Driveから選択可能）</li>
        <li>ページのサムネイル一覧が表示されるので、削除したいページをタップして選択</li>
        <li>「削除する」ボタンをタップ</li>
        <li>ダウンロードボタンから保存</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFを回転する手順（スマホ）</h2>
      <ol className="list-decimal list-outside ml-6 space-y-2 my-4">
        <li><Link href="/tools/pdf-rotate">PDF回転ツール</Link>をブラウザで開く</li>
        <li>PDFをアップロード</li>
        <li>全ページまたは特定のページを選び、回転角度（90°・180°・270°）を指定</li>
        <li>「回転する」をタップして保存</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>AndroidとiPhoneでの操作の違い</h2>
      <p>
        ブラウザベースのツールはAndroid（Chrome）・iPhone（Safari）どちらでも同様に動作します。ファイルの選択画面はOSによって表示が異なりますが、「ファイルを選択」ボタンからローカルファイルを選べる点は共通です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホでPDFに文字を書き込みたい場合</h2>
      <p>
        テキスト書き込みや署名記入には、PDF編集に特化したアプリ（Adobe Acrobat Reader等）が必要です。ページの削除・回転・並び替えはブラウザツールで対応できますが、書き込み機能はツールの対応範囲外です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ガイド</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/iphone-pdf-guide">iPhoneでPDFを活用する全機能ガイド</Link></li>
        <li><Link href="/blog/iphone-pdf-merge">iPhoneでPDFを結合する方法</Link></li>
        <li><Link href="/blog/pdf-compress-tips">PDFを軽くする5つのコツ</Link></li>
        <li><Link href="/blog/pdf-reorder-guide">PDFページ並び替えガイド</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">動作環境</strong>
        Chrome（Android）・Safari（iOS）最新版での動作を確認しています。ブラウザのバージョンや端末によって一部の操作に差がある場合があります。
      </div>
    </BlogLayout>
  );
}
