"use client";
// ============================================================
// ランダム商品カードの取得率を、カードの枠線に沿ったピンクの線で表す
//   * カードの枠（border-2・rounded-2xl）と同じ位置・太さ・角丸に重ねる SVG
//   * 左上の角の右から時計回りに、外周の実際の長さ × 取得率 だけ描く（角丸の部分も長さどおり）
//   * カードの大きさは ResizeObserver で測る（画面幅・縦横比が変わっても追従）
// ============================================================
import { useEffect, useRef, useState } from "react";

const RADIUS = 16; // rounded-2xl（枠の外側の半径）
const STROKE = 2; // border-2

/** 角丸長方形（幅 w・高さ h・半径 r）の外周の長さ。直線部分 ＋ 4つの 1/4 円 */
export function roundedRectPerimeter(w: number, h: number, r: number): number {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  return 2 * (w - 2 * rr) + 2 * (h - 2 * rr) + 2 * Math.PI * rr;
}

export function ProgressBorder({ progress }: { progress: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // contentRect は transform（タップ時の縮小アニメーション）の影響を受けない
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s && s.w === width && s.h === height ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const p = Math.min(1, Math.max(0, progress));
  // 線の中心線は枠の内側 1px（= 太さの半分）を通る → 外側の半径 16・内側の半径 14 の枠とぴったり重なる
  const w = size ? size.w - STROKE : 0;
  const h = size ? size.h - STROKE : 0;
  const r = RADIUS - STROKE / 2;
  const length = size ? roundedRectPerimeter(w, h, r) : 0;

  return (
    <svg ref={ref} aria-hidden="true" className="pointer-events-none absolute -inset-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)]">
      {size && p > 0 && w > 0 && h > 0 && (
        <rect
          data-progress={p.toFixed(4)}
          x={STROKE / 2}
          y={STROKE / 2}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill="none"
          className="stroke-pink-500"
          strokeWidth={STROKE}
          // rect の線は (x + rx, y)＝左上の角の右から時計回りに描かれる
          strokeDasharray={`${length * p} ${length}`}
        />
      )}
    </svg>
  );
}
