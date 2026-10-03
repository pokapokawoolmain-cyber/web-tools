"use client";
// 参加者（member）が共有イベントを自分のマイイベントから外す。
//   消えるのは自分の membership だけ（イベント・グッズ・他の人のリストには影響しない）。
//   RLS: 自分の member 行だけ削除可能。オーナー行は削除不可。
import { useState } from "react";
import { useRouter } from "next/navigation";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { btn } from "@/lib/goods/ui";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

export function LeaveEventButton({ eventId, userId, variant = "subtle" }: { eventId: string; userId: string; variant?: "subtle" | "primary" }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function leave() {
    setBusy(true);
    const { error } = await goodsBrowserClient().from("event_memberships").delete().eq("event_id", eventId).eq("user_id", userId).eq("role", "member");
    setBusy(false);
    setOpen(false);
    if (error) {
      toast.show("外せませんでした。もう一度お試しください。", { tone: "error" });
      return;
    }
    toast.show("マイイベントから外しました");
    router.replace("/mochico/events");
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={variant === "primary" ? btn.secondary : `${btn.ghost} text-slate-500`}>
        マイイベントから外す
      </button>
      <ConfirmDialog open={open} title="マイイベントから外しますか？" confirmLabel="外す" busy={busy} onConfirm={leave} onCancel={() => setOpen(false)}>
        このイベントでの自分の取得状況は表示されなくなります。共有リンクが有効なら、あとで再び追加できます。
      </ConfirmDialog>
    </>
  );
}
