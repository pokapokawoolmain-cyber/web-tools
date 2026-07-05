import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiTextTool, type AiField } from "@/components/tools/AiTextTool";

export const metadata: Metadata = generateMeta({
  title: "ChatGPTプロンプト作成補助｜役割・出力形式・条件を整えたプロンプトを自動生成【無料】",
  description:
    "やりたいことを入力するだけで、役割・依頼内容・出力形式・条件を整理した精度の高いプロンプトを自動生成。ChatGPTやClaude、Geminiにそのまま貼れる形で作成します。登録不要・ブラウザ完結。",
  path: "/tools/prompt-builder",
  keywords: ["ChatGPT プロンプト 作成", "プロンプト テンプレート", "プロンプト 書き方", "AI 指示文 作成", "プロンプトエンジニアリング 初心者"],
});

const fields: AiField[] = [
  {
    type: "textarea", name: "task", label: "AIにやってほしいこと", rows: 4,
    placeholder: "例：新商品の紹介文を作りたい。ターゲットは30代の働く女性。",
    hint: "「何を」「どうしたいか」を具体的に書くほど、良いプロンプトになります。",
  },
  { type: "text", name: "role", label: "AIに与える役割（任意）", placeholder: "例：経験10年のコピーライター" },
  {
    type: "select", name: "format", label: "出力形式",
    options: ["文章", "箇条書き", "表", "ステップ", "コード"].map((v) => ({ value: v, label: v })),
  },
  { type: "text", name: "audience", label: "想定読者・対象（任意）", placeholder: "例：初心者 / 経営者 / 小学生" },
  {
    type: "select", name: "tone", label: "トーン（任意）",
    options: ["指定なし", "丁寧・フォーマル", "親しみやすい", "簡潔・端的", "説得力重視"].map((v) => ({ value: v, label: v })),
  },
  { type: "text", name: "constraints", label: "制約・条件（任意）", placeholder: "例：300文字以内 / 専門用語は避ける" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "良いプロンプトの条件は？", acceptedAnswer: { "@type": "Answer", text: "①AIに役割を与える ②やってほしいことを具体的に書く ③出力形式を指定する ④読者や制約を伝える、の4点がそろうと精度が上がります。本ツールはこの要素を整理した形でプロンプトを組み立てます。" } },
    { "@type": "Question", name: "作ったプロンプトはどのAIで使えますか？", acceptedAnswer: { "@type": "Answer", text: "ChatGPT・Claude・Geminiなど、対話型のAI全般でそのまま使えます。生成されたプロンプトをコピーして、各AIの入力欄に貼り付けてください。" } },
    { "@type": "Question", name: "このツール自体がAIで回答してくれますか？", acceptedAnswer: { "@type": "Answer", text: "本ツールは「AIに渡すプロンプト（指示文）」を整える補助ツールです。回答の生成は、作成したプロンプトをお使いのAIに貼り付けて行ってください。" } },
    { "@type": "Question", name: "無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要です。処理はブラウザ内で完結します。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">プロンプトの精度を上げる4要素</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">要素</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">役割</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["役割", "「あなたは◯◯です」と立場を与えると回答の視点が定まる"],
              ["依頼内容", "何を作る・調べるかを具体的に書く"],
              ["出力形式", "箇条書き・表・手順など、欲しい形を指定する"],
              ["条件・制約", "文字数・読者・避けたい表現などを伝える"],
            ].map(([a, b], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-slate-700 dark:text-zinc-200">{a}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">「良い文章を書いて」のような曖昧な指示より、役割・形式・条件まで書いたプロンプトのほうが、AIの回答は安定して的確になります。慣れないうちは本ツールで型を作り、慣れてきたら自分で調整していくのがおすすめです。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・AIの出力を整えるなら <Link href="/tools/chatgpt-format" className="text-violet-600 dark:text-violet-400 hover:underline">ChatGPT改行整形</Link></li>
        <li>・AIっぽさを消すなら <Link href="/tools/ai-humanize" className="text-violet-600 dark:text-violet-400 hover:underline">AI文章自然化</Link></li>
        <li>・メール文面は <Link href="/tools/ai-email" className="text-violet-600 dark:text-violet-400 hover:underline">AIメール作成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ChatGPTプロンプト作成補助"
        description="やりたいことを入力するだけで、役割・出力形式・条件を整えた精度の高いプロンプトを自動生成。ChatGPT・Claude・Geminiにそのまま使えます。"
        icon="⌨️"
        slug="prompt-builder"
        seoContent={seoContent}
      >
        <AiTextTool fields={fields} generatorKey="prompt" generateLabel="プロンプトを作成する" resultLabel="生成されたプロンプト" />
      </ToolLayout>
    </>
  );
}
