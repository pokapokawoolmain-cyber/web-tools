"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollScale } from "./ScrollFX";

const STORIES = [
  {
    num: "01",
    category: "PDF",
    heading: "PDFをまとめる。\n圧縮する。変換する。",
    desc: "複数のPDFを1つに結合。ファイルを分割。容量を圧縮。画像からPDF、PDFから画像へ。すべてブラウザで完結。",
    img: "/previews/home/pdf-merge.jpg",
    href: "/pdf",
    ctaLabel: "PDFツールを見る",
    tools: [
      { name: "PDF結合", href: "/tools/pdf-merge" },
      { name: "PDF圧縮", href: "/tools/pdf-compress" },
      { name: "JPG→PDF変換", href: "/tools/jpg-to-pdf" },
      { name: "PDF→JPG変換", href: "/tools/pdf-to-jpg" },
    ],
    accent: "text-blue-500 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  {
    num: "02",
    category: "画像",
    heading: "画像を軽くする。\n変換する。証明写真にする。",
    desc: "JPG・PNG・HEICの圧縮と変換。証明写真を自動レイアウト。写真データはすべてブラウザ内で処理される。",
    img: "/previews/home/image-compress.jpg",
    href: "/image",
    ctaLabel: "画像ツールを見る",
    tools: [
      { name: "画像圧縮", href: "/tools/image-compress" },
      { name: "HEIC→JPG変換", href: "/tools/heic-to-jpg" },
      { name: "証明写真作成", href: "/tools/id-photo" },
      { name: "画像リサイズ", href: "/tools/image-resize" },
    ],
    accent: "text-emerald-500 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    num: "03",
    category: "お金・計算",
    heading: "FIREまでの年数を\nグラフで確かめる。",
    desc: "FIREシミュレーター・新NISA積立・手取り計算・住宅ローン・ふるさと納税。数字を入れるだけで将来が見える。",
    img: "/previews/home/fire-result.jpg",
    href: "/money",
    ctaLabel: "計算ツールを見る",
    tools: [
      { name: "FIREシミュレーター", href: "/tools/fire-simulator" },
      { name: "新NISA積立計算", href: "/tools/nisa-calculator" },
      { name: "手取り計算", href: "/tools/net-income" },
      { name: "住宅ローン計算", href: "/tools/mortgage-calculator" },
    ],
    accent: "text-amber-500 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  {
    num: "04",
    category: "仕事・書類",
    heading: "請求書を、\nその場で作れる。",
    desc: "請求書・見積書・業務委託契約書・NDA・履歴書。フォームを埋めてPDF出力まで一気に完結。Word不要。",
    img: "/previews/home/invoice-result.jpg",
    href: "/business",
    ctaLabel: "書類ツールを見る",
    tools: [
      { name: "請求書作成", href: "/tools/invoice-generator" },
      { name: "見積書作成", href: "/tools/estimate-generator" },
      { name: "業務委託契約書", href: "/tools/business-contract-generator" },
      { name: "履歴書・職務経歴書", href: "/tools/resume-builder" },
    ],
    accent: "text-violet-500 dark:text-violet-400",
    border: "border-violet-500/20",
  },
  {
    num: "05",
    category: "生活便利",
    heading: "Wi-FiのQRコードを\n1秒で作る。",
    desc: "来客用Wi-FiのQRコード生成。シフト給与計算。ガソリン代計算。日常の小さな作業をさっと片付ける。",
    img: "/previews/home/wifi-qr-result.jpg",
    href: "/tools/lifestyle",
    ctaLabel: "生活ツールを見る",
    tools: [
      { name: "Wi-Fi QRコード生成", href: "/tools/wifi-qr" },
      { name: "シフト給与計算", href: "/tools/shift-salary" },
      { name: "ガソリン代計算", href: "/tools/gas-calculator" },
      { name: "副業利益・税金計算", href: "/tools/side-job-profit" },
    ],
    accent: "text-pink-500 dark:text-pink-400",
    border: "border-pink-500/20",
  },
] as const;

export function StoryStickySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const activeRef = useRef(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = useCallback((idx: number) => {
    if (idx === activeRef.current) return;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      activeRef.current = idx;
      setFading(false);
    }, 180);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    panelRefs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) goTo(idx);
        },
        {
          // Fire when panel occupies the middle ~60% of viewport
          rootMargin: "-18% 0px -18% 0px",
          threshold: 0,
        }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [goTo]);

  const story = STORIES[activeIdx];

  return (
    <section className="bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
      {/* Section heading */}
      <div className="container-base pt-16 sm:pt-24 pb-12 sm:pb-16">
        <ScrollReveal>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4">
            WHAT YOU CAN DO
          </p>
        </ScrollReveal>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
          <ScrollReveal mode="clip">
            <span className="block">ひとつのサイトで、</span>
          </ScrollReveal>
          <ScrollReveal mode="clip" delay={150}>
            <span className="block">ここまでできる。</span>
          </ScrollReveal>
        </h2>
      </div>

      {/* Desktop: sticky right panel */}
      <div className="hidden lg:flex container-base gap-16 xl:gap-24 pb-24">
        {/* Left: scrolling text panels */}
        <div className="w-1/2 flex-shrink-0">
          {STORIES.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="min-h-screen flex items-center py-20"
            >
              <div>
                <p className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-5 ${s.accent}`}>
                  {s.num} — {s.category}
                </p>
                <h3 className="text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6 whitespace-pre-line">
                  {s.heading}
                </h3>
                <p className="text-[15px] text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-sm">
                  {s.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-400 dark:hover:border-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-all"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href={s.href}
                  className={`inline-flex items-center gap-1.5 text-[14px] font-semibold ${s.accent} hover:underline underline-offset-2`}
                >
                  {s.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Right: sticky image */}
        <div className="w-1/2 flex-shrink-0">
          <div className="sticky top-8 h-[calc(100vh-4rem)] flex items-center">
            <div className="w-full">
              {/* Browser frame */}
              <div
                className={[
                  "rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-700 transition-all duration-300 ease-out",
                  fading ? "opacity-0 scale-[0.94] blur-sm" : "opacity-100 scale-100 blur-0",
                ].join(" ")}
              >
                {/* Chrome bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80" />
                  <div className="ml-2 flex-1 h-5 bg-white dark:bg-zinc-700 rounded text-[11px] text-slate-400 dark:text-zinc-500 px-2 flex items-center gap-1 border border-slate-200 dark:border-zinc-600">
                    <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                    <span>toolboxjp.com</span>
                  </div>
                </div>
                <Image
                  src={story.img}
                  alt={`${story.category}ツールの操作画面`}
                  width={1280}
                  height={760}
                  className="w-full object-cover object-top"
                  style={{ height: "380px" }}
                  unoptimized
                  priority={activeIdx === 0}
                />
                {/* Category label */}
                <div className="bg-white dark:bg-zinc-900 px-4 py-3 border-t border-slate-100 dark:border-zinc-800">
                  <span className={`text-[12px] font-semibold ${story.accent}`}>
                    {story.num} / {story.category}
                  </span>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mt-5">
                {STORIES.map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "h-1 rounded-full transition-all duration-400",
                      i === activeIdx
                        ? "w-6 bg-slate-900 dark:bg-white"
                        : "w-1.5 bg-slate-200 dark:bg-zinc-700",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked compact panels */}
      <div className="lg:hidden container-base pb-16">
        <div className="space-y-12">
          {STORIES.map((s) => (
            <div
              key={s.num}
              className="border-t border-slate-100 dark:border-zinc-800 pt-10"
            >
              <p className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-3 ${s.accent}`}>
                {s.num} — {s.category}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3 whitespace-pre-line">
                {s.heading}
              </h3>
              <p className="text-[14px] text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
                {s.desc}
              </p>
              {/* Mini preview（ズームイン演出） */}
              <ScrollScale from={0.9} className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-md mb-5">
                <Image
                  src={s.img}
                  alt={`${s.category}ツール`}
                  width={800}
                  height={480}
                  className="w-full object-cover object-top"
                  style={{ height: "180px" }}
                  unoptimized
                />
              </ScrollScale>
              <div className="flex flex-wrap gap-2">
                {s.tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
