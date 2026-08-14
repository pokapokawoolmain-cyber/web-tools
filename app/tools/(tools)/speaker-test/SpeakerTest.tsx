"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type Ch = "left" | "right" | "both";

export function SpeakerTest() {
  const [playing, setPlaying] = useState<Ch | null>(null);
  const [tested, setTested] = useState<Set<Ch>>(new Set());
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const cleanup = useCallback(() => {
    if (nodesRef.current) {
      try {
        nodesRef.current.gain.gain.exponentialRampToValueAtTime(0.0001, (ctxRef.current?.currentTime ?? 0) + 0.05);
        nodesRef.current.osc.stop((ctxRef.current?.currentTime ?? 0) + 0.06);
      } catch {
        /* noop */
      }
      nodesRef.current = null;
    }
    setPlaying(null);
  }, []);

  useEffect(() => () => {
    cleanup();
    ctxRef.current?.close().catch(() => {});
  }, [cleanup]);

  const play = (ch: Ch) => {
    // 同じchを押したら停止
    if (playing === ch) {
      cleanup();
      return;
    }
    cleanup();
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 440; // A4
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    const panner = ctx.createStereoPanner();
    panner.pan.value = ch === "left" ? -1 : ch === "right" ? 1 : 0;

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    osc.start();

    nodesRef.current = { osc, gain };
    setPlaying(ch);
    setTested((t) => new Set(t).add(ch));
  };

  const CH: { id: Ch; label: string; hint: string }[] = [
    { id: "left", label: "左（L）", hint: "左のスピーカーから鳴ります" },
    { id: "both", label: "両方（L+R）", hint: "中央から均等に鳴ります" },
    { id: "right", label: "右（R）", hint: "右のスピーカーから鳴ります" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        ボタンを押すと、その方向のスピーカー／イヤホンからテスト音（440Hz）が鳴ります。<strong>左右が正しく分かれているか</strong>、片方が鳴らないかを確認できます。もう一度押すと停止します。
      </div>

      <div className="grid grid-cols-3 gap-3">
        {CH.map((c) => {
          const isPlaying = playing === c.id;
          const isTested = tested.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => play(c.id)}
              className={`rounded-2xl p-5 text-center border transition-colors ${
                isPlaying
                  ? "bg-violet-600 border-violet-600 text-white"
                  : isTested
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:border-violet-400"
              }`}
            >
              <div className="text-2xl mb-1">{isPlaying ? "🔊" : "🔈"}</div>
              <p className="text-[15px] font-bold">{c.label}</p>
              <p className={`text-[11px] mt-1 ${isPlaying ? "text-white/80" : "text-slate-400 dark:text-zinc-500"}`}>
                {isPlaying ? "再生中（押して停止）" : isTested ? "✓ 確認済み" : c.hint}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-[13px] text-slate-500 dark:text-zinc-400 px-1">
        左を押したのに右から聞こえる場合は、<strong>ケーブルの左右が逆</strong>か、オーディオ設定でチャンネルが入れ替わっている可能性があります。
      </p>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 音が鳴らないときは、端末の音量・ミュート、ブラウザのタブのミュート、接続先（スピーカー／イヤホン）の選択を確認してください。処理はブラウザ内で完結します。
      </p>
    </div>
  );
}
