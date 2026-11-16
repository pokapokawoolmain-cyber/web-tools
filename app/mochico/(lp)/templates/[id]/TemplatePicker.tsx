"use client";

// テンプレートのグッズを選んで、合計金額を見ながら「このリストで始める」へ進む画面
import { useMemo, useState } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { MascotSvg } from "@/lib/mochico/icon-render";
import { sumPrice, type GoodsTemplate } from "@/lib/mochico/templates";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
};

export function TemplatePicker({ template: t, appEnabled }: { template: GoodsTemplate; appEnabled: boolean }) {
  const [picked, setPicked] = useState<Set<number>>(() => new Set(t.selectAll ? t.items.map((_, i) => i) : []));
  const groups = useMemo(() => {
    const map = new Map<string, number[]>();
    t.items.forEach((it, i) => map.set(it.category, [...(map.get(it.category) ?? []), i]));
    return [...map.entries()];
  }, [t.items]);

  const chosen = [...picked].sort((a, b) => a - b);
  const total = sumPrice(chosen.map((i) => t.items[i]));
  const startHref = `/mochico/events/new/template/${t.id}?pick=${chosen.join(",")}`;

  const toggle = (i: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const setGroup = (idx: number[], on: boolean) =>
    setPicked((prev) => {
      const next = new Set(prev);
      idx.forEach((i) => (on ? next.add(i) : next.delete(i)));
      return next;
    });

  const onStart = () => {
    try {
      sendGAEvent("event", "mochico_template_start", { template_id: t.id, item_count: chosen.length, transport_type: "beacon" });
    } catch {
      // 計測の失敗で遷移を止めない
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9ff] text-[#1b1430]">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-40">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[13px] font-bold text-[#5a2fd2]">
            <MascotSvg size={22} />
            Mochico のグッズ テンプレート
          </p>
          <h1 className="text-[24px] sm:text-[28px] font-black leading-snug">{t.title}</h1>
          <p className="text-[15px] leading-relaxed text-[#3e3756]">{t.lead}</p>
          <p className="text-[12px] text-[#625b7c]">
            価格は{formatDate(t.checkedAt)}に{" "}
            <a href={t.source.url} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">
              {t.source.label}
              <ExternalLink className="w-3 h-3" aria-hidden />
            </a>{" "}
            で確認したものです（税込）。{t.coverage}
          </p>
          {t.articleHref && (
            <p className="text-[13px]">
              <Link href={t.articleHref} className="text-[#5a2fd2] underline">
                買い方・日程は記事で確認する
              </Link>
            </p>
          )}
        </header>

        {!t.selectAll && (
          <p className="mt-6 rounded-xl bg-[#efe9ff] px-4 py-3 text-[14px]">欲しい作品・グッズを選んでください。作品名の「すべて選ぶ」でまとめて選べます。</p>
        )}

        <div className="mt-6 space-y-5">
          {groups.map(([cat, idx]) => {
            const allOn = idx.every((i) => picked.has(i));
            return (
              <section key={cat} aria-label={cat} className="rounded-2xl border border-[#ebe6f6] bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[#ebe6f6] px-4 py-2.5">
                  <h2 className="text-[15px] font-bold">{cat}</h2>
                  <button
                    type="button"
                    onClick={() => setGroup(idx, !allOn)}
                    className="min-h-[40px] rounded-full border border-[#ddd2ff] px-3 text-[12px] font-bold text-[#5a2fd2]"
                  >
                    {allOn ? "すべて外す" : "すべて選ぶ"}
                  </button>
                </div>
                <ul>
                  {idx.map((i) => {
                    const it = t.items[i];
                    const on = picked.has(i);
                    return (
                      <li key={i} className="border-b border-[#f3f0fa] last:border-b-0">
                        <label className="flex cursor-pointer items-start gap-3 px-4 py-3 min-h-[52px]">
                          <input type="checkbox" checked={on} onChange={() => toggle(i)} className="peer sr-only" />
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-[#7c4dff] ${
                              on ? "border-[#7c4dff] bg-[#7c4dff] text-white" : "border-[#cfc8e4] bg-white"
                            }`}
                          >
                            {on && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-semibold leading-snug">{it.name}</span>
                            {it.note && <span className="block text-[12px] text-[#625b7c]">{it.note}</span>}
                          </span>
                          <span className="shrink-0 text-[14px] font-bold tabular-nums">{it.price != null ? yen(it.price) : "—"}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {/* 画面下の合計とボタン（選んだ数と合計金額をいつでも見られるように） */}
      <div className="fixed inset-x-0 bottom-0 border-t border-[#ebe6f6] bg-white/95 backdrop-blur" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="text-[12px] text-[#625b7c]">{chosen.length}点を選択中</p>
            <p className="text-[20px] font-black tabular-nums">合計 {yen(total)}</p>
          </div>
          {appEnabled ? (
            chosen.length > 0 ? (
              <Link
                href={startHref}
                onClick={onStart}
                className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-[#7c4dff] px-5 text-[15px] font-bold text-white hover:bg-[#5a2fd2]"
              >
                このリストで始める
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span className="inline-flex min-h-[48px] items-center rounded-xl bg-[#ebe6f6] px-5 text-[14px] font-bold text-[#625b7c]">グッズを選んでください</span>
            )
          ) : (
            <span className="inline-flex min-h-[48px] items-center rounded-xl bg-[#ebe6f6] px-5 text-[14px] font-bold text-[#625b7c]">アプリは近日公開</span>
          )}
        </div>
      </div>
    </div>
  );
}
