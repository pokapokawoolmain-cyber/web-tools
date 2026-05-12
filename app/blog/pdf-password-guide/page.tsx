import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-password-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF パスワード 設定 方法", "PDF ロック かけ方 無料", "PDF 暗号化 無料", "PDF 保護 方法", "PDF password 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        個人情報を含むPDFをメールで送る前に、パスワードをかけて保護したいというニーズは多くあります。Adobe Acrobatがなくても、ブラウザから無料でPDFを暗号化・パスワード保護する方法を解説します。
      </p>

      <h2>PDFにパスワードをかけたい場面</h2>
      <ul>
        <li>個人情報・住所・銀行口座が含まれる書類を送る前に保護したい</li>
        <li>社外秘の資料を共有する際に閲覧制限をかけたい</li>
        <li>クラウドに保存する重要文書を暗号化しておきたい</li>
      </ul>

      <h2>PDFにパスワードをかける手順</h2>

      <h3>① PDFパスワード設定ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-password">PDFパスワード設定ツール</Link>をブラウザで開きます。
      </p>

      <h3>② 「保護する」タブを選択してPDFをアップロードする</h3>
      <p>
        「ファイルを選択」でPDFを読み込みます。
      </p>

      <h3>③ パスワードを設定する</h3>
      <p>
        パスワードを入力して確認のためもう一度入力します。英数字・記号を組み合わせた推測されにくいパスワードを設定してください。
      </p>

      <h3>④ 保護してダウンロードする</h3>
      <p>
        「パスワードで保護する」ボタンを押すとAES-256暗号化で保護されたPDFをダウンロードできます。
      </p>

      <h2>重要な注意点</h2>
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-4 border border-amber-200 dark:border-amber-800">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">このツールはAdobeの標準PDF暗号化とは異なります</p>
        <p className="text-[14px] text-amber-700 dark:text-amber-400">
          このツールはAES-256暗号化を使った独自の保護形式です。設定したパスワードの解除には、このToolBoxの「解除する」タブのみを使用してください。Adobe AcrobatやiPhoneのプレビューでは解除できません。
        </p>
      </div>

      <h3>パスワードは必ず安全な場所に保管してください</h3>
      <p>
        パスワードを忘れた場合、ファイルを復元する手段はありません。AES-256暗号化は現在の技術では総当たり攻撃で解読できないレベルの強度があります。パスワードマネージャーへの保存をお勧めします。
      </p>

      <h2>パスワードを解除する方法</h2>
      <p>
        ToolBoxで保護したPDFを解除するには、同じツールの「解除する」タブを使います。保護したファイル（.pdfまたは.encrypted）をアップロードし、設定時のパスワードを入力すれば元のPDFを取り出せます。
      </p>

      <h2>メタデータも削除したい場合</h2>
      <p>
        PDFには作成者名・日付・使用ソフト名などの情報が埋め込まれています。共有前にこの情報も削除したい場合は、<Link href="/tools/pdf-metadata-remover">PDFメタデータ削除ツール</Link>と組み合わせてご利用ください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        パスワードを含む処理はすべてブラウザ内で完結します。PDFファイルもパスワードも外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
