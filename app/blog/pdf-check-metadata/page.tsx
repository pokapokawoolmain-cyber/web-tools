import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-check-metadata")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF メタデータ 確認", "PDF 作成者 確認 方法", "PDF プロパティ 見方", "PDF 個人情報 確認", "PDF 更新日時 確認"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        PDFには見えない「メタデータ」が埋め込まれており、作成者の実名・会社名・使用ソフト・日時などが誰でも確認できる状態で保存されています。送付前に確認・削除することで個人情報の意図しない漏洩を防げます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-metadata-remover" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFメタデータ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>PDFのメタデータとは</h2>
      <p>
        メタデータとは、PDFの本文には表示されていないが、ファイルのプロパティとして自動記録される付帯情報です。WordやExcel、InDesignなどで作成したファイルをPDFに変換すると、作成者のPC情報が自動的に埋め込まれます。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目名</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">内容例</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["タイトル（Title）", "新製品企画書2024年版"],
              ["作成者（Author）", "山田太郎 / tanaka.hanako"],
              ["件名（Subject）", "取締役会提出資料"],
              ["会社名（Creator org）", "株式会社〇〇 / ABC Corporation"],
              ["作成ソフト（Creator）", "Microsoft Word 2021 / Adobe InDesign 2024"],
              ["作成日時（CreationDate）", "2024-03-15T09:23:00+09:00"],
              ["更新日時（ModDate）", "2024-03-20T17:45:22+09:00"],
              ["PDFバージョン（PDF version）", "PDF 1.7 / PDF 2.0"],
              ["キーワード（Keywords）", "機密, 提案, 未承認"],
            ].map(([item, example], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Windowsでのメタデータ確認方法</h2>
      <h3>Adobe Acrobat Readerを使う方法</h3>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "Adobe Acrobat ReaderでPDFを開く", body: "PDFファイルをAdobe Acrobat Readerで開きます。無料版でもメタデータの確認は可能です。" },
          { step: "②", title: "「ファイル」メニューから「プロパティ」を開く", body: "メニューバーの「ファイル」→「プロパティ」を選択します。ショートカットキーはCtrl + Dです。" },
          { step: "③", title: "「説明」タブと「詳細情報」タブを確認する", body: "「説明」タブにタイトル・作成者・会社名が、「詳細情報」タブに作成日時・更新日時・使用ソフトが表示されます。" },
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

      <h3>ブラウザ（ChromeまたはEdge）で確認する方法</h3>
      <p>
        ChromeやEdgeにはPDFの組み込みビューアがありますが、メタデータの詳細表示には対応していません。基本的な確認はAdobe Acrobat Readerか、ToolBoxJPのメタデータ削除ツールを使うのが確実です。
      </p>

      <h2>Macでのメタデータ確認方法（プレビュー）</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "プレビューでPDFを開く", body: "PDFファイルをダブルクリックすると、Macのプレビューアプリで開きます。" },
          { step: "②", title: "「ツール」→「インスペクタを表示」", body: "メニューバーの「ツール」→「インスペクタを表示」を選択します（ショートカット: Cmd + I）。" },
          { step: "③", title: "「一般情報」タブを確認する", body: "インスペクタの「一般情報」タブにタイトル・作成者・作成日時・変更日時・使用ソフトが表示されます。" },
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

      <h2>スマホでの確認方法</h2>
      <p>
        iPhoneのファイルアプリでPDFを長押しして「情報を見る」を選択すると基本的なファイル情報が確認できますが、メタデータの詳細は表示されません。詳しいメタデータを確認したい場合は、ToolBoxJPのPDFメタデータ削除ツールでアップロードすると確認画面でメタデータ内容を閲覧できます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/pdf-metadata-remover" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDFメタデータ削除ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>メタデータに含まれる個人情報の具体例と漏洩リスク</h2>
      <ul className="space-y-2">
        <li><strong>氏名・ログイン名の漏洩</strong>：WordやExcelのユーザー設定で登録した実名がそのままPDFに記録されます。「satou.taro」のようなメールアドレス形式のログイン名が公開されることもあります。</li>
        <li><strong>会社名・部署名の漏洩</strong>：OfficeのOrganization設定で登録した会社名・部署名が自動的にメタデータに含まれます。</li>
        <li><strong>使用ソフト・バージョン情報の悪用</strong>：「Microsoft Word 2021」「Windows 10」などの情報から、既知の脆弱性を狙った標的型攻撃に利用されるリスクがあります。</li>
        <li><strong>作成・更新日時からの情報推測</strong>：書類の作成タイミングや修正回数が推測でき、競合他社や悪意ある第三者に情報の機密度や緊急性を知られる可能性があります。</li>
      </ul>

      <h2>メタデータを削除する方法（ToolBoxJP使用）</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "PDFメタデータ削除ツールを開く", body: "ToolBoxJPのPDFメタデータ削除ツールをブラウザで開きます。登録不要・無料で使えます。" },
          { step: "②", title: "PDFをアップロードする", body: "「ファイルを選択」でPDFを選択またはドラッグ＆ドロップします。アップロード後にメタデータ一覧が表示されます。" },
          { step: "③", title: "メタデータを確認する", body: "画面に表示される作成者名・会社名・使用ソフト等を確認します。削除が必要な情報がないか確認してください。" },
          { step: "④", title: "削除してダウンロードする", body: "「メタデータを削除する」ボタンで個人情報を削除したPDFをダウンロードできます。本文・画像は変更されません。" },
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

      <h2>PDFを共有・送付する前のチェックリスト</h2>
      <ul className="space-y-2">
        <li>✅ メタデータ（作成者名・会社名）を確認・削除済みか</li>
        <li>✅ PDF本文に不要な個人情報（住所・電話番号・メール）が含まれていないか</li>
        <li>✅ 機密書類には「社外秘」の透かしを追加したか</li>
        <li>✅ 送付先・宛先を間違えていないか</li>
        <li>✅ 必要に応じてパスワードを設定したか</li>
      </ul>

      <h2>注意点</h2>
      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 ポイント</strong>
        メタデータ削除後のPDFは元の状態に戻せません。削除前に元ファイルのバックアップを取っておくことを強くおすすめします。また、スキャンした書類のPDFにもスキャナーのメーカー名・機種名・スキャン日時が記録されているケースがあります。
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/pdf-remove-personal-info">PDFの作成者情報・個人情報を削除する方法｜メタデータ削除手順</Link></li>
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
