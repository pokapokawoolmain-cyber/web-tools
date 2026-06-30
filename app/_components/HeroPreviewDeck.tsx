"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FileText, ImageIcon, TrendingUp, FileCheck, Sparkles, Lock } from "lucide-react";

const ITEMS = [
  {
    id: "pdf",
    label: "PDF",
    tag: "PDF結合・圧縮・変換",
    img: "/previews/home/pdf-merge.jpg",
    mobileImg: "/previews/home/mobile-pdf-merge.jpg",
    gradient: "from-blue-500 to-blue-600",
    Icon: FileText,
  },
  {
    id: "image",
    label: "画像",
    tag: "画像圧縮・HEIC変換・証明写真",
    img: "/previews/home/image-compress.jpg",
    mobileImg: "/previews/home/mobile-image-compress.jpg",
    gradient: "from-emerald-500 to-teal-600",
    Icon: ImageIcon,
  },
  {
    id: "money",
    label: "お金・計算",
    tag: "FIRE・NISA・手取り計算",
    img: "/previews/home/fire-simulator.jpg",
    mobileImg: "/previews/home/mobile-fire-simulator.jpg",
    gradient: "from-amber-500 to-orange-500",
    Icon: TrendingUp,
  },
  {
    id: "work",
    label: "仕事・書類",
    tag: "請求書・見積書・履歴書作成",
    img: "/previews/home/invoice.jpg",
    mobileImg: "/previews/home/mobile-invoice.jpg",
    gradient: "from-violet-500 to-purple-600",
    Icon: FileCheck,
  },
  {
    id: "life",
    label: "生活便利",
    tag: "Wi-Fi QR・シフト計算",
    img: "/previews/home/wifi-qr.jpg",
    mobileImg: "/previews/home/mobile-wifi-qr.jpg",
    gradient: "from-pink-500 to-rose-500",
    Icon: Sparkles,
  },
] as const;

export function HeroPreviewDeck() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      setFading(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setFading(false);
      }, 180);
    },
    [activeIdx]
  );

  useEffect(() => {
    const t = setInterval(() => {
      goTo((activeIdx + 1) % ITEMS.length);
    }, 4200);
    return () => clearInterval(t);
  }, [activeIdx, goTo]);

  const item = ITEMS[activeIdx];

  return (
    <div className="relative">
      <div className="flex flex-col gap-3">
        {/* カテゴリタブ */}
        <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="プレビューカテゴリ">
          {ITEMS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === activeIdx}
                onClick={() => goTo(i)}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 min-h-[36px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900",
                  i === activeIdx
                    ? `bg-gradient-to-r ${p.gradient} text-white shadow-sm`
                    : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15 border border-white/10",
                ].join(" ")}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* PCブラウザフレーム */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-400/70 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-green-400/70 flex-shrink-0" />
            <div className="ml-2 flex-1 h-5 bg-zinc-700 rounded text-[11px] text-zinc-400 px-2 flex items-center gap-1.5 border border-white/5">
              <Lock className="w-2.5 h-2.5 flex-shrink-0 text-zinc-500" />
              <span>toolboxjp.com</span>
            </div>
          </div>
          <div className="relative overflow-hidden bg-zinc-900">
            <Image
              src={item.img}
              alt={item.tag}
              width={1280}
              height={760}
              className={[
                "w-full object-cover object-top transition-all duration-200",
                fading ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100",
              ].join(" ")}
              style={{ height: "300px" }}
              priority={activeIdx === 0}
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pt-10 pb-3 pointer-events-none">
              <span className="text-[11px] font-semibold text-white/80 tracking-wide">
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
                "h-1 rounded-full transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
                i === activeIdx
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/20 hover:bg-white/40",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* iPhone 17 風フローティングモック — lgのみ */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute -bottom-12 -left-10 z-10"
      >
        {/* チタニウムフレーム — iPhone 17 比率 (外枠半径 ≈ width×12%) */}
        <div className="relative w-[120px] bg-[#1c1c1e] rounded-[14px] p-[5px] shadow-[0_24px_56px_rgba(0,0,0,0.65),0_0_0_1.5px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(255,255,255,0.08),0_0_40px_rgba(255,255,255,0.03)]">
          {/* スクリーン領域 */}
          <div className="relative rounded-[10px] overflow-hidden bg-black">
            {/* Dynamic Island ピル (幅 ≈ 画面幅×32%) */}
            <div className="absolute top-[5px] left-1/2 -translate-x-1/2 z-20 w-[35px] h-[10px] bg-black rounded-full" />
            {/* スクリーンショット — 390:844 自然比率 */}
            <div
              className={[
                "transition-opacity duration-200",
                fading ? "opacity-0" : "opacity-100",
              ].join(" ")}
            >
              <Image
                src={item.mobileImg}
                alt=""
                width={390}
                height={844}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            {/* ホームインジケーター */}
            <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 z-20 w-8 h-[3px] bg-white/20 rounded-full" />
          </div>
          {/* 電源ボタン */}
          <div className="absolute right-[-3px] top-[28%] w-[3px] h-8 bg-[#2e2e2e] rounded-r-full" />
        </div>
      </div>
    </div>
  );
}
