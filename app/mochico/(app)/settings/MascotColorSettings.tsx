"use client";
// 設定 → 見た目 → キャラクターの色（12色・本人だけに反映）
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { card } from "@/lib/goods/ui";
import { MASCOT_COLORS, MASCOT_PALETTES, type MascotColor } from "@/components/mochico/palette";
import { AppMascot, useMascotColor } from "@/components/mochico/MascotColorContext";
import { Mascot } from "@/components/mochico/Mascot";
import { useToast } from "../_components/Toast";

export function MascotColorSettings({ userId }: { userId: string }) {
  const router = useRouter();
  const toast = useToast();
  const { color, setColor } = useMascotColor();
  const [saving, setSaving] = useState(false);

  async function choose(next: MascotColor) {
    if (next === color || saving) return;
    const prev = color;
    setColor(next); // すぐに見た目へ反映（保存に失敗したら戻す）
    setSaving(true);
    const { error } = await goodsBrowserClient().from("profiles").update({ mascot_color: next }).eq("id", userId);
    setSaving(false);
    if (error) {
      setColor(prev);
      toast.show("色を保存できませんでした。もう一度お試しください。", { tone: "error" });
      return;
    }
    router.refresh();
  }

  return (
    <section className={`${card} mt-4 p-5`} aria-labelledby="mascot-color-title">
      <h2 id="mascot-color-title" className="text-base font-bold text-slate-900 dark:text-white">
        見た目
      </h2>
      <div className="mt-3 flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800" aria-hidden="true">
          <AppMascot size={56} float />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">キャラクターの色</p>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">いまは「{MASCOT_PALETTES[color].label}」です。あなたの画面だけに反映されます。</p>
        </div>
      </div>
      <div role="radiogroup" aria-label="キャラクターの色" className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {MASCOT_COLORS.map((c) => {
          const selected = c === color;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={MASCOT_PALETTES[c].label}
              onClick={() => choose(c)}
              className={`relative flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white px-1 py-2 text-[11px] font-bold text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-zinc-900 dark:text-slate-300 ${
                selected ? "border-violet-600 dark:border-violet-400" : "border-slate-200 hover:border-slate-300 dark:border-zinc-700"
              }`}
            >
              <Mascot color={c} size={32} float={false} />
              <span aria-hidden="true">{MASCOT_PALETTES[c].label}</span>
              {selected && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-white" aria-hidden="true">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
