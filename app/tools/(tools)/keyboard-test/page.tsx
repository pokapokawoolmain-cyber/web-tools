import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { KeyboardTest } from "./KeyboardTest";

export const metadata: Metadata = generateMeta({
  title: "キーボードテスト【無料】押したキーが光る・反応しないキーを即チェック",
  description:
    "キーボードの全キーが正常に反応するかをブラウザで即チェック。押したキーが光り、一度押したキーは確認済みとして色が残るので、反応しないキーや効かないキーを1つずつ確認できます。同時押し（Nキーロールオーバー）やキーコードの確認にも対応。インストール不要・登録不要・無料。",
  path: "/tools/keyboard-test",
  keywords: [
    "キーボードテスト",
    "キーボード 反応しない 確認",
    "キー 効かない チェック",
    "キーボード チェック",
    "keyboard test",
    "キーコード 確認",
    "Nキーロールオーバー 確認",
    "キーボード 打鍵 テスト",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "キーボードテスト", icon: "⌨️", desc: "押したキーが光る・反応しないキーを即チェック" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "キーボードのどのキーが反応しないか調べられますか？", acceptedAnswer: { "@type": "Answer", text: "はい。キーを押すと画面上の対応するキーが光り、一度押したキーは確認済みとして色が残ります。すべてのキーを順番に押していけば、光らない（反応しない）キーがひと目でわかります。" } },
    { "@type": "Question", name: "同時押し（Nキーロールオーバー）は確認できますか？", acceptedAnswer: { "@type": "Answer", text: "できます。複数のキーを同時に押すと、押している間すべてのキーが光り、同時押しの数も表示されます。ゲーミングキーボードのロールオーバー性能の確認に使えます。" } },
    { "@type": "Question", name: "入力したキーの情報は外部に送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。判定はすべてブラウザ内で完結し、押したキーの情報が外部に送信されることはありません。安心してご利用いただけます。" } },
    { "@type": "Question", name: "光らないキーがあるのは故障ですか？", acceptedAnswer: { "@type": "Answer", text: "PrintScreenやFnキーなど、OSやハードウェアが専有して制御するキーは、ブラウザ側で検知できず光らないことがあります。通常の文字・数字・記号キーが光らない場合は、接触不良や故障の可能性があります。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">キーボードテストの使い方</h2>
      <p>
        キーを押すだけで、画面上の対応するキーが光ります。一度押したキーは<strong>確認済み（緑）</strong>として色が残るので、
        キーを順番に押していけば「どのキーが反応しないか」がひと目でわかります。新しいキーボードの初期チェック、
        中古品の動作確認、「特定のキーが効かない」ときの故障切り分けに便利です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">こんなときに使えます</h2>
      <ul className="space-y-1.5">
        <li>・特定のキーだけ入力できない・反応しないときの切り分け</li>
        <li>・新品・中古キーボードの購入直後の全キー動作チェック</li>
        <li>・ゲーミングキーボードの同時押し（Nキーロールオーバー）性能の確認</li>
        <li>・キーの <code>event.key</code> / <code>event.code</code> / keyCode を調べたいとき（開発用途）</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">キーが反応しないときの対処</h2>
      <ul className="space-y-1.5">
        <li>・USB・Bluetoothの接続を挿し直す、または再ペアリングする</li>
        <li>・別のUSBポートやパソコンで試して、キーボード側かPC側かを切り分ける</li>
        <li>・キーの隙間のゴミやホコリをエアダスターで除去する</li>
        <li>・ドライバーの再インストール、OSの再起動を試す</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・マウスのボタン・ホイールを確認する <Link href="/tools/mouse-test" className="text-violet-600 dark:text-violet-400 hover:underline">マウステスト</Link></li>
        <li>・マイクの入力を確認する <Link href="/tools/mic-test" className="text-violet-600 dark:text-violet-400 hover:underline">マイクテスト</Link></li>
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
        title="キーボードテスト"
        description="押したキーが光り、反応しないキーを1つずつ確認できるブラウザ完結のキーボード診断。同時押し・キーコード確認にも対応。"
        icon="⌨️"
        slug="keyboard-test"
        seoContent={seoContent}
      >
        <KeyboardTest />
      </ToolLayout>
    </>
  );
}
