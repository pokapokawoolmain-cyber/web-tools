import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { XPostPreview } from "./XPostPreview";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "X投稿プレビュー・改行シミュレーター",
  "X（旧Twitter）投稿の実際の表示をプレビュー。改行・文字数・ハッシュタグの見え方をポスト前に確認。スマホ表示も再現。",
  "x-post-preview",
  ["X 改行", "Twitter 改行確認", "X投稿 シミュレーター", "X 文字数 カウント", "Twitter 投稿 確認"]
);

const faqs = [
  {
    q: "Xの文字数カウントはどのように計算されますか？",
    a: "Xでは日本語・英語・記号にかかわらず1文字として数えます。ただしURLは文字数にかかわらず一律23文字としてカウントされます。絵文字は1〜2文字としてカウントされることがあり、環境によって異なります。無料プランの上限は140文字、X Premium（旧Twitter Blue）加入者は最大25,000文字まで投稿できます。",
  },
  {
    q: "改行はXで正しく反映されますか？",
    a: "はい、Enterキーによる改行はそのままXの投稿に反映されます。ただし連続する空行は最大2行までに自動圧縮されます。投稿前にこのツールでプレビューすることで、実際の見た目を確認できます。",
  },
  {
    q: "ハッシュタグは何個まで使えばいいですか？",
    a: "Xにはハッシュタグの個数制限はありませんが、多すぎるとスパムと判断されリーチが下がる傾向があります。一般的には1〜3個が効果的とされています。ハッシュタグは1文字として数えず、「#」から始まる単語全体が1つのリンクとしてカウントされます。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Xの文字数カウントの仕組み</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        X（旧Twitter）では日本語・英語・記号はすべて1文字としてカウントされます。ただしURLだけは例外で、文字数に関係なく一律23文字としてカウントされます。
        無料ユーザーは140文字が上限、X Premium（旧Twitter Blue）加入者は最大25,000文字まで投稿が可能です。絵文字はUnicode上2文字分を占めるものがあるため、実際の文字数が1個の絵文字でも2文字としてカウントされる場合があります。本ツールでリアルタイムに文字数を確認しながら投稿文を作成できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">プレビューで確認すべきポイント</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        投稿前にプレビューで確認しておきたい主なポイントは3つあります。
        1つ目は改行位置です。パソコンで書いたテキストをそのまま投稿すると、スマホでは改行位置がずれて見えることがあります。スマホ表示でのプレビューは特に重要です。
        2つ目は文字数です。140文字を超えていると投稿できないため、URL・絵文字を含めた正確な文字数を確認してください。
        3つ目はハッシュタグのリンク化です。スペースなしでハッシュタグを続けると意図しない形でリンクが切れることがあります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">文字数を減らすコツ</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        140文字に収まらないときの対策として、まずURLを短縮URLサービス（bit.lyなど）に変換することを検討してください。ただしXはURLを自動的に23文字換算するため、元のURLが長くても短縮不要なケースもあります。
        次に、句読点や接続詞を削って文章を圧縮する方法があります。「〜ということで」→「そのため」のように短い表現に言い換えましょう。
        どうしても収まらない場合は、スレッド形式で複数ツイートに分割することも有効です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ハッシュタグの効果的な使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        ハッシュタグは検索されやすいキーワードを選ぶことが重要です。「#副業」よりも「#副業初心者」のようにニッチなタグの方が、同じ興味を持つ人に届きやすい場合があります。
        個数は1〜3個が目安です。多すぎるとXのアルゴリズムがスパムと判断してインプレッションを下げる可能性があります。投稿内容と関係のないタグを乱用することも避けましょう。
        ハッシュタグは文末にまとめるか、文中の自然な位置に1つ入れるスタイルが読みやすくおすすめです。
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

export default function XPostPreviewPage() {
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
        title="X投稿プレビュー・改行シミュレーター"
        description="X（旧Twitter）投稿の実際の見た目をプレビュー。改行・文字数・ハッシュタグをポスト前に確認できます。"
        icon="𝕏"
        slug="x-post-preview"
        seoContent={seoContent}
      >
        <XPostPreview />
      </ToolLayout>
    </>
  );
}
