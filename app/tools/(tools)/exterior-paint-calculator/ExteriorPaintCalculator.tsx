"use client";
import { useState, useMemo } from "react";

type Shape = "rectangle" | "L-shape" | "custom";

function fmt(n: number, digits = 1) {
  return n.toFixed(digits);
}

// 外壁塗装面積の計算式（延べ床面積×係数）
const FLOOR_COEFFICIENTS: Record<number, number> = {
  1: 3.2,  // 平屋
  2: 2.8,  // 2階建て（標準）
  3: 2.5,  // 3階建て
};

// 塗料別の必要量目安（m²あたり）
const PAINT_COVERAGE = {
  "シリコン系": { perLiter: 5.5, unitPrice: 3800, lifespan: "10〜15年" },
  "フッ素系": { perLiter: 5.0, unitPrice: 5500, lifespan: "15〜20年" },
  "ラジカル系": { perLiter: 5.5, unitPrice: 4500, lifespan: "12〜15年" },
  "無機系": { perLiter: 5.0, unitPrice: 6500, lifespan: "20〜25年" },
};

// 工事費単価目安（円/m²）
const UNIT_PRICE_RANGE = {
  "シリコン系": { min: 2500, max: 3500 },
  "フッ素系": { min: 3500, max: 5000 },
  "ラジカル系": { min: 3000, max: 4200 },
  "無機系": { min: 4500, max: 6500 },
};

export function ExteriorPaintCalculator() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [floors, setFloors] = useState(2);
  const [tsubo, setTsubo] = useState("");        // 延べ床面積（坪）
  const [customArea, setCustomArea] = useState(""); // カスタム入力（m²）
  const [width, setWidth] = useState("");         // 間口（m）
  const [depth, setDepth] = useState("");         // 奥行（m）
  const [paintType, setPaintType] = useState<keyof typeof PAINT_COVERAGE>("シリコン系");
  const [coats, setCoats] = useState(2);          // 塗り回数

  const result = useMemo(() => {
    let wallArea = 0;

    if (shape === "rectangle") {
      const w = parseFloat(width) || 0;
      const d = parseFloat(depth) || 0;
      if (w > 0 && d > 0) {
        // 外周×階高（1階=2.8m、2階=2.6m等）
        const floorHeight = floors === 1 ? 2.8 : floors === 2 ? 5.5 : 8.2;
        wallArea = (w + d) * 2 * floorHeight;
        // 開口部（窓・ドア）差し引き：概算で15%カット
        wallArea *= 0.85;
      }
    } else if (shape === "L-shape") {
      const t = parseFloat(tsubo) || 0;
      if (t > 0) {
        const sqm = t * 3.306;
        const coef = FLOOR_COEFFICIENTS[Math.min(floors, 3)] ?? 2.8;
        wallArea = sqm * coef;
      }
    } else {
      wallArea = parseFloat(customArea) || 0;
    }

    if (wallArea <= 0) return null;

    const paint = PAINT_COVERAGE[paintType];
    const priceRange = UNIT_PRICE_RANGE[paintType];

    // 塗料使用量（下塗り1回+上塗りcoats回）
    const totalCoats = 1 + coats;
    const paintLiters = (wallArea / paint.perLiter) * totalCoats * 1.1; // 10%ロス加算

    const costMin = wallArea * priceRange.min;
    const costMax = wallArea * priceRange.max;

    return { wallArea, paintLiters, costMin, costMax, lifespan: paint.lifespan };
  }, [shape, floors, tsubo, customArea, width, depth, paintType, coats]);

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-[15px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* 計算方法選択 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">計算方法</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "rectangle", label: "間口・奥行から計算" },
              { value: "L-shape", label: "坪数（床面積）から計算" },
              { value: "custom", label: "面積を直接入力" },
            ] as { value: Shape; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setShape(value)}
                className={`py-2 px-3 rounded-xl text-[13px] font-medium border transition-all ${
                  shape === value
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {shape === "rectangle" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">建物の間口（m）</label>
              <input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="8.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">建物の奥行（m）</label>
              <input type="number" min="0" step="0.1" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="7.0" className={inputClass} />
            </div>
          </div>
        )}

        {shape === "L-shape" && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">延べ床面積（坪）</label>
            <input type="number" min="0" step="0.5" value={tsubo} onChange={(e) => setTsubo(e.target.value)} placeholder="35" className={inputClass} />
            <p className="text-[11px] text-slate-400 mt-1">登記簿や固定資産税通知書に記載の延べ床面積（坪）を入力してください。</p>
          </div>
        )}

        {shape === "custom" && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">外壁面積（m²）</label>
            <input type="number" min="0" step="1" value={customArea} onChange={(e) => setCustomArea(e.target.value)} placeholder="120" className={inputClass} />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">階数</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((f) => (
              <button
                key={f}
                onClick={() => setFloors(f)}
                className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium border transition-all ${
                  floors === f
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                {f === 1 ? "平屋" : `${f}階建て`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 塗料設定 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">塗料・仕様</h3>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">塗料グレード</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PAINT_COVERAGE) as (keyof typeof PAINT_COVERAGE)[]).map((p) => (
              <button
                key={p}
                onClick={() => setPaintType(p)}
                className={`py-2.5 px-3 rounded-xl text-[13px] font-medium border transition-all text-left ${
                  paintType === p
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                <span className="font-semibold">{p}</span>
                <span className="block text-[11px] opacity-70 mt-0.5">{PAINT_COVERAGE[p].lifespan}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">上塗り回数（下塗りは別途1回）</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((c) => (
              <button
                key={c}
                onClick={() => setCoats(c)}
                className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium border transition-all ${
                  coats === c
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                }`}
              >
                {c}回
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">標準は2回塗り（下塗り1回＋上塗り2回の計3回）</p>
        </div>
      </div>

      {/* 結果 */}
      {result && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div className="px-5 py-4 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">計算結果</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {fmt(result.wallArea)} m²
            </p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5">外壁塗装面積（開口部除く概算）</p>
          </div>
          <div className="px-5 py-4 space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-zinc-400">塗料使用量（概算）</span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">{fmt(result.paintLiters)} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-zinc-400">塗料グレード</span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">{paintType}（耐用{result.lifespan}）</span>
            </div>
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-3">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-zinc-400">工事費目安（税抜）</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800 dark:text-zinc-200">
                <span>¥{Math.round(result.costMin / 10000)}万 〜 ¥{Math.round(result.costMax / 10000)}万</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">仮設・高圧洗浄・養生・シーリング等を含む概算です。実際の金額は建物形状・劣化状況・足場費用等により異なります。</p>
            </div>
          </div>
        </div>
      )}

      {/* 開口部控除の補足 */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-5 space-y-3 text-[13px] text-slate-600 dark:text-zinc-400">
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">計算式と控除について</h3>
        <div className="space-y-1.5">
          <p>「間口・奥行から計算」：外周（間口+奥行）×2 × 階高 × <strong className="text-slate-700 dark:text-zinc-300">0.85（窓・ドア等の開口部を15%控除）</strong></p>
          <p>「坪数から計算」：延べ床面積（坪）× 3.306 × 係数（平屋3.2 / 2階2.8 / 3階2.5）</p>
          <p>塗料使用量：面積 ÷ 塗布量(m²/L) × 塗り回数 × 1.1（ロス係数10%加算）</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 space-y-1 text-[12px]">
          <p className="font-semibold text-slate-700 dark:text-zinc-300">開口部の控除について</p>
          <p>本ツールでは窓・玄関ドア・勝手口などの開口部を一律15%控除しています。開口部が多い（腰窓・掃き出し窓が多い）建物では実際の塗装面積はさらに小さくなります。逆に開口部が少ないデザインの建物では実測面積の方が大きくなる場合があります。必ず現地調査で実測してください。</p>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-600">※係数は一般的な住宅の実績値に基づく目安です。足場費用・シーリング打ち替え・付帯部塗装（雨樋・軒天等）は別途計上が必要です。</p>
      </div>

      {/* 補助金案内バナー */}
      <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 p-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">🏛️</span>
        <div>
          <p className="font-bold text-[14px] text-green-800 dark:text-green-300 mb-1">外壁塗装に補助金が使える可能性があります</p>
          <p className="text-[13px] text-green-700 dark:text-green-400 leading-relaxed mb-2">省エネ改修・断熱塗料・長期優良住宅化リフォームなどで国・自治体の補助金が適用できる場合があります。施主への提案前に確認しておきましょう。</p>
          <a href="/subsidy" className="inline-flex items-center gap-1 text-[13px] font-semibold text-green-700 dark:text-green-400 hover:underline">
            補助金・助成金診断ツールで確認する →
          </a>
        </div>
      </div>
    </div>
  );
}
