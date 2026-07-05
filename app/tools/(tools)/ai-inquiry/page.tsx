import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "AI問い合わせ文作成｜企業・店舗・役所への問い合わせメールを自動作成【無料】",
  description:
    "商品・在庫・予約・不具合・請求など、企業や店舗、役所への問い合わせメールを自動作成。用件を入力するだけで、失礼のない丁寧な問い合わせ文を下書きできます。登録不要・ブラウザ完結。",
  path: "/tools/ai-inquiry",
  keywords: ["AI 問い合わせ 文 作成", "問い合わせメール 例文", "問い合わせ 文面 ビジネス", "問い合わせ 書き方 メール", "カスタマーサポート 問い合わせ 例文"],
});

const fields: AiField[] = [
  {
    type: "select", name: "target", label: "問い合わせ先",
    options: [
      { value: "企業", label: "企業・カスタマーサポート" },
      { value: "店舗", label: "店舗・お店" },
      { value: "役所", label: "役所・公的機関" },
    ],
  },
  {
    type: "select", name: "kind", label: "問い合わせの種類",
    options: ["商品", "在庫", "予約", "不具合", "請求", "その他"].map((v) => ({ value: v, label: v })),
  },
  {
    type: "textarea", name: "content", label: "問い合わせ内容", rows: 5,
    placeholder: "例：先月購入した◯◯（注文番号12345）が起動しなくなった。保証期間内のため修理か交換が可能か知りたい。",
    hint: "商品名・注文番号・日付など、わかる情報を書くと回答がスムーズになります。",
  },
  { type: "text", name: "want", label: "希望する回答方法（任意）", placeholder: "例：メール / 電話（平日午後）" },
  { type: "text", name: "sender", label: "あなたの名前（任意）", placeholder: "例：山田 太郎" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "問い合わせメールに書くべき情報は？", acceptedAnswer: { "@type": "Answer", text: "用件に加えて、商品名・注文番号・購入日・利用中のプランなど、相手が状況を把握できる情報を添えると、やり取りの往復が減りスムーズです。本ツールの入力欄にわかる範囲で記入してください。" } },
    { "@type": "Question", name: "役所や店舗への問い合わせにも使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。問い合わせ先で企業・店舗・役所を選べます。宛先の敬称（御中・様）も自動で調整されます。" } },
    { "@type": "Question", name: "作成した文章はそのまま送れますか？", acceptedAnswer: { "@type": "Answer", text: "下書きとしてご利用ください。宛先や固有情報を確認し、必要に応じて調整してから送信してください。" } },
    { "@type": "Question", name: "無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。処理はブラウザ内で完結し、入力内容は外部に送信されません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">回答が早くなる問い合わせのコツ</h2>
      <p>問い合わせは、相手が「誰が・何について・どうしてほしいのか」を一読で把握できると、回答が早くなります。特に不具合や請求の問い合わせでは、<strong>注文番号・購入日・症状（いつから・どうなるか）</strong>を具体的に書くのが有効です。用件を先に、詳細を後に書く順序を意識すると、担当者が状況をつかみやすくなります。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・一般的な連絡は <Link href="/tools/ai-email" className="text-violet-600 dark:text-violet-400 hover:underline">AIメール作成</Link></li>
        <li>・敬語の言い換えは <Link href="/tools/ai-keigo" className="text-violet-600 dark:text-violet-400 hover:underline">AI敬語変換</Link></li>
        <li>・お詫びが必要なときは <Link href="/tools/ai-apology" className="text-violet-600 dark:text-violet-400 hover:underline">AI謝罪文作成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="AI問い合わせ文作成"
        description="企業・店舗・役所への問い合わせメールを自動作成。用件を入力するだけで、失礼のない丁寧な文面を下書きします。"
        icon="📮"
        slug="ai-inquiry"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="inquiry" generateLabel="問い合わせ文を作成する" resultLabel="問い合わせ文の下書き" />
      </ToolLayout>
    </>
  );
}
