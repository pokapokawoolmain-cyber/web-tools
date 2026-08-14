import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { WebcamTest } from "./WebcamTest";

export const metadata: Metadata = generateMeta({
  title: "Webカメラテスト【無料】カメラが映るかブラウザで即チェック｜解像度表示",
  description:
    "パソコンやスマホのカメラが正しく映るかをブラウザで即チェック。映像プレビューと解像度を表示し、前面／背面カメラの切り替えにも対応。Web会議・オンライン面接・配信の前の動作確認に。映像は録画・送信されません。無料・登録不要。",
  path: "/tools/webcam-test",
  keywords: [
    "webカメラ テスト",
    "カメラテスト",
    "カメラ 映るか 確認",
    "webカメラ 確認",
    "camera test",
    "カメラ 動作確認",
    "オンライン カメラ チェック",
    "zoom カメラ テスト",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "Webカメラテスト", icon: "📷", desc: "カメラが映るかブラウザで即チェック" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "カメラが正常か、どうやって確認しますか？", acceptedAnswer: { "@type": "Answer", text: "「カメラを起動」でカメラの使用を許可してください。映像が表示されればカメラは正しく動作しています。映らない場合は、カメラの接続や権限設定、他のアプリの使用状況を確認してください。" } },
    { "@type": "Question", name: "映像は録画・保存されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。映像はブラウザ内で表示するだけで、録画・保存・外部送信は一切行いません。ページを閉じるとカメラの使用も解除されます。" } },
    { "@type": "Question", name: "許可したのに映像が出ません。", acceptedAnswer: { "@type": "Answer", text: "Zoomやカメラアプリなど、他のソフトがカメラを使用中だと映像が出ないことがあります。それらを終了してから再度お試しください。ノートPCの物理シャッターやプライバシースイッチがオフになっていないかも確認してください。" } },
    { "@type": "Question", name: "スマホの前面・背面カメラを切り替えられますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「カメラ切替」ボタンで前面（自撮り）と背面カメラを切り替えられます。端末が対応している場合に有効です。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Webカメラテストの使い方</h2>
      <p>
        「カメラを起動」を押し、ブラウザのカメラ使用許可で「許可」を選びます。映像が表示され、あわせて<strong>解像度</strong>も確認できます。
        Web会議（Zoom・Teams・Google Meet）やオンライン面接、ライブ配信の前に、カメラが正しく映るか・明るさや向きが適切かを事前に確認できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">カメラが映らないときの対処</h2>
      <ul className="space-y-1.5">
        <li>・Zoomなど他のアプリがカメラを使用中でないか確認して終了する</li>
        <li>・ノートPCの物理カメラシャッター／プライバシースイッチを確認する</li>
        <li>・ブラウザのアドレスバーのカメラアイコンから許可設定を確認する</li>
        <li>・OSのプライバシー設定でブラウザにカメラアクセスを許可する</li>
        <li>・USBカメラは挿し直す、別のポートで試す</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">プライバシーについて</h2>
      <p>
        本ツールは映像をブラウザ内で表示するだけで、<strong>録画・保存・外部送信は一切行いません</strong>。
        カメラの使用許可はこのページを閉じると自動的に解除されます。安心してご利用いただけます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・マイクの入力を確認する <Link href="/tools/mic-test" className="text-violet-600 dark:text-violet-400 hover:underline">マイクテスト</Link></li>
        <li>・スピーカーの左右を確認する <Link href="/tools/speaker-test" className="text-violet-600 dark:text-violet-400 hover:underline">スピーカーテスト</Link></li>
        <li>・キーボードの全キーを確認する <Link href="/tools/keyboard-test" className="text-violet-600 dark:text-violet-400 hover:underline">キーボードテスト</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Webカメラテスト"
        description="カメラが正しく映るかをブラウザで確認。映像プレビューと解像度表示、前面／背面の切り替えに対応。録画・送信なし。"
        icon="📷"
        slug="webcam-test"
        seoContent={seoContent}
      >
        <WebcamTest />
      </ToolLayout>
    </>
  );
}
