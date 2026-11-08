import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { PdfWorkspace } from "./PdfWorkspace";

// Phase 2 PoC。品質を確認できるまで検索エンジンには載せない（サイトマップにも入れない）
export const metadata: Metadata = generateMeta({
  title: "PDFワークスペース（試験公開）",
  description: "PDFを入れるだけで、まとめる・並べ替える・回転・削除・分ける・画像にするまでを一度に。ファイルは端末の外へ送信しません。",
  path: "/workspace/pdf",
  noIndex: true,
});

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        <PdfWorkspace />
      </div>
    </div>
  );
}
