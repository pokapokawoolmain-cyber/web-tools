import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventCategories, getGoodsForEdit, getOwnedEvent, requireUser } from "@/lib/goods/data";
import { GoodsForm } from "../../../../../_components/GoodsForm";
import { PageHeader } from "../../../../../_components/PageHeader";
import { Forbidden } from "../../../../../_components/Forbidden";

export const metadata: Metadata = { title: "グッズを編集" };

export default async function EditGoodsPage({ params }: { params: Promise<{ eventId: string; goodsId: string }> }) {
  const { eventId, goodsId } = await params;
  const { supabase, user } = await requireUser(`/mochico/events/${eventId}/items/${goodsId}/edit`);
  const { event, forbidden } = await getOwnedEvent(supabase, user.id, eventId);
  if (forbidden) return <Forbidden backHref={`/mochico/events/${eventId}`} />;
  if (!event) notFound();
  const [item, categories] = await Promise.all([getGoodsForEdit(supabase, eventId, goodsId), getEventCategories(supabase, eventId)]);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <PageHeader title="グッズを編集" sub={event.title} backHref={`/mochico/events/${eventId}`} backLabel="イベントに戻る" />
      <GoodsForm eventId={eventId} item={item} categories={categories} nextSortOrder={item.sortOrder} />
    </div>
  );
}
