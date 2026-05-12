import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-merge-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF結合 スマホ", "PDF まとめる 方法", "iPhone PDF 結合", "PDF 複数 合体 無料", "PDF merger 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「複数のPDFを1つにまとめたいけど、専用アプリが必要？」と思っていませんか。実はスマホのブラウザだけで、インストールも登録も不要で無料でPDFを結合できます。この記事では、iPhoneやAndroidからでも使えるPDF結合の方法を手順ごとに解説します。
      </p>

      <h2>PDFを結合したくなる場面</h2>
      <p>
        PDF結合が必要になるシーンはよくあります。
      </p>
      <ul>
        <li>複数枚スキャンした書類を1つのPDFにまとめて提出したい</li>
        <li>見積書・請求書・契約書を1ファイルにして送りたい</li>
        <li>プレゼンの各章PDFを1本にまとめたい</li>
        <li>領収書の写真PDFをまとめて経費申請したい</li>
      </ul>
      <p>
        こういった場面でAdobe Acrobatや専用アプリが必要だと思われがちですが、ブラウザだけで完結します。
      </p>

      <h2>ブラウザだけでPDFを結合する方法（手順）</h2>

      <h3>① PDF結合ツールにアクセスする</h3>
      <p>
        スマホ・PCのブラウザで<Link href="/tools/pdf-merge">PDF結合ツール</Link>を開きます。iPhoneはSafari、AndroidはChromeから使えます。
      </p>

      <h3>② PDFファイルをアップロードする</h3>
      <p>
        「ファイルを選択」ボタンをタップして結合したいPDFを選びます。複数ファイルを一度に選択することも可能です。iPhoneの場合はファイルアプリやiCloudドライブからも選択できます。
      </p>

      <h3>③ 順番を確認・変更する</h3>
      <p>
        アップロードされたPDFはリスト表示されます。PCならドラッグ&ドロップ、スマホなら▲▼ボタンで順番を入れ替えられます。先頭に来るファイルが結合後の最初のページになります。
      </p>

      <h3>④ 結合してダウンロード</h3>
      <p>
        「PDFを結合する」ボタンを押すと処理が始まり、完成したPDFをダウンロードできます。処理はすべてブラウザ内で行われるため、ファイルがサーバーに送られることはありません。
      </p>

      <h2>スマホ利用時の注意点</h2>
      <p>
        スマホからPDF結合を行う際に気をつけることをまとめます。
      </p>
      <ul>
        <li><strong>ファイルの場所を事前に確認する</strong>：iPhoneはファイルアプリ、AndroidはGoogleドライブやDownloadsフォルダにPDFがあることが多いです。</li>
        <li><strong>ファイルサイズが大きいと時間がかかる</strong>：スキャン画像が多いPDFは1ファイルで数十MBになることがあります。合計数百MB以内が目安です。</li>
        <li><strong>メモリ不足に注意</strong>：古いスマホでは非常に大きなPDFの処理に失敗することがあります。その場合はPCから試してみてください。</li>
      </ul>

      <h2>ページ数が多いPDFを分けて提出したい場合</h2>
      <p>
        逆に、まとめたPDFを特定ページで分割したい場合は<Link href="/tools/pdf-split">PDF分割ツール</Link>が使えます。結合→分割を組み合わせることで、自由にPDFを編集できます。
      </p>
      <p>
        PDFを結合したあとサイズが大きくなってしまった場合は、<Link href="/tools/pdf-compress">PDF圧縮ツール</Link>で軽量化するとメール添付しやすくなります。
      </p>

      <h2>iPhoneでPDFをまとめる：よくある質問</h2>

      <h3>Q. Safariで使えますか？</h3>
      <p>
        はい。iPhoneのSafariから問題なく使えます。Chromeでも動作します。
      </p>

      <h3>Q. 結合したPDFは自動的に端末に保存されますか？</h3>
      <p>
        ダウンロードボタンを押すと保存先を選べます。iPhoneはファイルアプリまたは写真アプリへの保存が選べます。
      </p>

      <h3>Q. 無料で何ファイルまで結合できますか？</h3>
      <p>
        ファイル数の制限はありません。ただし合計サイズが極端に大きいとブラウザのメモリ制限に引っかかる場合があります。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        このツールはブラウザ内でのみ処理を行います。アップロードしたPDFファイルが外部サーバーに送信されることは一切ありません。機密書類でも安心してご利用ください。
      </div>
    </BlogLayout>
  );
}
