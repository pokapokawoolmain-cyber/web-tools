import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateToolMeta } from "@/lib/seo";
import { Gpa } from "./Gpa";

export const metadata: Metadata = generateToolMeta(
  "GPA計算",
  "科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。",
  "gpa",
  ["GPA計算", "大学 GPA", "成績計算", "単位 GPA", "累積GPA"]
);

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="gpa" title="GPA計算" description="科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。" />
      <Gpa />
    </>
  );
}
