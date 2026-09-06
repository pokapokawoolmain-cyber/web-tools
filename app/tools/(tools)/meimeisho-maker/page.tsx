import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { MeimeishoMaker } from "./MeimeishoMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "命名書メーカー【無料】お七夜の命名書を毛筆風に自動作成｜印刷対応",
  description: "赤ちゃんの命名書を無料で自動作成。名前・生年月日・両親の名前を入力するだけで、正式・略式どちらの書式にも対応した命名書が完成。A4印刷対応・登録不要・スマホ完結。",
  path: "/tools/meimeisho-maker",
  keywords: [
    "命名書 作成 無料",
    "命名書 テンプレート",
    "命名書 印刷",
    "お七夜 命名書",
    "命名書 書き方",
    "命名書 手作り",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "命名書メーカー", icon: "👶", desc: "お七夜の命名書を毛筆風に自動作成" }).toString()}`,
});

const faqs = [
  {
    q: "命名書はいつまでに用意すればいいですか？",
    a: "命名書は、生後7日目に行う「お七夜（おしちや）」までに用意するのが伝統的な習わしです。ただし現代では厳密にお七夜当日にこだわらず、生後1〜2週間の間に用意する家庭も多くなっています。退院や里帰りのタイミングに合わせて準備しても問題ありません。",
  },
  {
    q: "命名書はどこに飾りますか？",
    a: "正式には神棚や床の間に飾りますが、近年の住宅事情では神棚がない家庭も多いため、赤ちゃんの枕元やベビーベッドの近く、リビングの壁など、家族の目につく場所に飾るのが一般的です。命名式の写真撮影の背景としても使われます。",
  },
  {
    q: "正式書式と略式書式の違いは何ですか？",
    a: "正式書式は奉書紙を使い、中央に赤ちゃんの名前、右側に「命名」の文字、左側に生年月日・両親の名前・命名した日付を毛筆で書く伝統的な形式です。略式書式はこれを簡略化し、名前と両親の情報を中心にコンパクトにまとめたもので、飾るスペースが限られる場合や、よりカジュアルに残したい場合に選ばれます。本ツールは両方に対応しています。",
  },
  {
    q: "命名書はいつまで飾っておくものですか？",
    a: "厳密な決まりはありませんが、お宮参り（生後1ヶ月頃）までを目安に飾り、その後は成長の記念としてアルバムに保管したり、へその緒と一緒に保管したりする家庭が多いです。神棚がある場合は、そのまま長く飾り続けても問題ありません。",
  },
  {
    q: "字が下手でも自分で書いて大丈夫ですか？",
    a: "命名書は形式よりも赤ちゃんの誕生を祝う気持ちが大切とされており、手書きでも問題ありません。ただし字に自信がない場合は、本ツールのような毛筆風フォントで作成して印刷する方法や、命名書の代筆サービス・専門店への依頼も選択肢になります。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">命名書とは？お七夜との関係</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        命名書とは、赤ちゃんに付けた名前を正式にお披露目するための書面です。生後7日目に行われる「お七夜（おしちや）」という伝統行事の中で、命名書を用意して神棚や床の間に飾り、家族で赤ちゃんの誕生と命名を祝います。
        奉書紙に毛筆で書くのが正式な形式ですが、現代では専用の台紙やテンプレートを使って作成する家庭が増えています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">命名書に書く内容（正式書式）</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">位置</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">記載内容</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["右側", "「命名」の文字"],
              ["中央", "赤ちゃんの名前（大きく書く）"],
              ["中央下・左寄り", "生年月日"],
              ["左側", "父・母の名前（続柄と氏名）"],
              ["左端（一番下）", "命名した日付（お七夜の日付）"],
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
        ※ 正式には奉書紙を上下に三つ折りにし、中央部分に上記の内容を縦書きで記します。本ツールは略式の台紙印刷に対応した内容を再現しています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">お七夜と命名書の準備の流れ</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>・<strong>出生届の提出前に名前を確定：</strong>命名書はお七夜（生後7日目）、出生届は生後14日以内が期限です。</li>
        <li>・<strong>命名書を用意：</strong>手書き、代筆、または本ツールのようなテンプレートで作成します。</li>
        <li>・<strong>お七夜当日：</strong>家族や親族で食事会を開き、命名書をお披露目して赤ちゃんの誕生と健やかな成長を祝います。</li>
        <li>・<strong>記念撮影：</strong>命名書と赤ちゃんを一緒に撮影する「寝相アート」風の写真も人気です。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">出産・お七夜関連の書類もまとめて用意</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        出産内祝いの品物には
        <Link href="/tools/noshi-maker" className="text-amber-600 dark:text-amber-400 hover:underline mx-1">のし紙作成ツール</Link>
        で「内祝」ののし紙を、出産祝いをいただいた際のお礼状には
        <Link href="/tools/shugi-maker" className="text-amber-600 dark:text-amber-400 hover:underline mx-1">祝儀袋表書きメーカー</Link>
        もあわせてご活用ください。
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
        title="命名書メーカー"
        description="赤ちゃんの命名書を毛筆風フォントで無料作成。正式・略式両対応、お七夜にそのまま印刷して飾れます。"
        icon="👶"
        slug="meimeisho-maker"
        seoContent={seoContent}
      >
        <MeimeishoMaker />
      </ToolLayout>
    </>
  );
}
