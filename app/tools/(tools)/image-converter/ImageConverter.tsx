"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Upload, Download, X, AlertCircle, Loader2, CheckCircle2, Pause, Play,
  RotateCcw, ImageIcon, ShieldCheck, Settings2, FileArchive, ChevronDown,
} from "lucide-react";
import {
  OUTPUT_FORMATS, PRESETS, DEFAULT_OPTIONS, DEFAULT_FILENAME_RULE,
  detectEncodeSupport, isSupportedInput, formatBytes, buildFilename, formatByKey,
  type OutputFormat, type ConvertOptions, type FilenameRule,
} from "@/lib/image-converter";
import { ConverterPool } from "@/lib/image-converter-pool";

type Status = "waiting" | "processing" | "done" | "failed" | "cancelled";

interface Item {
  id: string;
  file: File;
  name: string;
  size: number;
  inputLabel: string;
  previewUrl: string;
  srcW?: number;
  srcH?: number;
  status: Status;
  outUrl?: string;
  outName?: string;
  outSize?: number;
  outW?: number;
  outH?: number;
  error?: string;
}

const LARGE_FILE = 25 * 1024 * 1024; // 25MB以上は事前警告
const isMobile = () => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function inputLabelOf(file: File): string {
  const n = file.name.toLowerCase();
  if (/\.(jpe?g)$/.test(n) || file.type === "image/jpeg") return "JPG";
  if (/\.png$/.test(n) || file.type === "image/png") return "PNG";
  if (/\.webp$/.test(n) || file.type === "image/webp") return "WebP";
  if (/\.avif$/.test(n) || file.type === "image/avif") return "AVIF";
  if (/\.gif$/.test(n)) return "GIF";
  if (/\.bmp$/.test(n)) return "BMP";
  return "画像";
}

function mapError(msg: string, format: OutputFormat): string {
  if (msg === "unsupported-output") {
    const label = formatByKey(format).label;
    return `このブラウザは${label}での書き出しに対応していません。出力形式をJPGまたはPNGに変えてお試しください。`;
  }
  if (/decode|createImageBitmap|Image|load/i.test(msg)) {
    return "画像を読み込めませんでした。ファイルが壊れているか、対応していない形式の可能性があります。";
  }
  return "変換に失敗しました。画像が大きすぎるかメモリが不足している可能性があります。枚数を減らすか、リサイズで小さくしてお試しください。";
}

export function ImageConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [opts, setOpts] = useState<ConvertOptions>(DEFAULT_OPTIONS);
  const [rule, setRule] = useState<FilenameRule>(DEFAULT_FILENAME_RULE);
  const [activePreset, setActivePreset] = useState<string | null>("web");
  const [phase, setPhase] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [filter, setFilter] = useState<"all" | "done" | "failed">("all");
  const [support, setSupport] = useState<Record<OutputFormat, boolean> | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [heicNotice, setHeicNotice] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [engineMode, setEngineMode] = useState<"worker" | "main" | null>(null);
  const dragRef = useRef(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const itemsRef = useRef<Item[]>([]);
  const optsRef = useRef(opts);
  const ruleRef = useRef(rule);
  const poolRef = useRef<ConverterPool | null>(null);
  const pausedRef = useRef(false);
  const inFlightRef = useRef(0);
  const claimedRef = useRef<Set<string>>(new Set());

  itemsRef.current = items;
  optsRef.current = opts;
  ruleRef.current = rule;

  const concurrency = useMemo(() => {
    if (typeof navigator === "undefined") return 2;
    const hw = navigator.hardwareConcurrency || 4;
    return Math.max(1, Math.min(isMobile() ? 2 : 3, hw - 1 || 1));
  }, []);

  useEffect(() => {
    detectEncodeSupport().then(setSupport);
    return () => {
      poolRef.current?.destroy();
      itemsRef.current.forEach((i) => {
        URL.revokeObjectURL(i.previewUrl);
        if (i.outUrl) URL.revokeObjectURL(i.outUrl);
      });
    };
  }, []);

  // ── ファイル追加 ──
  const addFiles = useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files);
    const existing = itemsRef.current;
    const accepted: Item[] = [];
    let dupCount = 0;
    let heic = false;
    let rejected = 0;
    let large = false;

    for (const f of incoming) {
      const check = isSupportedInput(f);
      if (!check.ok) {
        if (check.heic) heic = true;
        else rejected++;
        continue;
      }
      const dup = existing.some((e) => e.name === f.name && e.size === f.size) ||
        accepted.some((e) => e.name === f.name && e.size === f.size);
      if (dup) { dupCount++; continue; }
      if (f.size >= LARGE_FILE) large = true;
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f, name: f.name, size: f.size, inputLabel: inputLabelOf(f),
        previewUrl: URL.createObjectURL(f), status: "waiting",
      });
    }

    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      if (phase === "done") setPhase("idle");
    }
    setHeicNotice(heic);
    const msgs: string[] = [];
    if (dupCount) msgs.push(`重複した${dupCount}枚はスキップしました`);
    if (rejected) msgs.push(`対応していない${rejected}件は除外しました`);
    if (large) msgs.push("25MBを超える大きな画像があります。処理に時間がかかる場合はリサイズ設定をご利用ください");
    const total = existing.length + accepted.length;
    if (isMobile() && total > 40) msgs.push("スマホで多数の画像を一度に変換すると重くなることがあります。20〜30枚ずつを目安にすると安定します");
    setNotice(msgs.length ? msgs.join("。") : null);
  }, [phase]);

  // ── 寸法の遅延読み取り（背景・並列2・即closeでメモリ節約）──
  useEffect(() => {
    let cancelled = false;
    const targets = items.filter((i) => i.srcW === undefined).slice(0, 200);
    if (targets.length === 0) return;
    let idx = 0;
    const worker = async () => {
      while (!cancelled && idx < targets.length) {
        const t = targets[idx++];
        try {
          const bmp = await createImageBitmap(t.file);
          const w = bmp.width, h = bmp.height;
          bmp.close?.();
          if (cancelled) return;
          setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, srcW: w, srcH: h } : x)));
        } catch { /* 寸法取得失敗は無視 */ }
      }
    };
    const runners = Array.from({ length: 2 }, worker);
    Promise.all(runners);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // ── プリセット適用 ──
  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setActivePreset(id);
    setOpts((o) => ({ ...o, ...p.options }));
  };

  const patchOpts = (patch: Partial<ConvertOptions>) => {
    setActivePreset(null);
    setOpts((o) => ({ ...o, ...patch }));
  };

  // ── 変換ランナー（並列制限つき）──
  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const finalizeCheck = () => {
    const remaining = itemsRef.current.some((i) => i.status === "waiting" || i.status === "processing");
    if (!remaining && inFlightRef.current === 0) {
      setPhase("done");
    }
  };

  const pump = useCallback(() => {
    if (pausedRef.current) return;
    const pool = poolRef.current;
    if (!pool) return;
    while (inFlightRef.current < concurrency) {
      const next = itemsRef.current.find((i) => i.status === "waiting" && !claimedRef.current.has(i.id));
      if (!next) break;
      claimedRef.current.add(next.id);
      inFlightRef.current++;
      updateItem(next.id, { status: "processing", error: undefined });

      const index = itemsRef.current.findIndex((i) => i.id === next.id);
      const o = optsRef.current;
      pool.convert(next.file, o)
        .then((res) => {
          const fmt = formatByKey(o.format);
          const outName = buildFilename(next.name, index, ruleRef.current, fmt.ext);
          const outUrl = URL.createObjectURL(res.blob);
          updateItem(next.id, {
            status: "done", outUrl, outName, outSize: res.blob.size,
            outW: res.outW, outH: res.outH,
            srcW: res.srcW || next.srcW, srcH: res.srcH || next.srcH,
          });
        })
        .catch((err: Error) => {
          updateItem(next.id, { status: "failed", error: mapError(err.message, o.format) });
        })
        .finally(() => {
          inFlightRef.current--;
          claimedRef.current.delete(next.id);
          pump();
          finalizeCheck();
        });
    }
  }, [concurrency]);

  const ensurePool = () => {
    if (!poolRef.current) {
      poolRef.current = new ConverterPool(concurrency);
      setEngineMode(poolRef.current.mode);
    }
  };

  const start = () => {
    ensurePool();
    pausedRef.current = false;
    setPhase("running");
    pump();
  };

  const pause = () => { pausedRef.current = true; setPhase("paused"); };
  const resume = () => { pausedRef.current = false; setPhase("running"); pump(); };

  const cancelAll = () => {
    pausedRef.current = true;
    setItems((prev) => prev.map((i) => (i.status === "waiting" ? { ...i, status: "cancelled" } : i)));
    setTimeout(() => finalizeCheck(), 0);
  };

  const retryFailed = () => {
    setItems((prev) => prev.map((i) => (i.status === "failed" || i.status === "cancelled" ? { ...i, status: "waiting", error: undefined } : i)));
    ensurePool();
    pausedRef.current = false;
    setPhase("running");
    setTimeout(() => pump(), 0);
  };

  const retryOne = (id: string) => {
    updateItem(id, { status: "waiting", error: undefined });
    ensurePool();
    pausedRef.current = false;
    setPhase("running");
    setTimeout(() => pump(), 0);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) { URL.revokeObjectURL(it.previewUrl); if (it.outUrl) URL.revokeObjectURL(it.outUrl); }
      return prev.filter((x) => x.id !== id);
    });
  };

  const reset = () => {
    poolRef.current?.destroy();
    poolRef.current = null;
    itemsRef.current.forEach((i) => { URL.revokeObjectURL(i.previewUrl); if (i.outUrl) URL.revokeObjectURL(i.outUrl); });
    claimedRef.current.clear();
    inFlightRef.current = 0;
    pausedRef.current = false;
    setItems([]); setPhase("idle"); setNotice(null); setHeicNotice(false); setFilter("all");
  };

  // ── ZIP一括ダウンロード ──
  const downloadZip = async () => {
    const done = itemsRef.current.filter((i) => i.status === "done" && i.outUrl);
    if (done.length === 0) return;
    setZipping(true); setZipProgress(0);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const seen = new Map<string, number>();
      for (const it of done) {
        const blob = await fetch(it.outUrl!).then((r) => r.blob());
        let fname = it.outName || it.name;
        const n = seen.get(fname) ?? 0; // 同名回避
        if (n > 0) { const dot = fname.lastIndexOf("."); fname = dot > 0 ? `${fname.slice(0, dot)}(${n})${fname.slice(dot)}` : `${fname}(${n})`; }
        seen.set(it.outName || it.name, n + 1);
        zip.file(fname, blob);
      }
      const content = await zip.generateAsync({ type: "blob", compression: "STORE" }, (m) => setZipProgress(m.percent / 100));
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url; a.download = "toolboxjp-converted-images.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setNotice("ZIPの作成に失敗しました。枚数が多すぎる可能性があります。個別ダウンロードをお試しいただくか、枚数を分けてお試しください。");
    } finally {
      setZipping(false);
    }
  };

  // ── 集計 ──
  const summary = useMemo(() => {
    let srcTotal = 0, outTotal = 0, done = 0, failed = 0;
    for (const i of items) {
      if (i.status === "done") { done++; srcTotal += i.size; outTotal += i.outSize || 0; }
      else if (i.status === "failed") failed++;
    }
    const reduction = srcTotal > 0 ? Math.round((1 - outTotal / srcTotal) * 100) : 0;
    return { total: items.length, done, failed, srcTotal, outTotal, reduction };
  }, [items]);

  const processed = items.filter((i) => i.status === "done" || i.status === "failed" || i.status === "cancelled").length;
  const globalProgress = items.length ? processed / items.length : 0;
  const hasWaiting = items.some((i) => i.status === "waiting");
  const running = phase === "running";
  const filtered = items.filter((i) => filter === "all" || (filter === "done" && i.status === "done") || (filter === "failed" && (i.status === "failed" || i.status === "cancelled")));

  const fmtSupported = (f: OutputFormat) => (f === "webp" || f === "avif" ? support?.[f] !== false : true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* プライバシー */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <p className="font-semibold mb-0.5">選んだ画像はこの端末（ブラウザ内）で変換します</p>
            <p>サーバーにはアップロードされません。変換後の画像も端末上で作られ、ページを閉じるとデータは破棄されます。</p>
          </div>
        </div>
      </div>

      {/* ドロップゾーン */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!dragRef.current) { dragRef.current = true; setDragOver(true); } }}
        onDragLeave={() => { dragRef.current = false; setDragOver(false); }}
        onDrop={(e) => { e.preventDefault(); dragRef.current = false; setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/20" : "border-slate-300 dark:border-zinc-700 hover:border-blue-400"
        }`}
      >
        <Upload className="w-9 h-9 mx-auto text-slate-400 mb-3" />
        <p className="text-[16px] font-semibold text-slate-700 dark:text-zinc-100">画像をドラッグ＆ドロップ</p>
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">またはタップして選択（複数選択・20枚以上OK）</p>
        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">JPG・PNG・WebP・AVIF・GIF・BMP に対応</p>
        <input ref={inputRef} type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp" multiple className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
      </div>

      {notice && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 text-[13px] text-amber-700 dark:text-amber-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{notice}
        </div>
      )}
      {heicNotice && (
        <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-3.5 text-[13px] text-sky-700 dark:text-sky-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>iPhoneのHEIC/HEIF画像が含まれていました。HEICは
            <a href="/tools/heic-to-jpg" className="underline font-medium mx-1">HEIC→JPG変換</a>
            をご利用ください（このツールでは扱えません）。</span>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* 用途別プリセット */}
          <section>
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">用途で選ぶ（かんたん）</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.id} onClick={() => applyPreset(p.id)} title={p.hint}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${
                    activePreset === p.id ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-blue-400"}`}>
                  {p.name}
                </button>
              ))}
            </div>
            {activePreset && (
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-2 px-1">{PRESETS.find((p) => p.id === activePreset)?.hint}</p>
            )}
          </section>

          {/* 変換設定 */}
          <section className="rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 sm:p-5 space-y-5">
            <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
              <Settings2 className="w-4 h-4" /><span className="text-[14px] font-semibold">変換設定</span>
            </div>

            {/* 出力形式 */}
            <div>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-2">出力形式</p>
              <div className="grid grid-cols-4 gap-2">
                {OUTPUT_FORMATS.map((f) => {
                  const ok = fmtSupported(f.key);
                  return (
                    <button key={f.key} disabled={!ok} onClick={() => patchOpts({ format: f.key })}
                      className={`py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                        opts.format === f.key ? "bg-blue-600 border-blue-600 text-white"
                        : ok ? "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-blue-400"
                        : "bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-300 dark:text-zinc-600 cursor-not-allowed"}`}>
                      {f.label}
                    </button>
                  );
                })}
              </div>
              {!fmtSupported("avif") && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1.5">※ お使いのブラウザはAVIF出力に非対応のため選択できません。</p>
              )}
            </div>

            {/* 品質 */}
            {opts.format !== "png" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-slate-500 dark:text-zinc-400">品質</span>
                  <span className="text-[12px] font-mono text-slate-600 dark:text-zinc-300">{opts.quality}</span>
                </div>
                <input type="range" min={30} max={100} step={1} value={opts.quality}
                  onChange={(e) => patchOpts({ quality: Number(e.target.value) })}
                  className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500"><span>軽い</span><span>高画質</span></div>
              </div>
            )}

            {/* リサイズ */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">最大の横幅（px・0で無制限）</span>
                <input type="number" min={0} value={opts.maxWidth} onChange={(e) => patchOpts({ maxWidth: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-[14px]" />
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">最大の高さ（px・0で無制限）</span>
                <input type="number" min={0} value={opts.maxHeight} onChange={(e) => patchOpts({ maxHeight: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-[14px]" />
              </label>
            </div>

            {/* 詳細設定 */}
            <button onClick={() => setShowAdvanced((v) => !v)} className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200">
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />詳細設定（アスペクト比・透過・ファイル名）
            </button>
            {showAdvanced && (
              <div className="space-y-3.5 pt-1">
                <label className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-zinc-300"><input type="checkbox" checked={opts.keepAspect} onChange={(e) => patchOpts({ keepAspect: e.target.checked })} className="accent-blue-600" />アスペクト比を維持する</label>
                <label className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-zinc-300"><input type="checkbox" checked={opts.allowUpscale} onChange={(e) => patchOpts({ allowUpscale: e.target.checked })} className="accent-blue-600" />元より大きく拡大することを許可する</label>
                <label className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-zinc-300"><input type="checkbox" checked={opts.keepTransparency} onChange={(e) => patchOpts({ keepTransparency: e.target.checked })} className="accent-blue-600" />透過を保持する（PNG・WebP・AVIFのみ）</label>
                {!formatByKey(opts.format).supportsAlpha && (
                  <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-zinc-400">
                    <span>JPGは透過を保持できません。透過部分の背景色：</span>
                    <input type="color" value={opts.background} onChange={(e) => patchOpts({ background: e.target.value })} className="w-8 h-6 rounded border border-slate-200 dark:border-zinc-700" />
                  </div>
                )}
                <p className="text-[12px] text-slate-400 dark:text-zinc-500">※ 変換すると位置情報などのEXIFは自動的に削除されます（再エンコードのため）。写真の向きは保持します。</p>

                {/* ファイル名ルール */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
                  <p className="text-[12px] font-medium text-slate-500 dark:text-zinc-400">ファイル名</p>
                  <div className="flex flex-wrap gap-2">
                    {([["keep", "元の名前を維持"], ["sequence", "連番"], ["custom", "接頭辞＋連番"]] as [FilenameRule["base"], string][]).map(([v, l]) => (
                      <button key={v} onClick={() => setRule((r) => ({ ...r, base: v }))}
                        className={`px-2.5 py-1 rounded-lg text-[12px] border ${rule.base === v ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"}`}>{l}</button>
                    ))}
                  </div>
                  {rule.base === "custom" && (
                    <input value={rule.customName} onChange={(e) => setRule((r) => ({ ...r, customName: e.target.value }))} placeholder="接頭辞（例: photo）"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[13px]" />
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-600 dark:text-zinc-300">
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={rule.appendFormat} onChange={(e) => setRule((r) => ({ ...r, appendFormat: e.target.checked }))} className="accent-blue-600" />末尾に形式名</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={rule.spaceToHyphen} onChange={(e) => setRule((r) => ({ ...r, spaceToHyphen: e.target.checked }))} className="accent-blue-600" />空白を-に</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={rule.lowercase} onChange={(e) => setRule((r) => ({ ...r, lowercase: e.target.checked }))} className="accent-blue-600" />小文字化</label>
                  </div>
                  <p className="text-[12px] text-slate-400 dark:text-zinc-500">出力名の例：<span className="font-mono text-slate-600 dark:text-zinc-300">{buildFilename(items[0]?.name || "sample.jpg", 0, rule, formatByKey(opts.format).ext)}</span></p>
                </div>
              </div>
            )}
          </section>

          {/* 変換コントロール */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {phase !== "running" && hasWaiting && (
                <button onClick={start} className="flex-1 min-w-[160px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />{phase === "paused" ? "再開する" : `変換開始（${items.filter((i) => i.status === "waiting").length}枚）`}
                </button>
              )}
              {running && (
                <button onClick={pause} className="flex-1 min-w-[120px] py-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" />一時停止
                </button>
              )}
              {phase === "paused" && (
                <button onClick={resume} className="flex-1 min-w-[120px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />再開
                </button>
              )}
              {(running || phase === "paused") && (
                <button onClick={cancelAll} className="py-3 px-4 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-semibold">全キャンセル</button>
              )}
              {summary.failed > 0 && phase !== "running" && (
                <button onClick={retryFailed} className="py-3 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold flex items-center gap-1.5"><RotateCcw className="w-4 h-4" />失敗を再試行</button>
              )}
              <button onClick={reset} className="py-3 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 text-sm font-medium">すべてクリア</button>
            </div>

            {/* 全体進捗 */}
            {(running || phase === "paused" || phase === "done") && (
              <div>
                <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-zinc-400 mb-1">
                  <span>{phase === "done" ? "完了" : phase === "paused" ? "一時停止中" : "変換中…"} {processed}/{items.length}{engineMode === "worker" ? "・高速処理" : ""}</span>
                  <span>{Math.round(globalProgress * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-[width] duration-200" style={{ width: `${globalProgress * 100}%` }} />
                </div>
              </div>
            )}
          </section>

          {/* サマリー */}
          {summary.done > 0 && (
            <section className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "変換成功", value: `${summary.done}枚` },
                  { label: "失敗", value: `${summary.failed}枚` },
                  { label: "合計サイズ", value: `${formatBytes(summary.srcTotal)} → ${formatBytes(summary.outTotal)}` },
                  { label: "平均削減率", value: summary.reduction >= 0 ? `${summary.reduction}%減` : `${-summary.reduction}%増` },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">{s.label}</p>
                    <p className="text-[14px] font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={downloadZip} disabled={zipping}
                className="mt-4 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2">
                {zipping ? (<><Loader2 className="w-4 h-4 animate-spin" />ZIP作成中… {Math.round(zipProgress * 100)}%</>) : (<><FileArchive className="w-4 h-4" />変換した{summary.done}枚をZIPでまとめてダウンロード</>)}
              </button>
            </section>
          )}

          {/* フィルタ */}
          <div className="flex items-center gap-2">
            {([["all", `全件 ${items.length}`], ["done", `完了 ${summary.done}`], ["failed", `失敗 ${summary.failed}`]] as [typeof filter, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${filter === v ? "bg-slate-800 dark:bg-zinc-200 text-white dark:text-zinc-900" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"}`}>{l}</button>
            ))}
          </div>

          {/* 一覧 */}
          <div className="space-y-2.5">
            {filtered.map((it) => (
              <div key={it.id} className="rounded-2xl border border-slate-200 dark:border-zinc-700 p-3 flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.previewUrl} alt="" loading="lazy" className="w-14 h-14 rounded-lg object-cover bg-slate-100 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-800 dark:text-zinc-100 truncate">{it.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                    {it.inputLabel}・{formatBytes(it.size)}{it.srcW ? `・${it.srcW}×${it.srcH}px` : ""}
                  </p>
                  {it.status === "done" && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                      <span className="text-slate-500 dark:text-zinc-400">→ {formatByKey(opts.format).label}・{formatBytes(it.outSize || 0)}{it.outW ? `・${it.outW}×${it.outH}px` : ""}</span>
                      {typeof it.outSize === "number" && (
                        <span className={`font-semibold ${it.outSize <= it.size ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500"}`}>
                          {it.outSize <= it.size ? `${Math.round((1 - it.outSize / it.size) * 100)}%減` : `${Math.round((it.outSize / it.size - 1) * 100)}%増`}
                        </span>
                      )}
                    </div>
                  )}
                  {it.status === "failed" && it.error && (
                    <p className="text-[11px] text-red-500 mt-1 leading-snug">{it.error}</p>
                  )}
                </div>
                {/* ステータス / アクション */}
                <div className="shrink-0 flex flex-col items-end justify-between">
                  <div className="text-[11px]">
                    {it.status === "waiting" && <span className="text-slate-400 dark:text-zinc-500">待機中</span>}
                    {it.status === "processing" && <span className="text-blue-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />処理中</span>}
                    {it.status === "done" && <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />完了</span>}
                    {it.status === "failed" && <span className="text-red-500">失敗</span>}
                    {it.status === "cancelled" && <span className="text-slate-400">中止</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {it.status === "done" && it.outUrl && (
                      <a href={it.outUrl} download={it.outName} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" aria-label="ダウンロード"><Download className="w-4 h-4" /></a>
                    )}
                    {(it.status === "failed" || it.status === "cancelled") && (
                      <button onClick={() => retryOne(it.id)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400" aria-label="再変換"><RotateCcw className="w-4 h-4" /></button>
                    )}
                    {it.status !== "processing" && (
                      <button onClick={() => removeItem(it.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400" aria-label="削除"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[13px] text-slate-400 dark:text-zinc-500 flex flex-col items-center gap-2">
                <ImageIcon className="w-6 h-6" />該当する画像はありません
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
