import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { RefreshRate } from "./RefreshRate";

export const metadata: Metadata = generateMeta({
  title: "リフレッシュレート測定【無料】モニターが何Hzかブラウザで確認",
  description:
    "モニターやスマホのリフレッシュレート（Hz）をブラウザで測定。60Hz・120Hz・144Hzなど、画面が実際に何Hzで動作しているかを約2秒でチェック。ゲーミングモニターや高リフレッシュ設定の確認に。インストール不要・登録不要・無料。",
  path: "/tools/refresh-rate",
  keywords: [
    "リフレッシュレート 確認",
    "モニター hz 確認",
    "リフレッシュレート 測定",
    "144hz 確認",
    "refresh rate test",
    "画面 hz 調べる",
    "120hz 確認 スマホ",
    "モニター リフレッシュレート チェック",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "リフレッシュレート測定", icon: "📺", desc: "モニターが何Hzかブラウザで確認" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "リフレッシュレートとは何ですか？", acceptedAnswer: { "@type": "Answer", text: "1秒間に画面が何回書き換わるかを表す値で、単位はHz（ヘルツ）です。60Hzなら毎秒60回、144Hzなら毎秒144回更新されます。数値が高いほど動きが滑らかに見え、ゲームや動画で有利になります。" } },
    { "@type": "Question", name: "測定結果が設定値より低く出ます。", acceptedAnswer: { "@type": "Answer", text: "ブラウザは省電力設定・バッテリー動作・別タブの負荷などにより、描画を制限することがあります。また一部のブラウザは高リフレッシュ環境でも60Hz付近に制限する場合があります。正確な設定値はOSのディスプレイ設定でも確認してください。" } },
    { "@type": "Question", name: "設定した144Hzが出ているか確認できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。ゲーミングモニターで高リフレッシュ設定にしたあと、この測定でおおよその実効値を確認できます。ケーブル（HDMIのバージョンやDisplayPort）や解像度の組み合わせによっては設定が反映されないことがあるため、切り分けに役立ちます。" } },
    { "@type": "Question", name: "スマホのリフレッシュレートも測れますか？", acceptedAnswer: { "@type": "Answer", text: "はい。120Hz対応スマホなどで、実際に高リフレッシュで動作しているかの目安を確認できます。省電力モードでは60Hzに下がることがあります。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">リフレッシュレート測定の使い方</h2>
      <p>
        「測定開始」を押すと、約2秒間ブラウザの描画タイミングを計測し、<strong>リフレッシュレート（Hz）</strong>を判定します。
        測定中は瞬間値、終了後は平均から求めた値を表示します。ゲーミングモニターの高リフレッシュ設定が効いているかの確認、
        新しいモニターの動作チェックなどに使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">主なリフレッシュレートの目安</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">Hz</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">主な用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["60Hz", "一般的なモニター・事務作業・動画視聴"],
              ["120 / 144Hz", "ゲーミング入門〜標準。動きが明確に滑らかに"],
              ["165 / 240Hz", "FPSなど競技系ゲーミング"],
              ["360Hz", "プロ・ハイエンド競技用"],
            ].map(([hz, use], i) => (
              <tr key={hz as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold text-violet-600 dark:text-violet-300">{hz}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">測定値が設定と違うときは</h2>
      <ul className="space-y-1.5">
        <li>・OSのディスプレイ設定でリフレッシュレートが目的の値になっているか確認する</li>
        <li>・ケーブル（HDMIのバージョン・DisplayPort）が高リフレッシュに対応しているか確認する</li>
        <li>・高解像度と高リフレッシュを同時に出せない組み合わせがある点に注意する</li>
        <li>・ノートPCはバッテリー動作・省電力設定で自動的に下がることがある</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・画面の解像度や情報を確認する <Link href="/tools/screen-resolution" className="text-violet-600 dark:text-violet-400 hover:underline">画面解像度チェッカー</Link></li>
        <li>・画面の画素不良を確認する <Link href="/tools/dead-pixel-test" className="text-violet-600 dark:text-violet-400 hover:underline">ドット抜けチェッカー</Link></li>
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
        title="リフレッシュレート測定"
        description="モニターやスマホが実際に何Hzで動作しているかをブラウザで測定。60/120/144Hzなどを約2秒で判定。"
        icon="📺"
        slug="refresh-rate"
        seoContent={seoContent}
      >
        <RefreshRate />
      </ToolLayout>
    </>
  );
}
