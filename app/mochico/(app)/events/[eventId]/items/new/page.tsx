import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventCategoryList, getOwnedEvent, requireUser } from "@/lib/goods/data";
import { GoodsForm } from "../../../../_components/GoodsForm";
import { PageHeader } from "../../../../_components/PageHeader";
import { Forbidden } from "../../../../_components/Forbidden";

export const metadata: Metadata = { title: "グッズを登録" };

export default async function NewGoodsPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ first?: string }>;
}) {
  const { eventId } = await params;
  const { first } = await searchParams;
  const { supabase, user } = await requireUser(`/mochico/events/${eventId}/items/new`);
  const { event, forbidden } = await getOwnedEvent(supabase, user.id, eventId);
  if (forbidden) return <Forbidden backHref={`/mochico/events/${eventId}`} />;
  if (!event) notFound();

  const [categories, { data: last }] = await Promise.all([
    getEventCategoryList(supabase, eventId),
    supabase.from("goods").select("sort_order").eq("event_id", eventId).order("sort_order", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <PageHeader
        title={first ? "グッズを登録しましょう" : "グッズを登録"}
        sub={event.title}
        backHref={`/mochico/events/${eventId}`}
        backLabel={first ? "あとで登録する" : "イベントに戻る"}
      />
      <GoodsForm eventId={eventId} categories={categories} nextSortOrder={(last?.sort_order ?? -1) + 1} />
    </div>
  );
}
