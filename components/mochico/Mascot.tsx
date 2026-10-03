// ============================================================
// Mochico のドット絵キャラクター（SVG・数KB・JS 不要で待機アニメーション）
//   色は CSS 変数で差し替え（形・表情は全色共通）。装飾なので既定でスクリーンリーダーから隠す。
// ============================================================
import type { CSSProperties } from "react";
import { BODY, EYES_CLOSED, EYES_HAPPY, EYES_OPEN, FILL, ZZZ, rowRuns } from "./sprite";
import { DEFAULT_MASCOT_COLOR, paletteVars, type MascotColor } from "./palette";
import s from "./mascot.module.css";

export type MascotState = "idle" | "happy" | "sleep" | "peek";

const BODY_RUNS = rowRuns(BODY);

interface Props {
  color?: MascotColor;
  state?: MascotState;
  /** 表示幅（px）。ドットが崩れないよう 18 の倍数を推奨 */
  size?: number;
  float?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 意味を持たせる場合だけ指定（既定は装飾扱い） */
  label?: string;
  paused?: boolean;
}

export function Mascot({ color = DEFAULT_MASCOT_COLOR, state = "idle", size = 72, float = true, className, style, label, paused }: Props) {
  return (
    <span
      className={`${s.root} ${float ? s.float : ""} ${className ?? ""}`}
      data-state={state}
      data-paused={paused ? "true" : undefined}
      data-mascot=""
      style={{ width: size, ...paletteVars(color), ...style } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 -3 21 20" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <g className={s.body}>
          {BODY_RUNS.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={FILL[r.c]} />
          ))}
          <g className={s.eyesOpen}>
            {EYES_OPEN.map(([x, y, c], i) => (
              <rect key={i} x={x} y={y} width={1} height={1} fill={FILL[c]} />
            ))}
          </g>
          <g className={s.eyesClosed}>
            {EYES_CLOSED.map(([x, y, c], i) => (
              <rect key={i} x={x} y={y} width={1} height={1} fill={FILL[c]} />
            ))}
          </g>
          <g className={s.eyesHappy}>
            {EYES_HAPPY.map(([x, y, c], i) => (
              <rect key={i} x={x} y={y} width={1} height={1} fill={FILL[c]} />
            ))}
          </g>
        </g>
        <g className={s.zzz}>
          {ZZZ.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={1} height={1} fill="var(--m-shadow)" />
          ))}
        </g>
      </svg>
    </span>
  );
}
