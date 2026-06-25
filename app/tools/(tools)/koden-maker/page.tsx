import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { KodenMaker } from "./KodenMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "香典袋表書きメーカー",
  "御霊前・御仏前・御香典など宗派別に表書きを作成。毛筆風フォント・PDF保存・スマホ完結。",
  "koden-maker",
  ["香典袋 書き方", "表書き 印刷", "御霊前 名前 印刷", "御仏前 書き方", "香典 表書き 無料"]
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
