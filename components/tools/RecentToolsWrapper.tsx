"use client";
// ========================================
// RecentTools の dynamic import ラッパー
// ToolLayout (Server Component) から使用
// ========================================
import dynamic from "next/dynamic";

const RecentTools = dynamic(
  () => import("./RecentTools").then((m) => m.RecentTools),
  { ssr: false }
);

export function RecentToolsWrapper() {
  return <RecentTools />;
}
