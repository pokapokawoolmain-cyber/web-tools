import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { DateCalculator } from "./DateCalculator";

export const metadata: Metadata = generateMeta({
  title: "日数計算・日付計算【無料】2つの日付の差／○日後の日付を自動計算",
  description:
    "2つの日付の間が何日あるかを計算し、逆に「今日から100日後」「30日前」などの日付も曜日つきで自動計算。イベント・締切・記念日・契約期間の計算に。無料・登録不要・スマホ対応。",
  path: "/tools/date-calculator",
  keywords: [
    "日数計算",
    "日付計算",
    "日にち 計算",
    "何日後 計算",
    "日数 カウント",
    "日付 差 計算",
    "100日後 いつ",
    "経過日数 計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "日数・日付計算", icon: "📅", desc: "日付の差／○日後の日付を計算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "「両端を含む」とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "開始日と終了日の両方を1日として数える方法です。例えば1日から3日までを、含めない場合は2日、含める場合は3日と数えます。契約日数やイベント日数の数え方に合わせて切り替えてください。" } },
    { "@type": "Question", name: "○日後の日付に曜日は出ますか？", acceptedAnswer: { "@type": "Answer", text: "はい。計算結果には「2026年8月20日（木）」のように曜日を付けて表示します。締切やリマインドの確認に便利です。" } },
    { "@type": "Question", name: "月や年の単位でも計算できますか？", acceptedAnswer: { "@type": "Answer", text: "できます。『○日後・○日前』のモードで単位を日・週・か月・年から選べます。か月・年は暦どおりに加算するため、月末などは実在する日付に調整されます。" } },
    { "@type": "Question", name: "入力した日付は外部に送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。計算はすべてブラウザ内で行われ、入力した日付が外部へ送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">日数計算・日付計算ツールの使い方</h2>
      <p>
        このツールは2つのモードを切り替えて使えます。<strong>「2つの日付の差」</strong>では開始日と終了日を選ぶと、その間の日数・週・月・年をまとめて表示します。
        <strong>「○日後・○日前」</strong>では基準日から日・週・か月・年を足し引きした日付を、曜日つきで求められます。
        契約期間、イベントまでのカウントダウン、記念日、締切管理などに活用できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よく使う日数の目安</h2>
      <ul className="space-y-1.5">
        <li>・<strong>100日後：</strong>赤ちゃんのお食い初め（百日祝い）の目安。</li>
        <li>・<strong>49日後：</strong>仏式の四十九日法要の目安（<Link href="/tools/houyou-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">法要計算</Link>で命日から自動計算できます）。</li>
        <li>・<strong>2週間・1か月：</strong>退職の申し出や各種手続きの期限確認に。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・生年月日から年齢を求める <Link href="/tools/age-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">年齢計算</Link></li>
        <li>・西暦と元号を相互変換する <Link href="/tools/wareki-converter" className="text-violet-600 dark:text-violet-400 hover:underline">西暦・和暦変換</Link></li>
        <li>・命日から法要日を計算する <Link href="/tools/houyou-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">四十九日・法要計算</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="日数・日付計算"
        description="2つの日付の差を日数・週・月・年で計算。逆に○日後・○日前の日付も曜日つきで自動計算します。"
        icon="📅"
        slug="date-calculator"
        seoContent={seoContent}
      >
        <DateCalculator />
      </ToolLayout>
    </>
  );
}
