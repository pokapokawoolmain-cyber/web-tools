import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ResumeBuilder } from "./ResumeBuilder";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "履歴書・職務経歴書 作成ツール【無料】ブラウザで入力してPDF保存｜登録不要",
  description: "履歴書と職務経歴書をブラウザだけで作成できる無料ツール。JIS規格に準じたレイアウトで、入力内容はサーバーに送信されません。PDF保存してそのまま応募に使えます。スマホ対応。",
  path: "/tools/resume-builder",
  keywords: ["履歴書 作成 無料","職務経歴書 テンプレート","履歴書 PDF 作成","履歴書 ブラウザ 作成","履歴書 スマホ 作成 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "履歴書・職務経歴書 作成ツール", icon: "📋", desc: "履歴書・職務経歴書をPDFで作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "職務経歴書と履歴書の違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "履歴書は学歴・職歴・資格などの基本情報を記入する書類（JIS規格やA4サイズが一般的）で、主に事実の羅列です。職務経歴書は実際に何をしてきたか・どんな成果を出したかを自由形式で説明する書類で、転職活動では履歴書より重視されることが多いです。" },
    },
    {
      "@type": "Question",
      name: "職務経歴書は何枚（何文字）が適切ですか？",
      acceptedAnswer: { "@type": "Answer", text: "一般的にA4用紙1〜2枚（1200〜2400文字程度）が目安です。経験が浅い場合は1枚、10年以上の経験があれば2枚まで許容されます。3枚以上は採用担当者が読みづらくなるため、要点を絞りましょう。" },
    },
    {
      "@type": "Question",
      name: "自己PRは何を書けばいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "「強み＋それを裏付けるエピソード＋応募先でどう活かせるか」の3点セットで書くのが基本です。「コミュニケーション能力があります」だけでは弱く、「前職でチームリーダーとして5名をマネジメントし、離職率を30%改善した」のように具体的な数字や事実を入れることで説得力が増します。" },
    },
    {
      "@type": "Question",
      name: "スキルシートには何を書くべきですか？",
      acceptedAnswer: { "@type": "Answer", text: "業務スキル（使用言語・ツール・資格）と、各スキルの経験年数・習熟度を書きます。IT系なら「Python 3年・業務使用」「AWS（EC2/S3）2年」のように具体的に。業種共通のスキルとして、ExcelやWord、Teamsなどの使用経験も含めると採用担当者に伝わりやすいです。" },
    },
    {
      "@type": "Question",
      name: "作成した職務経歴書はどこに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールに入力した内容はブラウザ内でのみ処理されます。入力データが外部サーバーに送信されることは一切ありません。ただしページを閉じると入力内容が消えるため、「コピー」してWordやGoogleドキュメントに貼り付けて保存することをおすすめします。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      職務経歴書の書き方とこのツールの使い方
    </h2>
    <p>
      各フォームに職歴・スキル・自己PRを入力すると、そのまま提出できる文章が自動で生成されます。
      完成した文章はコピーしてWordやGoogleドキュメントに貼り付けて仕上げに使ってください。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      職務経歴書の基本構成
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800 space-y-2">
      {[
        ["①　職務要約（3〜5行）", "これまでの経験を端的にまとめる。採用担当者が最初に読む部分。"],
        ["②　職務経歴（時系列）", "会社名・在籍期間・役職・担当業務・実績を記載。直近から逆順が読みやすい。"],
        ["③　スキル・資格", "使用ツール・言語・資格を列挙。経験年数も添えると説得力が増す。"],
        ["④　自己PR（5〜8行）", "強み・エピソード・応募先への貢献イメージを書く。数字で実績を示す。"],
      ].map(([title, desc]) => (
        <div key={title} className="flex gap-3">
          <span className="font-semibold text-slate-700 dark:text-zinc-300 flex-shrink-0 w-44">{title}</span>
          <span className="text-slate-500 dark:text-zinc-400">{desc}</span>
        </div>
      ))}
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      業種別・書き方のコツ
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>IT・エンジニア職</strong>：技術スタック（言語・フレームワーク・クラウド）を明記。GitHubのURLや成果物リンクがあると強い</li>
      <li><strong>営業職</strong>：担当エリア・顧客数・目標達成率など数字が最重要。「月間○件の新規獲得、達成率120%」のような形で</li>
      <li><strong>事務・管理職</strong>：使えるソフト・処理件数・効率化した経験を具体的に。マルチタスク対応力を示す</li>
      <li><strong>医療・介護職</strong>：取得資格・施設種別・担当人数・夜勤可否などを明確に記載</li>
      <li><strong>クリエイティブ職</strong>：ポートフォリオURLは必須。使用ツール（Adobe系、Figmaなど）と納品実績を入れる</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      よくある失敗パターン
    </h3>
    <ul className="space-y-1 text-[14px]">
      <li>✗ 「頑張りました」「努力しました」→ 具体的な成果に置き換える</li>
      <li>✗ 仕事内容だけ書いて実績がない → 「○件処理」「コスト○%削減」を探して追加</li>
      <li>✗ 志望動機と自己PRが同じ内容 → 自己PRは「過去の実績」、志望動機は「未来への展望」で書き分ける</li>
      <li>✗ 3枚以上の長すぎる職務経歴書 → A4×2枚以内にまとめ、直近5年を重点的に</li>
    </ul>

    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">💡 プライバシーについて</p>
      <p className="text-slate-500 dark:text-zinc-400">
        入力した職歴・スキル・個人情報はすべてブラウザ内でのみ処理されます。
        外部サーバーへの送信は一切ありません。会社の機密情報を含む経歴書でも安心してご利用いただけます。
      </p>
    </div>
  </div>
);

export default function ResumeBuilderPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="職務経歴書作成ツール"
        description="フォームを埋めるだけで職務経歴書の文章が完成。コピーしてそのまま使えます。"
        icon="📄"
        slug="resume-builder"
        seoContent={seoContent}
      >
        <ResumeBuilder />
      </ToolLayout>
    </>
  );
}
