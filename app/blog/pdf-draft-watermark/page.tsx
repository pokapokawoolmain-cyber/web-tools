import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-draft-watermark")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF DRAFT 透かし", "PDF 校正中 透かし", "PDF 下書き ウォーターマーク", "PDF DRAFT 追加 無料", "PDF draft watermark"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        確認用のPDFを送る際に「DRAFT」や「校正中」の透かしを入れておくことで、最終版との差し替えミスを防げます。Adobe Acrobatは不要で、ブラウザから無料・登録不要で追加できます。スマホにも対応しています。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-watermark" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF透かし追加ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>DRAFTの透かしが必要な場面</h2>
      <ul className="space-y-2">
        <li>クライアントに確認依頼する段階の提案書・企画書を送るとき</li>
        <li>校正途中の報告書・マニュアルを関係者に共有するとき</li>
        <li>上司・チームメンバーにレビューを依頼するとき</li>
        <li>印刷前の最終確認用として印刷所に入稿データを送るとき</li>
        <li>承認前の契約書・規約書のレビュー用コピーを回覧するとき</li>
        <li>制作途中のパンフレット・カタログのデザイン確認用として使うとき</li>
      </ul>

      <h2>最も簡単な方法</h2>
      <p>
        ToolBoxJPの<Link href="/tools/pdf-watermark">PDF透かし追加ツール</Link>を使えば、PDFにDRAFT透かしをブラウザだけで追加できます。「DRAFT」「校正中」「第一稿」などのプリセットから選択するか、任意のテキストを入力できます。処理はブラウザ内で完結するため、機密資料も安全に処理できます。
      </p>

      <h2>PCでDRAFT透かしを入れる手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "ツールにアクセスする", body: "ToolBoxJPのPDF透かし追加ツールをブラウザで開きます。インストール不要、アカウント登録も不要です。" },
          { step: "②", title: "PDFをアップロードする", body: "「ファイルを選択」ボタンでPDFを選択するか、ドラッグ＆ドロップでアップロードします。複数ページのPDFにも対応しています。" },
          { step: "③", title: "DRAFTテキストを設定する", body: "「DRAFT」「校正中」「第一稿」などのプリセットから選ぶか、任意のテキストを入力します。日本語・英語どちらも入力できます。" },
          { step: "④", title: "表示設定を調整する", body: "文字色は赤やグレーが目立ちやすくおすすめです。透明度は30〜50%、角度は45°斜め表示に設定すると視認性が高くなります。" },
          { step: "⑤", title: "ダウンロードする", body: "「透かしを追加する」ボタンを押すと、全ページにDRAFT透かしが入ったPDFがダウンロードされます。" },
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

      <h2>スマホでの手順</h2>
      <p>
        iPhoneはSafari、AndroidはChromeでツールを開きます。「ファイルを選択」でファイルアプリやフォトライブラリからPDFを選択し、設定後にダウンロードします。PCと同じ設定画面が表示されるため、スマホでも同様の操作が行えます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-watermark" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF透かし追加ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>よく使われるDRAFT系の透かし文字一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">テキスト</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使用場面</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨透明度</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DRAFT", "海外クライアント・英語資料", "30〜50%"],
              ["校正中", "国内向け・日本語資料", "30〜50%"],
              ["第一稿", "初回提出の企画書・報告書", "30〜50%"],
              ["確認用", "承認前の内部回覧資料", "25〜40%"],
              ["社内確認用", "社内レビュー限定の資料", "25〜40%"],
              ["REVIEW", "英語圏でのレビュー依頼", "30〜50%"],
              ["CHECK", "校閲・チェック依頼時", "30〜50%"],
              ["SAMPLE", "見本・サンプル提供時", "30〜50%"],
            ].map(([text, use, opacity], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{text}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{opacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>DRAFT透かしの設定のコツ</h2>
      <p>
        色は<strong>赤</strong>が最も目立ちますが、本文との視認性を考えると<strong>グレー</strong>が読みやすさとのバランスが良いです。角度は45°の斜め表示が最もスタンダードで、ビジネス文書の透かしとして認識されやすい形式です。透明度は30〜50%に設定すると、本文の文字を読みながらでも透かしが明確に確認できます。フォントサイズは大きめに設定し、A4サイズのページ全体に透かしが広がるようにするのが効果的です。
      </p>

      <h2>失敗しやすいポイントと対処法</h2>
      <ul className="space-y-2">
        <li><strong>透明度が高すぎて透かしが見えにくい</strong>：透明度を下げて（不透明度60%以上に）設定すると視認性が上がります。</li>
        <li><strong>フォントサイズが小さすぎる</strong>：大〜特大サイズで設定し、印刷プレビューで確認してください。</li>
        <li><strong>透かしが中央1か所にしか表示されない</strong>：「対角線状に繰り返し」設定を使うと全体に均等に表示されます。</li>
        <li><strong>最終版に誤ってDRAFT入りを送ってしまう</strong>：ファイル名に「_DRAFT」「_確認用」を付けて管理することでミスを防げます。</li>
      </ul>

      <h2>セキュリティと注意点</h2>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: DRAFT透かしは視覚的な警告であり、PDFの編集を完全に防ぐものではありません。機密性の高い書類にはパスワード設定との組み合わせをおすすめします。</p>
      </div>

      <ul className="space-y-2">
        <li>元のPDF（透かしなし版）は社内に保管しておき、最終版としてDRAFTなしを配布する運用にしましょう。</li>
        <li>ToolBoxJPでの処理はすべてブラウザ内で完結するため、機密資料がサーバーに送信されることはありません。</li>
        <li>DRAFTの透かし入りPDFをメールで送る際は、件名・本文にも「確認用」と明記するとより確実です。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-confidential-watermark">PDFに「社外秘」の透かしを入れる方法｜無料・登録不要でブラウザ完結</Link></li>
        <li><Link href="/blog/pdf-watermark-guide">PDFに透かしを入れる方法【完全ガイド】</Link></li>
        <li><Link href="/blog/pdf-remove-personal-info">PDFの作成者情報・個人情報を削除する方法｜メタデータ削除手順</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-watermark" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF透かし追加ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>
    </BlogLayout>
  );
}
