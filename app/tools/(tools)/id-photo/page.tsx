import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { IdPhoto } from "./IdPhoto";

export const metadata: Metadata = {
  title: "証明写真作成ツール｜履歴書・コンビニ印刷対応",
  description: "履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を作成。L判4枚配置でコンビニ印刷にも対応。無料・登録不要。",
  keywords: ["証明写真 作成", "履歴書 写真 作成", "証明写真 コンビニ", "パスポート 写真 作成", "マイナンバー 写真 作成"].join(", "),
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="id-photo" title="証明写真作成" description="履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を自動作成。" />
      <IdPhoto />
    </>
  );
}
