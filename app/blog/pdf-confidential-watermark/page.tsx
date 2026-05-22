import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-confidential-watermark")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 社外秘 透かし", "PDF CONFIDENTIAL 入れる", "PDF ウォーターマーク 無料", "PDF 社外秘 スタンプ", "PDF 社外秘 追加 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        社外に書類を送る際、「社外秘」や「CONFIDENTIAL」の透かしをPDFに入れておくことで、受け取り側に情報の機密性を明示できます。Adobe Acrobatがなくても、ブラウザだけで無料・登録不要で追加できます。スマホからも操作可能です。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-watermark" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF透かし追加ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>社外秘の透かしが必要な場面</h2>
      <ul className="space-y-2">
        <li>社外の取引先・クライアントに機密書類を送るとき</li>
        <li>契約書・見積書・提案書を外部メールで送付するとき</li>
        <li>社内の未公開情報が含まれる資料を共有するとき</li>
        <li>製品設計図・仕様書など技術情報を外部に共有するとき</li>
        <li>採用候補者に社内規定・給与テーブルを提示するとき</li>
        <li>M&A・デューデリジェンスで財務情報を開示するとき</li>
        <li>印刷された書類のスキャン共有前に機密性を示すとき</li>
      </ul>

      <h2>最も簡単な方法</h2>
      <p>
        Adobe AcrobatやWordなどの有償ソフトを使わなくても、ToolBoxJPの<Link href="/tools/pdf-watermark">PDF透かし追加ツール</Link>を使えば、ブラウザだけで「社外秘」の透かしをPDFに追加できます。ファイルはブラウザ内で処理されるため、機密書類がサーバーに送信されることはありません。
      </p>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 ポイント</strong>
        処理はすべてブラウザ内で完結します。機密書類を含むPDFがサーバーに送信されることは一切ないため、社外秘文書を安心して処理できます。
      </div>

      <h2>PCでPDFに社外秘の透かしを入れる手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "ツールにアクセスする", body: "ToolBoxJPのPDF透かし追加ツールをブラウザで開きます。ChromeやEdge、Safariなど主要ブラウザに対応しています。" },
          { step: "②", title: "PDFをアップロードする", body: "「ファイルを選択」ボタンをクリックするか、PDFファイルをドラッグ＆ドロップしてアップロードします。複数ページのPDFも一括処理できます。" },
          { step: "③", title: "透かしテキストを入力する", body: "「社外秘」「CONFIDENTIAL」「社外秘 CONFIDENTIAL」など任意のテキストを入力します。プリセットが用意されているので選択するだけでも設定できます。" },
          { step: "④", title: "表示設定をカスタマイズする", body: "文字色（赤・グレー・黒など）・透明度（20〜80%）・角度（45度斜め表示など）・フォントサイズ・表示位置を設定します。ビジネス文書には透明度30〜50%の斜め表示が一般的です。" },
          { step: "⑤", title: "ダウンロードする", body: "「透かしを追加する」ボタンを押すと、全ページに透かしが入ったPDFが自動でダウンロードされます。" },
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

      <h2>スマホ（iPhone・Android）での操作手順</h2>
      <p>
        スマホからの操作もPCと同じ手順で行えます。iPhoneはSafari、AndroidはChromeでToolBoxJPのPDF透かし追加ツールを開きます。ファイルアプリ（iPhone）またはファイルマネージャー（Android）からPDFを選択してアップロードし、設定後にダウンロードすれば完了です。アプリのインストールは一切不要です。
      </p>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: スマホでダウンロードしたPDFはデフォルトで「ダウンロード」フォルダに保存されます。メールやLINEで送る際はファイルアプリから選択してください。</p>
      </div>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-watermark" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF透かし追加ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>社外秘透かしの設定オプション</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">設定項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">選択肢</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ設定</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["文字色", "赤・グレー・黒・青・カスタム", "赤またはグレー（視認性が高い）"],
              ["透明度", "20〜80%", "30〜50%（本文を読みやすく）"],
              ["角度", "0°（水平）・45°（斜め）・90°", "45°斜め（正式書類の標準）"],
              ["フォントサイズ", "小〜特大", "大〜特大（全ページで目立つサイズ）"],
              ["表示位置", "中央・対角線状に繰り返し", "対角線状に繰り返し（すべてのページに）"],
            ].map(([item, options, recommended], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{options}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{recommended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>社外秘の透かしを入れる際の注意点</h2>
      <ul className="space-y-2">
        <li><strong>元ファイルを保管する</strong>：透かし入りPDFは配布用とし、透かしなしの元ファイルは社内に保管しておきましょう。</li>
        <li><strong>透かしは完全な保護ではない</strong>：テキスト透かしはPDF編集ソフトで削除できる場合があります。機密保護にはパスワード設定との組み合わせが有効です。</li>
        <li><strong>印刷時にも透かしが出力される</strong>：印刷プレビューで透かしが正しく表示されることを確認してから配布してください。</li>
        <li><strong>文字が重なって本文が読みにくくなる場合</strong>：透明度を下げる（20〜30%）か、フォントサイズを小さくして調整してください。</li>
      </ul>

      <h2>よく使われる透かし文字一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">日本語</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">英語</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">主な用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["社外秘", "CONFIDENTIAL", "社外に出せない機密書類"],
              ["部外秘", "RESTRICTED", "特定部署のみ閲覧可能な書類"],
              ["取扱注意", "SENSITIVE", "慎重な取り扱いが必要な書類"],
              ["社内限り", "INTERNAL USE ONLY", "社内向けのみの書類"],
              ["極秘", "TOP SECRET", "最高機密の書類"],
              ["写し禁止", "DO NOT COPY", "複写・スキャン禁止の書類"],
              ["回覧", "FOR CIRCULATION", "社内回覧用の書類"],
            ].map(([ja, en, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{ja}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{en}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>透かしと組み合わせて使うと便利なPDFツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/pdf-password">PDFパスワード設定</Link>：透かし入りPDFにパスワードをかけてセキュリティをさらに強化できます。</li>
        <li><Link href="/tools/pdf-metadata-remover">PDFメタデータ削除</Link>：送付前に作成者名・会社名・使用ソフトなどの個人情報を削除できます。</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮</Link>：透かし追加後にファイルサイズが増えた場合に軽量化できます。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-draft-watermark">PDFにDRAFTの透かしを入れる方法｜スマホでも無料で追加</Link></li>
        <li><Link href="/blog/pdf-remove-personal-info">PDFの作成者情報・個人情報を削除する方法｜メタデータ削除手順</Link></li>
        <li><Link href="/blog/pdf-watermark-guide">PDFに透かしを入れる方法【完全ガイド】</Link></li>
        <li><Link href="/blog/pdf-check-metadata">PDFのメタデータを確認する方法｜作成者名・更新日時の見方</Link></li>
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
