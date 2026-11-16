// ============================================================
// Mochico テンプレートの公開ページ（記事から来た人が、グッズを選んで自分のリストを作る入口）
//   ログイン不要で一覧と合計金額を見られる。「このリストで始める」でログイン後に作成する
//   記事の内容と重なるため、検索には載せない（noindex）
// ============================================================
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GOODS_TEMPLATES, getTemplate } from "@/lib/mochico/templates";
import { TemplatePicker } from "./TemplatePicker";

export function generateStaticParams() {
  return GOODS_TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const t = getTemplate((await params).id);
  if (!t) return {};
  return {
    title: { absolute: `${t.title}の買い物リスト｜Mochico` },
    description: t.lead,
    robots: { index: false, follow: true },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const t = getTemplate((await params).id);
  if (!t) notFound();
  const appEnabled = process.env.NEXT_PUBLIC_MOCHICO_APP_ENABLED === "true";
  return <TemplatePicker template={t} appEnabled={appEnabled} />;
}
