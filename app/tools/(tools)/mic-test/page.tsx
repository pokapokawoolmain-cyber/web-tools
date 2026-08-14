import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { MicTest } from "./MicTest";

export const metadata: Metadata = generateMeta({
  title: "マイクテスト【無料】マイクが使えるかブラウザで即チェック｜音量メーター・波形表示",
  description:
    "マイクが正しく音を拾えているかをブラウザで即チェック。声を出すと音量メーターと波形がリアルタイムで動きます。Web会議・オンライン通話・配信・録音の前の動作確認に。音声は録音・送信されません。インストール不要・登録不要・無料。",
  path: "/tools/mic-test",
  keywords: [
    "マイクテスト",
    "マイク 確認",
    "マイク 使えるか 確認",
    "マイク 音 拾わない",
    "mic test",
    "マイク 動作確認",
    "マイク 反応しない 確認",
    "オンライン マイク チェック",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "マイクテスト", icon: "🎤", desc: "マイクが使えるか音量メーターで即チェック" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "マイクが正常か、どうやって確認しますか？", acceptedAnswer: { "@type": "Answer", text: "「テスト開始」でマイクの使用を許可し、声を出してください。音量メーターと波形が動けばマイクは正しく音を拾えています。全く動かない場合は、マイクの接続やミュート、権限設定を確認してください。" } },
    { "@type": "Question", name: "録音されたり音声が送信されたりしませんか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。音声はブラウザ内でレベルと波形を表示するために解析するだけで、録音・保存・外部送信は一切行いません。ページを閉じるとマイクの使用も解除されます。" } },
    { "@type": "Question", name: "許可したのにメーターが動きません。", acceptedAnswer: { "@type": "Answer", text: "マイクがミュートになっていないか、OSやアプリ側で別のマイクが選ばれていないかを確認してください。複数のマイクがある場合はブラウザの権限設定で使用するマイクを切り替えられます。他のアプリがマイクを占有している場合も拾えないことがあります。" } },
    { "@type": "Question", name: "スマホでも使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザでも利用できます。マイクの使用許可を求められたら「許可」を選んでください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">マイクテストの使い方</h2>
      <p>
        「テスト開始」を押し、ブラウザのマイク使用許可で「許可」を選びます。声を出すと<strong>音量メーターと波形</strong>がリアルタイムに動きます。
        Web会議（Zoom・Teams・Google Meet）やオンライン通話、配信、録音の前に、マイクがきちんと音を拾えるかを確認できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">マイクが反応しないときの対処</h2>
      <ul className="space-y-1.5">
        <li>・マイク本体やヘッドセットのミュートスイッチがオンになっていないか確認する</li>
        <li>・ブラウザのアドレスバーのマイクアイコンから、使用するマイクと許可設定を確認する</li>
        <li>・OSのサウンド設定で入力デバイスと入力音量を確認する</li>
        <li>・Zoomなど他のアプリがマイクを使用中でないか確認する</li>
        <li>・USB・Bluetoothを挿し直す、再ペアリングする</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">プライバシーについて</h2>
      <p>
        本ツールは音声をブラウザ内で解析してメーターと波形を表示するだけで、<strong>録音・保存・外部送信は一切行いません</strong>。
        マイクの使用許可はこのページを閉じると自動的に解除されます。安心してご利用いただけます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・キーボードの全キーを確認する <Link href="/tools/keyboard-test" className="text-violet-600 dark:text-violet-400 hover:underline">キーボードテスト</Link></li>
        <li>・マウスのボタンを確認する <Link href="/tools/mouse-test" className="text-violet-600 dark:text-violet-400 hover:underline">マウステスト</Link></li>
        <li>・回線速度を測る <Link href="/tools/speed-test" className="text-violet-600 dark:text-violet-400 hover:underline">インターネット速度テスト</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="マイクテスト"
        description="声を出すと音量メーターと波形が動く、ブラウザ完結のマイク動作確認ツール。Web会議・配信・録音の前に。音声は録音・送信されません。"
        icon="🎤"
        slug="mic-test"
        seoContent={seoContent}
      >
        <MicTest />
      </ToolLayout>
    </>
  );
}
