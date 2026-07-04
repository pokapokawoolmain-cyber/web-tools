import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShugiMaker } from "./ShugiMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

const title = "祝儀袋 表書きメーカー【無料】御結婚御祝・寿・連名対応｜そのまま印刷OK";
const description =
  "寿・御結婚御祝・御出産御祝など用途別にご祝儀袋の表書きを無料作成。毛筆風フォント・連名対応・中袋の金額（大字）も自動変換。A4印刷・PDF保存・スマホ完結。";

export const metadata: Metadata = generateMeta({
  title,
  description,
  path: "/tools/shugi-maker",
  keywords: [
    "祝儀袋 表書き",
    "ご祝儀袋 書き方",
    "寿 印刷",
    "御結婚御祝 書き方",
    "祝儀袋 名前 印刷",
    "ご祝儀 連名 書き方",
    "御出産御祝 表書き",
    "祝儀袋 テンプレート 無料",
  ],
  ogImage: `/api/og?${new URLSearchParams({
    title: "祝儀袋表書きメーカー",
    icon: "🎊",
    desc: description,
  }).toString()}`,
});

const faqs = [
  {
    q: "水引はどうやって選べばいいですか？",
    a: "結婚祝いは「結び切り（10本・金銀または紅白）」を選びます。一度結ぶとほどけない結び方で「一度きりであってほしい」という意味を込めます。出産・入学・卒業・就職・新築など、何度あっても嬉しいお祝いは「蝶結び（紅白5本または7本）」を選びます。逆に結婚祝いに蝶結びを使うのはマナー違反とされるため注意してください。",
  },
  {
    q: "ご祝儀の金額相場はいくらですか？",
    a: "結婚式の場合、友人・同僚は3万円、兄弟姉妹・親族は5〜10万円、部下や年下の相手には上司として3〜5万円が目安です。出産祝いは友人5千〜1万円・親族1〜3万円、入学祝いは5千〜1万円程度が一般的です。慶事では「4」「9」を含む金額と、割り切れる偶数額（2万円は例外とされることもあります）を避けるのがマナーです。",
  },
  {
    q: "連名の場合はどう書けばいいですか？",
    a: "連名は3名までが基本で、右から目上（年長者）の順に書きます。夫婦連名の場合は夫のフルネームを右に、妻は名前のみを左に書きます。4名以上のグループは代表者のフルネーム＋左に「外一同（他一同）」と書き、全員の名前は別紙に書いて中袋に入れます。本ツールは連名入力欄に対応しています。",
  },
  {
    q: "作成した表書きはどうやって印刷しますか？",
    a: "「印刷・PDF保存」ボタンを押すとブラウザの印刷画面が開き、A4サイズで表書きと中袋の金額をそのまま印刷できます。プリンターがない場合は、印刷画面で「PDFに保存」を選んでPDF化し、コンビニのネットプリント（セブン‐イレブン・ローソン・ファミリーマート）で印刷できます。半紙や短冊に合わせて切り取って使うこともできます。",
  },
  {
    q: "ご祝儀袋の名前は何で書くのが正式ですか？",
    a: "慶事の表書きは濃い黒の毛筆または筆ペンで、楷書ではっきりと書くのが正式です。弔事と違い薄墨は使いません。ボールペンや万年筆は略式とされるため避けましょう。本ツールは毛筆風フォント（Noto Serif JP）で濃墨の太字を再現しており、手書きが苦手な方でも整った表書きを作成できます。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途別の表書き一覧</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        ご祝儀袋の表書きはお祝いの種類によって使い分けます。迷ったら「御祝」がどの慶事にも使える万能な表書きです。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">表書き</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">水引</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["結婚祝い", "寿・御結婚御祝・御祝", "結び切り（10本・金銀/紅白）"],
              ["出産祝い", "御出産御祝・御祝", "蝶結び（紅白5〜7本）"],
              ["入学祝い", "御入学御祝・御祝", "蝶結び（紅白5〜7本）"],
              ["卒業祝い", "御卒業御祝・御祝", "蝶結び（紅白5〜7本）"],
              ["就職祝い", "御就職御祝・御祝", "蝶結び（紅白5〜7本）"],
              ["新築祝い", "御新築御祝・御祝", "蝶結び（紅白5〜7本）"],
              ["お礼", "御礼", "用途に応じて選択"],
              ["お返し", "内祝", "結婚は結び切り／出産等は蝶結び"],
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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ご祝儀の金額相場早見表</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        ご祝儀の金額は相手との関係と自分の立場で決まります。結婚式の相場を中心にまとめました。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">お祝いの種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">相手との関係</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">相場</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["結婚式（披露宴あり）", "友人・同僚", "3万円"],
              ["結婚式（披露宴あり）", "兄弟姉妹・親族", "5〜10万円"],
              ["結婚式（披露宴あり）", "部下・年下（上司として）", "3〜5万円"],
              ["結婚祝い（式なし）", "友人・知人", "1万円"],
              ["出産祝い", "友人・同僚", "5千〜1万円"],
              ["出産祝い", "兄弟姉妹・親族", "1〜3万円"],
              ["入学・卒業・就職祝い", "親族の子など", "5千〜1万円"],
              ["新築祝い", "友人・親族", "5千〜3万円"],
            ].map((row, idx) => (
              <tr key={idx}>
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
        ※慶事では「4」「9」を含む金額を避け、お札は新札を用意します。中袋の金額は「金参萬円」のように大字（旧字体の漢数字）で書くのが正式です。本ツールは金額を入力すると自動で大字に変換します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">水引の種類と選び方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        水引には大きく分けて「結び切り」と「蝶結び」の2種類があります。
        結び切りは一度結ぶとほどけないことから「一度きりであってほしいお祝い」＝結婚祝いに使い、本数は通常の5本より格上の10本（金銀または紅白）を選びます。
        蝶結び（花結び）は何度でも結び直せることから「何度あっても嬉しいお祝い」＝出産・入学・卒業・就職・新築などに使います。
        逆に、結婚祝いに蝶結びを使うと「何度も結婚する」という意味になってしまうため厳禁です。
        また、あわじ結び（鮑結び）は結び切りの一種で、結婚祝いにも一般の御祝にも使える結び方です。
        ご祝儀袋の格は中に包む金額と釣り合わせるのが基本で、1万円程度なら水引が印刷された袋、3万円以上なら実物の水引が付いた袋を選ぶとバランスがよいとされています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">表書き・名前の書き方の基本</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        表書きは水引の上段中央に「寿」「御結婚御祝」などの名目を、下段中央に贈り主のフルネームを名目よりやや小さめに書きます。
        慶事は濃い黒の毛筆・筆ペンで楷書ではっきりと書くのが正式で、弔事のような薄墨は使いません。
        連名の場合は3名までとし、右から目上の順に並べます。夫婦連名は夫のフルネームの左に妻の名前のみを添えます。
        4名以上は代表者名の左に「外一同」と書き、全員の氏名は別紙に書いて中袋に同封します。会社として贈る場合は名前の右側に小さく会社名を入れます。
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

export default function ShugiMakerPage() {
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
        title="祝儀袋表書きメーカー"
        description="寿・御結婚御祝・御出産御祝など用途別のご祝儀袋表書きを無料作成。毛筆風フォント・連名対応・中袋の金額も大字に自動変換。印刷・PDF保存・スマホ完結。"
        icon="🎊"
        slug="shugi-maker"
        seoContent={seoContent}
      >
        <ShugiMaker />
      </ToolLayout>
    </>
  );
}
