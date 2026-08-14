"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const COLORS: { name: string; value: string; dark?: boolean }[] = [
  { name: "赤", value: "#FF0000" },
  { name: "緑", value: "#00FF00" },
  { name: "青", value: "#0000FF" },
  { name: "白", value: "#FFFFFF" },
  { name: "黒", value: "#000000", dark: true },
  { name: "グレー", value: "#808080" },
  { name: "シアン", value: "#00FFFF" },
  { name: "マゼンタ", value: "#FF00FF" },
  { name: "黄", value: "#FFFF00" },
];

export function DeadPixelTest() {
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const next = useCallback(() => setIdx((i) => (i + 1) % COLORS.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + COLORS.length) % COLORS.length), []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setActive(false);
  }, []);

  const startAt = async (start: number) => {
    setIdx(start);
    setActive(true);
    try {
      await containerRef.current?.requestFullscreen();
    } catch {
      /* フルスクリーン不可でも全画面固定レイヤーで続行 */
    }
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") prev();
    };
    const onFsChange = () => {
      if (!document.fullscreenElement) setActive(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [active, next, prev, exit]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        全画面で単色を表示します。画面をよく見て、<strong>常に光る点（ドット抜け＝常時点灯）や、光らない黒い点（画素欠け）</strong>がないかを確認してください。画面をクリック（またはスペース／→キー）で次の色、<strong>Escで終了</strong>します。
      </div>

      {/* 色ボタン */}
      <div>
        <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-2">色を選んで全画面テストを開始</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {COLORS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => startAt(i)}
              className="rounded-xl border border-slate-200 dark:border-zinc-700 p-2 flex flex-col items-center gap-1.5 hover:border-violet-400 transition-colors"
            >
              <span className="w-full h-8 rounded-md border border-slate-200 dark:border-zinc-600" style={{ background: c.value }} />
              <span className="text-[12px] text-slate-600 dark:text-zinc-300">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="text-[13px] text-slate-500 dark:text-zinc-400 space-y-1 px-1">
        <li>・<strong>ドット抜け（常時点灯）：</strong>黒背景で光る点。赤・緑・青のいずれかで光ることが多い</li>
        <li>・<strong>画素欠け（常時消灯）：</strong>白背景で黒く見える点</li>
        <li>・<strong>常時点灯サブピクセル：</strong>各原色でのみ見える点。赤緑青すべてで確認を</li>
      </ul>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 画面を清掃してから行うと、ホコリと画素不良を混同しません。処理はすべてブラウザ内で完結します。
      </p>

      {/* 全画面レイヤー */}
      <div
        ref={containerRef}
        onClick={next}
        className={active ? "fixed inset-0 z-[9999] cursor-pointer" : "hidden"}
        style={{ background: COLORS[idx].value }}
      >
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-[13px] font-medium ${COLORS[idx].dark ? "bg-white/15 text-white" : "bg-black/15 text-black"}`}>
          {COLORS[idx].name}（{idx + 1}/{COLORS.length}）｜クリック/→で次へ・Escで終了
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); exit(); }}
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[13px] font-semibold ${COLORS[idx].dark ? "bg-white/20 text-white" : "bg-black/20 text-black"}`}
        >
          終了
        </button>
      </div>
    </div>
  );
}
