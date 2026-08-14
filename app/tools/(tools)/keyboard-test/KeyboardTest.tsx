"use client";

import { useState, useEffect, useCallback } from "react";

type Key = { code: string; label: string; w?: number };

// JIS配列ベースの簡易レイアウト（w は横幅の倍率）
const ROWS: Key[][] = [
  [
    { code: "Escape", label: "Esc" }, { code: "F1", label: "F1" }, { code: "F2", label: "F2" },
    { code: "F3", label: "F3" }, { code: "F4", label: "F4" }, { code: "F5", label: "F5" },
    { code: "F6", label: "F6" }, { code: "F7", label: "F7" }, { code: "F8", label: "F8" },
    { code: "F9", label: "F9" }, { code: "F10", label: "F10" }, { code: "F11", label: "F11" }, { code: "F12", label: "F12" },
  ],
  [
    { code: "Backquote", label: "半/全" }, { code: "Digit1", label: "1" }, { code: "Digit2", label: "2" },
    { code: "Digit3", label: "3" }, { code: "Digit4", label: "4" }, { code: "Digit5", label: "5" },
    { code: "Digit6", label: "6" }, { code: "Digit7", label: "7" }, { code: "Digit8", label: "8" },
    { code: "Digit9", label: "9" }, { code: "Digit0", label: "0" }, { code: "Minus", label: "-" },
    { code: "Equal", label: "^" }, { code: "IntlYen", label: "¥" }, { code: "Backspace", label: "⌫", w: 1.5 },
  ],
  [
    { code: "Tab", label: "Tab", w: 1.5 }, { code: "KeyQ", label: "Q" }, { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" }, { code: "KeyR", label: "R" }, { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" }, { code: "KeyU", label: "U" }, { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" }, { code: "KeyP", label: "P" }, { code: "BracketLeft", label: "@" },
    { code: "BracketRight", label: "[" }, { code: "Enter", label: "Enter", w: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps", w: 1.8 }, { code: "KeyA", label: "A" }, { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" }, { code: "KeyF", label: "F" }, { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" }, { code: "KeyJ", label: "J" }, { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" }, { code: "Semicolon", label: ";" }, { code: "Quote", label: ":" },
    { code: "Backslash", label: "]" },
  ],
  [
    { code: "ShiftLeft", label: "Shift", w: 2.3 }, { code: "KeyZ", label: "Z" }, { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" }, { code: "KeyV", label: "V" }, { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" }, { code: "KeyM", label: "M" }, { code: "Comma", label: "," },
    { code: "Period", label: "." }, { code: "Slash", label: "/" }, { code: "IntlRo", label: "\\" },
    { code: "ShiftRight", label: "Shift", w: 2 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", w: 1.5 }, { code: "MetaLeft", label: "Win" }, { code: "AltLeft", label: "Alt" },
    { code: "NonConvert", label: "無変換" }, { code: "Space", label: "space", w: 5 }, { code: "Convert", label: "変換" },
    { code: "KanaMode", label: "かな" }, { code: "AltRight", label: "Alt" }, { code: "ControlRight", label: "Ctrl", w: 1.5 },
  ],
  [
    { code: "ArrowLeft", label: "←" }, { code: "ArrowUp", label: "↑" }, { code: "ArrowDown", label: "↓" }, { code: "ArrowRight", label: "→" },
  ],
];

export function KeyboardTest() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [last, setLast] = useState<{ key: string; code: string; keyCode: number } | null>(null);

  const onDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressed((p) => new Set(p).add(e.code));
    setTested((t) => new Set(t).add(e.code));
    setLast({ key: e.key === " " ? "Space" : e.key, code: e.code, keyCode: e.keyCode });
  }, []);

  const onUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressed((p) => {
      const n = new Set(p);
      n.delete(e.code);
      return n;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [onDown, onUp]);

  const reset = () => {
    setPressed(new Set());
    setTested(new Set());
    setLast(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        キーを押すと、そのキーが光ります。一度押したキーは「確認済み」として色が残るので、<strong>すべてのキーが反応するか</strong>を1つずつ確かめられます。同時押し（Nキーロールオーバー）の確認にも使えます。
      </div>

      {/* ライブ表示 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "event.key", value: last?.key ?? "—" },
          { label: "event.code", value: last?.code ?? "—" },
          { label: "keyCode", value: last ? String(last.keyCode) : "—" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3 text-center">
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">{c.label}</p>
            <p className="text-[15px] font-mono font-semibold text-slate-800 dark:text-zinc-100 mt-0.5 truncate">{c.value}</p>
          </div>
        ))}
      </div>

      {/* キーボード */}
      <div className="bg-slate-100 dark:bg-zinc-900 rounded-2xl p-2 sm:p-3 overflow-x-auto">
        <div className="min-w-[640px] space-y-1.5">
          {ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1.5">
              {row.map((k) => {
                const isActive = pressed.has(k.code);
                const isTested = tested.has(k.code);
                return (
                  <div
                    key={k.code}
                    style={{ flexGrow: k.w ?? 1, flexBasis: 0 }}
                    className={`h-11 rounded-lg flex items-center justify-center text-[12px] font-medium select-none border transition-colors ${
                      isActive
                        ? "bg-violet-600 border-violet-600 text-white"
                        : isTested
                        ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                        : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"
                    }`}
                  >
                    {k.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 text-[12px] text-slate-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-600 inline-block" />押下中</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400 inline-block" />確認済み</span>
          <span>同時押し: <strong className="text-slate-700 dark:text-zinc-200">{pressed.size}</strong> / 確認済み: <strong className="text-slate-700 dark:text-zinc-200">{tested.size}</strong></span>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-[13px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          リセット
        </button>
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 一部のキー（PrintScreenやFnキーなどOSが専有するキー）はブラウザで検知できない場合があります。配列やキーボードの機種により表示位置と実際の刻印が異なることがあります。
      </p>
    </div>
  );
}
