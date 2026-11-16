import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/goods/data";
import { getTemplate, parsePick } from "@/lib/mochico/templates";
import { PageHeader } from "../../../../_components/PageHeader";
import { TemplateCreate } from "./TemplateCreate";

export const metadata: Metadata = { title: "テンプレートからリストを作成" };

// テンプレート（記事のグッズ）から、自分のイベントとグッズを一度に作る。
// 作るのは本人のアカウントのデータだけ。いつもの作成と同じ権限で書き込む
export default async function TemplateCreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pick?: string }>;
}) {
  const { id } = await params;
  const { pick } = await searchParams;
  const t = getTemplate(id);
  if (!t) notFound();
  const picked = parsePick(pick, t.items.length) ?? t.items.map((_, i) => i);
  await requireUser(`/mochico/events/new/template/${id}?pick=${picked.join(",")}`);
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <PageHeader title="テンプレートからリストを作成" backHref={`/mochico/templates/${id}`} backLabel="グッズを選び直す" />
      <TemplateCreate templateId={t.id} picked={picked} />
    </div>
  );
}
