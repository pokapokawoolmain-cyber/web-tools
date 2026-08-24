import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { WordToPdf } from "./WordToPdf";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "WordをPDFに変換｜.docxを無料でPDF化【登録不要・ブラウザ完結】",
  description: "WordファイルをPDFに変換。.docxをアップロードするだけで即変換。用紙サイズ・フォントサイズを選んでブラウザから直接PDFとして保存できます。登録不要・無料・ファイルはサーバーに送信されません。",
  path: "/tools/word-to-pdf",
  keywords: ["word pdf 変換", "docx pdf 変換", "word pdf 無料", "ワード pdf 変換", "docx pdf オンライン", "word pdf変換 無料 登録不要", "doc pdf 変換 無料", "word pdf 変換 ツール"],
  ogImage: `/api/og?${new URLSearchParams({ title: "Word→PDF変換", icon: "📄", desc: ".docxをPDFに変換。無料・登録不要・ブラウザ完結。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "WordファイルをPDFに変換するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: ".docxファイルをこのツールにアップロードまたはドラッグ＆ドロップすると、ブラウザ上でHTMLに変換されてプレビューが表示されます。「PDFとして保存する」ボタンを押すと印刷ダイアログが開くので、プリンター欄で「PDFとして保存」を選んで保存してください。",
      },
    },
    {
      "@type": "Question",
      name: ".doc（旧形式）のWordファイルは変換できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: ".docxのみ対応しています。.doc（Word 97〜2003形式）はブラウザ上での変換が困難なため非対応です。Wordをお持ちの場合は、いったん「名前を付けて保存」で.docxとして保存してからご利用ください。",
      },
    },
    {
      "@type": "Question",
      name: "ファイルが外部に送信されることはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ありません。変換処理はすべてブラウザ内のJavaScriptで完結します。アップロードしたWordファイルがサーバーに送信されることは一切ないため、社内文書や個人情報を含む書類も安心してご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "変換したPDFの見た目がWordと異なります",
      acceptedAnswer: {
        "@type": "Answer",
        text: "本ツールはブラウザ内での変換のため、Wordが使用している独自フォント・細かいレイアウト・特殊な書式設定は完全には再現できません。表・画像・見出しなどは概ね再現されますが、フォントのずれやレイアウトの差異が生じる場合があります。完全な再現が必要な場合はMicrosoft Word本体からの「名前を付けて保存」をご利用ください。",
      },
    },
    {
      "@type": "Question",
      name: "用紙サイズとフォントサイズは変えられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。A4・A3・Letterの3種類の用紙サイズと、小・中・大の3段階のフォントサイズを選択できます。出力前にプレビューで確認してから設定を調整することをお勧めします。",
      },
    },
    {
      "@type": "Question",
      name: "パスワード保護されたWordファイルは変換できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "パスワード保護されたWordファイルは変換できません。先にWordでパスワードを解除してから変換してください。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-6 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Word→PDF変換ツールの使い方</h2>
      <ol className="space-y-2 list-decimal list-inside">
        <li>.docxファイルをアップロードエリアにドラッグ＆ドロップ（またはクリックして選択）</li>
        <li>ブラウザ内でHTMLに変換され、プレビューが表示されます</li>
        <li>用紙サイズ・フォントサイズを調整する</li>
        <li>「PDFとして保存する」ボタンを押す</li>
        <li>印刷ダイアログの「プリンター」欄で「PDFとして保存」を選んで保存</li>
      </ol>
    </section>
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">対応している書式・要素</h2>
      <ul className="space-y-1 list-disc list-inside">
        <li>見出し（H1〜H4）・本文・箇条書き・番号付きリスト</li>
        <li>表（テーブル）・太字・イタリック・下線・取り消し線</li>
        <li>画像（文書内に埋め込まれたもの）</li>
        <li>引用（blockquote）・水平線・リンク</li>
      </ul>
    </section>
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">再現が難しい要素</h2>
      <p>ブラウザ上での変換のため、以下の書式は完全に再現されない場合があります。</p>
      <ul className="mt-2 space-y-1 list-disc list-inside">
        <li>Wordの独自フォント（游ゴシック・HGSゴシックM等）</li>
        <li>フォント・段落レベルの細かいインデント・行間設定</li>
        <li>ヘッダー・フッター・ページ番号</li>
        <li>テキストボックス・図形・SmartArt・グラフ</li>
        <li>段組み・複雑なレイアウト</li>
      </ul>
      <p className="mt-3">
        完全な再現が必要な場合は、Microsoft Word本体で「ファイル → エクスポート → PDFの作成」を使用することをお勧めします。また、
        <Link href="/tools/pdf-merge" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">PDF結合ツール</Link>
        で複数ファイルをまとめることも可能です。
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">こんな場面で使われています</h2>
      <ul className="space-y-1.5 list-disc list-inside">
        <li>契約書・案内文などのWord文書を、編集されない形式（PDF）で送りたい</li>
        <li>履歴書・職務経歴書をWordで作成し、応募先にPDFで提出したい</li>
        <li>役所・学校などへの提出書類をPDF形式に指定されている</li>
        <li>Wordを持っていない相手にも、レイアウト崩れなく文書を見せたい</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5 list-disc list-inside">
        <li>逆にPDFの文章をWordに戻したい場合は<Link href="/tools/pdf-to-word" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">PDF→Word変換</Link></li>
        <li>Excelファイルも変換したい場合は<Link href="/tools/excel-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">Excel→PDF変換</Link></li>
        <li>履歴書・職務経歴書をそのまま作りたい場合は<Link href="/tools/resume-builder" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">履歴書・職務経歴書作成</Link></li>
      </ul>
    </section>
  </div>
);

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Word→PDF変換"
        description=".docxファイルをアップロードするだけでPDFに変換。用紙サイズ・フォントサイズを選んでブラウザから直接保存できます。"
        icon="📄"
        slug="word-to-pdf"
        seoContent={seoContent}
      >
        <WordToPdf />
      </ToolLayout>
    </>
  );
}
