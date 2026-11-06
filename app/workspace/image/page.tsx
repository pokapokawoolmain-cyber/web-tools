import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ImageWorkspace } from "./ImageWorkspace";

// Phase 1 PoC。品質を確認できるまで検索エンジンには載せない（サイトマップにも入れない）
export const metadata: Metadata = generateMeta({
  title: "画像ワークスペース（試験公開）",
  description: "画像を入れるだけで、軽くする・大きさをそろえる・形式を変える・PDFにまとめるまでを一度に。ファイルは端末の外へ送信しません。",
  path: "/workspace/image",
  noIndex: true,
});

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
        <ImageWorkspace />
      </div>
    </div>
  );
}
