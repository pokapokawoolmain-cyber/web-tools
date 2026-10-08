"use client";
// イベントの作成・編集フォーム
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { removeImages, uploadProcessedImage } from "@/lib/goods/image/storage";
import { LIMITS, friendlyDbError, validateEvent, type FieldErrors } from "@/lib/goods/validation";
import type { GoodsEvent } from "@/lib/goods/types";
import { btn, field } from "@/lib/goods/ui";
import { ImagePicker, type ImageChange } from "./ImagePicker";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";
import { ConfirmDialog } from "./ConfirmDialog";

export function EventForm({ event }: { event?: GoodsEvent }) {
  const router = useRouter();
  const toast = useToast();
  const online = useOnline();
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startDate, setStartDate] = useState(event?.startDate ?? "");
  const [endDate, setEndDate] = useState(event?.endDate ?? "");
  const [cover, setCover] = useState<ImageChange>({ kind: "keep" });
  const [errors, setErrors] = useState<FieldErrors>({});
  // 入力し直したらその欄のエラーは消す（直したのに赤いままにしない）
  const clearError = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateEvent({ title, description, startDate, endDate });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(`ev-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    const supabase = goodsBrowserClient();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
    };

    try {
      let eventId = event?.id;
      if (!eventId) {
        const { data, error } = await supabase.from("events").insert(payload).select("id").single();
        if (error || !data) throw error;
        eventId = data.id as string;
      } else {
        const { error } = await supabase.from("events").update(payload).eq("id", eventId);
        if (error) throw error;
      }

      // カバー画像（イベント行が存在してからでないと Storage の RLS を通らない）
      if (cover.kind === "new") {
        try {
          const up = await uploadProcessedImage(supabase, eventId, "cover", cover.img);
          const { error } = await supabase.from("events").update({ cover_image_path: up.fullPath }).eq("id", eventId);
          if (error) {
            await removeImages(supabase, [up.fullPath, up.thumbPath]);
            throw error;
          }
          if (event?.coverImagePath) await removeImages(supabase, [event.coverImagePath, event.coverImagePath.replace(/-full\./, "-thumb.")]);
        } catch {
          toast.show("イベントは保存しましたが、画像のアップロードに失敗しました。編集画面から再度お試しください。", { tone: "error", duration: 7000 });
        }
      } else if (cover.kind === "remove" && event?.coverImagePath) {
        const { error } = await supabase.from("events").update({ cover_image_path: null }).eq("id", eventId);
        if (!error) await removeImages(supabase, [event.coverImagePath, event.coverImagePath.replace(/-full\./, "-thumb.")]);
      }

      if (event) {
        toast.show("イベントを更新しました");
        router.replace(`/mochico/events/${eventId}`);
      } else {
        // 作成直後はグッズ登録へ（イベント作成 → グッズ登録 → 一覧 の流れ）
        router.replace(`/mochico/events/${eventId}/items/new?first=1`);
      }
      router.refresh();
    } catch (err) {
      setSaving(false);
      toast.show(friendlyDbError(err as { code?: string; message?: string }), { tone: "error" });
    }
  }

  async function onDelete() {
    if (!event) return;
    setSaving(true);
    const { error } = await goodsBrowserClient().from("events").update({ deleted_at: new Date().toISOString() }).eq("id", event.id);
    if (error) {
      setSaving(false);
      setConfirmDelete(false);
      toast.show(friendlyDbError(error), { tone: "error" });
      return;
    }
    toast.show("イベントを削除しました");
    router.replace("/mochico/events");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="ev-title" className={field.label}>
          イベント名 <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="ev-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearError("title");
          }}
          maxLength={LIMITS.eventTitle}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "ev-title-err" : undefined}
          className={field.input}
          placeholder="例: 〇〇 LIVE TOUR 2026 東京公演"
          autoComplete="off"
        />
        {errors.title && <p id="ev-title-err" className={field.error}>{errors.title}</p>}
      </div>

      {/* iPhone の日付欄は既定で縮まないため、列と入力欄の両方を縮められるようにする（横はみ出し防止） */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <div className="min-w-0">
          <label htmlFor="ev-startDate" className={field.label}>開始日</label>
          <input id="ev-startDate" type="date" value={startDate} onChange={(e) => {
              setStartDate(e.target.value);
              clearError("endDate");
            }} className={field.dateInput} />
        </div>
        <div className="min-w-0">
          <label htmlFor="ev-endDate" className={field.label}>終了日</label>
          <input
            id="ev-endDate"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => {
              setEndDate(e.target.value);
              clearError("endDate");
            }}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? "ev-endDate-err" : undefined}
            className={field.dateInput}
          />
        </div>
        {errors.endDate && <p id="ev-endDate-err" className={`${field.error} col-span-2`}>{errors.endDate}</p>}
        <p className={`${field.hint} col-span-2`}>1日だけのイベントは開始日のみでOK</p>
      </div>

      <div>
        <label htmlFor="ev-description" className={field.label}>概要</label>
        <textarea
          id="ev-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearError("description");
          }}
          maxLength={LIMITS.eventDescription}
          rows={3}
          aria-invalid={!!errors.description}
          className={field.input}
          placeholder="会場、物販の時間、メモなど"
        />
        {errors.description && <p className={field.error}>{errors.description}</p>}
      </div>

      <ImagePicker label="カバー画像" currentUrl={event?.coverUrl ?? null} value={cover} onChange={setCover} aspect="wide" disabled={saving} />

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        {event ? (
          <button type="button" onClick={() => setConfirmDelete(true)} disabled={saving || !online} className={btn.danger}>
            イベントを削除
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={saving || !online} className={`${btn.primary} sm:min-w-40`}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {event ? "保存する" : "作成してグッズを登録"}
        </button>
      </div>
      {!online && <p className="text-sm text-amber-700 dark:text-amber-400">オフラインのため保存できません。</p>}

      <ConfirmDialog
        open={confirmDelete}
        title="このイベントを削除しますか？"
        confirmLabel="削除する"
        busy={saving}
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        登録したグッズもあわせて表示されなくなります。この操作は元に戻せません。
      </ConfirmDialog>
    </form>
  );
}
