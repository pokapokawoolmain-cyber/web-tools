import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ReceiptGenerator } from "./ReceiptGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "領収書作成ツール",
  "領収書を無料で作成。インボイス登録番号・消費税表示・収入印紙ガイド対応。PDF保存・印刷。ブラウザ完結・登録不要。",
  "receipt-generator",
  ["領収書 作成 無料", "領収書 PDF 無料", "インボイス 領収書 作成", "領収書 テンプレ 無料", "消費税 領収書"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">領収書作成ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        宛名・金額・但し書き・発行者情報を入力するだけで、印刷してそのまま使える領収書が作成できます。インボイス制度対応の登録番号表示・消費税の内訳表示にも対応。PDF保存は「PDFで保存・印刷」ボタンから行えます。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 領収書に収入印紙は必要ですか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 紙の領収書では、受取金額が5万円以上の場合は収入印紙が必要です（電子での授受を除く）。本ツールでは5万円以上の場合にガイドを表示します。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. インボイス番号（登録番号）はどこで確認できますか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 国税庁の「インボイス制度適格請求書発行事業者公表サイト」でご確認いただけます。「T」から始まる13桁の番号です。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 mb-1">Q. 入力内容はサーバーに保存されますか？</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">A. 保存されません。すべての処理はブラウザ内で完結します。入力内容はお使いのデバイスのLocalStorageにのみ保存されます。</p>
        </div>
      </div>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ ご注意</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した領収書はひな形です。税務上の取り扱いについては税理士等の専門家にご確認ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="領収書作成ツール"
      description="宛名・金額・但し書きを入力するだけで領収書を無料作成。インボイス対応・消費税表示・PDF保存。登録不要。"
      icon="🧾"
      slug="receipt-generator"
      seoContent={seoContent}
    >
      <ReceiptGenerator />
    </ToolLayout>
  );
}
