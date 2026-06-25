import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateToolMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Gpa } from "./Gpa";

export const metadata: Metadata = generateToolMeta(
  "GPA計算",
  "科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。",
  "gpa",
  ["GPA計算", "大学 GPA", "成績計算", "単位 GPA", "累積GPA"]
);

const faqs = [
  {
    q: "GPAは何点満点で計算しますか？",
    a: "多くの大学では4.0満点で計算します（A=4, B=3, C=2, D=1, F=0）。ただし大学によっては4.3満点（A+=4.3を含む）や3.0満点など異なる場合があります。本ツールはデフォルトで4.0満点ですが、変換方法を変更することもできます。",
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
        icon="📊"
        slug="gpa"
        seoContent={seoContent}
      >
        <Gpa />
      </ToolLayout>
    </>
  );
}
