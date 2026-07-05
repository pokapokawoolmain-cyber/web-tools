"use client";

// ========================================
// インターネット速度テスト
// - fetch ストリーム読み取りでダウンロード実測（並列・適応サイズ）
// - XHR upload.onprogress でアップロード実測
// - 対数スケールのガラス調ネオンメーター（0.1Mbps〜10Gbps）
// ========================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, RotateCcw, ChevronDown } from "lucide-react";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import {
  getSpeedRank,
  getUseCaseComforts,
  COMFORT_STYLE,
} from "./speed-ranks";

// ─── 測定モード定義 ─────────────────────────────
type ModeId = "quick" | "standard" | "ultra";

const MODES: Record<ModeId, {
  label: string;
  desc: string;
  estimate: string;
  pings: number;
  dl: { ms: number; cap: number; conns: number; init: number };
  ul: { ms: number; cap: number; conns: number };
  warning?: boolean;
}> = {
  quick: {
    label: "クイック",
    desc: "約5〜8秒・スマホ向け",
    estimate: "最大約55MB",
    pings: 6,
    dl: { ms: 6000, cap: 40 * 1024 * 1024, conns: 4, init: 1 * 1024 * 1024 },
    ul: { ms: 4000, cap: 15 * 1024 * 1024, conns: 2 },
  },
  standard: {
    label: "標準",
    desc: "約10〜15秒・バランス",
    estimate: "最大約190MB",
    pings: 8,
    dl: { ms: 11000, cap: 150 * 1024 * 1024, conns: 6, init: 2 * 1024 * 1024 },
    ul: { ms: 6000, cap: 40 * 1024 * 1024, conns: 3 },
  },
  ultra: {
    label: "高精度・超高速",
    desc: "約15〜25秒・ギガ回線向け",
    estimate: "最大約700MB",
    pings: 8,
    dl: { ms: 18000, cap: 600 * 1024 * 1024, conns: 8, init: 4 * 1024 * 1024 },
    ul: { ms: 8000, cap: 100 * 1024 * 1024, conns: 4 },
    warning: true,
  },
};

const MAX_REQ = 32 * 1024 * 1024; // /api/speed-test/download の1リクエスト上限
const UL_CHUNK = 3 * 1024 * 1024; // Edgeボディ上限を考慮したアップロードチャンク

type Phase = "idle" | "ping" | "download" | "upload" | "done" | "error";

type Sample = { t: number; mbps: number };

type Result = {
  dlMbps: number;
  dlPeak: number;
  ulMbps: number;
  ulPeak: number;
  pingMs: number | null;
  jitterMs: number | null;
  stability: number | null;
  dlBytes: number;
  ulBytes: number;
  seconds: number;
  partial: boolean;
};

// ─── 速度→表示ユーティリティ ─────────────────────
const fmtMbps = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(2)} Gbps` : v >= 100 ? `${v.toFixed(0)} Mbps` : `${v.toFixed(1)} Mbps`;
const fmtMBs = (mbps: number) => `${(mbps / 8).toFixed(mbps >= 80 ? 0 : 1)} MB/s`;
const fmtBytes = (b: number) =>
  b >= 1024 * 1024 * 1024 ? `${(b / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

/** 速度に応じたネオンカラー（低速:赤橙 → 中速:黄緑 → 高速:シアン青 → 超高速:紫ピンク） */
function speedColor(mbps: number): string {
  if (mbps < 1) return "#ef4444";
  if (mbps < 5) return "#f97316";
  if (mbps < 20) return "#facc15";
  if (mbps < 50) return "#4ade80";
  if (mbps < 150) return "#22d3ee";
  if (mbps < 500) return "#3b82f6";
  if (mbps < 2000) return "#a78bfa";
  return "#ec4899";
}

/** 対数スケール位置（0.1Mbps→0, 10Gbps→1） */
function logFraction(mbps: number): number {
  if (mbps <= 0.1) return 0;
  return Math.min(1, (Math.log10(mbps) + 1) / 5);
}

// ─── ゲージSVG ───────────────────────────────
const GAUGE_TICKS = [
  { v: 0.1, label: "0.1M" },
  { v: 1, label: "1M" },
  { v: 10, label: "10M" },
  { v: 100, label: "100M" },
  { v: 1000, label: "1G" },
  { v: 10000, label: "10G" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function Gauge({ mbps, active, reduced }: { mbps: number; active: boolean; reduced: boolean }) {
  const f = logFraction(mbps);
  const deg = -120 + 240 * f; // 針の角度（-120°〜+120°）
  const color = speedColor(mbps);
  const cx = 150, cy = 150, r = 118;
  const start = polar(cx, cy, r, -120);
  const end = polar(cx, cy, r, 120);
  const arc = `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`;

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 300 252" className="w-full" role="img" aria-label={`現在の速度 ${fmtMbps(mbps)}`}>
        {/* 外周グロー（測定中のみ発光） */}
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={active ? 0.28 : 0.12}
          style={{
            filter: active ? `drop-shadow(0 0 14px ${color})` : undefined,
            transition: "stroke 400ms ease, opacity 400ms ease",
          }}
        />
        {/* ベースアーク */}
        <path d={arc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
        {/* プログレスアーク */}
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${Math.max(0.5, f * 100)} 100`}
          style={{
            filter: `drop-shadow(0 0 6px ${color}aa)`,
            transition: reduced ? undefined : "stroke-dasharray 300ms ease-out, stroke 400ms ease",
          }}
        />
        {/* 目盛り＋ラベル */}
        {GAUGE_TICKS.map(({ v, label }) => {
          const tf = logFraction(v);
          const td = -120 + 240 * tf;
          const p1 = polar(cx, cy, r - 14, td);
          const p2 = polar(cx, cy, r - 22, td);
          const pl = polar(cx, cy, r - 36, td);
          return (
            <g key={v}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <text x={pl.x} y={pl.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="rgba(255,255,255,0.55)" fontWeight="600">
                {label}
              </text>
            </g>
          );
        })}
        {/* 針 */}
        <g
          style={{
            transform: `rotate(${deg}deg)`,
            transformOrigin: "150px 150px",
            transition: reduced ? undefined : "transform 350ms cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        >
          <line x1={cx} y1={cy + 14} x2={cx} y2={cy - r + 30} stroke={color} strokeWidth="3.5" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
        </g>
        {/* 中心キャップ */}
        <circle cx={cx} cy={cy} r="9" fill="#0a0a12" stroke={color} strokeWidth="2.5"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
      {/* 中央数値 */}
      <div className="absolute inset-x-0 bottom-0 text-center pointer-events-none">
        <p className="text-[42px] sm:text-[52px] font-bold leading-none tracking-tight tabular-nums" style={{ color }}>
          {mbps >= 1000 ? (mbps / 1000).toFixed(2) : mbps >= 100 ? mbps.toFixed(0) : mbps.toFixed(1)}
          <span className="text-[16px] sm:text-[18px] font-semibold ml-1.5 text-white/60">
            {mbps >= 1000 ? "Gbps" : "Mbps"}
          </span>
        </p>
        <p className="text-[12px] text-white/40 mt-1 tabular-nums">{fmtMBs(mbps)}</p>
      </div>
    </div>
  );
}

// ─── 推移グラフ ──────────────────────────────
function SpeedGraph({ dl, ul }: { dl: Sample[]; ul: Sample[] }) {
  if (dl.length < 2) return null;
  const all = [...dl, ...ul];
  const maxV = Math.max(...all.map((s) => s.mbps), 1);
  const maxT = Math.max(...all.map((s) => s.t), 1);
  const toPts = (arr: Sample[]) =>
    arr.map((s) => `${(s.t / maxT) * 300},${56 - (s.mbps / maxV) * 50}`).join(" ");
  return (
    <div>
      <div className="flex items-center gap-4 mb-1.5 text-[11px] text-slate-500 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-cyan-400 inline-block" />ダウンロード</span>
        {ul.length >= 2 && <span className="inline-flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-fuchsia-400 inline-block" />アップロード</span>}
        <span className="ml-auto tabular-nums">ピーク {fmtMbps(maxV)}</span>
      </div>
      <svg viewBox="0 0 300 60" className="w-full h-16 rounded-lg bg-black/30 border border-white/5" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={toPts(dl)} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" />
        {ul.length >= 2 && <polyline points={toPts(ul)} fill="none" stroke="#e879f9" strokeWidth="1.5" strokeLinejoin="round" />}
      </svg>
    </div>
  );
}

// ─── 本体 ─────────────────────────────────
export function SpeedTest() {
  const [mode, setMode] = useState<ModeId>("standard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayMbps, setDisplayMbps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [usedBytes, setUsedBytes] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [dlSamples, setDlSamples] = useState<Sample[]>([]);
  const [ulSamples, setUlSamples] = useState<Sample[]>([]);
  const [reduced, setReduced] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const xhrsRef = useRef<Set<XMLHttpRequest>>(new Set());
  const cancelledRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const log = useCallback((msg: string) => {
    const t = new Date().toLocaleTimeString("ja-JP", { hour12: false });
    setLogs((prev) => [...prev, `${t}  ${msg}`]);
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    abortRef.current?.abort();
    xhrsRef.current.forEach((x) => x.abort());
  }, []);

  useEffect(() => () => stop(), [stop]);

  // ─── 測定本体 ───
  const run = useCallback(async () => {
    const cfg = MODES[mode];
    cancelledRef.current = false;
    const ac = new AbortController();
    abortRef.current = ac;
    setResult(null);
    setError(null);
    setLogs([]);
    setDlSamples([]);
    setUlSamples([]);
    setUsedBytes(0);
    setDisplayMbps(0);
    setProgress(0);

    const startAll = performance.now();
    let pingMs: number | null = null;
    let jitterMs: number | null = null;

    try {
      // ── 1. レイテンシ ──
      setPhase("ping");
      log(`${cfg.label}モードで測定開始`);
      const rtts: number[] = [];
      for (let i = 0; i < cfg.pings; i++) {
        if (cancelledRef.current) throw new Error("cancelled");
        const t0 = performance.now();
        await fetch(`/api/speed-test/ping?cb=${Date.now()}-${i}`, { cache: "no-store", signal: ac.signal });
        const rtt = performance.now() - t0;
        if (i > 0) rtts.push(rtt); // 初回はウォームアップとして除外
        setProgress(((i + 1) / cfg.pings) * 0.1);
      }
      if (rtts.length) {
        const sorted = [...rtts].sort((a, b) => a - b);
        pingMs = sorted[Math.floor(sorted.length / 2)];
        jitterMs = rtts.length > 1
          ? rtts.slice(1).reduce((s, v, i) => s + Math.abs(v - rtts[i]), 0) / (rtts.length - 1)
          : 0;
        log(`レイテンシ 中央値 ${pingMs.toFixed(0)}ms / ジッター ${jitterMs.toFixed(1)}ms`);
      }

      // ── 2. ダウンロード ──
      setPhase("download");
      const dlBytesRef = { v: 0 };
      const dlLocalSamples: Sample[] = [];
      const dlStart = performance.now();
      let lastBytes = 0;
      let lastT = dlStart;
      let ema = 0;

      const sampler = setInterval(() => {
        const now = performance.now();
        const dt = (now - lastT) / 1000;
        if (dt <= 0) return;
        const inst = ((dlBytesRef.v - lastBytes) * 8) / dt / 1e6;
        lastBytes = dlBytesRef.v;
        lastT = now;
        ema = ema === 0 ? inst : ema * 0.55 + inst * 0.45;
        dlLocalSamples.push({ t: now - dlStart, mbps: inst });
        setDisplayMbps(ema);
        setUsedBytes(dlBytesRef.v);
        setDlSamples([...dlLocalSamples]);
        setProgress(0.1 + Math.min(1, (now - dlStart) / cfg.dl.ms) * 0.6);
      }, 200);

      const dlWorker = async () => {
        let size = cfg.dl.init;
        while (!cancelledRef.current) {
          const elapsed = performance.now() - dlStart;
          if (elapsed >= cfg.dl.ms || dlBytesRef.v >= cfg.dl.cap) break;
          const res = await fetch(`/api/speed-test/download?bytes=${size}&cb=${Math.random()}`, {
            cache: "no-store",
            signal: ac.signal,
          });
          if (!res.ok || !res.body) throw new Error(`download HTTP ${res.status}`);
          const reader = res.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            dlBytesRef.v += value.byteLength;
          }
          // 適応サイズ: 現在速度で約1.2秒分を次のリクエストサイズに
          const sec = (performance.now() - dlStart) / 1000;
          const bps = dlBytesRef.v / Math.max(sec, 0.1);
          size = Math.min(MAX_REQ, Math.max(1024 * 1024, Math.floor((bps * 1.2) / cfg.dl.conns)));
        }
      };

      try {
        await Promise.all(Array.from({ length: cfg.dl.conns }, dlWorker));
      } finally {
        clearInterval(sampler);
      }
      const dlSec = (performance.now() - dlStart) / 1000;
      const dlBytes = dlBytesRef.v;
      const dlMbps = (dlBytes * 8) / dlSec / 1e6;
      // ピークは瞬間サンプルの最大（立ち上がりの歪みを避けるため先頭2件を除外）
      const dlPeakSamples = dlLocalSamples.slice(2).map((s) => s.mbps);
      const dlPeak = dlPeakSamples.length ? Math.max(...dlPeakSamples) : dlMbps;
      log(`ダウンロード 平均 ${fmtMbps(dlMbps)} / ピーク ${fmtMbps(dlPeak)}（${fmtBytes(dlBytes)}）`);

      // 安定度: サンプルの変動係数から算出
      let stability: number | null = null;
      if (dlPeakSamples.length >= 3) {
        const mean = dlPeakSamples.reduce((a, b) => a + b, 0) / dlPeakSamples.length;
        const sd = Math.sqrt(dlPeakSamples.reduce((a, b) => a + (b - mean) ** 2, 0) / dlPeakSamples.length);
        stability = Math.max(0, Math.min(100, Math.round(100 - (sd / Math.max(mean, 0.01)) * 100)));
      }

      // ── 3. アップロード ──
      if (cancelledRef.current) throw new Error("cancelled");
      setPhase("upload");
      // 3MBのランダムペイロード（64KBブロックの繰り返しで生成）
      const block = new Uint8Array(65536);
      crypto.getRandomValues(block);
      const payload = new Uint8Array(UL_CHUNK);
      for (let off = 0; off < UL_CHUNK; off += block.length) {
        payload.set(block.subarray(0, Math.min(block.length, UL_CHUNK - off)), off);
      }

      const ulBytesRef = { v: 0 };
      const ulLocalSamples: Sample[] = [];
      const ulStart = performance.now();
      let ulLastBytes = 0;
      let ulLastT = ulStart;

      const ulSampler = setInterval(() => {
        const now = performance.now();
        const dt = (now - ulLastT) / 1000;
        if (dt <= 0) return;
        const inst = ((ulBytesRef.v - ulLastBytes) * 8) / dt / 1e6;
        ulLastBytes = ulBytesRef.v;
        ulLastT = now;
        ulLocalSamples.push({ t: now - ulStart, mbps: inst });
        setDisplayMbps((prev) => prev * 0.5 + inst * 0.5);
        setUsedBytes(dlBytes + ulBytesRef.v);
        setUlSamples([...ulLocalSamples]);
        setProgress(0.7 + Math.min(1, (now - ulStart) / cfg.ul.ms) * 0.3);
      }, 200);

      const ulOnce = () =>
        new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrsRef.current.add(xhr);
          let last = 0;
          xhr.upload.onprogress = (e) => {
            ulBytesRef.v += e.loaded - last;
            last = e.loaded;
          };
          const finish = () => {
            xhrsRef.current.delete(xhr);
            resolve();
          };
          xhr.onload = finish;
          xhr.onabort = finish;
          xhr.onerror = () => {
            xhrsRef.current.delete(xhr);
            reject(new Error("upload failed"));
          };
          xhr.open("POST", `/api/speed-test/upload?cb=${Math.random()}`);
          xhr.setRequestHeader("Content-Type", "application/octet-stream");
          xhr.send(payload);
        });

      const ulWorker = async () => {
        while (!cancelledRef.current) {
          const elapsed = performance.now() - ulStart;
          if (elapsed >= cfg.ul.ms || ulBytesRef.v >= cfg.ul.cap) break;
          await ulOnce();
        }
      };

      try {
        await Promise.all(Array.from({ length: cfg.ul.conns }, ulWorker));
      } finally {
        clearInterval(ulSampler);
      }
      const ulSec = (performance.now() - ulStart) / 1000;
      const ulBytes = ulBytesRef.v;
      const ulMbps = ulSec > 0.2 && ulBytes > 0 ? (ulBytes * 8) / ulSec / 1e6 : 0;
      const ulPeakSamples = ulLocalSamples.slice(1).map((s) => s.mbps);
      const ulPeak = ulPeakSamples.length ? Math.max(...ulPeakSamples) : ulMbps;
      log(`アップロード 平均 ${fmtMbps(ulMbps)} / ピーク ${fmtMbps(ulPeak)}（${fmtBytes(ulBytes)}）`);

      // ── 完了 ──
      const seconds = (performance.now() - startAll) / 1000;
      setDisplayMbps(dlMbps);
      setUsedBytes(dlBytes + ulBytes);
      setProgress(1);
      setResult({
        dlMbps, dlPeak, ulMbps, ulPeak, pingMs, jitterMs, stability,
        dlBytes, ulBytes, seconds, partial: false,
      });
      setPhase("done");
      log(`測定完了（${seconds.toFixed(1)}秒 / 合計 ${fmtBytes(dlBytes + ulBytes)}）`);
    } catch (e) {
      const cancelled = cancelledRef.current || (e instanceof DOMException && e.name === "AbortError");
      if (cancelled) {
        log("測定を中止しました");
        setPhase("idle");
        setDisplayMbps(0);
        setProgress(0);
      } else {
        log(`エラー: ${e instanceof Error ? e.message : "不明なエラー"}`);
        setError("測定中に通信エラーが発生しました。電波状況を確認して、もう一度お試しください。");
        setPhase("error");
      }
    }
  }, [mode, log]);

  const running = phase === "ping" || phase === "download" || phase === "upload";
  const rank = result ? getSpeedRank(result.dlMbps) : null;
  const comforts = result ? getUseCaseComforts(result.dlMbps, result.pingMs) : [];

  const phaseLabel =
    phase === "ping" ? "応答速度を測定中" :
    phase === "download" ? "ダウンロード測定中" :
    phase === "upload" ? "アップロード測定中" : "";

  const copyText = useMemo(() => {
    if (!result || !rank) return "";
    return [
      `インターネット速度テスト結果`,
      `ダウンロード: ${fmtMbps(result.dlMbps)}（${fmtMBs(result.dlMbps)}・ピーク ${fmtMbps(result.dlPeak)}）`,
      `アップロード: ${fmtMbps(result.ulMbps)}（ピーク ${fmtMbps(result.ulPeak)}）`,
      result.pingMs != null ? `Ping: ${result.pingMs.toFixed(0)}ms / ジッター: ${result.jitterMs?.toFixed(1)}ms` : "",
      `評価: レベル${rank.level}/20「${rank.name}」— ${rank.tagline}`,
      `https://www.toolboxjp.com/tools/speed-test`,
    ].filter(Boolean).join("\n");
  }, [result, rank]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── モード選択 ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MODES) as ModeId[]).map((m) => (
            <button
              key={m}
              onClick={() => !running && setMode(m)}
              disabled={running}
              className={`py-2.5 px-2 rounded-xl border text-center transition-all disabled:opacity-50 ${
                mode === m
                  ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600"
              }`}
            >
              <span className="block text-[13px] font-bold">{MODES[m].label}</span>
              <span className="block text-[10px] mt-0.5 opacity-70">{MODES[m].desc}</span>
            </button>
          ))}
        </div>
        <p className="text-[12px] text-slate-500 dark:text-zinc-500">
          データ使用量: <strong className="text-slate-700 dark:text-zinc-300">{MODES[mode].estimate}</strong>
          <span className="ml-1.5">モバイル回線では通信量にご注意ください。</span>
        </p>
        {MODES[mode].warning && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-3.5 py-2.5 text-[12px] text-amber-800 dark:text-amber-300 leading-relaxed">
            ⚠️ 高精度モードは超高速回線の実力を測るため、最大約700MBのデータを送受信します。
            モバイル回線・従量課金の環境では実行しないでください。
          </div>
        )}
      </div>

      {/* ── メーターカード ── */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0d1222] via-[#090c17] to-black p-5 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.4)]">
        {/* 環境光 */}
        <div aria-hidden="true" className="absolute -top-24 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full blur-[100px] pointer-events-none transition-colors duration-500"
          style={{ background: `${speedColor(displayMbps)}14` }} />

        <div className="relative">
          <Gauge mbps={displayMbps} active={running} reduced={reduced} />

          {/* フェーズ・進捗 */}
          {running && (
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between text-[12px] text-white/50 tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <span className={reduced ? "" : "animate-pulse"} style={{ color: speedColor(displayMbps) }}>●</span>
                  {phaseLabel}
                </span>
                <span>{fmtBytes(usedBytes)} 使用</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%`, background: speedColor(displayMbps) }} />
              </div>
            </div>
          )}

          {/* START / STOP */}
          <div className="mt-6 flex justify-center">
            {running ? (
              <button
                onClick={stop}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur text-white/90 font-bold text-[15px] hover:bg-white/10 transition-all min-h-[52px]"
              >
                <Square className="w-4 h-4" />
                測定を中止
              </button>
            ) : (
              <button
                onClick={run}
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-[16px] text-zinc-950 bg-white hover:bg-zinc-100 hover:-translate-y-0.5 transition-all min-h-[56px] shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                {phase === "done" || phase === "error" ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {phase === "done" || phase === "error" ? "もう一度測定" : "測定スタート"}
              </button>
            )}
          </div>

          {error && (
            <p className="mt-4 text-center text-[13px] text-rose-400">{error}</p>
          )}
        </div>
      </div>

      {/* ── 結果 ── */}
      {result && rank && (
        <div className="space-y-5">
          {/* 主要数値 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "ダウンロード（平均）", value: fmtMbps(result.dlMbps), sub: fmtMBs(result.dlMbps), main: true },
              { label: "アップロード（平均）", value: fmtMbps(result.ulMbps), sub: fmtMBs(result.ulMbps) },
              { label: "ピーク速度（下り）", value: fmtMbps(result.dlPeak), sub: `上り ${fmtMbps(result.ulPeak)}` },
              { label: "Ping（応答速度）", value: result.pingMs != null ? `${result.pingMs.toFixed(0)} ms` : "—", sub: result.jitterMs != null ? `ジッター ${result.jitterMs.toFixed(1)}ms` : "" },
              { label: "接続の安定度", value: result.stability != null ? `${result.stability}%` : "—", sub: "速度のブレの少なさ" },
              { label: "測定時間 / データ量", value: `${result.seconds.toFixed(1)}秒`, sub: `${fmtBytes(result.dlBytes + result.ulBytes)} 使用` },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl border p-4 ${c.main ? "border-cyan-500/40 bg-cyan-500/5" : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"}`}>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-1">{c.label}</p>
                <p className="text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-white tabular-nums leading-tight">{c.value}</p>
                {c.sub && <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 tabular-nums">{c.sub}</p>}
              </div>
            ))}
          </div>

          {/* 20段階評価 */}
          <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${rank.color}55`, background: `${rank.color}0d` }}>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="text-[12px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: rank.color }}>
                レベル {rank.level} / 20
              </span>
              <h2 className="text-[20px] font-bold text-slate-900 dark:text-white">{rank.name}</h2>
              <span className="text-[12px] text-slate-500 dark:text-zinc-400">（{rank.range}）</span>
            </div>
            <p className="text-[14px] text-slate-700 dark:text-zinc-300 leading-relaxed mb-4">{rank.tagline}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">✓ この速度でできること</p>
                <ul className="space-y-1 text-[13px] text-slate-600 dark:text-zinc-400">
                  {rank.can.map((c) => <li key={c}>・{c}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[12px] font-bold text-rose-500 dark:text-rose-400 mb-1.5">△ 厳しいこと</p>
                <ul className="space-y-1 text-[13px] text-slate-600 dark:text-zinc-400">
                  {rank.hard.map((c) => <li key={c}>・{c}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white/60 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 px-4 py-3">
              <p className="text-[12px] font-bold text-slate-500 dark:text-zinc-400 mb-0.5">改善アドバイス</p>
              <p className="text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed">{rank.advice}</p>
            </div>
          </div>

          {/* 用途別快適度 */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-3">用途別の快適度</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {comforts.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 bg-slate-50 dark:bg-zinc-800/50">
                  <span className="text-[13px] text-slate-700 dark:text-zinc-300">{c.label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${COMFORT_STYLE[c.level]}`}>{c.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 推移グラフ */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-3">速度の推移</h3>
            <SpeedGraph dl={dlSamples} ul={ulSamples} />
          </div>

          {/* アクション */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CopyResultButton text={copyText} />
            <button onClick={run} className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
              再測定する
            </button>
          </div>
        </div>
      )}

      {/* ── 測定ログ ── */}
      {logs.length > 0 && (
        <details className="group rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
          <summary className="flex items-center justify-between px-4 py-2.5 cursor-pointer list-none text-[12px] font-medium text-slate-500 dark:text-zinc-400">
            測定ログ
            <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-4 pb-3 space-y-0.5 font-mono text-[11px] text-slate-500 dark:text-zinc-500 border-t border-slate-100 dark:border-zinc-800 pt-2.5">
            {logs.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </details>
      )}

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center leading-relaxed">
        ※ 測定値はブラウザ・端末性能・Wi-Fi環境・測定サーバーの状況に影響されます。回線の実力の目安としてご利用ください。<br />
        ※ 通信はすべて測定用のランダムデータで、個人情報は一切送信されません。
      </p>
    </div>
  );
}
