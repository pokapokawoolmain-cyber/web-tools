import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ShortLink } from "./ShortLink";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "URL短縮 & QR生成",
  "長いURLをコンパクトに整形してQRコードも同時生成。コピー・ダウンロードもワンクリック。",
  "short-link",
  ["URL短縮", "短縮リンク", "QRコード生成", "リンク短縮", "無料"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "短縮したURLはずっと使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールはURLを視覚的に短く整形して表示するツールです。bit.lyのような永続的なリダイレクトURLは生成されません。元のURLにアクセスしたい場合は元のURLをそのまま使用してください。" },
    },
    {
      "@type": "Question",
      name: "生成したQRコードをどうやって印刷しますか？",
      acceptedAnswer: { "@type": "Answer", text: "ダウンロードボタンでPNG画像として保存し、WordやGoogleスライドに貼り付けてから印刷できます。名刺やチラシへの印刷はデザインソフトかWordに貼り付けてご利用ください。" },
    },
    {
      "@type": "Question",
      name: "QRコードが読み取れない場合は？",
      acceptedAnswer: { "@type": "Answer", text: "QRコードが小さすぎると読み取りにくくなります。印刷する場合は2cm×2cm以上のサイズを目安にしてください。また汚れや折り目があると読み取り精度が下がります。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">どんな場面で使う？</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">名刺・チラシへのQRコード印刷：</strong>URLをQRコードに変換してダウンロードし、デザインソフトやWordに貼り付けることで名刺やチラシに印刷できます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">SNSプロフィールへの掲載：</strong>長いURLを短く整形した表示版をコピーしてSNSのプロフィール欄に貼り付けると、すっきりした見た目になります。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">QRコードをスクリーンショットで共有：</strong>生成したQRコードをスクリーンショットして、チャットや資料に貼り付けることで、URLを打ち込まずにアクセスしてもらえます。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">URL短縮について</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        このツールはURLを視覚的に短く整形して表示するためのものです。bit.lyやTinyURLのような「永続的なリダイレクトURL」は生成しません。短縮表示はあくまで見た目の整形であり、表示されたURLはコピー用の参考表示です。実際にリンクとして機能させるには、元のURLをそのまま使用してください。QRコードは元の完全なURLを埋め込んで生成しているため、スキャンすると正しくアクセスできます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "短縮したURLはずっと使えますか？", a: "このツールはURLを視覚的に短く整形して表示するツールです。bit.lyのような永続的なリダイレクトURLは生成されません。元のURLにアクセスしたい場合は元のURLをそのまま使用してください。" },
          { q: "生成したQRコードをどうやって印刷しますか？", a: "ダウンロードボタンでPNG画像として保存し、WordやGoogleスライドに貼り付けてから印刷できます。名刺やチラシへの印刷はデザインソフトかWordに貼り付けてご利用ください。" },
          { q: "QRコードが読み取れない場合は？", a: "QRコードが小さすぎると読み取りにくくなります。印刷する場合は2cm×2cm以上のサイズを目安にしてください。また汚れや折り目があると読み取り精度が下がります。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function ShortLinkPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="URL短縮 & QR生成"
        description="長いURLをコンパクトに整形。QRコードも同時生成します。"
        icon="🔗"
        slug="short-link"
        seoContent={seoContent}
      >
        <ShortLink />
      </ToolLayout>
    </>
  );
}
