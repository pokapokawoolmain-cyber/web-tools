import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateToolMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Furusato } from "./Furusato";

export const metadata: Metadata = generateToolMeta(
  "ふるさと納税シミュレーター（詳細版）",
  "年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。推奨寄付額もわかる。",
  "furusato",
  ["ふるさと納税", "控除上限", "年収別計算", "配偶者控除", "扶養控除"]
);

const faqs = [
  {
    q: "詳細版と簡易版の違いは何ですか？",
    a: "簡易版は年収だけを入力して大まかな上限額を出します。詳細版は配偶者控除・扶養控除の有無まで入力できるため、実際の税負担に近い精度で控除上限を計算できます。家族構成が複雑な方は詳細版を使うことを強くおすすめします。",
  },
  {
    q: "控除上限を超えて寄付するとどうなりますか？",
    a: "上限を超えた分は控除の対象外になり、純粋な自己負担となります。たとえば上限が5万円の人が8万円寄付すると、2,000円の自己負担に加えて3万円が単純な支出になります。上限ギリギリを狙うのが最もお得です。",
  },
  {
    q: "ワンストップ特例の申請期限はいつですか？",
    a: "寄付した翌年の1月10日（必着）が期限です。自治体によっては年末ギリギリの寄付だと間に合わない場合もあるため、12月中旬までに申し込むと安心です。なお、5自治体を超えた場合はワンストップ特例が使えず確定申告が必要になります。",
  },
  {
    q: "このシミュレーターの計算結果は正確ですか？",
    a: "総務省の計算式をもとに算出していますが、あくまで目安です。実際の控除額は住民税の所得割額や医療費控除など他の控除との組み合わせで変わります。正確な上限を知りたい場合は、ふるさと納税ポータルサイトのシミュレーターや税務署にご確認ください。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">詳細版と簡易版の違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        ふるさと納税の控除上限を計算するツールには「簡易版」と「詳細版」の2種類があります。簡易版は年収だけを入力して大まかな上限額を出すのに対し、詳細版は配偶者控除・扶養控除の有無まで加味した精密な計算が可能です。
        たとえば年収600万円の人でも、配偶者（専業主婦）がいる場合と共働きの場合では控除上限が数千円単位で変わります。より正確な目安を知りたい方は詳細版を使いましょう。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">控除上限の仕組み</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        ふるさと納税は「寄付金額 − 2,000円」の全額が所得税・住民税から控除される仕組みです。ただし控除には上限があり、年収や扶養人数によって金額が変わります。上限内に収めれば実質2,000円の負担で返礼品が受け取れますが、上限を超えた部分は控除されず自腹になります。
        住民税の所得割額の約20%が上限の目安ですが、計算式は複雑なため本ツールを使って事前にシミュレーションすることをおすすめします。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ワンストップ特例制度について</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        年間の寄付先が5自治体以内であれば、各自治体に「寄附金税額控除に係る申告特例申請書」を提出することで、確定申告なしで住民税控除が受けられます。これがワンストップ特例です。
        一方、6自治体以上に寄付した場合や、医療費控除・住宅ローン控除など他の控除で確定申告が必要な場合は、ふるさと納税分も含めてまとめて確定申告が必要です。申請期限は翌年1月10日必着です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">注意点</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        本ツールの計算結果はあくまで目安です。実際の控除額は住民税の所得割額・他の控除の有無・自治体の計算方法などによって異なります。
        年末に駆け込みで寄付する場合は、ワンストップ特例の申請書の提出期限（翌年1月10日必着）に注意してください。また、年収が大幅に変動した年は前年の年収をベースに計算すると誤差が生じやすいため、実際の年収見込みで入力してください。
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
      <ToolJsonLd slug="furusato" title="ふるさと納税（詳細版）" description="年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。" />
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
        title="ふるさと納税シミュレーター（詳細版）"
        description="年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。推奨寄付額もわかる。"
        icon="🎁"
        slug="furusato"
        seoContent={seoContent}
      >
        <Furusato />
      </ToolLayout>
    </>
  );
}
