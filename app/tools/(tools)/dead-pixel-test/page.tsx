import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeadPixelTest } from "./DeadPixelTest";

export const metadata: Metadata = generateMeta({
  title: "ドット抜けチェッカー【無料】全画面の単色でモニターの画素不良を確認",
  description:
    "モニターやスマホ画面のドット抜け（常時点灯）・画素欠け（常時消灯）を、全画面の単色表示でチェックできる無料ツール。赤・緑・青・白・黒などを順に表示。液晶・有機ELの購入直後や中古品の確認に。インストール不要・登録不要。",
  path: "/tools/dead-pixel-test",
  keywords: [
    "ドット抜け チェック",
    "ドット抜け 確認",
    "液晶 ドット抜け テスト",
    "モニター 画素 チェック",
    "dead pixel test",
    "常時点灯 確認",
    "画面 チェック 単色",
    "ドット抜け 検査",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "ドット抜けチェッカー", icon: "🟥", desc: "全画面の単色でモニターの画素不良を確認" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "ドット抜けと画素欠けの違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "ドット抜け（常時点灯／輝点）は黒背景で常に光って見える点、画素欠け（常時消灯／黒点）は白背景で黒く見える点です。どちらも画素の不良で、黒・白・赤・緑・青の単色を順に表示すると見つけやすくなります。" } },
    { "@type": "Question", name: "使い方を教えてください。", acceptedAnswer: { "@type": "Answer", text: "色を選ぶと全画面で単色が表示されます。画面をクリックまたはスペース／→キーで次の色に切り替わり、Escキーで終了します。各色で画面全体をよく観察し、周囲と違う点がないか確認してください。" } },
    { "@type": "Question", name: "ホコリと画素不良を見分けるには？", acceptedAnswer: { "@type": "Answer", text: "テスト前に画面をやわらかい布で清掃してください。拭いて消えるものはホコリ、位置が変わらず残るものが画素不良の可能性です。" } },
    { "@type": "Question", name: "ドット抜けは保証で交換できますか？", acceptedAnswer: { "@type": "Answer", text: "メーカーや製品によって基準が異なり、一定数までは仕様の範囲内として交換対象外の場合があります。購入前に各メーカーのドット抜け保証規定を確認することをおすすめします。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ドット抜けチェッカーの使い方</h2>
      <p>
        テストしたい色を選ぶと、画面全体が単色で表示されます。<strong>クリック（またはスペース／→キー）で次の色</strong>に切り替わり、
        <strong>Escキーで終了</strong>します。赤・緑・青・白・黒・グレーなどを順に表示し、画面全体を近くでよく観察してください。
        新品モニターの初期チェックや、中古ディスプレイ・スマホ購入時の確認に使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">不良の種類と見つけ方</h2>
      <ul className="space-y-1.5">
        <li>・<strong>ドット抜け（常時点灯・輝点）：</strong>黒い画面で常に光って見える点。赤・緑・青のどれかで光ることが多い</li>
        <li>・<strong>画素欠け（常時消灯・黒点）：</strong>白い画面で黒く見える点</li>
        <li>・<strong>サブピクセル不良：</strong>特定の原色のときだけ現れる点。赤・緑・青すべてで確認する</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">チェックのコツ</h2>
      <ul className="space-y-1.5">
        <li>・事前に画面を清掃し、ホコリと画素不良を混同しないようにする</li>
        <li>・部屋を少し暗くすると輝点が見つけやすい</li>
        <li>・画面に近づき、端から端まで視線を動かして確認する</li>
        <li>・購入前に各メーカーのドット抜け保証規定（許容画素数）を確認しておく</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">他のデバイスもテスト</h2>
      <ul className="space-y-1.5">
        <li>・画面の解像度や情報を確認する <Link href="/tools/screen-resolution" className="text-violet-600 dark:text-violet-400 hover:underline">画面解像度チェッカー</Link></li>
        <li>・モニターのリフレッシュレートを測る <Link href="/tools/refresh-rate" className="text-violet-600 dark:text-violet-400 hover:underline">リフレッシュレート測定</Link></li>
        <li>・キーボードの反応を確認する <Link href="/tools/keyboard-test" className="text-violet-600 dark:text-violet-400 hover:underline">キーボードテスト</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ドット抜けチェッカー"
        description="全画面の単色表示で、モニターやスマホ画面のドット抜け・画素欠けを確認。赤・緑・青・白・黒などを順に表示。"
        icon="🟥"
        slug="dead-pixel-test"
        seoContent={seoContent}
      >
        <DeadPixelTest />
      </ToolLayout>
    </>
  );
}
