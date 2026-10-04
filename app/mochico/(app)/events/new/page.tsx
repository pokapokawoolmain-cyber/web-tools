import type { Metadata } from "next";
import { requireUser } from "@/lib/goods/data";
import { EventForm } from "../../_components/EventForm";
import { PageHeader } from "../../_components/PageHeader";

export const metadata: Metadata = { title: "イベントを作成" };

export default async function NewEventPage() {
  await requireUser("/mochico/events/new");
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <PageHeader title="イベントを作成" backHref="/mochico/events" backLabel="マイイベント" />
      <EventForm />
    </div>
  );
}
