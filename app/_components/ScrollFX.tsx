"use client";

// ========================================
// スクロール連動FX（Apple製品ページ風の動き）
// - Parallax:    スクロール速度差で奥行きを出す
// - ScrollScale: ビューポート進入に合わせてズーム＋シャープイン
// rAF + transform/opacity のみ（レイアウトを揺らさない）
// prefers-reduced-motion では全て無効化
// ========================================

import { useEffect, useRef, useState, ReactNode } from "react";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * 要素がビューポート中央からどれだけ離れているかに応じて translateY。
 * speed: -1〜1 目安。負=スクロールよりゆっくり（奥）、正=速い（手前）。
 */
export function Parallax({
  children,
  speed = -0.1,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 要素中心とビューポート中心の距離（-vh/2〜vh/2 程度）
      const offset = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, reduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: reduced ? undefined : "transform" }}>
      {children}
    </div>
  );
}

/**
 * ビューポートに入るにつれて scale/opacity/blur が 1 に収束する
 * 「ズームしながらピントが合う」Apple 風エフェクト。
 * progress: 要素上端が画面下端に来た時 0 → 要素中心が画面中央で 1
 */
export function ScrollScale({
  children,
  from = 0.92,
  withBlur = false,
  className = "",
}: {
  children: ReactNode;
  /** 開始時のスケール（0.8〜0.95推奨） */
  from?: number;
  /** ピントが合う演出（大きな見出し・画像向け） */
  withBlur?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0: 要素上端が画面下端 / 1: 要素中心が画面中央
      const start = vh;
      const end = vh / 2 - rect.height / 2;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const scale = from + (1 - from) * p;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = `${0.3 + 0.7 * p}`;
      if (withBlur) el.style.filter = `blur(${(1 - p) * 8}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [from, withBlur, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: reduced ? undefined : "transform, opacity",
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
