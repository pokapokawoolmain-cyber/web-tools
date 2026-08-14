import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { MouseTest } from "./MouseTest";

export const metadata: Metadata = generateMeta({
  title: "マウステスト【無料】左右・ホイール・サイドボタンの反応をブラウザでチェック",
  description:
    "マウスの左クリック・右クリック・ホイール（回転／押込）・サイドボタン（戻る／進む）・ダブルクリックが正常に反応するかをブラウザで即チェック。チャタリングや効かないボタンの切り分けに。インストール不要・登録不要・無料。",
  path: "/tools/mouse-test",
  keywords: [
    "マウステスト",
    "マウス 反応しない 確認",
    "マウス ボタン チェック",
    "サイドボタン 確認",
    "ホイール 効かない チェック",
    "mouse test",
    "マウス 動作確認",
    "ダブルクリック チェック",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "マウステスト", icon: "🖱️", desc: "左右・ホイール・サイドボタンの反応をチェック" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "マウスのどのボタンが反応しないか調べられますか？", acceptedAnswer: { "@type": "Answer", text: "はい。テストエリアで各ボタンを操作すると、左右クリック・ホイール回転・ホイール押込・サイドボタン（戻る／進む）・ダブルクリックが個別に確認済みになります。反応しないボタンがひと目でわかります。" } },
    { "@type": "Question", name: "サイドボタンが確認済みになりません。故障ですか？", acceptedAnswer: { "@type": "Answer", text: "サイドボタン（戻る／進む）は、マウス側の設定や専用ユーティリティ、ブラウザの仕様によってブラウザに伝わらないことがあります。必ずしも故障とは限りません。他のボタンが正常なら本体は動作しています。" } },
    { "@type": "Question", name: "チャタリング（勝手に二重クリックされる）は確認できますか？", acceptedAnswer: { "@type": "Answer", text: "ダブルクリックの項目や、1回だけクリックしたつもりが反応が二重になるかで、ある程度の目安になります。厳密なチャタリング測定には専用ソフトの利用をおすすめします。" } },
    { "@type": "Question", name: "操作した情報は外部に送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。判定はすべてブラウザ内で完結し、外部に送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">マウステストの使い方</h2>
      <p>
        テストエリアの中でマウスを操作するだけです。左クリック・右クリック・ホイールの回転と押し込み・サイドボタン（戻る／進む）・ダブルクリックを行うと、
        それぞれの項目が<strong>確認済み（緑）</strong>になります。すべて反応すればマウスは正常です。新品・中古マウスの動作確認や、「特定のボタンが効かない」ときの切り分けに使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ボタンが反応しないときの対処</h2>
      <ul className="space-y-1.5">
        <li>・USB・Bluetoothを挿し直す、電池を交換する、再ペアリングする</li>
        <li>・別のポートや別のPCで試して、マウス側かPC側かを切り分ける</li>
        <li>・マウス付属のユーティリティでボタン割り当てを確認する（サイドボタンが無効化されていることがあります）</li>
        <li>・症状が続く場合は内部スイッチの劣化・故障の可能性があります</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・キーボードの全キーを確認する <Link href="/tools/keyboard-test" className="text-violet-600 dark:text-violet-400 hover:underline">キーボードテスト</Link></li>
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
        title="マウステスト"
        description="左右クリック・ホイール・サイドボタン・ダブルクリックの反応をブラウザで確認できるマウス診断ツール。"
        icon="🖱️"
        slug="mouse-test"
        seoContent={seoContent}
      >
        <MouseTest />
      </ToolLayout>
    </>
  );
}
