import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReceiptGenerator } from "./ReceiptGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "領収書作成ツール【無料】インボイス対応の領収書をブラウザで発行・PDF保存",
  description: "但し書き・宛名・金額を入力するだけで領収書を作成。インボイス（適格請求書）の登録番号欄・収入印紙の目安表示にも対応。PDF保存・印刷OK。個人事業主・フリーランスに。無料・登録不要。",
  path: "/tools/receipt-generator",
  keywords: ["領収書 作成 無料","領収書 テンプレート","領収書 発行 オンライン","インボイス 領収書","領収書 PDF 作成"],
  ogImage: `/api/og?${new URLSearchParams({ title: "領収書作成ツール", icon: "🧾", desc: "インボイス対応の領収書を即発行" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "インボイス（適格請求書）対応の領収書は作れますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。登録番号・適用税率・税率ごとの消費税額を記載でき、適格簡易請求書（簡易インボイス）の要件を満たす領収書を作成できます。"
    }
  },
  {
    "@type": "Question",
    "name": "収入印紙はいくらから必要ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "売上代金の領収書は、受取金額が5万円以上の場合に収入印紙（5万円以上100万円以下は200円）が必要です。ただしPDFなど電子発行の領収書には印紙は不要です。"
    }
  },
  {
    "@type": "Question",
    "name": "但し書きは何と書けばいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "「お品代」は税務上望ましくないとされます。「書籍代として」「飲食代として」など、実際の取引内容がわかる具体的な記載にしましょう。"
    }
  },
  {
    "@type": "Question",
    "name": "手書きの領収書と同じ効力がありますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。領収書は発行方法を問わず、金銭の受領事実を証明する書類として有効です。発行者名・日付・金額・但し書きが記載されていれば税務上も問題ありません。"
    }
  }
],
};


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
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="領収書作成ツール"
      description="宛名・金額・但し書きを入力するだけで領収書を無料作成。インボイス対応・消費税表示・PDF保存。登録不要。"
      icon="🧾"
      slug="receipt-generator"
      seoContent={seoContent}
    >
      <ReceiptGenerator />
    </ToolLayout>
    </>
  );
}
