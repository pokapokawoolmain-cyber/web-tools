"use client";

// テンプレートから自分のリストを一度に作る（イベント → カテゴリ → グッズの順。いつもの作成と同じ権限）
// 途中で失敗したら、作りかけのイベントを削除済みにして、何も残らないようにする
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { friendlyDbError } from "@/lib/goods/validation";
import { btn } from "@/lib/goods/ui";
import { getTemplate, sumPrice } from "@/lib/mochico/templates";
import { useOnline } from "../../../../_components/useOnline";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export function TemplateCreate({ templateId, picked }: { templateId: string; picked: number[] }) {
  const router = useRouter();
  const online = useOnline();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = getTemplate(templateId)!;
  const items = picked.map((i) => t.items[i]);
  const categories = [...new Set(items.map((it) => it.category))];

  async function create() {
    setSaving(true);
    setError(null);
    const supabase = goodsBrowserClient();
    let eventId: string | null = null;
    try {
      // 1. イベント
      const { data: ev, error: evErr } = await supabase
        .from("events")
        .insert({
          title: t.eventTitle,
          description: `ToolBoxJPのテンプレートから作成（価格は${t.checkedAt.replaceAll("-", "/")}時点の公式情報・税込）`,
          start_date: t.startDate ?? null,
          end_date: t.endDate ?? null,
        })
        .select("id")
        .single();
      if (evErr || !ev) throw evErr;
      eventId = ev.id as string;

      // 2. カテゴリ（テンプレートの並び順）
      const { data: cats, error: catErr } = await supabase
        .from("goods_categories")
        .insert(categories.map((name, i) => ({ event_id: eventId, name, sort_order: i })))
        .select("id, name");
      if (catErr || !cats) throw catErr;
      const catId = new Map(cats.map((c) => [c.name as string, c.id as string]));

      // 3. グッズ（まとめて1回で作る）
      const { error: gErr } = await supabase.from("goods").insert(
        items.map((it, i) => ({
          event_id: eventId,
          sort_order: i,
          kind: "normal",
          name: it.name,
          price: it.price,
          description: it.note ?? null,
          category_id: catId.get(it.category) ?? null,
        }))
      );
      if (gErr) throw gErr;

      router.replace(`/mochico/events/${eventId}`);
      router.refresh();
    } catch (err) {
      // 作りかけのイベントを残さない（グッズ・カテゴリはイベントと一緒に見えなくなる）
      if (eventId) await supabase.from("events").update({ deleted_at: new Date().toISOString() }).eq("id", eventId);
      setError(friendlyDbError(err as { code?: string; message?: string }));
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">作成するリスト</p>
        <p className="mt-0.5 text-lg font-bold">{t.eventTitle}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {items.length}点・{categories.length}カテゴリ・合計 {yen(sumPrice(items))}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          作ったあとは、グッズの追加・削除、写真の登録、持っているかどうかの記録を自由にできます。価格は{t.checkedAt.replaceAll("-", "/")}時点の公式情報です。
        </p>
      </div>
      <ul className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 text-sm dark:border-zinc-700">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0 dark:border-zinc-800">
            <span className="min-w-0">{it.name}</span>
            <span className="shrink-0 tabular-nums text-slate-600 dark:text-slate-300">{it.price != null ? yen(it.price) : "—"}</span>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
      <button type="button" onClick={create} disabled={saving || !online || items.length === 0} className={`${btn.primary} w-full`}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        このリストを作成する
      </button>
    </div>
  );
}
