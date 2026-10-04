import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getEventDetail, requireUser } from "@/lib/goods/data";
import { EventHeader } from "../../_components/EventHeader";
import { GoodsBoard } from "../../_components/GoodsBoard";
import { StateMessage } from "../../_components/StateMessage";
import { LeaveEventButton } from "../../_components/LeaveEventButton";

export const metadata: Metadata = { title: "イベント" };

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ added?: string; already?: string }>;
}) {
  const { eventId } = await params;
  const { added, already } = await searchParams;
  const { supabase, user } = await requireUser(`/mochico/events/${eventId}`);
  const detail = await getEventDetail(supabase, user.id, eventId);
  if (!detail) notFound();

  if (detail.event.deletedAt) {
    return (
      <>
        <StateMessage icon={<Trash2 className="h-7 w-7" />} title="このイベントは作成者によって削除されています" tone="warning" action={{ href: "/mochico/events", label: "マイイベントへ" }}>
          グッズの表示と取得状況の変更はできません。不要であればマイイベントから外してください。
        </StateMessage>
        {!detail.isOwner && (
          <div className="-mt-8 flex justify-center pb-10">
            <LeaveEventButton eventId={eventId} userId={user.id} variant="primary" />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      {(added || already) && (
        <p role="status" className="mb-3 rounded-xl bg-pink-50 px-4 py-3 text-sm font-medium text-pink-800 dark:bg-pink-950/40 dark:text-pink-200">
          {added ? "マイイベントに追加しました。グッズをタップして、自分の取得状況を記録できます。" : "このイベントはすでにマイイベントにあります。"}
        </p>
      )}
      <EventHeader event={detail.event} isOwner={detail.isOwner} />
      <GoodsBoard
        userId={user.id}
        event={detail.event}
        goods={detail.goods}
        initialStatuses={detail.statuses}
        isOwner={detail.isOwner}
      />
      {!detail.isOwner && (
        <div className="mt-10 flex justify-center">
          <LeaveEventButton eventId={eventId} userId={user.id} />
        </div>
      )}
    </div>
  );
}
