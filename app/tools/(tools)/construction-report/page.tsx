import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstructionReport } from "./ConstructionReport";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "工事完了報告書作成ツール｜建設・リフォーム向け無料テンプレート",
  description: "工事名・施主名・施工内容・使用材料・工事保証を入力して工事完了報告書をPDF出力。施工会社情報・建設業許可番号対応。登録不要・ブラウザ完結・スマホ対応。",
  path: "/tools/construction-report",
  keywords: [
    "工事完了報告書 作成 無料", "施工完了報告書 テンプレ", "リフォーム 完了報告書 PDF",
    "外壁塗装 完了報告書", "建設業 完了報告書 フォーマット", "工事 報告書 作成 無料",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "作業報告書には何を書けばいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "日付・現場名・作業内容・作業時間・使用材料・作業員数・特記事項（変更やトラブル）が基本項目です。本ツールはこれらをフォーム入力するだけで書式に流し込めます。"
    }
  },
  {
    "@type": "Question",
    "name": "施主や元請けへの提出用に使えますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。A4の見やすい書式でPDF保存・印刷できるため、日報・週報として元請けや施主への提出にそのまま使えます。社名や担当者名も入れられます。"
    }
  },
  {
    "@type": "Question",
    "name": "写真は添付できますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "本ツールは報告書本文の作成に特化しています。現場写真をまとめたPDFは、姉妹ツールの「工事写真PDF」で作成し、あわせて提出するのがおすすめです。"
    }
  },
  {
    "@type": "Question",
    "name": "入力した内容は保存されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "入力内容はサーバーに送信されず、ブラウザ内でのみ処理されます。ページを閉じると消えるため、作成後は必ずPDF保存してください。"
    }
  }
],
};


const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールでできること</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {[
          "工事名・施主情報・工期・施工内容・材料・保証を一画面で入力",
          "工事保証テンプレートから一発入力（外壁塗装・防水・内装など）",
          "リアルタイムプレビューで仕上がりを確認しながら編集",
          "PDF保存・印刷（A4）、テキストコピーに対応",
          "建設業許可番号・担当者名を記載可能",
          "ブラウザ内完結でデータがサーバーに送信されない",
        ].map((item) => (
          <li key={item} className="flex gap-2 items-start">
            <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方・入力例</h2>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 p-4 text-sm space-y-2">
        <p className="font-semibold text-blue-800 dark:text-blue-300">外壁塗装工事の入力例</p>
        <div className="space-y-1 text-slate-700 dark:text-zinc-300">
          <div><span className="text-blue-600 font-semibold">工事名：</span>○○邸 外壁・屋根塗装工事</div>
          <div><span className="text-blue-600 font-semibold">工期：</span>2024年○月○日 〜 2024年○月○日（10日間）</div>
          <div><span className="text-blue-600 font-semibold">施工内容：</span>高圧洗浄→シーリング打ち替え→下塗り→中塗り→上塗り</div>
          <div><span className="text-blue-600 font-semibold">使用材料：</span>○○シリコン塗料（外壁）、○○遮熱塗料（屋根）</div>
          <div><span className="text-blue-600 font-semibold">工事保証：</span>塗膜保証5年 / 施工保証2年</div>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "施主向けと社内保管用で内容を変えたい", a: "施主向けは保証・アフター案内を手厚く記載し、社内向けは使用材料・ロット番号など詳細情報を加えて別途保存するのがおすすめです。本ツールで2回作成・印刷することで対応できます。" },
          { q: "工事保証の書き方がわからない", a: "「塗膜保証○年 / 施工保証○年」が外壁塗装の標準的な表記です。使用塗料のメーカー保証と自社施工保証を区別して明記すると施主に信頼されやすいです。" },
          { q: "複数工種（外壁・屋根・シーリング）を1枚にまとめたい", a: "施工内容欄に改行で複数工種を記載できます。箇条書き形式（・）を使うと視認性が高まります。" },
          { q: "印刷せずにメールで送りたい", a: "「テキストコピー」ボタンで内容を文字列としてコピーし、メール本文に貼り付けることができます。PDF送付する場合は「PDF保存・印刷」→「PDFに保存」で保存してください。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 注意点</p>
      <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
        <li>・入力内容はブラウザを閉じるとリセットされます。印刷/PDF出力を必ず先に行ってください。</li>
        <li>・本ツールで作成した書類はひな形です。工事内容・保証条件は実際の契約に沿って正確に記載してください。</li>
        <li>・建設業法上の「完成検査」「竣工検査」要件は別途確認が必要です。</li>
      </ul>
    </div>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "工事完了報告書は法的に必要ですか？", a: "建設業法上、一般的に義務付けられているわけではありませんが、施主との信頼関係・トラブル防止のために作成することを強く推奨します。特に保証条件を明文化することで後のクレームを防げます。" },
          { q: "入力データはどこかに送信されますか？", a: "一切送信されません。すべてブラウザ内で処理されます。" },
          { q: "請負契約書とは別に必要ですか？", a: "契約書は工事開始前の取り交わしが目的で、完了報告書は工事終了後に施工内容・保証を確認するための書類です。それぞれ役割が異なります。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="工事完了報告書作成ツール"
      description="工事内容・施主情報・使用材料・工事保証を入力して完了報告書をPDF出力。建設・リフォーム業向け。"
      icon="📋"
      slug="construction-report"
      seoContent={seoContent}
    >
      <ConstructionReport />
    </ToolLayout>
    </>
  );
}
