import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-privacy-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF メタデータ 削除 方法", "PDF 個人情報 削除", "PDF 作成者名 削除", "PDF プロパティ 削除 無料", "PDF プライバシー 保護"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「PDFに名前が入っていた」「どのソフトで作ったか知られたくない」——PDFファイルには見えない部分に個人情報が記録されています。共有・提出前にこの情報を削除する方法を解説します。
      </p>

      <h2>PDFのメタデータとは何か</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        PDFファイルには文書の内容（テキスト・画像）のほかに、「メタデータ」と呼ばれる付属情報が自動的に記録されます。Windowsでファイルを右クリック→「プロパティ」→「詳細」タブで確認できます。
      </p>
      <ul className="space-y-2">
        <li><strong>作成者名</strong>：WordやAcrobatにログインしているユーザー名</li>
        <li><strong>作成日時・更新日時</strong>：文書を作成・保存した日時</li>
        <li><strong>使用ソフト名</strong>：「Microsoft Word」「Adobe Acrobat」等</li>
        <li><strong>会社名・組織名</strong>：Officeのライセンス設定に入力された組織名</li>
        <li><strong>キーワード・コメント</strong>：手動で入力した場合</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>メタデータが問題になる場面</h2>
      <ul className="space-y-2">
        <li>名前を伏せて提出したい書類に本名が入っている</li>
        <li>業者・取引先に会社のWindowsアカウント名が見えてしまう</li>
        <li>個人用PCで作成した文書に私的なユーザー名が記録されている</li>
        <li>古いバージョンのソフト名が入っていてセキュリティリスクになる</li>
        <li>文書の作成履歴から意図しない情報が推測される</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFのメタデータを削除する手順</h2>

      <h3>① PDFメタデータ削除ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-metadata-remover">PDFメタデータ削除ツール</Link>をブラウザで開きます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」またはドラッグ&ドロップでPDFを読み込みます。
      </p>

      <h3>③ メタデータを削除してダウンロード</h3>
      <p>
        「メタデータを削除」ボタンを押すと作成者名・日付・ソフト名などのプロパティ情報が削除されたPDFをダウンロードできます。文書の内容・レイアウト・画像は変更されません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>削除されるメタデータと残るもの</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">削除対象</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["作成者名・更新者名", "✓ 削除される"],
              ["作成日時・更新日時", "✓ 削除される"],
              ["使用ソフト名・バージョン", "✓ 削除される"],
              ["会社名・組織名", "✓ 削除される"],
              ["文書のタイトル・キーワード", "✓ 削除される"],
              ["文書の内容（テキスト・画像）", "× 削除されない（変更なし）"],
              ["PDFのページ構成・レイアウト", "× 削除されない（変更なし）"],
            ].map(([type, del], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{type}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${del.startsWith("✓") ? "text-green-700 dark:text-green-400" : "text-slate-500 dark:text-zinc-500"}`}>{del}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>セキュリティをさらに強化する方法</h2>
      <p>
        メタデータ削除に加えて、以下のツールを組み合わせることでより安全にPDFを共有できます。
      </p>
      <ul className="space-y-2">
        <li><Link href="/tools/pdf-password">PDFパスワード設定</Link>：AES-256暗号化でファイルを保護</li>
        <li><Link href="/tools/pdf-watermark">PDF透かし追加</Link>：「社外秘」などの透かしで取り扱いを明示</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        処理はすべてブラウザ内で完結します。個人情報を含むPDFがサーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
