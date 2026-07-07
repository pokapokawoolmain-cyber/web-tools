import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { SnsLinks } from "./SnsLinks";

export const metadata: Metadata = generateMeta({
  title: "SNSリンクまとめページ作成【無料】X・Instagram・TikTokのプロフィールリンクを1つに",
  description: "X・Instagram・TikTok・YouTubeなど複数のSNSリンクをまとめた共有ページを無料で作成。プロフィールの「リンクは1つだけ」問題を解決。登録不要でその場で発行できます。",
  path: "/tools/sns-links",
  keywords: ["SNS リンク まとめ 無料","リンクまとめ 作成","プロフィール リンク まとめ","リットリンク 代わり","SNS まとめページ"],
  ogImage: `/api/og?${new URLSearchParams({ title: "SNSリンクまとめページ作成", icon: "🔗", desc: "SNSリンクをまとめた共有ページを作成" }).toString()}`,
});

const faqs = [
  {
    q: "入力したデータはどこに保存されますか？",
    a: "データはお使いのブラウザ（ローカルストレージ）にのみ保存されます。外部サーバーへのアップロードは一切行いません。そのため、同じURLを別のデバイスで開くと内容が表示されない場合があります。共有用URLにはURLパラメータとしてデータが含まれます。",
  },
  {
    q: "QRコードで友達にシェアできますか？",
    a: "生成されたURLをQRコード化することで、スマホで読み取って即アクセスできます。QRコードの作成は本ツールには含まれていませんが、QRコード生成ツール（当サイト内）を使って生成したURLをQRコードにすることができます。",
  },
  {
    q: "SNSアカウントは何個まで登録できますか？",
    a: "X・Instagram・TikTok・YouTube・LINE・note・その他URLなど、主要SNSを一通り登録できます。URLの長さに制限があるため、入力できる内容には上限がありますが、通常の使い方では問題ありません。",
  },
  {
    q: "生成したページはスマホで見やすいですか？",
    a: "はい、生成されるリンクまとめページはスマートフォンでの表示に最適化されています。インスタグラムのプロフィール欄から開いたときにも、タップしやすいボタン形式でSNSリンクが表示されます。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このツールでできること</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        X（旧Twitter）・Instagram・TikTok・YouTube・LINEなど複数のSNSリンクを1つのページにまとめて、共有用URLをすぐに生成できます。インスタグラムのプロフィール欄には1つしかURLを貼れないため、このツールで作ったリンクまとめページのURLを使えば、フォロワーが複数のSNSに一発でアクセスできるようになります。
        アカウント登録は不要で、入力してすぐ生成できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        名前・プロフィール文・各SNSのIDまたはURLを入力すると、リンクまとめページが自動生成されます。生成されたURLをコピーして、インスタグラムのプロフィール編集画面の「ウェブサイト」欄に貼り付けるだけで完了です。
        名刺や同人誌の奥付に印刷したり、メールの署名に入れたりと、SNSを複数運営している方のあらゆる場面で活用できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Linktreeとの違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Linktreeは海外の有名リンクまとめサービスですが、利用には外部アカウントの登録が必要で、無料プランではデザインのカスタマイズに制限があります。また、データが外部サーバーに保存されるため、サービス終了や規約変更のリスクもあります。
        本ツールはアカウント登録不要で即生成でき、データはURLパラメータまたはブラウザのローカルストレージにのみ保存されます。シンプルに使いたい方に向いています。
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

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="sns-links" title="SNSリンクまとめ" description="複数のSNSリンクをまとめた共有ページを即生成。" />
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
        title="SNSリンクまとめページ生成"
        description="X・Instagram・TikTok・YouTubeなど複数のSNSリンクをまとめた共有ページを即生成。登録不要。"
        icon="🔗"
        slug="sns-links"
        seoContent={seoContent}
      >
        <SnsLinks />
      </ToolLayout>
    </>
  );
}
