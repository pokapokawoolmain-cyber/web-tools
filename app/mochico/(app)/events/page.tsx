import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getMyEvents, requireUser } from "@/lib/goods/data";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { EventList } from "../_components/EventList";
import { StateMessage } from "../_components/StateMessage";
import { HomeScreenPrompt } from "../_components/HomeScreenPrompt";
import { AppMascot } from "@/components/mochico/MascotColorContext";


export const metadata: Metadata = { title: "マイイベント" };

export default async function MyEventsPage() {
  const { supabase, user } = await requireUser("/mochico/events");
  const events = await getMyEvents(supabase);

  if (events.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <HomeScreenPrompt userId={user.id} />
        </div>
        <StateMessage
        plainIcon
        icon={<AppMascot size={72} state="peek" />}
        title="最初のイベントを作りましょう"
        action={{ href: "/mochico/events/new", label: "イベントを作成" }}
      >
        ライブやイベントを作って、グッズの写真と価格を登録すると、取得状況を一覧で管理できます。
        </StateMessage>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <HomeScreenPrompt userId={user.id} />
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">マイイベント</h1>
        <Link href="/mochico/events/new" className={cn(btn.primary, "hidden sm:inline-flex")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          イベントを作成
        </Link>
      </div>

      <EventList events={events} />

      {/* スマホ: 親指の届く位置に作成ボタン */}
      <Link
        href="/mochico/events/new"
        className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 sm:hidden"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        aria-label="イベントを作成"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </Link>
    </div>
  );
}
