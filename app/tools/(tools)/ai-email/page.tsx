import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "AIメール作成｜ビジネスメールの文面を用途・相手別に自動作成【無料】",
  description:
    "依頼・お礼・日程調整・報告・督促など、ビジネスメールの文面を用途と相手を選ぶだけで自動作成。件名・宛名・挨拶・本文・結び・署名までそろった下書きをすぐにコピーできます。登録不要・ブラウザ完結。",
  path: "/tools/ai-email",
  ogImage: `/api/og?${new URLSearchParams({ title: "AIメール作成", icon: "✉️", desc: "依頼・お礼・日程調整など、ビジネスメールの文面を用途と相" }).toString()}`,
  keywords: ["AI メール 作成", "ビジネスメール 例文 自動作成", "メール 文面 作成 無料", "お礼メール 作成", "依頼メール テンプレート"],
});

const fields: AiField[] = [
  {
    type: "select", name: "purpose", label: "メールの用途",
    options: ["依頼", "お礼", "日程調整", "報告", "相談", "督促"].map((v) => ({ value: v, label: v })),
  },
  {
    type: "select", name: "recipient", label: "送る相手",
    options: [
      { value: "取引先", label: "社外の取引先" },
      { value: "初めて", label: "初めて連絡する相手" },
      { value: "上司", label: "社内の上司" },
      { value: "同僚", label: "社内の同僚" },
    ],
  },
  {
    type: "select", name: "tone", label: "文体",
    options: [
      { value: "丁寧", label: "丁寧（社外・目上向け）" },
      { value: "標準", label: "標準" },
      { value: "簡潔", label: "簡潔（社内向け）" },
    ],
  },
  { type: "text", name: "recipientName", label: "相手の会社名（任意）", placeholder: "例：株式会社サンプル" },
  {
    type: "textarea", name: "body", label: "伝えたい要件", rows: 5,
    placeholder: "例：来週の打ち合わせを30分ほど早めていただけないか相談したい。候補は火曜10時か水曜14時。",
    hint: "箇条書きでも構いません。最初の行が件名の一部にも使われます。",
  },
  { type: "text", name: "sender", label: "差出人の名前（任意）", placeholder: "例：山田 太郎 / 株式会社◯◯ 営業部" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "作成したメールはそのまま送れますか？", acceptedAnswer: { "@type": "Answer", text: "件名・宛名・挨拶・本文・結び・署名までそろった下書きが作成されます。会社名・宛名・日時などの固有情報を確認し、必要に応じて調整してから送信してください。" } },
    { "@type": "Question", name: "AIメール作成は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。処理はすべてブラウザ内で完結し、入力した内容が外部に送信されることはありません。" } },
    { "@type": "Question", name: "社内向けのくだけたメールも作れますか？", acceptedAnswer: { "@type": "Answer", text: "「送る相手」で上司・同僚を選び、「文体」を簡潔にすると、社内向けの短めの文面になります。用途に応じて使い分けてください。" } },
    { "@type": "Question", name: "お礼メールや断りのメールも作れますか？", acceptedAnswer: { "@type": "Answer", text: "お礼は用途で「お礼」を選べます。断りの文面は専用の断り文作成ツール、謝罪はお詫び文作成ツールをご利用ください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AIメール作成ツールの使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>用途（依頼・お礼・日程調整など）と送る相手を選ぶ</li>
        <li>伝えたい要件を箇条書きでも構わないので入力する</li>
        <li>「文章を作成する」を押すと、件名から署名までそろった下書きが表示される</li>
        <li>固有名詞・日時を確認し、コピーしてメールソフトに貼り付ける</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ビジネスメールで押さえたい型</h2>
      <p>読みやすいビジネスメールは、①件名で用件がわかる ②宛名と挨拶 ③要件（結論から） ④依頼やお願い ⑤結びと署名、という流れが基本です。本ツールはこの型に沿って自動で組み立てるため、書き出しに迷う時間を減らせます。要件は「何を・いつまでに・どうしてほしいか」を意識して入力すると、そのまま使える文面に近づきます。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・断りたいときは <Link href="/tools/ai-decline" className="text-violet-600 dark:text-violet-400 hover:underline">AI断り文作成</Link></li>
        <li>・謝罪・お詫びは <Link href="/tools/ai-apology" className="text-violet-600 dark:text-violet-400 hover:underline">AI謝罪文作成</Link></li>
        <li>・敬語に自信がないときは <Link href="/tools/ai-keigo" className="text-violet-600 dark:text-violet-400 hover:underline">AI敬語変換</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="AIメール作成"
        description="用途と相手を選んで要件を入力するだけで、ビジネスメールの文面を自動作成。件名から署名までまとめて下書きします。"
        icon="✉️"
        slug="ai-email"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="email" generateLabel="メールを作成する" resultLabel="メール下書き" />
      </ToolLayout>
    </>
  );
}
