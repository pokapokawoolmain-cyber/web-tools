import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfMerge } from "./PdfMerge";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDF結合ツール｜複数PDFを無料でまとめる【登録不要】",
  description: "複数のPDFファイルをブラウザ上で簡単に結合。ドラッグで順番変更・登録不要・無料・スマホ対応。ファイルはサーバーに送信されません。",
  path: "/tools/pdf-merge",
  keywords: ["PDF結合", "PDF まとめる", "PDF 複数 合体", "PDF結合 無料", "PDF merger"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF結合ツール", icon: "📎", desc: "複数PDFを1つにまとめる。登録不要・無料・スマホ対応。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDF結合は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。" } },
    { "@type": "Question", name: "スマホでも使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidともに対応しています。" } },
    { "@type": "Question", name: "PDFの結合順番は変えられますか？", acceptedAnswer: { "@type": "Answer", text: "はい。アップロード後にドラッグ＆ドロップでファイルの順番を自由に並び替えられます。スマホでは上下ボタンで順番を変更できます。" } },
    { "@type": "Question", name: "何ファイルまで結合できますか？", acceptedAnswer: { "@type": "Answer", text: "ファイル数に上限はありませんが、大きなPDFを多数結合するとブラウザのメモリ上限に達する場合があります。合計ファイルサイズが数百MB以内を目安にご利用ください。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-merge" title="PDF結合ツール" description="複数のPDFファイルをブラウザ上で簡単に結合。登録不要・無料・スマホ対応。" />
      <JsonLd data={faqSchema} />
      <PdfMerge />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-merge" />
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF結合ツールの使い方</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            複数のPDFファイルを選択してアップロードし、ドラッグ＆ドロップで順番を調整してから「PDF結合」ボタンを押すと、1つのPDFとしてダウンロードできます。スマホでは上下ボタンで順番を入れ替えられます。ファイルはすべてブラウザ内で処理されるため、外部サーバーへの送信は一切ありません。アカウント登録やソフトのインストールも不要で、今すぐ無料でお使いいただけます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">どんな場面で使う？</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            PDF結合ツールは、複数のPDFをひとつにまとめて管理・共有したい場面で広く活用されています。
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ビジネス書類の送付：</strong>見積書・仕様書・会社概要を1ファイルにまとめて取引先にメール添付する際に便利です。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">確定申告・税務書類：</strong>複数の領収書スキャンや申告書類を1つのPDFにまとめて提出できます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">旅行の予約確認：</strong>フライト・ホテル・レンタカーの予約PDFを1ファイルに整理して、旅行中の参照をスムーズにできます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">学術レポート・論文：</strong>本文・参考文献・付録を別々に作成してから最後に結合し、提出形式を整えることができます。</span></li>
            <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">マニュアル・手順書：</strong>章ごとに分かれたPDFをひとつにまとめて、配布・印刷しやすい形にできます。</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ブラウザ内で完結する安全性</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            社内文書や個人情報を含むPDFをオンラインサービスにアップロードすることへの不安は自然なことです。このツールは、処理のすべてがお使いのブラウザ（Chrome・Safari・Edge など）内で完結します。ファイルが外部のサーバーに送信されることは一切なく、インターネット接続さえあれば利用でき、完了後にページを閉じるとデータは残りません。機密性の高い契約書や医療書類も安心してご利用いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: "PDF結合は無料ですか？", a: "完全無料です。登録・インストール不要でブラウザから即利用できます。" },
              { q: "何ファイルまで結合できますか？", a: "ファイル数に上限はありませんが、大きなPDFを多数結合するとブラウザのメモリ上限に達する場合があります。合計ファイルサイズが数百MB以内を目安にご利用ください。" },
              { q: "PDFの結合順番は変えられますか？", a: "はい。アップロード後にドラッグ＆ドロップでファイルの順番を自由に並び替えられます。スマホでは上下ボタンで順番を変更できます。" },
              { q: "パスワード付きPDFも結合できますか？", a: "パスワードで保護されたPDFは、先にパスワードを解除してからご利用ください。パスワード保護されたままでは結合できない場合があります。" },
              { q: "ファイルはサーバーに送信されますか？", a: "いいえ。処理はすべてブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。" },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
                <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
