import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpeakerTest } from "./SpeakerTest";

export const metadata: Metadata = generateMeta({
  title: "スピーカーテスト【無料】左右(L/R)の音をブラウザでチェック｜イヤホン確認",
  description:
    "スピーカーやイヤホンの左右（L/R）が正しく鳴るかをブラウザで即チェック。左・右・両方のテスト音を再生し、片方が鳴らない・左右が逆などの不具合を確認できます。アプリ不要・登録不要・無料。オーディオ結線の確認に。",
  path: "/tools/speaker-test",
  keywords: [
    "スピーカーテスト",
    "イヤホン 左右 確認",
    "スピーカー 左右 テスト",
    "音 左右 確認",
    "speaker test",
    "ヘッドホン 左右 確認",
    "L R 確認 音",
    "スピーカー 動作確認",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "スピーカーテスト", icon: "🔊", desc: "左右(L/R)の音をブラウザでチェック" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "スピーカーの左右はどうやって確認しますか？", acceptedAnswer: { "@type": "Answer", text: "「左（L）」「右（R）」「両方」のボタンを押すと、その方向からテスト音が鳴ります。左を押して左から、右を押して右から聞こえれば正常です。片方だけ鳴らない場合は接続や故障を確認してください。" } },
    { "@type": "Question", name: "左を押したのに右から聞こえます。", acceptedAnswer: { "@type": "Answer", text: "ケーブルやコネクタの左右が逆になっているか、OS・アプリのオーディオ設定でチャンネルが入れ替わっている可能性があります。イヤホンの装着（LとRの向き）もあわせて確認してください。" } },
    { "@type": "Question", name: "音が全く鳴りません。", acceptedAnswer: { "@type": "Answer", text: "端末やブラウザのタブがミュートになっていないか、音量が上がっているか、出力先（内蔵スピーカー／イヤホン／Bluetooth機器）が正しく選ばれているかを確認してください。" } },
    { "@type": "Question", name: "スマホでも使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザでも利用できます。イヤホンやBluetoothスピーカーを接続した状態でもテストできます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">スピーカーテストの使い方</h2>
      <p>
        「左（L）」「右（R）」「両方」のボタンを押すと、その方向のスピーカー／イヤホンから440Hzのテスト音が鳴ります。
        <strong>左右が正しく分かれているか</strong>、片方が鳴らないかを耳で確認できます。新しいイヤホンの動作確認、
        オーディオ機器の結線チェック、左右の聞こえ方の比較などに使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">音が正しく鳴らないときの確認</h2>
      <ul className="space-y-1.5">
        <li>・端末・ブラウザのタブがミュートになっていないか、音量が十分か</li>
        <li>・出力先（内蔵スピーカー／有線イヤホン／Bluetooth）が正しく選ばれているか</li>
        <li>・イヤホンのLとRを正しく装着しているか</li>
        <li>・片方だけ鳴らない場合は、プラグの差し込み・断線・故障を確認する</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・マイクの入力を確認する <Link href="/tools/mic-test" className="text-violet-600 dark:text-violet-400 hover:underline">マイクテスト</Link></li>
        <li>・カメラの映像を確認する <Link href="/tools/webcam-test" className="text-violet-600 dark:text-violet-400 hover:underline">Webカメラテスト</Link></li>
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
        title="スピーカーテスト"
        description="スピーカー・イヤホンの左右（L/R）が正しく鳴るかをブラウザで確認。左・右・両方のテスト音を再生。"
        icon="🔊"
        slug="speaker-test"
        seoContent={seoContent}
      >
        <SpeakerTest />
      </ToolLayout>
    </>
  );
}
