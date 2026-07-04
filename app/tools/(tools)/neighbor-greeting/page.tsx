import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { NeighborGreeting } from "./NeighborGreeting";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "工事近隣挨拶文メーカー【無料・コピーOK】解体・新築・リフォーム・外壁塗装の例文テンプレート",
  description: "工事種別・期間・会社情報を入力して近隣挨拶文を即生成。解体・新築・外壁塗装・リフォーム工事に対応。騒音・粉塵・重機などの注意事項も自動挿入。ダウンロード不要・ブラウザで完結・コピー印刷対応。",
  path: "/tools/neighbor-greeting",
  keywords: [
    "工事 近隣 挨拶文",
    "工事 挨拶状 テンプレート",
    "解体工事 挨拶文 テンプレート",
    "近隣挨拶文 例文",
    "工事のお知らせ テンプレート",
    "リフォーム 近隣 挨拶",
    "外壁塗装 近隣 挨拶",
    "近隣 挨拶 工事 無料",
  ],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事近隣挨拶文メーカーの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        工事の種類・住所・期間・作業時間・施工会社情報を入力するだけで、そのまま使えるプロらしい近隣挨拶文が自動生成されます。騒音レベル・重機使用・車両駐車などのチェック項目に応じて適切な説明文が自動挿入されます。ダウンロード不要・登録不要で、生成後すぐコピーまたは印刷できます。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">挨拶のタイミングと範囲の目安</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>・<strong>時期：</strong>工事開始の3〜7日前（遅くとも前日まで）</li>
          <li>・<strong>範囲：</strong>工事現場から半径50〜100m（通常10〜20軒が目安）</li>
          <li>・<strong>粗品：</strong>500〜1,000円程度のタオル・洗剤などを持参すると丁寧</li>
          <li>・<strong>留守時：</strong>挨拶文と名刺をポストに投函し、後日再訪または電話</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事種別の挨拶文例文（書き出し）</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">各工種に応じた挨拶文の書き出し例です。上のツールで詳細を入力すると、完全な文章を自動生成できます。</p>
      <div className="space-y-3 text-sm">
        {[
          {
            type: "解体工事",
            badge: "騒音・粉塵に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の場所におきまして解体工事を行うことになりました。工事期間中は騒音・振動・粉塵が発生し、近隣の皆様には多大なご迷惑をおかけすることと存じます。…",
            note: "防塵シートの設置状況、粉塵の車・洗濯物への飛散リスクを明記すると安心感が高まります。",
          },
          {
            type: "新築工事",
            badge: "重機・長工期に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記住所に新築工事を施工させていただく運びとなりました。工事期間が長期にわたることから、基礎工事・鉄骨建方など各工程において騒音・振動が生じます。…",
            note: "クレーン車の使用日は特に案内を徹底。工期が3か月を超える場合は中間挨拶も検討してください。",
          },
          {
            type: "外壁塗装工事",
            badge: "塗料の臭気・飛散に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の建物にて外壁塗装工事を実施いたします。足場の組立・解体時の騒音および塗料の臭気・飛散について、近隣の皆様には格別のご理解をお願い申し上げます。…",
            note: "洗濯物への塗料飛散はクレームになりやすい点です。養生範囲・施工時間帯を挨拶文に明記してください。",
          },
          {
            type: "リフォーム工事",
            badge: "内容により騒音差あり",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の建物にてリフォーム工事を実施いたします。工事期間中は資材の搬入・搬出や工事音により、皆様にご不便をおかけすることをお詫び申し上げます。…",
            note: "スケルトンリフォームは騒音が大きく、解体工事に準じた内容を記載することをお勧めします。",
          },
        ].map(({ type, badge, example, note }) => (
          <div key={type} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-slate-800 dark:text-zinc-200">【{type}】</p>
              <span className="text-[11px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">{badge}</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-500 text-[12px] italic leading-relaxed mb-2 bg-slate-50 dark:bg-zinc-800 rounded p-3">{example}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-[12px]">💡 {note}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">近隣挨拶文に必ず記載する項目</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">記載項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">記載例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">必要度</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["工事場所", "○○市△△町1-2-3", "必須"],
              ["工事の種類", "外壁塗装工事 / 解体工事 など", "必須"],
              ["工事期間", "2026年8月1日〜8月31日（予定）", "必須"],
              ["作業時間", "平日 8:00〜17:00", "必須"],
              ["施工会社名・担当者", "株式会社〇〇建設　担当：山田", "必須"],
              ["緊急連絡先", "090-XXXX-XXXX（現場担当）", "必須"],
              ["騒音・粉塵の有無", "コンプレッサー使用あり、粉塵対策として防塵シート設置", "推奨"],
              ["重機・クレーン使用予定", "クレーン車使用日：8月5日・8月10日", "推奨"],
              ["駐車場所", "近隣駐車場を使用します", "推奨"],
            ].map(([item, example, level], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500 text-[12px]">{example}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${level === "必須" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"}`}>{level}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "近隣挨拶は法律で義務付けられていますか？", a: "法的な義務ではありませんが、建設業界の慣習として広く行われています。近隣トラブルを未然に防ぐためにも強く推奨されます。特に解体・新築・外壁塗装工事では必須と考えてください。" },
          { q: "留守の場合はどうすればいい？", a: "ポストに挨拶状（文書）と名刺・粗品を置いていく方法が一般的です。訪問した旨のメモも添えると丁寧です。後日電話で一声かけるとなお好印象です。" },
          { q: "マンションの工事の場合は？", a: "掲示板への掲示と管理会社経由の周知が基本です。管理組合・管理会社への事前届出が必要な場合も多いです。本ツールの「マンション大規模修繕」プリセットを選ぶと、掲示用の文面を作成できます。" },
          { q: "生成した文章をそのまま使えますか？", a: "そのまま使えるよう設計しています。実際の工事内容・状況に合わせて必要に応じて修正してください。「追加で伝えたいこと」欄で個別の事情を追記することをお勧めします。" },
          { q: "Word形式でダウンロードできますか？", a: "できます。「Word形式でダウンロード」ボタンから.docファイルとして保存でき、Wordで開いてそのまま編集・印刷できます。無料・登録不要です。コピー・印刷ボタンも利用できます。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
        そのままコピペで使える例文集は<Link href="/blog/construction-greeting-templates" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">工事の近隣挨拶文 例文テンプレート集</Link>へ。解体・新築・リフォーム・外壁塗装の完成例文を掲載しています。
      </p>
    </section>
  </div>
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "工事前の近隣挨拶は法律で義務付けられていますか？",
      acceptedAnswer: { "@type": "Answer", text: "法的な義務ではありませんが、建設業界の慣習として広く行われています。近隣トラブルを未然に防ぐためにも強く推奨されます。特に解体・新築・外壁塗装工事では必須と考えてください。" },
    },
    {
      "@type": "Question",
      name: "工事前の近隣挨拶はいつまでに行えばいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "工事開始の3〜7日前が目安です。遅くとも前日までに済ませてください。対象範囲は工事現場から半径50〜100m（通常10〜20軒）です。" },
    },
    {
      "@type": "Question",
      name: "解体工事の近隣挨拶文に必要な内容は何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "工事場所・工事種別・工事期間・作業時間・施工会社名・担当者・緊急連絡先が必須項目です。解体工事では騒音・振動・粉塵の発生と防塵シートの設置も明記すると安心感が高まります。" },
    },
    {
      "@type": "Question",
      name: "近隣に留守の方がいた場合はどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "ポストに挨拶状（文書）と名刺・粗品を置いていく方法が一般的です。訪問した旨のメモも添えると丁寧です。後日電話で一声かけるとなお好印象です。" },
    },
    {
      "@type": "Question",
      name: "マンションの工事の場合は？",
      acceptedAnswer: { "@type": "Answer", text: "掲示板への掲示と管理会社経由の周知が基本です。本ツールのマンション大規模修繕プリセットを選ぶと、掲示用の文面を作成できます。" },
    },
    {
      "@type": "Question",
      name: "Word形式でダウンロードできますか？",
      acceptedAnswer: { "@type": "Answer", text: "できます。「Word形式でダウンロード」ボタンから.docファイルとして保存でき、Wordでそのまま編集・印刷できます。無料・登録不要です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="工事近隣挨拶文メーカー"
        description="工事の種類・期間・会社情報を入力して近隣挨拶文を自動生成。解体・新築・外壁塗装・リフォーム工事に対応。ダウンロード不要・コピー・印刷対応。"
        icon="📝"
        slug="neighbor-greeting"
        seoContent={seoContent}
      >
        <NeighborGreeting />
      </ToolLayout>
    </>
  );
}
