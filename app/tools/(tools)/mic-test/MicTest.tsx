"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Status = "idle" | "running" | "denied" | "error";

export function MicTest() {
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(0); // 0-100
  const [peak, setPeak] = useState(0);
  const [deviceLabel, setDeviceLabel] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setStatus("idle");
    setLevel(0);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      setDeviceLabel(stream.getAudioTracks()[0]?.label || "マイク");

      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      const timeData = new Uint8Array(analyser.fftSize);
      setStatus("running");
      setPeak(0);

      const draw = () => {
        analyser.getByteTimeDomainData(timeData);
        // RMSレベル
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / timeData.length);
        const lv = Math.min(100, Math.round(rms * 180));
        setLevel(lv);
        setPeak((p) => Math.max(p, lv));

        // 波形描画
        const canvas = canvasRef.current;
        if (canvas) {
          const dpr = window.devicePixelRatio || 1;
          const w = canvas.clientWidth, h = canvas.clientHeight;
          if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr; canvas.height = h * dpr;
          }
          const g = canvas.getContext("2d");
          if (g) {
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            g.clearRect(0, 0, w, h);
            g.lineWidth = 2;
            g.strokeStyle = "#7c3aed";
            g.beginPath();
            const slice = w / timeData.length;
            for (let i = 0; i < timeData.length; i++) {
              const y = (timeData[i] / 255) * h;
              const x = i * slice;
              if (i === 0) g.moveTo(x, y);
              else g.lineTo(x, y);
            }
            g.stroke();
          }
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    } catch (e) {
      if (e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError")) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        「テスト開始」を押してマイクの使用を許可すると、声を出したときに<strong>音量メーターと波形</strong>が動きます。マイクが正しく音を拾えているかをその場で確認できます。音声は録音されず、外部にも送信されません。
      </div>

      {/* メーター */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] text-slate-500 dark:text-zinc-400">入力レベル</span>
            <span className="text-[12px] font-mono text-slate-500 dark:text-zinc-400">{level}%（ピーク {peak}%）</span>
          </div>
          <div className="h-4 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-75"
              style={{
                width: `${level}%`,
                background: level > 80 ? "#ef4444" : level > 40 ? "#22c55e" : "#7c3aed",
              }}
            />
          </div>
        </div>

        <canvas ref={canvasRef} className="w-full h-24 rounded-xl bg-slate-50 dark:bg-zinc-800" />

        {status === "running" && deviceLabel && (
          <p className="text-[12px] text-slate-400 dark:text-zinc-500">使用中のマイク: {deviceLabel}</p>
        )}
      </div>

      {/* コントロール */}
      <div className="flex items-center gap-3">
        {status !== "running" ? (
          <button
            onClick={start}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            テスト開始
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            停止
          </button>
        )}
        {status === "running" && (
          <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
            {peak > 5 ? "✓ 音を検出しています" : "声を出してみてください…"}
          </span>
        )}
      </div>

      {status === "denied" && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-[13px] text-amber-700 dark:text-amber-300">
          マイクの使用が許可されませんでした。ブラウザのアドレスバーのマイクアイコンや、サイトの権限設定から「許可」に変更して、もう一度お試しください。
        </div>
      )}
      {status === "error" && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-[13px] text-red-700 dark:text-red-300">
          マイクにアクセスできませんでした。マイクが接続されているか、他のアプリが使用中でないかを確認してください。
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 音声はブラウザ内で解析するだけで、録音・保存・送信は一切行いません。マイクの許可はこのページを閉じると解除されます。
      </p>
    </div>
  );
}
