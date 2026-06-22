import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ConstructionContract } from "./ConstructionContract";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "工事請負契約書作成ツール｜建設・リフォーム向け無料テンプレート",
  description: "工事請負契約書を無料で作成。発注者・請負者情報、工事金額・支払条件・保証を入力してPDF出力。建設業許可番号・消費税・着手金分割払いに対応。登録不要・ブラウザ完結。",
  path: "/tools/construction-contract",
  keywords: [
    "工事請負契約書 作成 無料", "リフォーム 請負契約書 テンプレ", "建設業 契約書 無料 PDF",
    "工事 請負契約書 雛形", "外壁塗装 契約書 作成", "建設工事 契約書 フォーマット",
  ],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールでできること</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {[
          "発注者（施主）・請負者（施工会社）情報を入力して契約書を作成",
          "工事金額・消費税・着手金/中間金/完成時払いを自動計算",
          "契約不適合責任（保証）をテンプレートから選択または自由入力",
          "特約事項を自由記述で追加可能",
          "PDF保存・印刷（A4）または文章のテキストコピーに対応",
          "建設業許可番号の記載欄付き",
        ].map((item) => (
          <li key={item} className="flex gap-2 items-start">
            <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事請負契約書の基本知識</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        工事請負契約書は、発注者（施主）と施工会社が工事内容・金額・工期・支払条件などを明確にするための重要な書類です。建設業法第18条・19条では、工事請負契約の書面作成を義務付けています（500万円以上の工事は特に重要）。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 p-4 text-sm">
        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">建設業法で定められた契約書の必須記載事項</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-blue-700 dark:text-blue-400">
          {["工事内容", "請負代金の額", "工事着手の時期・完成時期", "請負代金の支払方法", "天災等の費用負担", "価格等の変動に基づく改訂", "設計変更の取扱い", "完成確認の方法", "瑕疵担保責任の履行措置"].map((item) => (
            <div key={item}>・{item}</div>
          ))}
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">入力例</h2>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 p-4 text-sm space-y-1 text-slate-700 dark:text-zinc-300">
        <div><span className="font-semibold text-blue-600 dark:text-blue-400">工事名：</span>○○邸 外壁塗装工事</div>
        <div><span className="font-semibold text-blue-600 dark:text-blue-400">工期：</span>2024年○月○日 〜 2024年○月○日</div>
        <div><span className="font-semibold text-blue-600 dark:text-blue-400">工事金額（税抜）：</span>¥1,500,000</div>
        <div><span className="font-semibold text-blue-600 dark:text-blue-400">支払条件：</span>着手金30%・中間金40%・完成時30%</div>
        <div><span className="font-semibold text-blue-600 dark:text-blue-400">保証：</span>塗膜保証5年 / 施工保証2年</div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース・注意点</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "着手金・中間金の割合の目安は？", a: "建設業界では着手金30%・中間金40%・完成時30%が一般的です。小規模リフォームでは着手金なし（完成時一括払い）のケースもあります。施主との合意を先に取ってから入力してください。" },
          { q: "契約不適合責任とは何ですか？", a: "旧「瑕疵担保責任」の後継です。工事完了後に隠れた欠陥（雨漏り・施工不良など）が見つかった場合に施工会社が負う責任期間・内容を定めるものです。住宅の主要構造部と防水は10年保証が法定要件です。" },
          { q: "消費税は10%で合っていますか？", a: "工事は基本的に標準税率10%が適用されます（食品等の軽減税率は対象外）。インボイス制度により適格請求書発行事業者番号の記載が推奨されます。" },
          { q: "特約事項には何を書けばいい？", a: "近隣トラブル時の対応責任、追加工事の単価基準、施主の立ち入り可否、天災時の対応、工事中断時の費用負担などを明記すると後のトラブルを防げます。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 重要な注意点</p>
      <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
        <li>・本ツールはひな形を提供するものです。建設業法・民法（契約不適合責任等）の要件を完全に満たすかどうかは工事の種類・金額により異なります。</li>
        <li>・500万円以上の建設工事では建設業許可が必要です（軽微な工事を除く）。</li>
        <li>・重要な工事・高額工事では、行政書士・弁護士等の専門家に契約書の確認を依頼することを強く推奨します。</li>
        <li>・入力したデータはブラウザを閉じるとリセットされます。PDFを必ず保存してください。</li>
      </ul>
    </div>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "このツールで作成した契約書は法的に有効ですか？", a: "署名・捺印した書面としての効力を持つ場合があります。ただし建設業法の要件（必須記載事項）を全て網羅しているかどうかは工事内容によって異なります。重要な工事では専門家の確認を推奨します。" },
          { q: "収入印紙は必要ですか？", a: "建設工事の請負契約書は印紙税の課税文書（第2号文書）です。契約金額に応じた収入印紙が必要です（1万円未満は非課税）。金額別の印紙税額は国税庁のウェブサイトでご確認ください。" },
          { q: "入力データはどこかに送信されますか？", a: "一切送信されません。すべてブラウザ内で完結しています。" },
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
    <ToolLayout
      title="工事請負契約書作成ツール"
      description="発注者・請負者情報、工事金額・支払条件を入力して工事請負契約書をPDF出力。建設・リフォーム業向け。"
      icon="📑"
      slug="construction-contract"
      seoContent={seoContent}
    >
      <ConstructionContract />
    </ToolLayout>
  );
}
