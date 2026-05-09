import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { PasswordGenerator } from "./PasswordGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "パスワード生成",
  "長さ・記号・数字を自由に設定。強度メーター付きの安全なランダムパスワードを即生成。",
  "password-generator",
  ["パスワード生成", "安全パスワード", "ランダムパスワード", "強いパスワード", "セキュリティ"]
);

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      title="パスワード生成"
      description="長さ・記号・数字を自由に設定。強度メーター付きのランダムパスワードをブラウザ内で安全に生成。"
      icon="🔐"
    >
      <PasswordGenerator />
    </ToolLayout>
  );
}
