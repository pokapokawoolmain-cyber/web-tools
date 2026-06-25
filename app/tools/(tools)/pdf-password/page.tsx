import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfPassword } from "./PdfPassword";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFパスワード設定ツール｜PDFに無料でロックを追加【登録不要】",
  description: "PDFにパスワードを設定して保護できます。AES-256暗号化でブラウザ完結。登録不要・無料・サーバー保存なし。設定したパスワードで解除も可能。",
  path: "/tools/pdf-password",
  keywords: ["PDF パスワード", "PDF 暗号化", "PDF ロック", "PDF 保護", "PDF password 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDFパスワード設定", icon: "🔐", desc: "AES-256暗号化でPDFを保護。ブラウザ完結。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "このツールで設定したパスワードはAcrobatやプレビューで使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。このツールはAdobeのPDF暗号化規格ではなく、独自のAES-256暗号化を使用しています。設定したパスワードの解除には、このツール（ToolBox）の「解除する」タブのみを使用してください。" },
    },
    {
      "@type": "Question",
      name: "ファイルはサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。PDFファイルや設定したパスワードが外部サーバーに送信されることは一切ありません。" },
    },
    {
      "@type": "Question",
      name: "パスワードを忘れた場合はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "パスワードを紛失した場合、ファイルを復元する手段はありません。AES-256暗号化は非常に強力であり、総当たり攻撃での解読は現実的ではありません。パスワードは必ず安全な場所に保管してください。" },
    },
    {
      "@type": "Question",
      name: "保護を解除するにはどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "「解除する」タブに切り替え、このツールで保護したファイル（.pdfまたは.encrypted）をアップロードし、設定時と同じパスワードを入力してください。元のPDFを復元できます。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-password" title="PDFパスワード設定ツール" description="PDFにAES-256パスワード保護を追加。ブラウザ完結・登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfPassword />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-password" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">このツールの暗号化の仕組みと制限について</h2>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[13px] space-y-2">
            <p className="font-semibold text-amber-800 dark:text-amber-300">重要：AdobeのPDF暗号化規格とは異なります</p>
            <p className="text-amber-700 dark:text-amber-400">
              このツールはAdobeが定めたPDF暗号化規格ではなく、独自のAES-256実装を使用しています。そのため、<strong>AcrobatやmacOSプレビュー、その他の標準PDFリーダーではパスワードを解除できません。</strong>このツールの「解除する」タブのみが復号に対応しています。
            </p>
          </div>
          <p>
            AES-256は現在利用できる最も強力な暗号化規格の一つです。総当たり攻撃での解読は現実的ではありません。ただし、パスワードを紛失した場合の復元手段も存在しないため、パスワードの管理には十分注意してください。
          </p>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">このツールが適している使い方</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
              <p className="font-semibold text-green-800 dark:text-green-300 text-[14px] mb-1">同じツールを使う相手との間でファイル共有</p>
              <p className="text-[13px] text-green-700 dark:text-green-400">送り手と受け取り手が両方このツールを使える場合に適しています。DropboxやGoogleドライブで共有する際に、万が一第三者がアクセスしても内容を読めないようにできます。</p>
            </div>
            <div className="p-4 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
              <p className="font-semibold text-green-800 dark:text-green-300 text-[14px] mb-1">一時的な保護と期限付き共有</p>
              <p className="text-[13px] text-green-700 dark:text-green-400">期間限定で閲覧させたい文書に使えます。共有期間が終了したらパスワードを相手に伝えないことで実質的にアクセス制限になります。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">このツールが適していない使い方</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <p className="font-semibold text-red-800 dark:text-red-300 text-[14px] mb-1">一般的なPDFリーダーで開かれることを想定した保護</p>
              <p className="text-[13px] text-red-700 dark:text-red-400">「AcrobatやプレビューのユーザーにPDFを送り、パスワードを知らせて開いてもらう」用途には使えません。相手はパスワードを入力できる画面が表示されず、ファイルが開けません。</p>
            </div>
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <p className="font-semibold text-red-800 dark:text-red-300 text-[14px] mb-1">長期保存・アーカイブ用途</p>
              <p className="text-[13px] text-red-700 dark:text-red-400">数年後に復号する可能性がある重要書類の長期保管には向きません。このツール自体が将来利用できない可能性があり、パスワードを忘れた場合の復元手段がありません。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">パスワードの管理について</h2>
          <p>
            AES-256暗号化の特性上、設定したパスワードを忘れると復号は不可能です。以下のような管理方法を推奨します。
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] space-y-2">
            <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-zinc-400">
              <li>パスワードマネージャー（1Password、Bitwarden等）に記録する</li>
              <li>ファイル名や保存場所にヒントを残す（例：「パスワードはXXXのフォルダ参照」）</li>
              <li>送付先に渡すパスワードはメールと別の方法（SMS、口頭）で共有する</li>
              <li>暗号化前の元ファイルを手元に残しておく</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">よくある質問</h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{item.name}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
