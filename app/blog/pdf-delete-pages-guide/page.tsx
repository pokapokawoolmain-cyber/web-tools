import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-delete-pages-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF ページ 削除", "PDF 不要ページ 削除", "PDF ページ 消す 無料", "PDF ページ削除 スマホ", "PDF 白紙 削除"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        PDFの不要なページを削除したいのにAdobe Acrobatがなくて困っていませんか？ブラウザから無料・登録不要でページを削除できます。表紙だけ削除したい・白紙ページを取り除きたい・広告ページを消したい、など様々な場面に対応しています。スマホからも操作できます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-delete-pages" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFページ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>PDFのページを削除したい場面</h2>
      <ul className="space-y-2">
        <li><strong>表紙・裏表紙を削除したい</strong>：受け取ったPDFから不要な表紙やカバーページを取り除きたい場合。</li>
        <li><strong>白紙ページを取り除きたい</strong>：スキャンしたPDFに混入した白紙ページや意図しない空白ページを削除したい場合。</li>
        <li><strong>広告・注意書きページを削除したい</strong>：ダウンロードしたPDFの広告ページや利用規約ページを取り除きたい場合。</li>
        <li><strong>必要なページだけ抜き出したい</strong>：全100ページのPDFから特定の数ページだけ送付したい場合（削除で対応）。</li>
        <li><strong>ファイルサイズを小さくしたい</strong>：不要ページを削除してファイルサイズを減らしたい場合。</li>
        <li><strong>機密ページを除いて送付したい</strong>：社外秘ページを含むPDFから、そのページだけ削除して送りたい場合。</li>
      </ul>

      <h2>最も簡単な削除方法</h2>
      <p>
        ToolBoxJPの<Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>を使えば、Adobe Acrobatなしでブラウザだけでページを削除できます。削除したいページを選択するだけで、複数ページの一括削除にも対応しています。処理はブラウザ内で完結するため、機密書類もサーバーに送信されません。
      </p>

      <h2>PCでのページ削除手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "ツールにアクセスする", body: "ToolBoxJPのPDFページ削除ツールをブラウザで開きます。ChromeやEdge、Safariなど主要ブラウザに対応しています。" },
          { step: "②", title: "PDFをアップロードする", body: "「ファイルを選択」ボタンでPDFを選択するか、ドラッグ＆ドロップでアップロードします。アップロード後に全ページのサムネイルが表示されます。" },
          { step: "③", title: "削除するページを選択する", body: "サムネイル表示から削除したいページをクリックして選択します。複数ページを選択して一括削除もできます。" },
          { step: "④", title: "削除を実行する", body: "削除したいページが選択されていることを確認し、「選択ページを削除」ボタンを押します。" },
          { step: "⑤", title: "削除後のPDFをダウンロードする", body: "「ダウンロード」ボタンで、選択したページが削除されたPDFを保存します。元のPDFは変更されません。" },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>スマホ（iPhone・Android）での削除手順</h2>
      <p>
        iPhoneはSafari、AndroidはChromeでツールを開きます。「ファイルを選択」でファイルアプリからPDFを選択し、サムネイル表示から削除ページをタップして選択します。PC版と同様に操作でき、アプリのインストールは不要です。ダウンロードしたPDFはファイルアプリの「ダウンロード」フォルダに保存されます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-delete-pages" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFページ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>Windows標準機能でページを削除する方法</h2>
      <p>
        Adobe Acrobatがない場合でも、Windowsの「Microsoft Print to PDF」を使うことでページを削除できます（ただし、削除したいページ以外のページを「印刷」する形になります）。
      </p>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "PDFをブラウザまたはAcrobat Readerで開く", body: "ChromeやEdgeのブラウザでPDFを開きます。Ctrl + P で印刷ダイアログを開きます。" },
          { step: "②", title: "プリンターに「Microsoft Print to PDF」を選択する", body: "印刷ダイアログのプリンター一覧から「Microsoft Print to PDF」を選択します。" },
          { step: "③", title: "印刷するページ範囲を指定する", body: "「ページ」欄に残したいページ番号を入力します（例: 1-5, 7, 10-15）。削除したいページ番号は含めません。" },
          { step: "④", title: "「印刷」ボタンを押してPDFとして保存する", body: "「印刷」を押すと保存先を選択するダイアログが表示されます。保存先とファイル名を指定して保存します。" },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: Print to PDFによる変換では、元のPDFのブックマーク・リンク・フォームフィールドなどが失われる場合があります。重要な書類にはToolBoxJPのページ削除ツールの使用をおすすめします。</p>
      </div>

      <h2>Macでページを削除する方法（プレビュー使用）</h2>
      <p>
        MacにはプレビューアプリでPDFのページを削除する機能が標準で備わっています。
      </p>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "プレビューでPDFを開く", body: "PDFファイルをダブルクリックしてプレビューアプリで開きます。" },
          { step: "②", title: "サムネイルパネルを表示する", body: "「表示」メニュー→「サムネイル」を選択するか、Cmd + Opt + 2 でサムネイルパネルを表示します。" },
          { step: "③", title: "削除するページを選択する", body: "サムネイルから削除したいページをクリックします。Cmdキーを押しながらクリックすると複数選択できます。" },
          { step: "④", title: "削除して保存する", body: "「編集」→「削除」（またはDeleteキー）でページを削除します。Cmd + S で上書き保存するか、「別名で保存」で新しいファイルとして保存します。" },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Adobe Acrobatを使う場合</h2>
      <p>
        Adobe Acrobat（有償版）を持っている場合は、「ツール」→「ページを整理」→「ページを削除」から操作できます。サムネイル選択→右クリック→「ページを削除」でも削除できます。Acrobatは高機能ですが月額プランが必要です。頻繁にページ削除が必要でない場合は、ToolBoxJPの無料ツールで十分対応できます。
      </p>

      <h2>失敗しやすいポイントと注意事項</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">失敗例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">対策</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["元のPDFを上書きしてしまった", "ダウンロード前に元PDFのバックアップを必ず作成する"],
              ["削除したくないページを誤って削除した", "削除前にサムネイルを見てページ番号を再確認する"],
              ["パスワード付きPDFが処理できない", "先にパスワードを解除してから削除ツールに読み込む"],
              ["削除後のPDFが開けない・壊れた", "ToolBoxJPのツールを使うことで正常なPDFが出力される"],
              ["ファイルサイズが思ったより小さくならない", "テキストページより画像ページの削除がサイズ削減に効果的"],
            ].map(([fail, solution], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{fail}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>PDFと合わせて使うと便利なツール</h2>
      <ul className="space-y-2">
        <li>
          <div className="my-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
            <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1"><Link href="/tools/pdf-reorder">PDFページ並べ替えツール</Link></p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400">削除後のページ順を並べ替えたい場合に便利です。</p>
          </div>
        </li>
        <li>
          <div className="my-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
            <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1"><Link href="/tools/pdf-split">PDF分割ツール</Link></p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400">特定のページ範囲だけを別ファイルとして保存したい場合に使えます。</p>
          </div>
        </li>
        <li>
          <div className="my-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
            <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1"><Link href="/tools/pdf-compress">PDF圧縮ツール</Link></p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400">ページ削除後にファイルをさらに軽量化したい場合に使えます。</p>
          </div>
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-split-guide">PDFを分割する方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFを結合する方法</Link></li>
        <li><Link href="/blog/pdf-rotate-guide">PDFのページを回転する方法</Link></li>
        <li><Link href="/blog/pdf-reorder-guide">PDFのページを並べ替える方法</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-delete-pages" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFページ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>
    </BlogLayout>
  );
}
