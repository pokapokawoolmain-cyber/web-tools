import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { VideoCompressor } from "./VideoCompressor";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "動画圧縮ツール",
  "MP4・MOV・AVI・MKV・WebMの動画をブラウザで圧縮。ファイルはサーバーに送信されません。品質・解像度を自由に設定。",
  "video-compress",
  ["動画圧縮", "MP4圧縮", "動画ファイルサイズ削減", "動画変換", "無料"]
);

const seoContent = (
  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">動画圧縮ツールの使い方</h2>
    <p>MP4・MOV・AVI・MKV・WebMなどの動画をブラウザ内で圧縮します。ファイルはサーバーに送信されないためプライバシーが守られます。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">品質（CRF値）の目安</h3>
    <ul className="list-disc list-inside space-y-1">
      <li>18〜22 — 高品質（映画・長期アーカイブ用）</li>
      <li>23〜28 — 標準（日常用途・バランス重視）</li>
      <li>29〜35 — 高圧縮（SNS投稿・メール添付）</li>
      <li>36〜40 — 超高圧縮（画質を大幅に犠牲にする）</li>
    </ul>
  </div>
);

export default function VideoCompressPage() {
  return (
    <ToolLayout
      title="動画圧縮ツール"
      description="MP4・MOV・MKVなどの動画をブラウザで完結圧縮。ファイルはサーバーに送信されません。"
      icon="🎬"
      slug="video-compress"
      seoContent={seoContent}
    >
      <VideoCompressor />
    </ToolLayout>
  );
}
