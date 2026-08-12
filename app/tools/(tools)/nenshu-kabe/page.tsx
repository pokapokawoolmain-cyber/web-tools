import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { NenshuKabe } from "./NenshuKabe";

export const metadata: Metadata = generateMeta({
  title: "年収の壁シミュレーター【2026年最新】106万廃止・130万・178万の壁をまとめて判定",
  description:
    "パート・アルバイトの年収を入力するだけで、超える壁・超えない壁を自動判定。106万円の壁撤廃（2026年10月）・130万円・136万円・178万円など2026年の制度変更に対応。社会保険加入の要否もわかる。無料・登録不要。",
  path: "/tools/nenshu-kabe",
  ogImage: `/api/og?${new URLSearchParams({ title: "年収の壁シミュレーター", icon: "🚧", desc: "パート・アルバイトの年収から超える壁・社会保険加入の要否" }).toString()}`,
  keywords: [
    "年収の壁 2026",
    "106万の壁 いつ廃止",
    "130万の壁 計算",
    "178万の壁",
    "年収の壁 シミュレーション",
    "扶養 年収 いくらまで 2026",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "106万円の壁はいつ廃止されますか？",
      acceptedAnswer: { "@type": "Answer", text: "106万円の壁（社会保険加入の賃金要件）は2026年10月に撤廃される予定です。撤廃後は「週20時間以上」の労働時間要件で社会保険への加入が判定されるようになります。" },
    },
    {
      "@type": "Question",
      name: "130万円を超えたらどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "配偶者などの社会保険上の扶養から外れ、ご自身で社会保険（または国民健康保険・国民年金）に加入する必要があります。2026年4月からは一時的な収入増では扶養から外れないよう、労働契約書ベースで判定される仕組みに変わります。" },
    },
    {
      "@type": "Question",
      name: "働き損になるゾーンはありますか？",
      acceptedAnswer: { "@type": "Answer", text: "130万円を少し超えて社会保険料の負担が生じると、一時的に手取りが減る「働き損」ゾーンが生じることがあります。目安として年収150万円前後まで働くと、社会保険料を払っても手取りが回復するとされています。" },
    },
    {
      "@type": "Question",
      name: "178万円の壁とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "2026年の税制改正で引き上げられた所得税の非課税ラインです。基礎控除と給与所得控除の引き上げにより、年収178万円まで所得税がかからなくなります。ただし毎月の給与天引き（源泉徴収）への反映は令和9年1月以降で、2026年中は年末調整で精算されます。" },
    },
    {
      "@type": "Question",
      name: "2026年の年収の壁の変更点まとめは？",
      acceptedAnswer: { "@type": "Answer", text: "①106万円の壁（賃金要件）が2026年10月に撤廃 ②130万円の壁が2026年4月から労働契約ベースの判定に ③所得税の扶養が123万→136万円に ④配偶者特別控除の満額要件が160万→169万円に ⑤所得税の非課税ラインが178万円に引き上げ、が主な変更点です。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2026年「年収の壁」一覧</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">壁</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">何の壁か</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2026年の変更点</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["100万円", "住民税が発生し始める（自治体により93〜100万円）", "住民税の非課税ラインは2026年度は約110万円に"],
              ["106万円", "社会保険加入の賃金要件（従業員51人以上）", "2026年10月に撤廃 → 週20時間以上で判定へ"],
              ["123万円", "本人の所得税がかかり始める", "基礎控除等の引き上げで変動"],
              ["130万円", "配偶者等の社会保険の扶養から外れる", "2026年4月から労働契約ベースで判定"],
              ["136万円", "配偶者控除（満額）を受けられる配偶者の所得", "123万→136万円に引き上げ"],
              ["169万円", "配偶者特別控除（満額）を受けられる上限", "160万→169万円に引き上げ"],
              ["178万円", "所得税の非課税ライン", "基礎控除引き上げで103万→178万円に（源泉反映は令和9年〜）"],
            ].map(([wall, what, change], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{wall}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{what}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px] text-slate-500 dark:text-zinc-500">{change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">
        ※ 2026年7月時点の制度に基づきます。年収の壁は税制・社会保険制度の改正で変動します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある誤解</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・<strong>「壁を1円でも超えたら大損」ではない</strong>：所得税は超えた分にのみ課税され、税額はゆるやかに増えます。手取りが逆転するのは主に社会保険料が生じる130万円前後です。</li>
        <li>・<strong>106万円の壁はもうすぐ消える</strong>：2026年10月に賃金要件が撤廃され、週20時間以上勤務かどうかで加入が決まります。</li>
        <li>・<strong>178万円は「手取りが増える壁」</strong>：所得税の非課税枠が広がる改正で、負担が増える壁ではありません。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">正確な手取りを計算する</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        壁を超えて社会保険に加入した場合の実際の手取りは、
        <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">手取り計算ツール</Link>
        で確認できます。「あと少し働くと手取りはいくら増えるか」を知りたい場合は
        <Link href="/tools/takehome-reverse" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">手取り逆算シミュレーター</Link>
        も便利です。
      </p>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="年収の壁シミュレーター"
        description="パート・アルバイトの年収を入力するだけで、超える壁・超えない壁と社会保険加入の要否を判定。2026年の制度変更に対応。"
        icon="🚧"
        slug="nenshu-kabe"
        seoContent={seoContent}
      >
        <NenshuKabe />
      </ToolLayout>
    </>
  );
}
