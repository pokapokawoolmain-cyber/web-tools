import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { KodenMaker } from "./KodenMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "香典袋表書きメーカー",
  "御霊前・御仏前・御香典など宗派別に表書きを作成。毛筆風フォント・PDF保存・スマホ完結。",
  "koden-maker",
  ["香典袋 書き方", "表書き 印刷", "御霊前 名前 印刷", "御仏前 書き方", "香典 表書き 無料", "香典 相場", "御布施 表書き", "御車代 御膳料 書き方"]
);

const faqs = [
  {
    q: "御霊前と御仏前はどちらを使えばいいですか？",
    a: "四十九日の法要前は「御霊前」、四十九日以降は「御仏前」を使うのが基本です。宗派がわからない場合は「御霊前」か「御香典」が無難です。ただし浄土真宗では「御霊前」を使わず、通夜・葬儀からすべて「御仏前」を使います。",
  },
  {
    q: "香典袋の金額はどのように書けばいいですか？",
    a: "中袋には漢数字（大字）で縦書きするのが正式です。一万円は「壱萬円」、三万円は「参萬円」と書きます。ボールペンや鉛筆は避け、薄墨筆ペンまたは黒の筆ペンを使います。中袋の裏面に住所・氏名を記載するのも忘れないでください。",
  },
  {
    q: "キリスト教・神式の場合は何と書けばいいですか？",
    a: "神式（神道）の場合は「御玉串料」「御榊料」「御霊前」などを使います。キリスト教の場合はプロテスタントは「御花料」、カトリックは「御ミサ料」が一般的ですが「御霊前」「御花料」でも問題ありません。蓮の花が印刷された袋は仏式専用のため、神式・キリスト教では使わないように注意してください。",
  },
  {
    q: "香典の相場はいくらですか？",
    a: "故人との関係と自分の年代によって変わります。目安は、両親10万円（20代は3〜10万円）、兄弟姉妹5万円、祖父母1〜5万円、叔父・叔母1〜3万円、友人・知人5千〜1万円、職場関係5千〜1万円、近所の方3千〜5千円です。年代が上がるほど増額するのが一般的です。「4」「9」を含む金額（4千円・9千円・4万円など）は「死」「苦」を連想させるため避けます。",
  },
  {
    q: "お布施の表書きも作れますか？",
    a: "はい、作成できます。宗派選択で「お布施」を選ぶと「御布施」「御車代」「御膳料」の表書きが選択できます。お布施の相場は通夜・葬儀の読経1回あたり3〜5万円、四十九日や一周忌などの法要は3〜5万円、御車代・御膳料はそれぞれ5千〜1万円が目安です。お布施は僧侶へのお礼のため、薄墨ではなく濃墨で書きます。",
  },
  {
    q: "薄墨で書く理由は何ですか？また、どこで買えますか？",
    a: "薄墨は「悲しみの涙で墨が薄まった」「急いで準備したため墨をすりきれなかった」という弔意を表す慣習です。現代では薄墨筆ペンがコンビニ・100円ショップ・文房具店で販売されており、手軽に入手できます。なお、御霊前の表書きや名前は薄墨で書き、金額記入欄（中袋）は読みやすさのために黒でもかまわないとされています。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">御霊前と御仏前の違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        香典袋の表書きで最も迷いやすいのが「御霊前」と「御仏前」の使い分けです。基本的には四十九日の法要前は「御霊前」、四十九日以降は「御仏前」を使います。
        ただし浄土真宗では、亡くなった方はすぐに仏様になるという考え方から、通夜・葬儀の段階からも「御仏前」を使います。宗派がわからない場合は「御霊前」または「御香典」が最も無難です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">金額の書き方（漢数字・縦書き）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        香典袋の中袋には、縦書きで漢数字（大字）を使って金額を記載するのが正式なマナーです。「一」「二」「三」ではなく「壱」「弐」「参」を用います。
        一万円は「金壱萬円也」、三万円は「金参萬円也」のように書きます。ボールペンや鉛筆は略式なので避け、薄墨の筆ペンか黒の筆ペンを使いましょう。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">宗教別の表書きの違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        仏式（仏教）：「御霊前」「御仏前」「御香典」のいずれかを用途に応じて選びます。
        神式（神道）：「御玉串料」「御榊料」「御霊前」を使います。蓮の花が印刷された袋は仏式専用のため使用不可です。
        キリスト教：プロテスタントは「御花料」、カトリックは「御ミサ料」が一般的です。「御霊前」「御花料」と書かれた白い袋や封筒を使います。
        宗派不明の場合は「御霊前」が最も広く使えます（浄土真宗を除く）。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">香典金額の相場早見表（関係別×年代別）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        香典の金額は「故人との関係の近さ」と「贈る側の年代」で決まります。以下は一般的な目安です。地域や親族間の慣習がある場合はそちらを優先してください。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">故人との関係</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">20代</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">30代</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left text-slate-700 dark:text-zinc-200 font-semibold">40代以上</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            {[
              ["両親", "3〜10万円", "5〜10万円", "10万円"],
              ["兄弟姉妹", "3〜5万円", "5万円", "5万円"],
              ["祖父母", "1万円", "1〜3万円", "3〜5万円"],
              ["叔父・叔母", "1万円", "1〜2万円", "1〜3万円"],
              ["友人・知人", "5千円", "5千〜1万円", "1万円"],
              ["職場関係", "5千円", "5千〜1万円", "1万円"],
              ["近所の方", "3千〜5千円", "3千〜5千円", "5千円"],
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
        ※「4」「9」を含む金額（4千円・9千円・4万円など）は「死」「苦」を連想させるため避けるのがマナーです。お札は新札を避け、やむを得ず新札しかない場合は一度折り目をつけて包みます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">お布施の相場とマナー</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        お布施は読経や戒名をいただいた僧侶へのお礼です。本ツールでは「御布施」「御車代」「御膳料」の表書きにも対応しています。
        相場の目安は、通夜・葬儀の読経1回あたり3〜5万円、四十九日・一周忌などの法要は3〜5万円、僧侶の交通費として渡す「御車代」は5千〜1万円、会食を辞退された際に渡す「御膳料」は5千〜1万円です。
        戒名料は宗派や位（信士・居士・院号など）によって数万円〜数十万円と幅があります。
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        お布施は不祝儀ではなく僧侶へのお礼のため、薄墨ではなく濃墨（黒墨）で書くのが正式です。奉書紙で包むか、白無地の封筒（郵便番号枠のないもの）を使い、水引は不要です。
        渡す際は直接手渡しせず、切手盆（小さなお盆）に載せるか袱紗（ふくさ）の上に置いて差し出すのが丁寧な作法です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">薄墨を使う理由と入手方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        通夜・葬儀の表書きに薄墨を使う慣習は、「悲しみで涙が落ちて墨が薄まった」または「急いで準備したため墨を充分にすれなかった」という弔意を表したものとされています。
        現代では薄墨筆ペンがコンビニ・100円ショップ・文房具店などで広く販売されており、急いでいるときでも手軽に入手できます。急ぎで用意する場合、黒ボールペンよりも薄墨筆ペンの方が作法に沿っています。
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

export default function KodenMakerPage() {
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
        title="香典袋表書きメーカー"
        description="御霊前・御仏前・御香典など宗派別の香典袋表書きを無料作成。毛筆風フォント対応・PDF保存・スマホ完結。"
        icon="🕯️"
        slug="koden-maker"
        seoContent={seoContent}
      >
        <KodenMaker />
      </ToolLayout>
    </>
  );
}
