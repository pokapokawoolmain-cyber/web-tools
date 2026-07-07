import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstructionPhotoPdf } from "./ConstructionPhotoPdf";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "工事写真帳作成ツール｜施工前・中・後をA4 PDFに整理【無料】",
  description: "工事写真（施工前・施工中・施工後）に工程区分・施工箇所・コメントを付けてA4 PDF形式の工事写真帳を作成。登録不要・ブラウザ完結・スマホ対応。建設・外壁塗装・リフォーム業に。",
  path: "/tools/construction-photo-pdf",
  keywords: [
    "工事写真帳 作成 無料", "施工写真 PDF 整理", "工事写真 報告書 作成",
    "外壁塗装 施工写真 PDF", "リフォーム 工事写真 まとめ", "建設業 写真報告書",
    "施工前 施工後 PDF", "工事写真 コメント 印刷",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "写真は何枚まで追加できますか？",
      acceptedAnswer: { "@type": "Answer", text: "制限はありませんが、ブラウザのメモリ制限上、高解像度写真は30〜50枚程度が目安です。スマホよりもPCが安定して動作します。" },
    },
    {
      "@type": "Question",
      name: "写真を追加した後にページを更新すると消えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、消えます。ブラウザのメモリ内でのみ管理しているため、更新・タブを閉じると写真はリセットされます。必ず印刷/PDF出力を先に行ってください。" },
    },
    {
      "@type": "Question",
      name: "建設業の写真台帳（施工管理写真）として使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "本ツールは工事報告書・施主提出用の写真帳を想定しています。公共工事の写真管理基準（デジタル写真管理情報基準）への対応は含まれていません。" },
    },
    {
      "@type": "Question",
      name: "PDFではなく印刷（紙）でも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。印刷ダイアログで実際のプリンタを選択すれば紙への印刷も可能です。" },
    },
    {
      "@type": "Question",
      name: "iPhoneで撮影したHEIC写真を使いたい",
      acceptedAnswer: { "@type": "Answer", text: "iPhoneのSafariからアップロードすると、ブラウザが自動的にJPEGに変換して処理します。そのまま選択してください。" },
    },
    {
      "@type": "Question",
      name: "完成後にPDFをメールで送りたい",
      acceptedAnswer: { "@type": "Answer", text: "ブラウザの印刷ダイアログで「PDFに保存」を選択するとPDFファイルとして保存できます。iPhone/MacはAirDropで共有も可能です。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールでできること</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {[
          "施工前・施工中・施工後・完成の工程区分を各写真に設定できる",
          "施工箇所・コメントを写真ごとに入力してPDFに印字",
          "工事名・現場名・施工会社・担当者名・作成日を表紙に自動反映",
          "1ページ2枚 / 4枚のレイアウトを切り替えて印刷",
          "ドラッグ＆ドロップで写真の順番を自由に並び替え",
          "ブラウザ内完結でサーバーに写真が送信されない安心設計",
        ].map((item) => (
          <li key={item} className="flex gap-2 items-start">
            <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方</h2>
      <div className="space-y-3">
        {[
          { step: "1", title: "基本情報を入力", desc: "左パネルに工事名・現場名・施工会社などを入力します。表紙ページに反映されます。" },
          { step: "2", title: "写真を追加", desc: "右パネルのドロップゾーンに工事写真をドラッグ＆ドロップ、またはタップして複数選択します。スマホで撮影したHEIC写真も対応しています。" },
          { step: "3", title: "各写真に情報を付加", desc: "工程区分（施工前/施工中/施工後/完成/その他）、施工箇所（例：南面外壁）、コメント（例：下塗り完了）を入力します。" },
          { step: "4", title: "順番を調整", desc: "工程の流れに合わせてドラッグ＆ドロップで並び替えます。" },
          { step: "5", title: "PDF保存・印刷", desc: "「PDF保存・印刷」ボタンを押すとブラウザの印刷ダイアログが開きます。PDFに保存する場合は「PDFに保存」を選択してください。" },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 p-4">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[12px] font-bold flex items-center justify-center shrink-0">{step}</div>
            <div>
              <p className="font-semibold text-[14px] text-slate-800 dark:text-zinc-200 mb-0.5">{title}</p>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">入力例</h2>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 p-4 text-sm space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700 dark:text-zinc-300">
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">工事名：</span>○○邸 外壁塗装工事</div>
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">現場名：</span>山田様邸</div>
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">工事場所：</span>東京都○○区○○町1-2-3</div>
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">施工会社：</span>○○塗装工業株式会社</div>
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">担当者：</span>田中 一郎</div>
          <div><span className="text-blue-600 dark:text-blue-400 font-semibold">作成日：</span>2024年○月○日</div>
        </div>
        <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
          <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">写真1枚目の例</p>
          <div className="text-slate-600 dark:text-zinc-400 space-y-0.5">
            <div>工程区分：施工前 / 施工箇所：南面外壁 / コメント：既存塗膜のチョーキング・クラックを確認</div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース・対応方法</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "iPhoneで撮影したHEIC写真を使いたい", a: "iPhoneのSafariからアップロードすると、ブラウザが自動的にJPEGに変換して処理します。そのまま選択してください。" },
          { q: "写真が多くて1ページ2枚では多すぎる", a: "1ページ4枚レイアウトを選択してください。写真が小さくなりますが、全体量が少ないページ数にまとまります。A3印刷の場合は4枚レイアウトが見やすくなります。" },
          { q: "施主向けと社内向けを別々に作りたい", a: "社内向けは全写真を含む完全版を、施主向けは「施工前」「完成」写真のみを選択してもう一度出力するといった使い分けができます。" },
          { q: "完成後にPDFをメールで送りたい", a: "ブラウザの印刷ダイアログで「PDFに保存」を選択するとPDFファイルとして保存できます。iPhone/MacはAirDropで共有も可能です。" },
          { q: "写真の向きが横向きになってしまう", a: "Exif情報の向きを自動反映するブラウザとしないブラウザがあります。向きがおかしい場合は写真を事前に回転させてから追加してください。" },
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
        <li>・写真はブラウザのメモリ内でのみ処理されます。ページを閉じるとリセットされます。</li>
        <li>・サーバーへの送信は一切なく、写真データが外部に漏れることはありません。</li>
        <li>・大量の高解像度写真（50枚以上）は処理が重くなる場合があります。PCでのご利用を推奨します。</li>
        <li>・印刷レイアウトはブラウザ・OS・プリンタ設定により若干異なる場合があります。</li>
      </ul>
    </div>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "写真は何枚まで追加できますか？", a: "制限はありませんが、ブラウザのメモリ制限上、高解像度写真は30〜50枚程度が目安です。スマホよりもPCが安定して動作します。" },
          { q: "写真を追加した後にページを更新すると消えますか？", a: "はい、消えます。ブラウザのメモリ内でのみ管理しているため、更新・タブを閉じると写真はリセットされます。必ず印刷/PDF出力を先に行ってください。" },
          { q: "建設業の写真台帳（施工管理写真）として使えますか？", a: "本ツールは工事報告書・施主提出用の写真帳を想定しています。公共工事の写真管理基準（デジタル写真管理情報基準）への対応は含まれていません。" },
          { q: "PDFではなく印刷（紙）でも使えますか？", a: "はい。印刷ダイアログで実際のプリンタを選択すれば紙への印刷も可能です。" },
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
        title="工事写真帳作成ツール"
        description="施工前・施工中・施工後の写真に工程区分・コメントを付けてA4 PDFの写真帳を作成。登録不要・ブラウザ完結。"
        icon="📸"
        slug="construction-photo-pdf"
        seoContent={seoContent}
      >
        <ConstructionPhotoPdf />
      </ToolLayout>
    </>
  );
}
