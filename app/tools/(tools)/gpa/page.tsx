import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Gpa } from "./Gpa";

export const metadata: Metadata = generateMeta({
  title: "GPA計算ツール【無料】成績評価から即算出｜4.0・4.3スケール対応",
  description: "科目ごとの成績（秀・優・良・可など）と単位数を入れるだけでGPAを自動計算。4.0スケール・4.3スケールに対応し、奨学金や留学の基準確認に使えます。無料・登録不要・スマホ対応。",
  path: "/tools/gpa",
  keywords: ["GPA 計算","GPA 計算方法","GPA 出し方","大学 成績 GPA 計算","GPA 4.0 換算"],
  ogImage: `/api/og?${new URLSearchParams({ title: "GPA計算ツール", icon: "🎓", desc: "成績と単位数からGPAを自動計算" }).toString()}`,
});

const faqs = [
  {
    q: "GPAは何点満点で計算しますか？",
    a: "4.0満点（または4点満点）で計算する大学が多いですが、評価の名前と点数の対応は大学ごとに異なります。本ツールでは「成績の換算方式」から、S・A・B・C（S=4〜C=1）、A・B・C・D（A=4〜D=1）、A+〜Fの4.3スケール、S=4.5・A=4.0の方式を選べます。成績証明書や学生便覧の換算表に合わせて選んでください。",
  },
  {
    q: "4.3満点のGPAを4.0満点に換算するには？",
    a: "よく使われる方法は2つあります。1つは比例換算で、GPA × 4.0 ÷ 4.3 で求めます（例：3.6 → 約3.35）。もう1つは、A+（4.3）を4.0とみなして計算し直す方法です。本ツールで4.3スケールを選ぶと、両方の値を同時に表示します。どちらを使うかは提出先（大学院・留学先・奨学金団体など）の指定に従ってください。",
  },
  {
    q: "GPAの成績はどのように変換すればよいですか？",
    a: "一般的な変換例はS/A=4、B=3、C=2、D=1、F/E=0です。大学によって「秀・優・良・可・不可」で表される場合は、秀=4、優=3、良=2、可=1、不可=0が基本です。成績証明書に記載されている換算表を確認してください。",
  },
  {
    q: "大学によってGPAの計算方法が違うのですか？",
    a: "はい、GPAの計算方法は大学によって異なります。不合格科目をGPA計算に含めるかどうか、再履修した場合にどちらの成績を使うか、必修と選択で計算を分けるかなど、ルールが大学ごとに設定されています。大学院進学や留学に使う場合は、自大学の公式計算方法を確認してください。",
  },
  {
    q: "GPAを外部（大学院・留学）に提出する際の注意点は？",
    a: "本ツールの計算結果はあくまで自己確認用です。大学院出願・留学・奨学金申請には、大学が発行する「成績証明書」を提出する必要があります。成績証明書には公式のGPAまたは成績一覧が記載されており、自己計算の数値は使えません。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">GPAとは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        GPA（Grade Point Average）とは、各科目の成績を数値化して単位数で加重平均した指標です。たとえば「4単位のA（4点）」と「2単位のC（2点）」があれば、(4×4 + 2×2) ÷ (4+2) = 3.33 がGPAになります。
        単純な平均点と異なり、単位数の多い科目の成績がGPAに強く影響する点が特徴です。単位数の大きい必修科目でしっかり成績を取ることがGPA向上のカギになります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">GPAの使い道</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        GPAは留学申請・国内外の大学院進学・奨学金申請・就職活動など、さまざまな場面で評価材料として使われます。
        海外大学院の出願では多くの場合3.0以上（4.0満点中）が目安とされており、有名校では3.5以上を求めるところもあります。日本の大学院でもGPAや成績を重視する傾向が強まっています。
        就活では成績表を提出する企業も増えており、とくに外資系・コンサル・金融業界ではGPAを参考にする採用担当者もいます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">GPAを上げるには</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        GPAを効率よく上げるには、単位数の多い科目（必修科目など）でAを取ることが最も効果的です。2単位の選択科目でAを取るより、4単位の必修科目でAを取る方がGPAへの貢献度は2倍になります。
        また、落単（不合格）はGPAを大きく下げます。Dでも単位を取得した方がGPA計算では有利なケースが多いため、苦手科目は早めに対策を立ててください。再履修が可能な大学では、不合格科目を再履修して上書きできる場合もあります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4"
          >
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="gpa" title="GPA計算" description="科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <ToolLayout
        title="GPA計算ツール"
        description="科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。"
        icon="🎓"
        slug="gpa"
        seoContent={seoContent}
      >
        <Gpa />
      </ToolLayout>
    </>
  );
}
