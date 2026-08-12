import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "AI謝罪文作成｜ビジネスのお詫びメール・謝罪文を自動作成【無料】",
  description:
    "納期遅延・ミス・クレーム対応など、ビジネスの謝罪文（お詫びメール）を状況を入力するだけで自動作成。原因説明と再発防止まで含んだ、そのまま使える文面を作成できます。登録不要・ブラウザ完結。",
  path: "/tools/ai-apology",
  ogImage: `/api/og?${new URLSearchParams({ title: "AI謝罪文作成", icon: "🙏", desc: "納期遅延・ミス・クレーム対応など、状況を入力するだけで謝" }).toString()}`,
  keywords: ["AI 謝罪文 作成", "お詫びメール 例文", "謝罪文 ビジネス テンプレート", "お詫び 文面 作成", "謝罪メール 書き方"],
});

const fields: AiField[] = [
  {
    type: "select", name: "recipient", label: "謝罪する相手",
    options: [
      { value: "取引先", label: "取引先・ビジネス相手" },
      { value: "顧客", label: "お客様（顧客）" },
      { value: "社内", label: "社内（上司・チーム）" },
    ],
  },
  {
    type: "textarea", name: "about", label: "何についてのお詫びか", rows: 3,
    placeholder: "例：納品物の一部に誤りがあり、修正版の提出が予定より遅れた件",
  },
  { type: "text", name: "cause", label: "原因（任意）", placeholder: "例：確認体制が不十分だったこと" },
  { type: "text", name: "action", label: "今後の対応・再発防止（任意）", placeholder: "例：提出前のダブルチェック" },
  { type: "text", name: "sender", label: "差出人の名前（任意）", placeholder: "例：山田 太郎 / 株式会社◯◯" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "謝罪文で最も大切なことは何ですか？", acceptedAnswer: { "@type": "Answer", text: "言い訳より先に、まず率直にお詫びの言葉を伝えることです。そのうえで原因と今後の対応（再発防止）を簡潔に示すと、誠意が伝わりやすくなります。本ツールはこの順序で文面を組み立てます。" } },
    { "@type": "Question", name: "原因や再発防止は必ず入力が必要ですか？", acceptedAnswer: { "@type": "Answer", text: "任意です。入力しない場合は一般的な言い回しで作成されます。原因が特定できている場合は入力すると、より具体的で誠実な文面になります。" } },
    { "@type": "Question", name: "作成した文章はそのまま送れますか？", acceptedAnswer: { "@type": "Answer", text: "下書きとしてご利用ください。相手の会社名・宛名・具体的な日時などを確認し、状況に合わせて調整してから送信することをおすすめします。" } },
    { "@type": "Question", name: "無料で使えますか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。処理はブラウザ内で完結し、内容が外部に送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">伝わる謝罪文の構成</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li><strong>お詫び</strong>：まず率直に謝罪の言葉を述べる</li>
        <li><strong>事実の説明</strong>：何が起きたかを簡潔に（言い訳にしない）</li>
        <li><strong>原因</strong>：わかっている範囲で正直に</li>
        <li><strong>再発防止・対応</strong>：今後どうするかを具体的に</li>
        <li><strong>結び</strong>：改めてお詫びし、理解をお願いする</li>
      </ol>
      <p className="mt-3">スピードも誠意のうちです。事実確認に時間がかかる場合でも、まず「お詫びと現在の状況」を早めに伝えると、相手の不安を和らげられます。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・通常の連絡は <Link href="/tools/ai-email" className="text-violet-600 dark:text-violet-400 hover:underline">AIメール作成</Link></li>
        <li>・お願い・お断りは <Link href="/tools/ai-decline" className="text-violet-600 dark:text-violet-400 hover:underline">AI断り文作成</Link></li>
        <li>・敬語の確認は <Link href="/tools/ai-keigo" className="text-violet-600 dark:text-violet-400 hover:underline">AI敬語変換</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="AI謝罪文作成"
        description="状況を入力するだけで、お詫びメール・謝罪文を自動作成。原因と再発防止まで含んだ文面を下書きします。"
        icon="🙏"
        slug="ai-apology"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="apology" generateLabel="謝罪文を作成する" resultLabel="謝罪文の下書き" />
      </ToolLayout>
    </>
  );
}
