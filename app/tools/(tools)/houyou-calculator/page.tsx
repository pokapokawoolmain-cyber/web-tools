import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { HouyouCalculator } from "./HouyouCalculator";

export const metadata: Metadata = generateMeta({
  title: "四十九日・法要日程 自動計算【無料】命日から忌日・年忌法要の日程表を作成",
  description:
    "命日を入力するだけで四十九日・一周忌・三回忌などの法要日程を自動計算。初七日から三十三回忌までの日付と曜日を一覧表示。忌日の数え方・繰り上げ法要・香典の表書きの変わるタイミングも解説。無料・登録不要。",
  path: "/tools/houyou-calculator",
  ogImage: `/api/og?${new URLSearchParams({ title: "四十九日・法要日程 計算", icon: "🪷", desc: "命日を入力するだけで四十九日・一周忌・三回忌などの法要日" }).toString()}`,
  keywords: [
    "四十九日 計算",
    "法要 日程 計算",
    "四十九日 いつ 計算",
    "一周忌 三回忌 計算",
    "年忌法要 早見表",
    "忌日 計算 無料",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "四十九日はどうやって数えますか？",
      acceptedAnswer: { "@type": "Answer", text: "命日を1日目として数え、49日目が四十九日（七七日）です。つまり命日の48日後にあたります。関西の一部では命日の前日から数える風習もあります。本ツールは命日を1日目とする一般的な数え方で計算します。" },
    },
    {
      "@type": "Question",
      name: "三回忌はいつですか？",
      acceptedAnswer: { "@type": "Answer", text: "一周忌は満1年目（翌年の祥月命日）ですが、三回忌以降は「回忌数−1」年後に営みます。三回忌は満2年目、七回忌は満6年目です。数え方が一周忌と異なる点に注意してください。" },
    },
    {
      "@type": "Question",
      name: "繰り上げ法要とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "参列者が集まりやすいよう、算出された正確な日ではなく直前の土曜・日曜に日程を繰り上げて営むことです。近年は初七日を葬儀当日に行う「繰り上げ初七日」も一般的になっています。" },
    },
    {
      "@type": "Question",
      name: "浄土真宗の場合も同じ日程ですか？",
      acceptedAnswer: { "@type": "Answer", text: "日程の数え方は共通ですが、浄土真宗では「亡くなってすぐ仏になる」という教えのため、追善供養ではなく故人を偲び仏法に触れる法要として営みます。表書きも「御仏前」を用います。詳しくは菩提寺にご確認ください。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">忌日法要・年忌法要の数え方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        忌日法要は<strong>命日を1日目</strong>として数えます。四十九日は命日を含めて49日目（命日の48日後）です。一方、年忌法要の一周忌は<strong>満1年後</strong>の祥月命日ですが、三回忌以降は「回忌数−1年後」に営みます（三回忌＝満2年後、七回忌＝満6年後）。この数え方の違いを間違えやすいため、本ツールで正確な日付を確認してください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">忌日法要・年忌法要の早見表</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        法要の名称と、命日からの数え方をまとめました。年忌法要は「回忌数−1年後」に営む点が特に間違えやすいポイントです。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">法要名</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">時期</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">香典表書き</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["初七日", "命日を含めて7日目", "御霊前"],
              ["四十九日（七七日）", "命日を含めて49日目", "御霊前→御仏前"],
              ["一周忌", "満1年後の祥月命日", "御仏前"],
              ["三回忌", "満2年後（死後3年目）", "御仏前"],
              ["七回忌", "満6年後（死後7年目）", "御仏前"],
              ["十三回忌", "満12年後（死後13年目）", "御仏前"],
              ["十七回忌", "満16年後（死後17年目）", "御仏前"],
              ["二十三回忌", "満22年後（死後23年目）", "御仏前"],
              ["二十七回忌", "満26年後（死後27年目）", "御仏前"],
              ["三十三回忌（弔い上げ）", "満32年後（死後33年目）", "御仏前"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} className={`border border-slate-200 dark:border-zinc-700 px-3 py-2 ${i === 0 ? "font-semibold text-slate-700 dark:text-zinc-200" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2">
        ※ 三十三回忌または五十回忌を「弔い上げ」とし、以降は個別の年忌法要を終える地域・宗派が多いです。正確な日付は上のツールに命日を入力して確認してください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">四十九日までにやること</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・本位牌の準備（白木位牌から本位牌へ。四十九日法要で魂入れ）</li>
        <li>・納骨の準備（四十九日に合わせて納骨することが多い）</li>
        <li>・僧侶・会場・会食の手配、参列者への案内</li>
        <li>・香典返し（忌明けの挨拶状を添えて返礼）の準備</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">香典の表書きは四十九日で変わります</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        四十九日を境に、香典の表書きは「御霊前」から「御仏前」へと変わります（故人が仏になるとされるため）。四十九日以降の法要に持参する不祝儀袋は「御仏前」を用います。表書きは
        <Link href="/tools/koden-maker" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">香典表書きメーカー</Link>
        で無料作成できます。お布施の「御布施」「御車代」「御膳料」にも対応しています。
      </p>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="四十九日・法要日程 自動計算"
        description="命日を入力するだけで四十九日・一周忌・三回忌などの法要日程を自動で計算。忌日・年忌の日付と曜日を一覧表示します。"
        icon="🪷"
        slug="houyou-calculator"
        seoContent={seoContent}
      >
        <HouyouCalculator />
      </ToolLayout>
    </>
  );
}
