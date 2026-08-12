import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "AI断り文作成｜角が立たない丁寧な断り方・お断りメールを自動作成【無料】",
  description:
    "誘い・依頼・提案・勧誘を、相手の気分を害さずに丁寧に断る文面を自動作成。感謝＋理由＋代替案の型で、角が立たないお断りメールを下書きできます。登録不要・ブラウザ完結。",
  path: "/tools/ai-decline",
  ogImage: `/api/og?${new URLSearchParams({ title: "AI断り文作成", icon: "🙅", desc: "誘い・依頼・提案を、相手の気分を害さずに丁寧に断る文面を" }).toString()}`,
  keywords: ["AI 断り文 作成", "断り方 メール 例文", "丁寧な 断り方 ビジネス", "お断りメール テンプレート", "誘い 断る 文面"],
});

const fields: AiField[] = [
  {
    type: "select", name: "what", label: "何を断るか",
    options: [
      { value: "依頼", label: "仕事の依頼・お願い" },
      { value: "誘い", label: "誘い・イベント" },
      { value: "見積・提案", label: "見積・提案・営業" },
      { value: "勧誘", label: "勧誘・案内" },
    ],
  },
  {
    type: "select", name: "recipient", label: "相手",
    options: [
      { value: "取引先", label: "取引先・ビジネス相手" },
      { value: "顧客", label: "お客様" },
      { value: "社内", label: "社内・知人" },
    ],
  },
  { type: "text", name: "reason", label: "断る理由（任意）", placeholder: "例：現在の業務が立て込んでいる / 予算の都合" },
  { type: "text", name: "alternative", label: "代替案・次の機会（任意）", placeholder: "例：来月以降 / 別のプランでのご提案" },
  { type: "text", name: "sender", label: "差出人の名前（任意）", placeholder: "例：山田 太郎 / 株式会社◯◯" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "角が立たない断り方のコツは？", acceptedAnswer: { "@type": "Answer", text: "①まず声をかけてくれたことへの感謝を伝える ②理由は簡潔に（詳しすぎない） ③可能なら代替案や次の機会を添える、の3点です。本ツールはこの型で文面を組み立てるため、冷たい印象になりにくくなります。" } },
    { "@type": "Question", name: "理由は正直に書いたほうがいいですか？", acceptedAnswer: { "@type": "Answer", text: "詳しく書きすぎる必要はありません。「諸般の事情により」といったやわらかい表現でも失礼にはあたりません。差し支えない範囲で入力してください（任意です）。" } },
    { "@type": "Question", name: "営業や勧誘を断る文面も作れますか？", acceptedAnswer: { "@type": "Answer", text: "「何を断るか」で見積・提案や勧誘を選べます。今後の連絡を控えてほしい場合は、その旨を一文添えて調整してください。" } },
    { "@type": "Question", name: "無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。処理はブラウザ内で完結し、内容は外部に送信されません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">断り文の基本の型</h2>
      <p>丁寧なお断りは「クッション＋結論＋フォロー」で構成すると角が立ちません。まず<strong>感謝やお礼</strong>（クッション）を述べ、次に<strong>今回は見送る旨</strong>（結論）をはっきり伝え、最後に<strong>次の機会や代替案</strong>（フォロー）を添えます。あいまいな表現で引き延ばすより、丁寧にはっきり断るほうが、結果的にお互いにとって誠実です。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・通常のメールは <Link href="/tools/ai-email" className="text-violet-600 dark:text-violet-400 hover:underline">AIメール作成</Link></li>
        <li>・お詫びが必要なときは <Link href="/tools/ai-apology" className="text-violet-600 dark:text-violet-400 hover:underline">AI謝罪文作成</Link></li>
        <li>・言い回しの敬語は <Link href="/tools/ai-keigo" className="text-violet-600 dark:text-violet-400 hover:underline">AI敬語変換</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="AI断り文作成"
        description="誘い・依頼・提案を、角が立たないように丁寧に断る文面を自動作成。感謝＋理由＋代替案の型で下書きします。"
        icon="🙅"
        slug="ai-decline"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="decline" generateLabel="断り文を作成する" resultLabel="断り文の下書き" />
      </ToolLayout>
    </>
  );
}
