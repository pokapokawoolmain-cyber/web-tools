"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ITEMS = [
  {
    id: "pdf",
    label: "PDFツール",
    tag: "PDF結合・圧縮・変換",
    img: "/previews/home/pdf-merge.jpg",
    gradient: "from-blue-500 to-blue-600",
    icon: "📄",
  },
  {
    id: "image",
    label: "画像ツール",
    tag: "画像圧縮・HEIC変換・証明写真",
    img: "/previews/home/image-compress.jpg",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🖼️",
  },
  {
    id: "money",
    label: "お金・計算",
    tag: "FIRE・NISA・手取り計算",
    img: "/previews/home/fire-simulator.jpg",
    gradient: "from-amber-500 to-orange-500",
    icon: "💰",
  },
  {
    id: "work",
    label: "仕事・書類",
    tag: "請求書・見積書・履歴書作成",
    img: "/previews/home/invoice.jpg",
    gradient: "from-violet-500 to-purple-600",
    icon: "📋",
  },
  {
    id: "life",
    label: "生活便利",
    tag: "Wi-Fi QR・シフト計算",
    img: "/previews/home/wifi-qr.jpg",
    gradient: "from-pink-500 to-rose-500",
    icon: "🏠",
  },
] as const;

export function HeroPreviewDeck() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFading(false);
    }, 180);
  }, [activeIdx]);

  useEffect(() => {
    const t = setInterval(() => {
      goTo((activeIdx + 1) % ITEMS.length);
    }, 4200);
    return () => clearInterval(t);
  }, [activeIdx, goTo]);

  const item = ITEMS[activeIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* カテゴリタブ */}
      <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="プレビューカテゴリ">
        {ITEMS.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === activeIdx}
            onClick={() => goTo(i)}
            className={[
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 min-h-[36px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
              i === activeIdx
                ? `bg-gradient-to-r ${p.gradient} text-white shadow-sm`
                : "bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-700",
            ].join(" ")}
          >
            <span aria-hidden="true">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* ブラウザフレーム */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        {/* クロームバー */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
          <span className="w-3 h-3 rounded-full bg-red-400/80 flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80 flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-green-400/80 flex-shrink-0" />
          <div className="ml-2 flex-1 h-5 bg-white dark:bg-zinc-700 rounded text-[11px] text-slate-400 dark:text-zinc-500 px-2 flex items-center gap-1 border border-slate-200 dark:border-zinc-600">
            <span>🔒</span>
            <span>toolboxjp.com</span>
          </div>
        </div>

        {/* スクリーンショット */}
        <div className="relative overflow-hidden bg-slate-50 dark:bg-zinc-900">
          <Image
            src={item.img}
            alt={item.tag}
            width={1280}
            height={760}
            className={[
              "w-full object-cover object-top transition-all duration-200",
              fading ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100",
            ].join(" ")}
            style={{ height: "340px" }}
            priority={activeIdx === 0}
            unoptimized
          />
          {/* ラベルオーバーレイ */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pt-10 pb-3 pointer-events-none">
            <span
              className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${item.gradient} text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-sm`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.tag}
            </span>
          </div>
        </div>
      </div>

      {/* ドット */}
      <div className="flex justify-center gap-1.5" role="tablist" aria-label="スライドインジケーター">
        {ITEMS.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`${p.label}を表示`}
            onClick={() => goTo(i)}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              i === activeIdx
                ? "w-6 bg-blue-500"
                : "w-1.5 bg-slate-300 dark:bg-zinc-600 hover:bg-slate-400 dark:hover:bg-zinc-500",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
