import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpeedTest } from "./SpeedTest";
import { SPEED_RANKS } from "./speed-ranks";

export const metadata: Metadata = generateMeta({
  title: "スピードテスト｜インターネット回線速度・Ping・ジッターを測定し20段階で実用診断【無料】",
  description:
    "インターネット回線の通信速度（ダウンロード・アップロード）・Ping・ジッターを無料で測定できるスピードテスト。動画・オンラインゲーム・4K/8K・ビデオ会議など「その回線速度で何が快適か」を20段階で具体的に診断。10Gbps級対応・登録不要・ブラウザ完結。",
  path: "/tools/speed-test",
  keywords: [
    "インターネット 速度テスト",
    "スピードテスト",
    "回線速度 測定",
    "wifi 速度 測定",
    "ダウンロード速度 測定",
    "ネット 速度 診断",
    "通信速度 テスト 無料",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "インターネット速度テスト", icon: "🚀", desc: "回線速度を測定して20段階で実用評価。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "インターネット速度は何Mbpsあれば十分ですか？", acceptedAnswer: { "@type": "Answer", text: "1人でのSNS・動画視聴なら10〜20Mbps、家族での同時利用や4K動画には50〜100Mbpsが目安です。オンラインゲームは速度よりPing値（30ms以下推奨）が重要です。本ツールでは測定結果を20段階で評価し、その速度で何ができるかを具体的に表示します。" } },
    { "@type": "Question", name: "4K動画を見るには何Mbps必要ですか？", acceptedAnswer: { "@type": "Answer", text: "Netflixは4K再生に15Mbps以上、YouTubeの4Kは約20Mbpsを推奨しています。安定して視聴するには実測25Mbps以上、家族が同時に使う環境なら50Mbps以上あると安心です。" } },
    { "@type": "Question", name: "オンラインゲームに重要なのは速度ですか？", acceptedAnswer: { "@type": "Answer", text: "ダウンロード速度よりもPing（応答速度）とジッター（応答のブレ）が重要です。FPSや格闘ゲームではPing 15ms以下が理想、30ms以下なら快適です。速度は10Mbps以上あれば対戦自体には十分ですが、ゲーム本体のダウンロードには速いほど有利です。" } },
    { "@type": "Question", name: "ダウンロード速度とアップロード速度の違いは？", acceptedAnswer: { "@type": "Answer", text: "ダウンロードは動画視聴・Web閲覧などデータを受け取る速度、アップロードはビデオ会議の映像送信・SNS投稿・クラウド保存などデータを送る速度です。一般的な光回線では下りの方が速く、在宅ワークや配信をする人はアップロード速度も重要になります。" } },
    { "@type": "Question", name: "スマホで測ると遅くなるのはなぜですか？", acceptedAnswer: { "@type": "Answer", text: "スマホはアンテナ性能や対応するWi-Fi規格がPCより限定的なため、同じ回線でも実測値が低く出ることがあります。また5GHz帯ではなく2.4GHz帯に接続されていると速度が大きく落ちます。回線自体の実力を知りたい場合は、有線接続のPCでの測定が最も正確です。" } },
    { "@type": "Question", name: "Wi-Fiルーターの近くなのに遅い原因は？", acceptedAnswer: { "@type": "Answer", text: "電子レンジ・Bluetooth機器との電波干渉、2.4GHz帯への接続、ルーターの規格が古い（Wi-Fi 4以前）、接続台数の過多などが典型的な原因です。5GHz帯への切り替えとルーターの再起動をまず試してください。" } },
    { "@type": "Question", name: "夜だけ遅いのはなぜですか？", acceptedAnswer: { "@type": "Answer", text: "夜間（20〜23時）は利用者が集中し、回線事業者の設備やプロバイダの帯域が混雑するためです。PPPoE方式で接続している場合は、混雑を避けやすいIPv6（IPoE）方式への切り替えで大きく改善することがあります。" } },
    { "@type": "Question", name: "測定するたびに結果が変わるのはなぜですか？", acceptedAnswer: { "@type": "Answer", text: "回線の混雑状況・Wi-Fiの電波状態・端末の負荷が刻々と変わるためで、ある程度のブレは正常です。時間帯を変えて数回測定し、中央値で判断するのがおすすめです。本ツールの「接続の安定度」はこのブレの少なさを数値化したものです。" } },
    { "@type": "Question", name: "1Gbps契約なのに1Gbps出ないのはなぜですか？", acceptedAnswer: { "@type": "Answer", text: "契約速度は理論上の最大値（ベストエフォート）で、実測はプロバイダの混雑・宅内配線・ルーター性能・LANケーブル規格・端末性能に左右されます。実測300〜700Mbps出ていれば1Gbps契約としては良好です。Cat5eより古いLANケーブルや、Wi-Fi 5以前のルーターがボトルネックになっている例が多くあります。" } },
    { "@type": "Question", name: "10Gbps回線は一般家庭に必要ですか？", acceptedAnswer: { "@type": "Answer", text: "動画視聴・ゲーム・在宅ワーク中心なら1Gbpsで十分なことがほとんどです。10Gbpsが活きるのは、大容量の映像素材を日常的に転送する制作用途や、多数の端末で同時に大容量通信をする環境です。導入するならルーター・LAN・PCのNICまで10Gbps対応で揃える必要があります。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">インターネット速度テストとは</h2>
      <p>
        このツールは、お使いの回線の<strong>ダウンロード速度・アップロード速度・Ping（応答速度）・ジッター</strong>をブラウザだけで実測します。
        アプリのインストールは不要で、測定にはランダムデータのみを使用するため個人情報は一切送信されません。
        測定後は結果を「速い・遅い」ではなく、<strong>その速度で実際に何ができるのか</strong>を20段階で具体的に診断します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">MbpsとMB/sの違い</h2>
      <p>
        Mbps（メガビット毎秒）は回線速度の単位、MB/s（メガバイト毎秒）はファイルサイズ基準の転送速度で、<strong>8Mbps = 1MB/s</strong>の関係です。
        「100Mbpsの回線」で1GBのファイルをダウンロードすると、理論上は 1GB ÷ 12.5MB/s = 約80秒かかります。
        本ツールは両方の単位を併記するので、「このファイルなら何秒か」の感覚がつかめます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途別に必要な速度の目安</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">必要速度の目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">ポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Web閲覧・SNS", "1〜5Mbps", "画像の多いページは5Mbps以上で快適"],
              ["YouTube フルHD", "5〜10Mbps", "1080pの推奨は5Mbps程度"],
              ["Netflix 4K", "15〜25Mbps", "公式推奨15Mbps。余裕を見て25Mbps"],
              ["8K動画", "80〜100Mbps", "YouTube 8Kはビットレートが非常に高い"],
              ["Zoom / Google Meet", "上下3〜5Mbps", "アップロード速度と安定性が重要"],
              ["オンラインゲーム対戦", "10Mbps + Ping 30ms以下", "速度よりPing・ジッターが支配的"],
              ["クラウドゲーム", "25〜50Mbps", "4K配信品質なら50Mbps推奨"],
              ["大型ゲームのDL（100GB）", "100Mbpsで約2.2時間", "1Gbpsなら約13分"],
              ["家族4人の同時利用", "50〜100Mbps", "動画×2＋会議＋ゲームを想定"],
            ].map(([use, speed, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-slate-700 dark:text-zinc-200">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 whitespace-nowrap">{speed}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">20段階評価の早見表</h2>
      <p className="mb-3">本ツールの評価基準です。測定しなくても、普段の回線速度がどのレベルかを確認できます。</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">Lv</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">速度帯</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">ランク</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">一言評価</th>
            </tr>
          </thead>
          <tbody>
            {SPEED_RANKS.map((r, i) => (
              <tr key={r.level} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-bold tabular-nums" style={{ color: r.color }}>{r.level}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 whitespace-nowrap tabular-nums">{r.range}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-slate-700 dark:text-zinc-200 whitespace-nowrap">{r.name}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{r.tagline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">速度が出ないときのチェックリスト</h2>
      <ol className="list-decimal list-outside ml-5 space-y-2">
        <li><strong>ルーターを再起動する</strong> — 数週間連続稼働したルーターは処理が滞ることがあります。電源を抜いて30秒待つだけで改善する例は多いです。</li>
        <li><strong>5GHz帯に接続する</strong> — Wi-Fiの「2.4GHz」は壁に強い代わりに遅く干渉に弱い帯域です。SSID末尾が「-A」「5G」等のネットワークに切り替えてみてください。</li>
        <li><strong>ルーターの設置場所を見直す</strong> — 床置き・水槽や電子レンジの近く・部屋の隅は電波が弱くなります。家の中心・高い位置が理想です。</li>
        <li><strong>LANケーブルの規格を確認する</strong> — Cat5（1Gbps非対応）やCat5eの古いケーブルが速度の上限になっている例が非常に多いです。Cat6A以上への交換は数百円でできる最も費用対効果の高い改善です。</li>
        <li><strong>IPv6（IPoE）接続に切り替える</strong> — 夜だけ遅い場合の定番の解決策です。プロバイダの契約状況とルーターの対応を確認してください。</li>
        <li><strong>接続台数を整理する</strong> — スマート家電・古いタブレットなどが帯域やルーターの処理能力を消費していることがあります。</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Ping・ジッターとは？「速いのに体感が遅い」理由</h2>
      <p className="mb-3">
        <strong>Ping（レイテンシ）</strong>はデータが相手に届いて返ってくるまでの往復時間、<strong>ジッター</strong>はそのブレの大きさです。
        Web閲覧の「クリックしてから表示され始めるまでの一瞬」や、ゲームの「撃ったのに当たらない」はダウンロード速度ではなくPingが原因です。
      </p>
      <p>
        ダウンロード速度が十分速いのに体感が遅い場合は、①Pingが大きい（50ms超）、②ジッターが大きく通信が不安定、
        ③DNSの応答が遅い、④端末側の負荷（メモリ不足・拡張機能）——のいずれかであることがほとんどです。
        本ツールの測定結果でPing・ジッター・安定度をあわせて確認してください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">測定結果を見るときの注意点</h2>
      <ul className="space-y-2">
        <li>・ブラウザ測定は端末のCPU・Wi-Fi性能の影響を受けます。特に<strong>1Gbpsを超える領域では端末側が上限</strong>になることがあります。</li>
        <li>・スマホは同じ回線でもPCより低く出る傾向があります（アンテナ・対応規格の差）。</li>
        <li>・混雑時間帯（夜20〜23時）と昼間の両方で測ると、回線品質の実態がわかります。</li>
        <li>・「契約速度＝実測速度」にはなりません。ベストエフォート型では実測が契約の3〜7割程度でも正常な範囲です。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10Gbps回線は本当に必要か</h2>
      <p>
        結論から言えば、動画視聴・ゲーム・在宅ワークが中心なら<strong>1Gbpsで困ることはほぼありません</strong>。
        10Gbpsが活きるのは、4K/8K映像素材を日常的にクラウドと往復させる制作環境や、家庭内サーバー・多数端末の同時大容量通信がある場合です。
        また10Gbpsを活かすには、ルーター・スイッチ・LANケーブル（Cat6A以上）・PCのNICまで対応機器で揃える必要があり、
        1か所でも古い機器が挟まるとそこが上限になります。導入前に本ツールの高精度モードで現状の実測を把握しておきましょう。
      </p>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="インターネット速度テスト"
        description="ダウンロード・アップロード速度をブラウザで実測し、動画・ゲーム・4K/8K・ビデオ会議など何が快適にできるかを20段階で診断。10Gbps級にも対応。"
        icon="🚀"
        slug="speed-test"
        seoContent={seoContent}
      >
        <SpeedTest />
      </ToolLayout>
    </>
  );
}
