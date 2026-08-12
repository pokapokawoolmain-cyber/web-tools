import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AgeCalculator } from "./AgeCalculator";

export const metadata: Metadata = generateMeta({
  title: "年齢計算【無料】生年月日から満年齢・数え年・干支をすぐ計算",
  description:
    "生年月日を入力するだけで、今の満年齢・数え年・干支・星座・生まれてからの日数を自動計算。基準日を変えれば過去や未来の年齢もわかります。履歴書・厄年・還暦などの確認に。無料・登録不要・スマホ対応。",
  path: "/tools/age-calculator",
  keywords: [
    "年齢計算",
    "生年月日 年齢",
    "満年齢 計算",
    "数え年 計算",
    "干支 調べる",
    "何歳 計算",
    "年齢 早見",
    "生まれてから何日",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "年齢計算", icon: "🎂", desc: "生年月日から満年齢・数え年・干支を計算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "満年齢と数え年の違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "満年齢は生まれた日を0歳とし、誕生日ごとに1歳増える数え方です。数え年は生まれた時点を1歳とし、以後は元日（1月1日）ごとに1歳増えます。厄年や長寿祝いなどでは数え年を使うことがあります。" } },
    { "@type": "Question", name: "過去や未来の年齢も計算できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。基準日を変更すると、その日時点での満年齢を計算できます。『入社日に何歳だったか』『成人式の日に何歳か』などの確認に使えます。" } },
    { "@type": "Question", name: "履歴書に書く年齢はどの日付基準ですか？", acceptedAnswer: { "@type": "Answer", text: "履歴書では提出日または記入日時点の満年齢を書くのが一般的です。基準日をその日付に合わせて計算してください。" } },
    { "@type": "Question", name: "厄年や還暦は満年齢と数え年どちらですか？", acceptedAnswer: { "@type": "Answer", text: "厄年は伝統的に数え年で数えることが多く、還暦は満60歳（生まれ年の干支に戻る年）で祝うのが一般的です。地域や神社により異なる場合があります。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">年齢計算ツールの使い方</h2>
      <p>
        生年月日を選ぶと、今日時点の<strong>満年齢</strong>が大きく表示され、あわせて<strong>数え年・干支・星座・生まれてからの日数・次の誕生日まで</strong>もわかります。
        基準日を変えれば、過去のある日や未来のある日に何歳だったか（何歳になるか）も計算できます。履歴書の年齢確認、厄年・長寿祝い、イベントの逆算などに使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">満年齢と数え年の違い</h2>
      <ul className="space-y-1.5">
        <li>・<strong>満年齢：</strong>生まれた日を0歳とし、誕生日が来るたびに1歳増えます。日常や公的書類で使う一般的な年齢です。</li>
        <li>・<strong>数え年：</strong>生まれた時点を1歳とし、以降は元日（1月1日）ごとに1歳増えます。厄年や長寿祝いで使われます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">長寿祝いの年齢早見（数え年）</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">呼び名</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年齢</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">由来・色</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["還暦（かんれき）", "満60歳", "生まれ年の干支に戻る・赤"],
              ["古希（こき）", "数え70歳", "紫"],
              ["喜寿（きじゅ）", "数え77歳", "紫"],
              ["傘寿（さんじゅ）", "数え80歳", "黄（金茶）"],
              ["米寿（べいじゅ）", "数え88歳", "黄（金茶）"],
              ["卒寿（そつじゅ）", "数え90歳", "白"],
              ["白寿（はくじゅ）", "数え99歳", "白"],
            ].map(([name, age, note], i) => (
              <tr key={name} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-slate-700 dark:text-zinc-300">{name}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{age}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・西暦と元号を相互変換する <Link href="/tools/wareki-converter" className="text-violet-600 dark:text-violet-400 hover:underline">西暦・和暦変換</Link></li>
        <li>・2つの日付の差や○日後を求める <Link href="/tools/date-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">日数・日付計算</Link></li>
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
        title="年齢計算"
        description="生年月日から満年齢・数え年・干支・星座・生まれてからの日数を自動計算。基準日を変えれば過去・未来の年齢も。"
        icon="🎂"
        slug="age-calculator"
        seoContent={seoContent}
      >
        <AgeCalculator />
      </ToolLayout>
    </>
  );
}
