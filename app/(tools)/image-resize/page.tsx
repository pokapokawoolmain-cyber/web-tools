import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ImageResize } from "./ImageResize";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "画像リサイズ・アスペクト比変換",
  "画像のサイズ変更・アスペクト比変換をブラウザで完結。16:9・4:3・1:1など主要比率に対応。PNG/JPGで保存。",
  "image-resize",
  ["画像リサイズ", "アスペクト比変換", "画像サイズ変更", "16:9", "4:3", "正方形", "無料"]
);

const seoContent = (
  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">画像リサイズツールの使い方</h2>
    <p>画像をアップロードし、目的に合わせてサイズを変更できます。SNSのプロフィール画像・サムネイル・印刷用など、用途に応じた比率やサイズを選択してください。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">よく使うアスペクト比</h3>
    <ul className="list-disc list-inside space-y-1">
      <li>16:9 — YouTube・PC壁紙・プレゼンテーション</li>
      <li>1:1 — Instagram・プロフィール画像</li>
      <li>4:3 — 旧デジカメ・プレゼン資料</li>
      <li>9:16 — Instagram Stories・TikTok・YouTubeショート</li>
    </ul>
  </div>
);

export default function ImageResizePage() {
  return (
    <ToolLayout
      title="画像リサイズ・アスペクト比変換"
      description="画像のサイズ変更・アスペクト比変換をブラウザで完結。ファイルはサーバーに送信されません。"
      icon="✂️"
      seoContent={seoContent}
    >
      <ImageResize />
    </ToolLayout>
  );
}
