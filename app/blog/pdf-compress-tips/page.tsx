import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-compress-tips")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 軽くする", "PDF 圧縮 コツ", "PDF サイズ 小さく", "PDF メール 添付 サイズ", "PDF 圧縮 方法"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        PDFのファイルサイズが大きくてメール添付やアップロードに困ったことはありませんか？ここでは<strong>PDFを軽くする5つの方法</strong>と、状況別の使い分けを解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">ブラウザからすぐに圧縮できる</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">アプリ不要・無料でPDFを圧縮できます。スマホでも対応。</p>
        <Link href="/tools/pdf-compress" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          PDF圧縮ツールを使う（無料）→
        </Link>
      </div>

      <h2>PDFを軽くする5つの方法</h2>

      <h3>① PDF圧縮ツールを使う（最も手軽）</h3>
      <p>
        ブラウザ上の<Link href="/tools/pdf-compress">PDF圧縮ツール</Link>にアップロードするだけで自動圧縮されます。画像を多く含むPDFでは元サイズの20〜30%程度まで削減できることもあります。アプリのインストール不要で、スマホからも利用可能です。
      </p>

      <h3>② 不要なページを削除する</h3>
      <p>
        送付に不要なページが含まれている場合、<Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>で削除するとサイズを減らせます。ページ数が多いPDFほど効果的です。
      </p>

      <h3>③ 画像解像度を下げて再保存する</h3>
      <p>
        WordやPowerPointなどで作成したPDFは、画像の解像度を下げてから再度PDFとして書き出すことでサイズを削減できます。印刷用の高解像度設定を「標準」や「Web用」に変更する方法です。
      </p>

      <h3>④ スキャン時の解像度を下げる</h3>
      <p>
        書類をスキャンする場合、解像度（dpi）が高いほどファイルサイズが大きくなります。メール添付なら150〜200dpi、印刷用なら300dpi程度が一般的な目安です。
      </p>

      <h3>⑤ 不要な埋め込みフォントを削除する</h3>
      <p>
        Adobe AcrobatなどのPDF編集ソフトでは、未使用のフォントや埋め込みデータを削除してサイズを小さくする「最適化」機能があります。フォントが多く埋め込まれたPDFで効果を発揮します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>用途別の目標ファイルサイズ目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨サイズの目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">理由</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["メール添付", "1〜10MB以下", "主要サービスの添付上限は20〜25MB"],
              ["Web掲載・ダウンロード提供", "1MB以下", "読み込み速度・ユーザビリティ向上"],
              ["印刷・高品質保存", "制限なし", "画質を優先"],
              ["スマホでの閲覧", "5MB以下", "モバイル回線での読み込み速度"],
            ].map(([use, size, reason], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮しても画質が大きく落ちないPDFとは</h2>
      <p>
        テキストや図形（ベクターデータ）中心のPDFは、圧縮率を高くしても見た目への影響がほぼありません。一方、写真や画像を多く含むPDFは圧縮率を上げると画質が低下します。重要な書類は圧縮後に画質を確認してから送付することをおすすめします。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ガイド</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-compress-guide">PDF圧縮の使い方ガイド（ツール操作詳細）</Link></li>
        <li><Link href="/blog/iphone-pdf-merge">iPhoneでPDFを結合する方法</Link></li>
        <li><Link href="/blog/pdf-edit-smartphone">スマホでPDFを編集する方法</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">注意</strong>
        圧縮後のファイルは元のファイルとは別に保存することをおすすめします。圧縮によって画質が低下した場合、元ファイルがないと復元できません。
      </div>
    </BlogLayout>
  );
}
