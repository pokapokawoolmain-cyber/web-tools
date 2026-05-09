import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { WordCounter } from "./WordCounter";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "文字数カウント",
  "入力した瞬間にリアルタイムで文字数・行数・単語数を計測。Twitter・メール・履歴書に便利。",
  "word-counter",
  ["文字数カウント", "文字数チェッカー", "文字数制限", "Twitter文字数", "文字数確認", "無料"]
);

export default function WordCounterPage() {
  return (
    <ToolLayout
      title="文字数カウント"
      description="入力した瞬間にリアルタイムで文字数・行数・単語数を計測。スペース有無の切り替えも可能。"
      icon="✍️"
    >
      <WordCounter />
    </ToolLayout>
  );
}
