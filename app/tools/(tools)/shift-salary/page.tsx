import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateToolMeta } from "@/lib/seo";
import { ShiftSalary } from "./ShiftSalary";

export const metadata: Metadata = generateToolMeta(
  "シフト給与計算",
  "時給・勤務時間・深夜時間・勤務日数を入力して月収を計算。深夜割増・交通費も対応。",
  "shift-salary",
  ["シフト 給与計算", "時給計算", "アルバイト 月収", "深夜手当", "パート 収入計算"]
);

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="shift-salary" title="シフト給与計算" description="時給・勤務時間・深夜時間を入力して月収を計算。深夜割増・交通費も対応。" />
      <ShiftSalary />
    </>
  );
}
