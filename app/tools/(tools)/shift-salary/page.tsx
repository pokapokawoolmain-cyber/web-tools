import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { ShiftSalary } from "./ShiftSalary";

export const metadata: Metadata = generateMeta({
  title: "シフト給与計算ツール【無料】時給×勤務時間で月収を自動計算・深夜割増25%対応",
  description:
    "時給・1日の勤務時間・深夜時間・月の勤務日数を入力するだけで、アルバイト・パートの月収を自動計算。深夜割増賃金（25%増し）・交通費にも対応。登録不要・スマホ対応の無料ツール。",
  path: "/tools/shift-salary",
  keywords: [
    "シフト 給与計算",
    "バイト 給料 計算",
    "時給 月収 計算",
    "アルバイト 月収 シミュレーション",
    "深夜手当 計算",
    "パート 収入計算",
    "深夜割増 25%",
  ],
  ogImage: `/api/og?${new URLSearchParams({
    title: "シフト給与計算",
    icon: "⏰",
    desc: "時給×勤務時間で月収を自動計算・深夜割増対応",
  }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "深夜手当はどう計算されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "22時〜翌5時の勤務には基本時給の25%増しの深夜割増が適用されます。本ツールでは深夜時間を入力すると自動で割増計算されます。"
    }
  },
  {
    "@type": "Question",
    "name": "交通費も含めて計算できますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。1日あたりの交通費を入力すると、勤務日数分を合算した月収を表示します。交通費は所得税の非課税枠（公共交通機関なら月15万円まで）に収まるのが一般的です。"
    }
  },
  {
    "@type": "Question",
    "name": "扶養の136万円・130万円・178万円の壁は確認できますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "月収の計算結果を12倍すれば年収の目安になります。2026年分は、親や配偶者の扶養控除・配偶者控除の対象になるのが給与収入136万円以下、社会保険の扶養が原則130万円未満、本人に所得税がかかり始めるのが178万円超です。詳しい判定は姉妹ツールの「年収の壁シミュレーター」をご利用ください。"
    }
  },
  {
    "@type": "Question",
    "name": "2026年度の最低賃金はいくらですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "2026年度の地域別最低賃金は全国加重平均で1,177円（前年度から56円の引き上げ）で、10月以降、都道府県ごとに順次発効しています。お住まいの都道府県の金額と発効日は厚生労働省の「地域別最低賃金の全国一覧」で確認し、このツールに入力した時給が下回っていないか比べてみてください。"
    }
  },
  {
    "@type": "Question",
    "name": "計算結果は正確ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "入力された時給・時間に基づく概算です。実際の給与は勤務先の締め日・端数処理・各種手当により異なります。目安としてご活用ください。"
    }
  }
],
};


const faqs = [
  {
    q: "2026年度の最低賃金はいくらですか？",
    a: "2026年度の地域別最低賃金は全国加重平均で1,177円（前年度から56円の引き上げ）で、10月以降、都道府県ごとに順次発効しています。お住まいの都道府県の金額と発効日は厚生労働省の「地域別最低賃金の全国一覧」で確認し、このツールに入力した時給が下回っていないか比べてみてください。",
  },
  {
    q: "深夜割増賃金は何時から何時までが対象ですか？",
    a: "労働基準法第37条により、午後10時から翌朝5時までの労働が深夜割増の対象です。この時間帯は通常の時給に25%以上の割増が必要です。たとえば時給1,200円の場合、深夜帯は最低でも1,500円になります。",
  },
  {
    q: "交通費は所得税の課税対象になりますか？",
    a: "電車・バスなど公共交通機関を利用する場合は月15万円まで非課税です。マイカー通勤の場合は距離に応じて非課税限度額が変わります（2km未満は全額課税）。本ツールでは交通費を月収に加算した総支給額を表示しています。",
  },
  {
    q: "アルバイトでも深夜割増は受けられますか？",
    a: "はい、雇用形態に関係なく労働基準法が適用されるため、パート・アルバイト問わず深夜割増は受けられます。もし支払われていない場合は、未払い残業代として請求できる可能性があります。",
  },
  {
    q: "扶養内に収めたい場合、月収はいくらまでですか？",
    a: "2026年分は、親や配偶者の税金上の扶養（扶養控除・配偶者控除）に入れるのが給与収入136万円以下で、月収の目安は約11万3,000円（136万円 ÷ 12か月）です。社会保険の扶養（原則年収130万円未満）も守るなら月約10万8,000円が目安です。勤務先が従業員51人以上なら、2026年10月から週20時間以上の勤務で年収にかかわらず社会保険に加入します。交通費は原則として給与に含めずに計算し、12月は勤務日数を調整して年間合計を確認しましょう。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">シフト給与計算ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        時給・1日の勤務時間・深夜時間帯（22時〜翌5時）の勤務時間・月の勤務日数・交通費を入力すると、月収の目安をリアルタイムで計算します。
        深夜割増賃金（通常時給の25%増し）も自動的に反映されるため、シフト表を見ながら実際の給与を手軽に確認できます。アルバイト・パートの方が自分の給与明細と照合するのにも使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">深夜割増賃金について</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        労働基準法により、午後10時から翌朝5時までの時間帯は通常時給の25%以上の割増賃金が義務付けられています。たとえば時給1,000円のアルバイトが深夜帯に働く場合、その時間は最低でも時給1,250円になります。
        居酒屋・コンビニ・病院など深夜営業の職場では深夜シフトが多いため、計算を間違えると月収が大きくずれることがあります。本ツールで事前にシミュレーションしておくと安心です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">月収と手取りの関係</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        本ツールが計算するのは税・保険料控除前の「額面月収」です。実際に銀行口座に振り込まれる手取り額は、所得税・住民税・社会保険料が引かれるため、額面の80〜90%程度になります。
        2026年分は給与収入178万円以下なら本人の所得税はかからず、手取り率が上がります。社会保険の加入要件（従業員51人以上の勤務先で週20時間以上など。月8万8,000円の賃金要件は2026年10月に撤廃）に当てはまると社会保険料も引かれるため注意が必要です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">注意点</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        実際の給与は会社の就業規則・雇用契約書の内容によって異なります。残業代・有給休暇の賃金・各種手当（皆勤手当・資格手当など）は本ツールでは計算していません。
        また、月によって勤務日数が変わる場合は毎月入力し直して確認してください。給与明細と数字が大きく異なる場合は、会社に計算方法を確認することをおすすめします。
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
      <JsonLd data={faqSchema} />
      <ToolJsonLd slug="shift-salary" title="シフト給与計算" description="時給・勤務時間・深夜時間を入力して月収を計算。深夜割増・交通費も対応。" />
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
        title="シフト給与計算"
        description="時給・勤務時間・深夜時間・勤務日数を入力して月収を計算。深夜割増・交通費も対応。"
        icon="⏰"
        slug="shift-salary"
        seoContent={seoContent}
      >
        <ShiftSalary />
      </ToolLayout>
    </>
  );
}
