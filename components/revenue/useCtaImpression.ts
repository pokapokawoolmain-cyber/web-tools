"use client";
import { useEffect, useRef } from "react";

/**
 * CTAが実際にviewportへ入った瞬間に1回だけonImpressionを呼ぶ。
 * LP Viewだけで判断しない（Phase Revenue 0の計測方針）ための土台。
 */
export function useCtaImpression<T extends HTMLElement>(onImpression: () => void) {
  const ref = useRef<T | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onImpression();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
