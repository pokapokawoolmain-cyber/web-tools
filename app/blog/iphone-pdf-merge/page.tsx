import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("iphone-pdf-merge")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["iPhone PDF 結合", "iPhoneでPDF まとめる", "iPhone PDF 無料", "Safari PDF 結合", "スマホ PDF 結合"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        iPhoneだけでPDFを結合したいとき、アプリのインストールは不要です。SafariなどのブラウザからPDF結合ツールを使えば、<strong>3ステップで無料</strong>でファイルをまとめられます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">iPhoneのSafariから今すぐ使える</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">アプリ不要・無料・登録不要でPDFを結合できます。</p>
        <Link href="/tools/pdf-merge" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          PDF結合ツールを使う（無料）→
        </Link>
      </div>

      <h2>iPhoneでPDFを結合する手順（3ステップ）</h2>
      <ol className="list-decimal list-outside ml-6 space-y-3 my-4">
        <li>
          <strong>SafariでPDF結合ツールを開く</strong><br />
          iPhoneのSafariで<Link href="/tools/pdf-merge">PDF結合ツール</Link>にアクセスします。
        </li>
        <li>
          <strong>PDFを選んで追加する</strong><br />
          「ファイルを選択」をタップすると「ファイル」アプリが開き、iCloud Drive・ダウンロードフォルダ・その他のストレージから結合したいPDFを選べます。複数のファイルを順番に追加します。
        </li>
        <li>
          <strong>「結合する」をタップして保存</strong><br />
          結合するファイルの順番を確認し、「結合する」ボタンをタップします。完成したPDFはダウンロードボタンから保存できます。
        </li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iPhoneの「ファイル」アプリからPDFを選ぶコツ</h2>
      <ul className="space-y-2">
        <li><strong>iCloud Drive</strong>：MacやiPadで保存したPDFを共有できます。</li>
        <li><strong>「このiPhone内」</strong>：ダウンロードフォルダや各アプリのフォルダ内を参照できます。</li>
        <li><strong>メールの添付ファイル</strong>：メールアプリで添付PDFを「ファイルに保存」してから使うとスムーズです。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iPhoneの標準機能との違い</h2>
      <p>
        iOSの「ショートカット」アプリを使ってPDFを結合する方法もありますが、設定が複雑です。ブラウザ上のツールを使う方が手順が少なく、誰でも簡単に操作できます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>結合後のPDFサイズが大きい場合</h2>
      <p>
        複数のPDFを結合するとファイルサイズが大きくなることがあります。メール添付が難しい場合は、<Link href="/tools/pdf-compress">PDF圧縮ツール</Link>でサイズを小さくできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ガイド</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで結合する方法（詳細版）</Link></li>
        <li><Link href="/blog/iphone-pdf-guide">iPhoneでPDFを活用する全機能ガイド</Link></li>
        <li><Link href="/blog/pdf-compress-tips">PDFを軽くする5つのコツ</Link></li>
        <li><Link href="/blog/pdf-edit-smartphone">スマホでPDFを編集する方法</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">動作環境</strong>
        Safari（iOS最新版）、Chrome for iOSでの動作を確認しています。iOSのバージョンや設定によって一部の操作に差がある場合があります。
      </div>
    </BlogLayout>
  );
}
