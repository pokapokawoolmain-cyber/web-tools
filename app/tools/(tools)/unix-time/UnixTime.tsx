"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Clock } from "lucide-react";

function fmtLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">{label}</p>
        <p className="text-[14px] font-mono text-slate-800 dark:text-zinc-100 break-all">{value}</p>
      </div>
      <button onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ } }}
        aria-label="コピー" className="shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  );
}

export function UnixTime() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState("");
  const [dt, setDt] = useState("");
  const [fromTs, setFromTs] = useState<Date | null>(null);
  const [fromDt, setFromDt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const convertTs = () => {
    setError(null);
    const raw = ts.trim();
    if (!raw || !/^\d+$/.test(raw)) { setFromTs(null); setError("数字のタイムスタンプを入力してください。"); return; }
    let n = Number(raw);
    if (raw.length >= 13) n = Math.floor(n / 1000); // ミリ秒を秒へ
    setFromTs(new Date(n * 1000));
  };
  const convertDt = () => {
    setError(null);
    const d = new Date(dt);
    if (isNaN(d.getTime())) { setFromDt(null); setError("正しい日時を入力してください。"); return; }
    setFromDt(Math.floor(d.getTime() / 1000));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 現在時刻 */}
      <div className="rounded-2xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/20 p-5">
        <p className="text-[12px] font-semibold text-sky-700 dark:text-sky-300 mb-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />現在のUnixタイムスタンプ</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[28px] font-bold font-mono text-slate-900 dark:text-white tabular-nums">{now}</span>
          <button onClick={async () => { try { await navigator.clipboard.writeText(String(now)); } catch { /* noop */ } }}
            className="text-[12px] px-2.5 py-1 rounded-lg border border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400">コピー</button>
        </div>
        <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">{fmtLocal(new Date(now * 1000))}（お使いの端末の時刻）</p>
      </div>

      {error && <p className="text-[13px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl px-4 py-3">{error}</p>}

      {/* タイムスタンプ → 日時 */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">タイムスタンプ → 日時</h2>
        <div className="flex flex-wrap gap-2">
          <input value={ts} onChange={(e) => setTs(e.target.value)} placeholder="例: 1751000000" inputMode="numeric"
            className="flex-1 min-w-[180px] h-11 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <button onClick={convertTs} className="px-5 h-11 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90">変換</button>
          <button onClick={() => setTs(String(now))} className="px-3 h-11 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-500 dark:text-zinc-400">現在</button>
        </div>
        {fromTs && (
          <div className="space-y-2">
            <Row label="ローカル日時" value={fmtLocal(fromTs)} />
            <Row label="UTC" value={fromTs.toUTCString()} />
            <Row label="ISO 8601" value={fromTs.toISOString()} />
          </div>
        )}
      </section>

      {/* 日時 → タイムスタンプ */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">日時 → タイムスタンプ</h2>
        <div className="flex flex-wrap gap-2">
          <input type="datetime-local" step={1} value={dt} onChange={(e) => setDt(e.target.value)}
            className="flex-1 min-w-[180px] h-11 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <button onClick={convertDt} className="px-5 h-11 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90">変換</button>
        </div>
        {fromDt !== null && (
          <div className="space-y-2">
            <Row label="Unixタイムスタンプ（秒）" value={String(fromDt)} />
            <Row label="ミリ秒" value={String(fromDt * 1000)} />
          </div>
        )}
      </section>

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center">13桁以上の入力はミリ秒として自動判定します。すべてブラウザ内で処理されます。</p>
    </div>
  );
}
