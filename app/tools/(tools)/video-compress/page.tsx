import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { VideoCompressor } from "./VideoCompressor";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "動画圧縮【無料】MP4・MOVをブラウザで軽量化｜サーバー送信なしでLINE・メール対応",
  description:
    "MP4・MOV・AVI・MKV・WebMの動画をブラウザだけで圧縮。ファイルはサーバーに送信されないので安心。品質（CRF）・解像度を自由に設定でき、LINE送信やメール添付のサイズ制限対策に。無料・登録不要・スマホ対応。",
  path: "/tools/video-compress",
  keywords: ["動画圧縮 無料", "MP4 圧縮 オンライン", "動画 軽くする", "LINE 動画 送れない 圧縮", "MOV 圧縮 ブラウザ", "動画 ファイルサイズ 削減", "動画圧縮 アプリ不要"],
  ogImage: `/api/og?${new URLSearchParams({ title: "動画圧縮ツール", icon: "🎬", desc: "MP4・MOVをブラウザで軽量化" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "どの動画形式に対応していますか？",
      acceptedAnswer: { "@type": "Answer", text: "MP4・MOV・AVI・MKV・WebMに対応しています。iPhoneで撮影したMOVやAndroidのMP4もそのままアップロードできます。" },
    },
    {
      "@type": "Question",
      name: "動画はサーバーに送信されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。動画ファイルが外部サーバーに送信されることは一切ありません。" },
    },
    {
      "@type": "Question",
      name: "スマホからでも圧縮できますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザからご利用いただけます。ただし長時間の動画はブラウザの処理に時間がかかることがあります。" },
    },
    {
      "@type": "Question",
      name: "圧縮後のファイルサイズはどのくらいになりますか？",
      acceptedAnswer: { "@type": "Answer", text: "元動画の内容・解像度・品質設定によって大きく異なります。CRF値を上げると同時に解像度も下げると、元の20〜30%程度まで削減できることがあります。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">動画圧縮ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        MP4・MOV・AVI・MKV・WebMなどの動画ファイルをブラウザ上で圧縮します。ファイルをアップロードして品質・解像度を設定し、「圧縮開始」ボタンを押すだけです。処理はすべてブラウザ内で完結するため、動画ファイルが外部サーバーに送信されることはありません。プライベートな動画や社内映像も安心してご利用いただけます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">動画圧縮が必要になる場面</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">LINEで動画を送れない：</strong>LINEの動画送信には25MB前後の上限があります。スマホで撮影した1分の動画でも100MBを超えることがあり、圧縮が必要です。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">Instagramに投稿できない：</strong>Instagramの動画アップロードには最大100MBの制限があります。高画質で撮影した動画はこれを超えることが多く、圧縮で対応できます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">メール添付ができない：</strong>GmailやOutlookの添付上限（25MB）を超える動画はそのまま送れません。圧縮すれば添付可能なサイズにできます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">スマホの容量を節約したい：</strong>iPhoneやAndroidの内部ストレージを圧迫する動画ファイルを圧縮して保存することで、端末の空き容量を増やせます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ウェブサイトやブログへの掲載：</strong>ページに埋め込む動画を軽量化することで、読み込み速度を改善し、閲覧者の体験を向上させられます。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">品質（CRF値）と圧縮率の目安</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        CRF（Constant Rate Factor）値は画質と圧縮率のバランスを決める設定です。値が小さいほど高画質・大サイズ、大きいほど高圧縮・低画質になります。
      </p>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">CRF 18〜22：</strong>高品質。映画・長期アーカイブ用。ファイルサイズはあまり小さくなりません。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">CRF 23〜28：</strong>標準品質。日常的な用途に最適なバランス。多くのケースではここを起点に調整します。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">CRF 29〜35：</strong>高圧縮。SNS投稿・メール添付など容量優先の場面に。画質低下は気になり始めますが実用範囲です。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">CRF 36〜40：</strong>超高圧縮。ファイルサイズは最小になりますが、画質が大幅に低下します。確認用・プレビュー用途向け。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">動画圧縮の注意点</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        動画は圧縮を繰り返すたびに画質が著しく劣化します（世代劣化と呼ばれます）。必ず元のオリジナルファイルをバックアップしてから圧縮作業を行ってください。また、解像度を下げると画質の劣化は顕著になりますが、ファイルサイズは大きく削減できます。用途に応じて解像度と品質のどちらを優先するかを判断して設定してください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "どの動画形式に対応していますか？", a: "MP4・MOV・AVI・MKV・WebMに対応しています。iPhoneで撮影したMOVやAndroidのMP4もそのままアップロードできます。" },
          { q: "動画はサーバーに送信されますか？", a: "いいえ。処理はすべてブラウザ内で完結します。動画ファイルが外部サーバーに送信されることは一切ありません。" },
          { q: "スマホからでも圧縮できますか？", a: "はい。iPhone・Androidのブラウザからご利用いただけます。ただし長時間の動画はブラウザの処理に時間がかかることがあります。" },
          { q: "圧縮後のファイルサイズはどのくらいになりますか？", a: "元動画の内容・解像度・品質設定によって大きく異なります。CRF値を上げると同時に解像度も下げると、元の20〜30%程度まで削減できることがあります。" },
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

export default function VideoCompressPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
      title="動画圧縮ツール"
      description="MP4・MOV・MKVなどの動画をブラウザで完結圧縮。ファイルはサーバーに送信されません。"
      icon="🎬"
      slug="video-compress"
      seoContent={seoContent}
    >
      <VideoCompressor />
    </ToolLayout>
    </>
  );
}
