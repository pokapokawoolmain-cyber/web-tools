import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateToolMeta } from "@/lib/seo";
import { WifiQr } from "./WifiQr";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "Wi-Fi QRコード生成",
  "SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。スキャンするだけで簡単接続。アプリ不要・無料。",
  "wifi-qr",
  ["WiFi QRコード 作り方", "Wi-Fi 共有 QRコード", "WiFi パスワード QR 生成", "来客 Wi-Fi 接続 簡単", "WPA2 QRコード"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wi-Fi QRコードをスキャンするにはどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "iPhoneはカメラアプリを開いてQRコードに向けるだけで自動認識されます（iOS 11以降）。Androidも標準カメラアプリでスキャン可能なモデルが多く、対応していない場合はGoogle レンズを使います。スキャン後に表示される通知をタップするとWi-Fiに自動接続されます。" },
    },
    {
      "@type": "Question",
      name: "生成したQRコードはサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。QRコードの生成はすべてブラウザ内で完結します。入力したSSID・パスワードが外部サーバーに送信されることは一切ありません。Wi-Fiのパスワードを安心して入力してご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "WPA2とWPA3の違いは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "WPA2は現在最も広く使われているWi-Fi暗号化規格で、ほぼ全ての機器に対応しています。WPA3はより強力な暗号化を提供する新しい規格で、2018年以降の新しいルーターや端末で対応が進んでいます。接続する端末がWPA3に対応しているか不明な場合は、互換性の高いWPA2を選ぶのが無難です。" },
    },
    {
      "@type": "Question",
      name: "パスワードなしのオープンネットワークでも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。セキュリティ設定で「なし（オープン）」を選択することでパスワードなしのQRコードを作れます。ただしオープンネットワークは通信が暗号化されないため、カフェや公共施設など不特定多数が利用する場所で個人情報を送受信しないよう注意が必要です。" },
    },
    {
      "@type": "Question",
      name: "生成したQRコードを印刷して使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。生成されたQRコードを右クリック（スマホは長押し）して画像として保存し、印刷することができます。ゲストルーム・会議室・店舗のテーブルに貼っておくと来客に自分でスキャンしてもらえます。Wi-Fiパスワードを都度教える手間がなくなります。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      Wi-Fi QRコード生成ツールの使い方
    </h2>
    <p>
      ネットワーク名（SSID）とパスワードを入力してボタンを押すだけでQRコードが生成されます。
      iPhoneなら標準カメラ・AndroidならGoogleレンズでスキャンすれば、
      パスワードを入力することなく即座にWi-Fiに接続できます。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      こんな場面で活躍します
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>来客・友人を招いたとき</strong>：「Wi-Fiパスワードなに？」のやり取りが不要。貼っておけばセルフで接続</li>
      <li><strong>会議室・オフィス</strong>：毎回パスワードを告知する手間を省略。入口に印刷して掲示</li>
      <li><strong>民泊・ゲストハウス</strong>：チェックイン説明書にQRコードを載せるだけ</li>
      <li><strong>店舗・カフェ</strong>：テーブルPOPにQRを印刷。顧客がセルフ接続できる</li>
      <li><strong>イベント会場</strong>：会場Wi-Fiの接続案内を瞬時に配布</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      セキュリティ設定の選び方
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[12px]">
            <th className="pb-2 font-medium">規格</th>
            <th className="pb-2 font-medium">おすすめ度</th>
            <th className="pb-2 font-medium">対応機器</th>
          </tr>
        </thead>
        <tbody className="text-slate-600 dark:text-zinc-400">
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5 font-medium">WPA3</td>
            <td className="py-1.5 text-emerald-600 dark:text-emerald-400">◎ 最も安全</td>
            <td className="py-1.5">2019年以降の端末</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5 font-medium">WPA2</td>
            <td className="py-1.5 text-blue-600 dark:text-blue-400">○ 一般的</td>
            <td className="py-1.5">ほぼ全ての機器</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5 font-medium">WPA</td>
            <td className="py-1.5 text-amber-600 dark:text-amber-400">△ 古い</td>
            <td className="py-1.5">古いルーター向け</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5 font-medium">なし（オープン）</td>
            <td className="py-1.5 text-red-600 dark:text-red-400">✗ 非推奨</td>
            <td className="py-1.5">暗号化なし・危険</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      スキャン方法（機種別）
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>iPhone（iOS 11以降）</strong>：カメラアプリを開いてQRコードに向けると通知が出る → タップで接続</li>
      <li><strong>Android（標準カメラ対応機）</strong>：カメラでスキャン → 通知をタップ</li>
      <li><strong>Android（Googleレンズ）</strong>：カメラ右下のレンズアイコン → QRをスキャン</li>
      <li><strong>Windows 10/11</strong>：設定 → ネットワーク → QRコードスキャン機能（対応機種のみ）</li>
    </ul>

    <div className="text-[13px] bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-100 dark:border-amber-900">
      <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 印刷・掲示する際の注意</p>
      <p className="text-amber-700 dark:text-amber-400">
        QRコードにはWi-Fiパスワードが含まれています。不特定多数が入れる場所に掲示する場合、
        パスワードを定期的に変更してQRコードも更新するようにしましょう。
        ゲスト用のSSIDを別に用意するとメインネットワークを守れます。
      </p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Wi-Fi QRコード生成"
        description="SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。スキャンするだけで簡単接続。"
        icon="📶"
        slug="wifi-qr"
        seoContent={seoContent}
      >
        <WifiQr />
      </ToolLayout>
    </>
  );
}
