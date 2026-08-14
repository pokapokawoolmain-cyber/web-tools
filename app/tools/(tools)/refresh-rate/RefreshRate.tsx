"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function RefreshRate() {
  const [running, setRunning] = useState(false);
  const [hz, setHz] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setRunning(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = () => {
    setRunning(true);
    setHz(null);
    setProgress(0);
    const times: number[] = [];
    const DURATION = 2000;
    let startT = 0;

    const loop = (t: number) => {
      if (!startT) startT = t;
      times.push(t);
      const elapsed = t - startT;
      setProgress(Math.min(1, elapsed / DURATION));

      // 直近の瞬間値
      if (times.length > 10) {
        const recent = times.slice(-10);
        const dt = (recent[recent.length - 1] - recent[0]) / (recent.length - 1);
        if (dt > 0) setCurrent(Math.round(1000 / dt));
      }

      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // 全体の平均（最初の数フレームは除外）
        const frames = times.slice(2);
        const total = frames[frames.length - 1] - frames[0];
        const avgDt = total / (frames.length - 1);
        const measured = 1000 / avgDt;
        // 一般的なレートに丸める
        const common = [24, 30, 48, 60, 75, 90, 100, 120, 144, 165, 240, 360];
        const nearest = common.reduce((a, b) => (Math.abs(b - measured) < Math.abs(a - measured) ? b : a), common[0]);
        const snap = Math.abs(nearest - measured) <= 4 ? nearest : Math.round(measured);
        setHz(snap);
        setRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        「測定開始」を押すと約2秒間、画面の描画タイミングを計測し、<strong>リフレッシュレート（Hz）</strong>を判定します。60Hz・120Hz・144Hzなど、モニターが実際に何Hzで動いているかを確認できます。
      </div>

      {/* 結果表示 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-10 text-center">
        {hz !== null ? (
          <>
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">測定結果</p>
            <p className="text-[56px] leading-none font-bold text-slate-900 dark:text-white">
              {hz}<span className="text-2xl font-semibold ml-1">Hz</span>
            </p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
              約{Math.round(1000 / hz)}msごとに1フレーム描画されています
            </p>
          </>
        ) : running ? (
          <>
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">測定中…</p>
            <p className="text-[56px] leading-none font-bold text-violet-600 dark:text-violet-300">
              {current ?? "—"}<span className="text-2xl font-semibold ml-1">Hz</span>
            </p>
            <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-violet-500 rounded-full transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
            </div>
          </>
        ) : (
          <p className="text-[15px] text-slate-500 dark:text-zinc-400">「測定開始」を押してください</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={running ? stop : start}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            running
              ? "border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {running ? "中止" : hz !== null ? "もう一度測定" : "測定開始"}
        </button>
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ ブラウザは通常、画面のリフレッシュレートに同期して描画します。省電力設定・バッテリー動作・別タブの負荷・ブラウザの制限により、実際のパネル性能より低く出ることがあります。正確な設定値はOSのディスプレイ設定でも確認できます。
      </p>
    </div>
  );
}
