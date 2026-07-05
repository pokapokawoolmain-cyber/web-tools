import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "AI敬語変換｜カジュアルな文章をビジネス敬語に自動変換【無料】",
  description:
    "「了解です」「確認してください」などのくだけた表現を、ビジネスで使える丁寧な敬語に自動変換。社外向けの丁寧語から社内向けのやわらかい敬語まで調整できます。メール・チャットの言い換えに。登録不要・ブラウザ完結。",
  path: "/tools/ai-keigo",
  keywords: ["AI 敬語 変換", "敬語 変換 ツール", "丁寧語 言い換え", "ビジネス 敬語 例文", "了解しました 敬語"],
});

const fields: AiField[] = [
  {
    type: "select", name: "mode", label: "変換のタイプ",
    options: [
      { value: "standard", label: "ビジネス標準（丁寧語に整える）" },
      { value: "sonkei", label: "しっかり敬語（社外・目上向け）" },
      { value: "casual", label: "やわらかい敬語（社内向け）" },
    ],
  },
  {
    type: "textarea", name: "body", label: "変換したい文章", rows: 6,
    placeholder: "例：了解です。あとで資料送ります。確認しといてください。",
    hint: "話し言葉やチャットの文面をそのまま貼り付けてください。",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "AI敬語変換はどんなときに使いますか？", acceptedAnswer: { "@type": "Answer", text: "「了解です」「送っておいて」などのくだけた表現を、取引先や上司に送れる丁寧な敬語に整えたいときに使います。メールやチャットの下書きの言い換えに便利です。" } },
    { "@type": "Question", name: "尊敬語と謙譲語も正しくなりますか？", acceptedAnswer: { "@type": "Answer", text: "よく使う表現を中心に丁寧語・敬語へ変換します。「しっかり敬語」を選ぶと尊敬・謙譲寄りの表現になりますが、主語（相手の動作か自分の動作か）によって適切な語が変わるため、最終的にはご確認ください。" } },
    { "@type": "Question", name: "変換した文章はサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。変換はすべてブラウザ内で行われ、入力した文章が外部に送信されることはありません。社外秘の内容も安心してご利用いただけます。" } },
    { "@type": "Question", name: "無料で使えますか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。回数制限もありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある言い換え例</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">くだけた表現</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">ビジネス敬語</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["了解です", "承知いたしました"],
              ["確認してください", "ご確認いただけますでしょうか"],
              ["送ります", "お送りいたします"],
              ["できますか？", "可能でしょうか"],
              ["ごめんなさい", "申し訳ございません"],
              ["いいですか？", "差し支えございませんでしょうか"],
            ].map(([a, b], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{a}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-violet-600 dark:text-violet-400">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">敬語で気をつけたい点</h2>
      <p>丁寧にしようとして「させていただきます」を多用すると、かえって回りくどくなります。相手の動作には尊敬語（ご覧になる・おっしゃる）、自分の動作には謙譲語（拝見する・申し上げる）を使い分けるのが基本です。本ツールは下書きの土台づくりに便利ですが、主語が誰かを意識して最終確認すると、より自然な敬語になります。文章そのものを整えたいときは <Link href="/tools/ai-humanize" className="text-violet-600 dark:text-violet-400 hover:underline">AI文章自然化</Link> もあわせてご利用ください。</p>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="AI敬語変換"
        description="くだけた文章を、ビジネスで使える丁寧な敬語に自動変換。社外向け・社内向けのトーンも選べます。"
        icon="🙇"
        slug="ai-keigo"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="keigo" generateLabel="敬語に変換する" resultLabel="変換結果" />
      </ToolLayout>
    </>
  );
}
