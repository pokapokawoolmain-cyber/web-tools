import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { Furusato } from "./Furusato";

export const metadata: Metadata = generateToolMeta(
  "ふるさと納税シミュレーター（詳細版）",
  "年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。推奨寄付額もわかる。",
  "furusato",
  ["ふるさと納税", "控除上限", "年収別計算", "配偶者控除", "扶養控除"]
);

export default function Page() {
  return <Furusato />;
}
