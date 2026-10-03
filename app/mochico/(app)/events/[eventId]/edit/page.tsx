import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOwnedEvent, requireUser } from "@/lib/goods/data";
import { EventForm } from "../../../_components/EventForm";
import { PageHeader } from "../../../_components/PageHeader";
import { Forbidden } from "../../../_components/Forbidden";

export const metadata: Metadata = { title: "イベントを編集" };

export default async function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const { supabase, user } = await requireUser(`/mochico/events/${eventId}/edit`);
  const { event, forbidden } = await getOwnedEvent(supabase, user.id, eventId);
  if (forbidden) return <Forbidden backHref={`/mochico/events/${eventId}`} />;
  if (!event) notFound();
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <PageHeader title="イベントを編集" backHref={`/mochico/events/${eventId}`} backLabel="イベントに戻る" />
      <EventForm event={event} />
    </div>
  );
}
