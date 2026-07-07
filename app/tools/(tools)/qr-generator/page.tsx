import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { QrGenerator } from "./QrGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "QRコード作成【無料・登録不要】URLやテキストから即生成｜色変更・PNG/SVG保存",
  description: "URL・テキスト・Wi-Fi情報からQRコードを無料で作成。色のカスタマイズ、PNG・SVG形式でのダウンロードに対応。有効期限なし・商用利用OK・ブラウザ完結でデータは外部に送信されません。",
  path: "/tools/qr-generator",
  keywords: ["QRコード 作成 無料","QRコード 生成","QRコード 作り方","URL QRコード 変換","QRコード 無料 登録不要 安全"],
  ogImage: `/api/og?${new URLSearchParams({ title: "QRコード作成", icon: "📱", desc: "URL・テキストからQRコードを即生成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "QRコードを無料で作る方法は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにURLやテキストを入力するだけで即座にQRコードを生成できます。PNG・SVG形式でダウンロードでき、登録・インストール不要で完全無料です。" },
    },
    {
      "@type": "Question",
      name: "QRコードの色を変えることはできますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。前景色（QRのドット色）と背景色をそれぞれカスタマイズできます。ブランドカラーに合わせたQRコードを作成できます。ただし、コントラスト比が低いと読み取りにくくなるため注意してください。" },
    },
    {
      "@type": "Question",
      name: "WiFiのQRコードはどうやって作りますか？",
      acceptedAnswer: { "@type": "Answer", text: "「WiFi」タブに切り替え、SSIDとパスワード・セキュリティ方式を入力するだけで、スマホのカメラで読み取るとWiFiに自動接続できるQRコードを生成できます。" },
    },
    {
      "@type": "Question",
      name: "作ったQRコードはいつまで使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "生成したQRコードは期限なく使い続けられます。このツールはQRコードをサーバーで管理しないため、ダウンロード後はオフラインでも使用できます。" },
    },
    {
      "@type": "Question",
      name: "SVGとPNGどちらをダウンロードすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "印刷物やパンフレット向けにはSVG（ベクター形式、拡大しても劣化なし）が適しています。ウェブや資料への貼り付けにはPNGが汎用的で使いやすいです。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">QRコード生成ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        URLやテキストを入力するだけで即座にQRコードを作成できます。PNG・SVG両形式でダウンロード可能で、前景色・背景色のカスタマイズにも対応しています。生成したQRコードは期限なく使い続けられます。アカウント登録・インストール不要で、今すぐ無料でお使いいただけます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">QRコードの活用場面</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ウェブサイトURL：</strong>チラシ・名刺・店頭ポップにQRコードを印刷することで、スマホからワンタップでサイトにアクセスしてもらえます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">SNSアカウント：</strong>InstagramやX（旧Twitter）のプロフィールURLをQRコード化してプロフィール画面や名刺に掲載できます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">Wi-Fi接続：</strong>カフェ・オフィス・民泊などでWi-FiのSSIDとパスワードをQRコードにしておくと、スキャンするだけで接続できて便利です。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">連絡先情報：</strong>電話番号・メールアドレスをQRコード化して名刺に入れると、相手のスマホに直接保存してもらえます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">イベント告知：</strong>申し込みフォームのURL・イベント詳細ページへのリンクをQRコードにしてポスターやDMに掲載できます。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">QRコードが読み取れない場合の対処法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        印刷したQRコードが読み取れない場合は以下の点を確認してください。
      </p>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">コントラストが低い：</strong>前景色と背景色の差が小さいと読み取りにくくなります。黒地に白、または白地に黒が最も確実です。カラーQRコードを使う場合はコントラスト比を十分に確保してください。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">サイズが小さすぎる：</strong>名刺なら1.5cm以上、ポスターなら3cm以上のサイズが推奨です。印刷サイズが小さいとスキャンに失敗しやすくなります。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">汚れ・破損：</strong>QRコードにはエラー訂正機能があり、一部が欠けていても読み取れることがありますが、汚れや破損が大きい場合は再印刷が必要です。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">印刷時の推奨サイズと形式</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        チラシ・名刺・パンフレットへの印刷にはSVG形式でのダウンロードを推奨します。SVGはベクター形式のため、どんなサイズに拡大・縮小しても画質が劣化しません。PNGで印刷する場合はサイズを十分に大きく設定してから書き出してください。画像を一度PDFに貼り付けてから印刷すると、解像度が保たれてきれいに仕上がります。専用の
        <Link href="/tools/wifi-qr" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">WiFi QRコード生成ツール</Link>
        も用意しています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "QRコードに入れられる文字数の上限はありますか？", a: "URLやテキストの文字数が多くなるほどQRコードが複雑になり、読み取りにくくなります。URLは200文字以内、テキストは300文字以内が目安です。短縮URLを使うとシンプルなQRコードになります。" },
          { q: "カラーQRコードは読み取れますか？", a: "はい。ただし前景色と背景色のコントラスト比が十分でないと読み取りに失敗します。特に薄い色同士の組み合わせは避けてください。作成後に実際のスマホカメラで読み取りテストをすることをお勧めします。" },
          { q: "印刷に適したサイズはどのくらいですか？", a: "名刺への掲載なら最低1.5cm角以上、ポスターやチラシなら3cm角以上が推奨です。サイズが小さいと読み取りエラーが増えます。印刷物に合わせて余白も十分に取ってください。" },
          { q: "エラー訂正とは何ですか？", a: "QRコードにはコードの一部が汚れや破損していても読み取れるよう、エラー訂正データが組み込まれています。訂正レベルが高いほど耐性が上がりますが、QRコードが複雑になります。ロゴを中央に重ねる場合は高いエラー訂正レベルを使います。" },
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

export default function QrGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="QRコード生成"
        description="URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。"
        icon="📱"
        slug="qr-generator"
        seoContent={seoContent}
      >
        <QrGenerator />
      </ToolLayout>
    </>
  );
}
