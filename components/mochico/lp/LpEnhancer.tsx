"use client";
// ============================================================
// LP の動きをまとめて担当する小さなスクリプト（JS が無くても LP は読める）
//   * reveal: 画面に入った要素だけをふわっと表示（IntersectionObserver・1回だけ）
//   * companion: ヒーローを過ぎると右下に小さな個体が現れ、セクションごとに表情・位置が変わる
//     （CSS transition で少し遅れてついてくる。scroll ごとの React 再描画はしない）
//   * 画面外・タブ非表示のマスコットはアニメーションを止める
//   * しばらく操作がないと、見えているマスコットが「ねむり」に入る
//   * prefers-reduced-motion では動きを付けない
// ============================================================
import { useEffect, useRef } from "react";
import { Mascot } from "../Mascot";
import s from "./lp.module.css";

const SLEEP_AFTER_MS = 18000;

export function LpEnhancer({ rootId }: { rootId: string }) {
  const companionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.enhanced = "true";

    // ---------- reveal ----------
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            revealIO.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => revealIO.observe(el));

    // ---------- マスコット: 画面外では停止 ----------
    const visible = new Set<HTMLElement>();
    const mascotIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          visible.add(el);
          if (!document.hidden) delete el.dataset.paused;
        } else {
          visible.delete(el);
          el.dataset.paused = "true";
        }
      }
    });
    const watchMascots = () => document.querySelectorAll<HTMLElement>(`#${rootId} [data-mascot]`).forEach((el) => mascotIO.observe(el));
    watchMascots();
    const onVisibility = () => {
      document.querySelectorAll<HTMLElement>(`#${rootId} [data-mascot]`).forEach((el) => {
        if (document.hidden || !visible.has(el)) el.dataset.paused = "true";
        else delete el.dataset.paused;
      });
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---------- companion ----------
    const comp = companionRef.current;
    const compMascot = comp?.querySelector<HTMLElement>("[data-companion-main] [data-mascot]");
    const setMood = (mood: string) => {
      if (!comp || !compMascot) return;
      const state = mood === "peek" ? "peek" : mood === "sleep" ? "sleep" : "idle";
      compMascot.dataset.state = state;
      comp.dataset.buddy = mood === "share" ? "true" : "false";
      comp.dataset.side = mood === "peek" ? "left" : "right";
    };
    let currentMood = "idle";
    const sectionIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const mood = el.dataset.companion ?? "idle";
          if (comp) comp.dataset.visible = mood === "hide" ? "false" : "true";
          currentMood = mood;
          setMood(mood);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-companion]").forEach((el) => sectionIO.observe(el));

    // デモで「取得済み」にしたら、ついてきた個体も一緒に喜ぶ
    const onCheer = () => {
      if (!compMascot || reduced) return;
      compMascot.dataset.state = "happy";
      window.setTimeout(() => setMood(currentMood), 1900);
    };
    window.addEventListener("mochico:cheer", onCheer);

    // ---------- しばらく操作がなければ「ねむり」 ----------
    let sleepTimer = 0;
    let asleep = false;
    const sleepTargets = () => document.querySelectorAll<HTMLElement>(`#${rootId} [data-mascot][data-state="idle"], #${rootId} [data-mascot][data-sleeping="true"]`);
    const wake = () => {
      if (asleep) {
        sleepTargets().forEach((el) => {
          if (el.dataset.sleeping === "true") {
            el.dataset.state = "idle";
            delete el.dataset.sleeping;
          }
        });
        asleep = false;
      }
      window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => {
        if (document.hidden || reduced) return;
        sleepTargets().forEach((el) => {
          if (visible.has(el) && el.dataset.state === "idle") {
            el.dataset.state = "sleep";
            el.dataset.sleeping = "true";
          }
        });
        asleep = true;
      }, SLEEP_AFTER_MS);
    };
    const activity = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    activity.forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
    wake();

    return () => {
      revealIO.disconnect();
      mascotIO.disconnect();
      sectionIO.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mochico:cheer", onCheer);
      activity.forEach((ev) => window.removeEventListener(ev, wake));
      window.clearTimeout(sleepTimer);
    };
  }, [rootId]);

  return (
    <div ref={companionRef} className={s.companion} data-visible="false" data-side="right" data-buddy="false" aria-hidden="true">
      <span className={s.buddy}>
        <Mascot size={36} color="cyan" />
      </span>
      <span data-companion-main="">
        <Mascot size={44} />
      </span>
    </div>
  );
}
