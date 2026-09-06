import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { NengaJimaiMaker } from "./NengaJimaiMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "年賀状じまい・喪中はがき文例メーカー【無料】そのまま使える例文を自動作成",
  description: "年賀状じまい（年賀状の卒業）と喪中はがきの文例を無料で自動作成。理由・続柄を選ぶだけで、そのまま印刷・コピーできる例文が完成。送る時期やマナーも解説。登録不要・スマホ対応。",
  path: "/tools/nenga-jimai-maker",
  keywords: [
    "年賀状じまい 文例",
    "年賀状じまい 例文",
    "喪中はがき 文例",
    "喪中はがき 例文 無料",
    "年賀状じまい テンプレート",
    "年賀状 やめる 文例",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "年賀状じまい・喪中はがき文例", icon: "✉️", desc: "理由を選ぶだけで文例が完成" }).toString()}`,
});

const faqs = [
  {
    q: "年賀状じまいはいつ出せばいいですか？",
    a: "年賀状じまいは、通常の年賀状と同じく元旦に届くよう12月25日頃までに投函するのが一般的です。すでに年賀状のやり取りをしている方全員に「今回（または来年）を最後にする」ことを伝えるため、通常の年賀状シーズンに合わせて送ります。",
  },
  {
    q: "年賀状じまいと喪中はがきの違いは何ですか？",
    a: "年賀状じまいは「今後は年賀状を送るのをやめます」という意思表示で、高齢や身辺整理などが理由です。おめでたい体裁のまま（または落ち着いたデザインで）元旦に届けます。喪中はがきは近親者が亡くなったために「今年は年始の挨拶を控えます」と伝えるもので、相手が年賀状を用意する前の11月中旬〜12月上旬までに届けるのがマナーです。目的も届ける時期も異なります。",
  },
  {
    q: "喪中はがきはいつまでに出せばいいですか？",
    a: "相手が年賀状を準備し始める前、11月中旬から12月上旬までに届くように投函するのが一般的です。12月中旬以降に不幸があった場合は、松の内（1月7日頃）が明けてから「寒中見舞い」として欠礼の挨拶を送ります。",
  },
  {
    q: "年賀状じまいは失礼にあたりませんか？",
    a: "高齢化や年賀状文化の変化を背景に、近年は年賀状じまいをする人が増えており、マナー違反にはあたりません。ただし、これまでの感謝の言葉を添え、今後の連絡手段（メール・SNSなど）に触れると、より丁寧な印象になります。本ツールの文例にはこれらの要素をあらかじめ含めています。",
  },
  {
    q: "喪中はがきに故人の名前を書く必要はありますか？",
    a: "必須ではありませんが、続柄と名前を記載するのが一般的です。年齢（享年）を添えるとより丁寧な印象になります。故人の名前を伏せて「近親者」とだけ書く形式も広く使われており、本ツールではどちらにも対応しています。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">年賀状じまいとは？今、増えている理由</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        年賀状じまいとは、これまで年賀状を送ってきた相手に対して「今後は年賀状での挨拶を控えます」と伝える挨拶状のことです。
        帝国データバンクの2025年12月調査によると、個人の<strong>64.3%がすでに年賀状を出すのをやめており</strong>、さらに14.7%が「今年はやめることを検討している」と回答しています。
        高齢化や郵便料金の値上げ、SNS・メールでの挨拶への移行などが主な理由で、もはや一時的な流行ではなく定着したトレンドといえます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">年賀状じまいと喪中はがきの違い（早見表）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        どちらも「年始の挨拶をしない」意思を伝える文書ですが、目的・届ける時期・体裁が異なります。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">年賀状じまい</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">喪中はがき</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["理由", "高齢・身辺整理・SNS移行など", "近親者の死去（不幸）"],
              ["届ける時期", "元旦（12/25頃までに投函）", "11月中旬〜12月上旬"],
              ["体裁", "年賀状として（または落ち着いた意匠）", "落ち着いた意匠（慶事の要素は使わない）"],
              ["今後", "以後、年賀状のやり取りを終了", "翌年以降は通常の年賀状に戻ることが多い"],
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
        ※喪中はがきを出したあと、翌年以降も年賀状じまいをする場合は、翌年の年賀状シーズンに改めて年賀状じまいの文例を送るのが自然です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">年賀状じまいの文面に入れるべき3つの要素</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・<strong>これまでの感謝の言葉：</strong>長年の付き合いへのお礼を必ず添えます。</li>
        <li>・<strong>やめる理由（簡潔に）：</strong>「高齢のため」「身辺整理のため」など、詳しすぎない程度に一文で。</li>
        <li>・<strong>今後の連絡手段：</strong>「メールやお電話で」など、関係を絶つのではなく形を変える旨を伝えると印象が良くなります。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">喪中はがきの文面に入れるべき3つの要素</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・<strong>年始の挨拶を控える旨：</strong>「喪中につき新年のご挨拶をご遠慮申し上げます」が定番の書き出しです。</li>
        <li>・<strong>いつ・誰が亡くなったか：</strong>続柄と、あれば享年を添えます（本年○月に他界、のように）。</li>
        <li>・<strong>結びの挨拶：</strong>「明年も変わらぬご交誼のほどお願い申し上げます」など、今後も付き合いを続ける意思を示します。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">送るときの注意点</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        年賀状じまいは、これまで年賀状のやり取りがあった相手全員に、一律に送るのが基本です。特定の相手だけを除外すると角が立つことがあるため注意しましょう。
        喪中はがきは、相手が年賀状の準備を始める前に届くよう、11月中旬〜12月上旬の投函が理想です。12月中旬以降に不幸があった場合は、無理に喪中はがきを出さず、松の内が明けてから「寒中見舞い」として欠礼を伝える方法もあります。
        法要関連の書類は
        <Link href="/tools/houyou-calculator" className="text-rose-600 dark:text-rose-400 hover:underline mx-1">四十九日・法要日程 自動計算</Link>
        や
        <Link href="/tools/koden-maker" className="text-rose-600 dark:text-rose-400 hover:underline mx-1">香典袋表書きメーカー</Link>
        もあわせてご利用ください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
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
        title="年賀状じまい・喪中はがき文例メーカー"
        description="年賀状じまい・喪中はがきの文例を無料で自動作成。理由・続柄を選ぶだけで、そのまま使える例文が完成します。"
        icon="✉️"
        slug="nenga-jimai-maker"
        seoContent={seoContent}
      >
        <NengaJimaiMaker />
      </ToolLayout>
    </>
  );
}
