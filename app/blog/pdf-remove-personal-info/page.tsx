import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-remove-personal-info")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 個人情報 削除", "PDF 作成者 削除", "PDF メタデータ 削除", "PDF プロパティ 消す", "PDF 個人情報 漏洩 防止"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        PDFを外部に送る際、知らない間に作成者の実名・会社名・使用ソフト名がファイルに埋め込まれていることがあります。これらのメタデータはブラウザから無料・登録不要で削除できます。個人情報漏洩を防ぐために、送付前に必ず確認しましょう。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-metadata-remover" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFメタデータ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>PDFに含まれる個人情報の種類</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">メタデータ項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">含まれる情報の例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">リスク</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["作成者（Author）", "山田太郎、tanaka.hanako", "個人名の漏洩"],
              ["最終更新者", "社員のPCログイン名", "社員情報の漏洩"],
              ["会社名（Organization）", "株式会社〇〇、ABC Corp", "所属組織の漏洩"],
              ["使用ソフト（Creator）", "Microsoft Word 2021、Adobe InDesign", "使用環境の特定"],
              ["作成日時", "2024-03-15 09:23", "業務内容・スケジュール推測"],
              ["更新日時", "2024-03-20 17:45", "修正履歴の推測"],
              ["タイトル・件名", "「新製品戦略2024年版」", "機密文書内容の露出"],
              ["コメント", "「上司の確認待ち」など", "内部状況の漏洩"],
            ].map(([item, example, risk], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{example}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>個人情報が漏洩するリスクの具体例</h2>
      <ul className="space-y-2">
        <li><strong>競合他社への情報流出</strong>：取引先に送ったPDFのプロパティから、作成者名・組織名・使用システムが判明し、競合情報として活用されるリスクがあります。</li>
        <li><strong>フィッシング攻撃への悪用</strong>：作成者の実名・会社名・メールアドレスが公開PDFから収集され、標的型フィッシングメールに使用されるケースがあります。</li>
        <li><strong>修正履歴からの情報漏洩</strong>：複数回の修正日時から、担当者の業務スケジュールや進捗状況が推測されることがあります。</li>
        <li><strong>使用ソフトの脆弱性悪用</strong>：Adobe InDesignやWordのバージョン情報からセキュリティ上の脆弱性を特定し、マルウェアの標的にされるリスクがあります。</li>
      </ul>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: 企業のウェブサイトで公開しているPDFや、メールで送付する提案書・見積書にも個人情報が含まれていることがあります。送付前に必ず確認してください。</p>
      </div>

      <h2>最も簡単な削除方法</h2>
      <p>
        ToolBoxJPの<Link href="/tools/pdf-metadata-remover">PDFメタデータ削除ツール</Link>を使えば、ブラウザだけでPDFの個人情報を一括削除できます。Adobe AcrobatやPDFソフトの購入は不要です。処理はブラウザ内で完結するため、機密書類がサーバーに送信されることはありません。
      </p>

      <h2>PCでの操作手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "ツールにアクセスする", body: "ToolBoxJPのPDFメタデータ削除ツールをブラウザで開きます。ChromeやEdgeなど主要ブラウザに対応しています。" },
          { step: "②", title: "PDFをアップロードする", body: "「ファイルを選択」ボタンでPDFを選択するか、ドラッグ＆ドロップでアップロードします。" },
          { step: "③", title: "メタデータを確認する", body: "アップロード後、現在のメタデータ（作成者名・会社名・ソフト名など）が表示されます。どの情報が含まれているか確認できます。" },
          { step: "④", title: "削除してダウンロードする", body: "「メタデータを削除する」ボタンを押すと、個人情報が削除されたPDFがダウンロードされます。本文・画像は変更されません。" },
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

      <h2>スマホでの操作手順</h2>
      <p>
        iPhoneはSafari、AndroidはChromeでツールにアクセスします。「ファイルを選択」でファイルアプリからPDFを選択し、メタデータを確認後に削除ボタンを押してダウンロードします。PC版と操作は同じです。アプリのインストールは不要です。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-metadata-remover" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFメタデータ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>Windowsでプロパティを確認する方法（削除前の確認）</h2>
      <p>
        削除前にどんな個人情報が含まれているか確認したい場合、Windowsでは以下の手順でプロパティを確認できます。
      </p>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "Adobe Acrobat Readerで開く", body: "PDFをAdobe Acrobat Readerで開き、メニューから「ファイル」→「プロパティ」を選択します（ショートカット: Ctrl + D）。" },
          { step: "②", title: "「説明」タブを確認する", body: "「ドキュメントのプロパティ」ダイアログの「説明」タブにタイトル・作成者・件名・キーワードが表示されます。" },
          { step: "③", title: "「詳細情報」タブを確認する", body: "「詳細情報」タブで作成ソフト・作成日時・更新日時などの詳細メタデータを確認できます。" },
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

      <h2>Macでプロパティを確認する方法</h2>
      <p>
        MacではプレビューアプリでPDFを開き、メニューから「ツール」→「インスペクタを表示」（Cmd + I）を選択します。「一般情報」タブでタイトル・作成者・作成日時・変更日時などが確認できます。また、Safariで開いた場合はアドレスバー付近の情報アイコンからも確認できます。
      </p>

      <h2>削除前後の確認方法</h2>
      <p>
        メタデータ削除後は、上記のWindowsまたはMacの手順で再度プロパティを確認してください。作成者名・会社名などが空白または「Unknown」に変わっていれば削除成功です。ToolBoxJPのツールでは削除前後のメタデータを画面で比較確認できます。
      </p>

      <h2>注意点と安全性</h2>
      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 ポイント</strong>
        ToolBoxJPのPDFメタデータ削除ツールはすべての処理をブラウザ内で完結します。PDFファイルはサーバーに送信されないため、機密文書も安全に処理できます。元ファイルは削除操作を行うまで変更されません。
      </div>
      <ul className="space-y-2">
        <li><strong>元ファイルを保管する</strong>：メタデータ削除後のPDFからは情報を復元できません。元のPDFは必ず別途バックアップしておいてください。</li>
        <li><strong>本文内の個人情報は別途対応が必要</strong>：メタデータ削除は付帯情報のみ削除します。PDF本文中に記載された個人情報（住所・電話番号など）は別途テキスト編集で対応してください。</li>
        <li><strong>埋め込みフォント・リンクは保持される</strong>：削除されるのはメタデータのみで、フォント・レイアウト・リンクは変更されません。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-check-metadata">PDFのメタデータを確認する方法｜作成者名・更新日時の見方</Link></li>
        <li><Link href="/blog/pdf-privacy-guide">PDFのプライバシー設定ガイド</Link></li>
        <li><Link href="/blog/pdf-watermark-guide">PDFに透かしを入れる方法【完全ガイド】</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-metadata-remover" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFメタデータ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>
    </BlogLayout>
  );
}
