"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Status = "idle" | "running" | "denied" | "error";

export function WebcamTest() {
  const [status, setStatus] = useState<Status>("idle");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState("");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setSize("");
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(async (mode: "user" | "environment") => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      setLabel(track?.label || "カメラ");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const v = videoRef.current;
          if (v) setSize(`${v.videoWidth} × ${v.videoHeight}`);
        };
      }
      setStatus("running");
    } catch (e) {
      if (e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError")) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);

  const flip = () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    if (status === "running") start(next);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        「カメラを起動」を押して使用を許可すると、映像がその場に表示されます。Web会議・オンライン面接・配信の前に、カメラが正しく映るか・向きや画質を確認できます。映像は録画・保存・送信されません。
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-zinc-700 aspect-video flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
        {status !== "running" && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-[14px]">
            カメラは停止中です
          </div>
        )}
        {status === "running" && size && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 text-white text-[11px] font-mono">
            {size}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {status !== "running" ? (
          <button onClick={() => start(facing)} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
            カメラを起動
          </button>
        ) : (
          <>
            <button onClick={stop} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              停止
            </button>
            <button onClick={flip} className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              カメラ切替（前/背面）
            </button>
          </>
        )}
        {status === "running" && label && (
          <span className="text-[12px] text-slate-500 dark:text-zinc-400">使用中: {label}</span>
        )}
      </div>

      {status === "denied" && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-[13px] text-amber-700 dark:text-amber-300">
          カメラの使用が許可されませんでした。ブラウザのアドレスバーのカメラアイコンやサイトの権限設定から「許可」に変更して、もう一度お試しください。
        </div>
      )}
      {status === "error" && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-[13px] text-red-700 dark:text-red-300">
          カメラにアクセスできませんでした。カメラが接続されているか、他のアプリ（Zoom等）が使用中でないかを確認してください。
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 映像はブラウザ内で表示するだけで、録画・保存・送信は一切行いません。カメラの許可はこのページを閉じると解除されます。
      </p>
    </div>
  );
}
