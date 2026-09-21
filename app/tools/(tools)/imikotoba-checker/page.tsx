import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImikotobaChecker } from "./ImikotobaChecker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "忌み言葉チェッカー【無料】結婚式スピーチ・弔辞の原稿をNGワード自動診断",
  description: "結婚式のスピーチや葬儀・法事の挨拶文を貼り付けるだけで、忌み言葉・重ね言葉・忌み数字を自動検出。該当箇所をハイライト表示し、言い換え例も提示します。登録不要・ブラウザ完結・無料。",
  path: "/tools/imikotoba-checker",
  keywords: [
    "忌み言葉 チェック",
    "忌み言葉 一覧",
    "結婚式 スピーチ NGワード",
    "重ね言葉 結婚式",
    "弔辞 忌み言葉",
    "スピーチ原稿 チェック",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "忌み言葉チェッカー", icon: "⚠️", desc: "スピーチ原稿を貼るだけでNGワードを自動検出" }).toString()}`,
});

const faqs = [
  {
    q: "忌み言葉とは何ですか？",
    a: "忌み言葉とは、結婚式や葬儀などの場でその意味や響きが不吉・不謹慎とされ、使用を避けるべき言葉のことです。結婚式では「切れる」「別れる」など離別を連想させる言葉、葬儀では「重ね重ね」「たびたび」など不幸が重なることを連想させる「重ね言葉」が代表的です。",
  },
  {
    q: "重ね言葉はなぜ結婚式でも葬儀でも避けるのですか？",
    a: "重ね言葉（たびたび・重ね重ね・再三など、同じ音や意味を繰り返す言葉）は「物事が繰り返される」ことを連想させます。結婚式では「再婚（離婚を繰り返す）」を、葬儀では「不幸が重なる」ことを連想させるため、どちらの場でも避けるべき言葉とされています。",
  },
  {
    q: "忌み数字とは何ですか？",
    a: "「4」は「死」、「9」は「苦」を連想させることから、結婚式・葬儀のどちらでも縁起の悪い数字（忌み数字）として避けられます。ご祝儀・香典の金額でも4万円・9万円は避けるのが一般的なマナーです。",
  },
  {
    q: "「4日」「9日」のような日付も検出されますか？",
    a: "本ツールは機械的に文字列を検索するため、日付表現の「4日」「9日」なども忌み数字として検出される場合があります（誤検出）。文脈上問題がない場合はそのままで構いません。最終的には人の目で読み返してご確認ください。",
  },
  {
    q: "スピーチ原稿は保存・送信されますか？",
    a: "いいえ。入力したテキストはすべてブラウザ内で処理され、サーバーに送信・保存されることはありません。プライベートなスピーチ原稿でも安心してお使いいただけます。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">忌み言葉チェッカーとは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        結婚式のスピーチや葬儀・法事の挨拶文には、使ってはいけない「忌み言葉（いみことば）」があります。本ツールはスピーチ原稿を貼り付けるだけで、忌み言葉・重ね言葉・忌み数字を自動検出し、該当箇所をハイライト表示。それぞれの言葉が避けられる理由と、言い換え例もあわせて提示します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">結婚式で避けるべき忌み言葉の例</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        結婚式・披露宴のスピーチでは、離別や再婚を連想させる言葉を避けます。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">分類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">避けるべき言葉の例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">理由</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["忌み言葉", "切れる・別れる・離れる・去る・終わる", "離別を連想させる"],
              ["重ね言葉", "たびたび・重ね重ね・再三・再び", "再婚（繰り返し）を連想させる"],
              ["忌み数字", "4（死）・9（苦）", "不吉な音を連想させる"],
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
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">葬儀・法事で避けるべき忌み言葉の例</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        弔辞やお悔やみの挨拶では、不幸が重なることを連想させる言葉と、生死に関する直接的な表現を避けます。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">分類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">避けるべき言葉の例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">言い換え例</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["重ね言葉", "たびたび・重ね重ね・再三・ますます", "何度も／心より／一層"],
              ["忌み言葉", "続く・次々・迷う", "（使わずに言い換える）"],
              ["生死の直接表現", "死ぬ・死亡・生きる", "ご逝去・永眠／ご生前"],
              ["忌み数字", "4（死）・9（苦）", "（数を避けて表現）"],
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
        ※ 浄土真宗など宗派によっては「ご冥福をお祈りします」自体が不適切とされる場合があります。宗派が分かる場合は事前に確認しておくとより丁寧です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">スピーチ・弔辞を用意する際のポイント</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・忌み言葉は「絶対に使ってはいけない」というより「配慮として避ける」ものです。年配の参列者ほど気にする傾向があるため、フォーマルな場では特に注意しましょう。</li>
        <li>・言い換えが難しい場合は、その文自体を別の表現に書き直すのが確実です。</li>
        <li>・原稿ができたら、当日と同じ速さで声に出して読み、時間配分も確認しておくと安心です。</li>
      </ul>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
        結婚式のご祝儀袋は
        <Link href="/tools/shugi-maker" className="text-rose-600 dark:text-rose-400 hover:underline mx-1">祝儀袋表書きメーカー</Link>
        、香典袋は
        <Link href="/tools/koden-maker" className="text-rose-600 dark:text-rose-400 hover:underline mx-1">香典袋表書きメーカー</Link>
        で無料作成できます。
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
        title="忌み言葉チェッカー"
        description="結婚式のスピーチや弔辞の原稿を貼り付けるだけで、忌み言葉・重ね言葉・忌み数字を自動検出。言い換え例も表示します。"
        icon="⚠️"
        slug="imikotoba-checker"
        seoContent={seoContent}
      >
        <ImikotobaChecker />
      </ToolLayout>
    </>
  );
}
