"use client";

import { useEffect, useRef, useState } from "react";
import { getSnsKitAttribution } from "@/lib/sns-starter-kit/attribution";
import { deviceCategory, trackSnsKit, type SnsKitEventName } from "@/lib/analytics/sns-starter-kit";
import s from "./lp.module.css";

// ============================================================
// ページ全体の後付け拡張（サーバー描画された内容には手を加えない）:
//   - 表示イベント / セクション到達イベント / CTAクリック
//   - スクロールでのフェードイン（JS有効時のみ隠す。無効でも内容は見える）
//   - モバイルの追従CTA（Hero通過後に表示し、価格・予約・フッターでは隠す）
// すべて IntersectionObserver ベース。scroll イベントは購読しない。
// ============================================================

function props() {
  const a = getSnsKitAttribution();
  return {
    source: a.source,
    utm_source: a.utmSource,
    utm_medium: a.utmMedium,
    utm_campaign: a.utmCampaign,
    device_category: deviceCategory(),
  };
}

export function LpEnhancer({ rootId }: { rootId: string }) {
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroPassed = useRef(false);
  const hideZones = useRef(new Set<Element>());

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    trackSnsKit("starter_lp_view", props());

    // ── フェードイン ──
    root.dataset.motion = "on";
    const revealIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            revealIo.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px 0px 0px", threshold: 0 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => {
      // 最初から画面内にある要素は即表示（初期表示でちらつかせない）
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.setAttribute("data-in", "");
      else revealIo.observe(el);
    });

    // ── セクション到達 ──
    const trackIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const name = (e.target as HTMLElement).dataset.track as SnsKitEventName | undefined;
          if (name) trackSnsKit(name, props());
          trackIo.unobserve(e.target);
        }
      },
      // 縦に長いセクション（Signature Scroll）でも発火するよう、比率ではなく「画面の上65%に入ったか」で判定
      { threshold: 0, rootMargin: "0px 0px -35% 0px" },
    );
    root.querySelectorAll("[data-track]").forEach((el) => trackIo.observe(el));

    // ── CTAクリック（委譲） ──
    const onClick = (ev: MouseEvent) => {
      const target = (ev.target as HTMLElement | null)?.closest("[data-cta]");
      if (target) trackSnsKit("starter_reserve_cta_click", props());
      const hero = (ev.target as HTMLElement | null)?.closest("[data-hero]");
      if (hero) trackSnsKit("starter_hero_engaged", props());
    };
    root.addEventListener("click", onClick);

    // ── Hero を読み進めた（一定量スクロール） ──
    const heroEl = root.querySelector("[data-hero]");
    const heroIo = new IntersectionObserver(
      ([e]) => {
        // Hero の下端が画面の上半分より上に来た = 読み進めた
        const passed = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (passed) trackSnsKit("starter_hero_engaged", props());
        heroPassed.current = passed;
        setStickyVisible(heroPassed.current && hideZones.current.size === 0);
      },
      { threshold: 0, rootMargin: "0px 0px -40% 0px" },
    );
    if (heroEl) heroIo.observe(heroEl);

    // ── 追従CTAを隠す領域（価格・予約・フッター） ──
    const zones = [
      ...Array.from(root.querySelectorAll("[data-hide-sticky]")),
      ...Array.from(document.querySelectorAll("footer")),
    ];
    const zoneIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) hideZones.current.add(e.target);
        else hideZones.current.delete(e.target);
      }
      setStickyVisible(heroPassed.current && hideZones.current.size === 0);
    });
    zones.forEach((z) => zoneIo.observe(z));

    return () => {
      revealIo.disconnect();
      trackIo.disconnect();
      heroIo.disconnect();
      zoneIo.disconnect();
      root.removeEventListener("click", onClick);
    };
  }, [rootId]);

  return (
    <div className={s.sticky} data-visible={stickyVisible ? "" : undefined} aria-hidden={!stickyVisible}>
      <p className={s.stickyPrice}>
        49,800円
        <small>税込 ・ 販売準備中</small>
      </p>
      <a
        href="#reserve"
        className={`${s.btn} ${s.stickyBtn}`}
        data-cta="sticky"
        tabIndex={stickyVisible ? 0 : -1}
      >
        先行予約
      </a>
    </div>
  );
}
