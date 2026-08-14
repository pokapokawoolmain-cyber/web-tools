"use client";

import { useState, useRef, useCallback } from "react";

const BUTTONS = [
  { id: "left", label: "左クリック" },
  { id: "wheel", label: "ホイール押込" },
  { id: "right", label: "右クリック" },
  { id: "back", label: "戻る（サイド）" },
  { id: "forward", label: "進む（サイド）" },
  { id: "double", label: "ダブルクリック" },
  { id: "scrollUp", label: "ホイール上" },
  { id: "scrollDown", label: "ホイール下" },
] as const;

type BtnId = (typeof BUTTONS)[number]["id"];

const btnMap: Record<number, BtnId> = { 0: "left", 1: "wheel", 2: "right", 3: "back", 4: "forward" };

export function MouseTest() {
  const [tested, setTested] = useState<Set<BtnId>>(new Set());
  const [active, setActive] = useState<BtnId | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const mark = useCallback((id: BtnId) => {
    setTested((t) => new Set(t).add(id));
    setActive(id);
    setTimeout(() => setActive((a) => (a === id ? null : a)), 200);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    const id = btnMap[e.button];
    if (id) mark(id);
  };
  const onWheel = (e: React.WheelEvent) => {
    mark(e.deltaY < 0 ? "scrollUp" : "scrollDown");
  };
  const onDoubleClick = () => mark("double");
  const onMove = (e: React.MouseEvent) => {
    const r = areaRef.current?.getBoundingClientRect();
    if (r) setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
  };

  const reset = () => {
    setTested(new Set());
    setActive(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        下のエリアでマウスの各ボタンをクリック・ホイール操作すると、対応する項目が<strong>確認済み</strong>になります。左右・ホイール・サイドボタン（戻る/進む）・ダブルクリックが正しく反応するかを確認できます。
      </div>

      {/* テストエリア */}
      <div
        ref={areaRef}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onMouseMove={onMove}
        onContextMenu={(e) => e.preventDefault()}
        className="relative h-56 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-center select-none cursor-crosshair overflow-hidden"
      >
        <div>
          <p className="text-[15px] font-semibold text-slate-700 dark:text-zinc-200">ここでクリック・スクロールしてください</p>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">右クリックのメニューはこのエリア内では無効化されています</p>
          {pos && (
            <p className="text-[12px] font-mono text-slate-400 dark:text-zinc-500 mt-2">
              座標: x={pos.x}, y={pos.y}
            </p>
          )}
        </div>
      </div>

      {/* ボタン一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BUTTONS.map((b) => {
          const isTested = tested.has(b.id);
          const isActive = active === b.id;
          return (
            <div
              key={b.id}
              className={`rounded-xl p-3 text-center border transition-colors ${
                isActive
                  ? "bg-violet-600 border-violet-600 text-white"
                  : isTested
                  ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400"
              }`}
            >
              <p className="text-[13px] font-medium">{b.label}</p>
              <p className="text-[11px] mt-0.5 opacity-80">{isTested ? "✓ 確認済み" : "未確認"}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-slate-500 dark:text-zinc-400">
          確認済み: <strong className="text-slate-700 dark:text-zinc-200">{tested.size}</strong> / {BUTTONS.length}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-[13px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          リセット
        </button>
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ サイドボタン（戻る/進む）はマウスやブラウザの設定によっては検知できない場合があります。判定はすべてブラウザ内で行われ、外部に送信されません。
      </p>
    </div>
  );
}
