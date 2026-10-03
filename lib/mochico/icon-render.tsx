// Mochico のアイコン / OG 画像用に、ドット絵キャラクター（公式色: purple）を SVG で描く
//   ImageResponse（satori）は CSS 変数を解釈しないため、色を直接埋め込む。
import { BODY, EYES_OPEN, rowRuns } from "@/components/mochico/sprite";
import { MASCOT_PALETTES } from "@/components/mochico/palette";

const P = MASCOT_PALETTES.purple;
const COLOR: Record<string, string> = { O: P.outline, B: P.base, H: P.highlight, S: P.shadow, C: P.cheek, E: P.eye, W: P.spark };
const RUNS = rowRuns(BODY);

export function MascotSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={(size * 17) / 18} viewBox="0 0 18 17" style={{ shapeRendering: "crispEdges" } as never}>
      {RUNS.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w + 0.02} height={1.06} fill={COLOR[r.c]} />
      ))}
      {EYES_OPEN.map(([x, y, c], i) => (
        <rect key={`e${i}`} x={x} y={y} width={1.02} height={1.06} fill={COLOR[c]} />
      ))}
    </svg>
  );
}

/** 正方形アイコン（ラベンダーの背景にキャラクター） */
export function MochicoIcon({ size, rounded = false, padding = 0.18 }: { size: number; rounded?: boolean; padding?: number }) {
  const inner = Math.round(size * (1 - padding * 2));
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #f4efff 0%, #e4d9ff 100%)",
        borderRadius: rounded ? Math.round(size * 0.22) : 0,
      }}
    >
      <MascotSvg size={inner} />
    </div>
  );
}
