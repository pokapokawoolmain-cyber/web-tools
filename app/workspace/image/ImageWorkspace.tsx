"use client";

// ============================================================
// 画像ワークスペース（Phase 1 PoC）
// 画像を入れる → 目的を選ぶ（おすすめを自動で上に）→ まとめて処理 → 保存
// 処理はすべて端末内（Worker）。ファイルは外部に送信しない。
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle, CheckCircle2, Download, FileArchive, FileText, ImagePlus, Loader2, RotateCcw, Settings2, ShieldCheck, Square, X,
} from "lucide-react";
import { sniffFile, kindFromName, KIND_LABEL, type FileKind } from "@/lib/workspace/sniff";
import {
  DEFAULT_JOB_OPTIONS, INPUT_KINDS, LIMITS, dedupeNames, outputName,
  type AspectFit, type AspectRatio, type ImageJobOptions, type OutputFormat, type ResizeMode,
} from "@/lib/workspace/image-plan";
import { suggest, type OutputMode, type Suggestion } from "@/lib/workspace/suggest";
import { ImageEngine, type EngineOutcome } from "@/lib/workspace/image-engine";
import type { ImageJobErrorCode, ImageJobResult } from "@/lib/workspace/image-core";
import { saveBlob, toPdf, toZip } from "@/lib/workspace/export";

type Status = "ready" | "rejected" | "processing" | "done" | "failed" | "cancelled";

interface Entry {
  id: number;
  file: File;
  kind: FileKind;
  width?: number;
  height?: number;
  hasAlpha: boolean;
  status: Status;
  /** 受け付けなかった理由・失敗の理由 */
  reason?: string;
  /** 拡張子と中身が違うときの知らせ */
  note?: string;
  result?: ImageJobResult & { name: string };
}

const MB = 1024 * 1024;

const ERROR_TEXT: Record<ImageJobErrorCode | "cancelled", string> = {
  "decode-failed": "この画像を読み込めませんでした。壊れているか、このブラウザが対応していない形式です。",
  "too-many-pixels": "画像が大きすぎます（5,000万画素まで）。",
  "unsupported-output": "このブラウザは選んだ形式で書き出せません。JPGかPNGを選んでください。",
  "canvas-failed": "メモリ不足などで処理できませんでした。枚数を減らすか、大きさを小さくしてお試しください。",
  cancelled: "中断しました。",
};

const RESIZE_LABEL: Record<ResizeMode, string> = {
  none: "変えない", long: "長い辺を指定（px）", width: "横幅を指定（px）", height: "高さを指定（px）", percent: "割合で指定（%）",
};
const ASPECT_LABEL: Record<AspectRatio, string> = {
  none: "変えない", "1:1": "1:1（正方形）", "4:3": "4:3（横）", "3:4": "3:4（縦・証明写真の比率）", "16:9": "16:9（横長）", "9:16": "9:16（縦長・ストーリーズ）",
};
const FORMAT_LABEL: Record<OutputFormat | "keep", string> = { keep: "元のまま", jpeg: "JPG", png: "PNG", webp: "WebP", avif: "AVIF" };
const TARGETS = [0, 300 * 1024, 500 * 1024, 1 * MB, 2 * MB, 5 * MB];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < MB) return `${Math.round(n / 1024)} KB`;
  return `${(n / MB).toFixed(1)} MB`;
}

async function canEncode(mime: string): Promise<boolean> {
  try {
    const c = document.createElement("canvas");
    c.width = 2; c.height = 2;
    const blob: Blob | null = await new Promise((res) => c.toBlob(res, mime, 0.8));
    return !!blob && blob.type === mime;
  } catch {
    return false;
  }
}

export function ImageWorkspace() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [purposeId, setPurposeId] = useState<string>("");
  const [opts, setOpts] = useState<ImageJobOptions>(DEFAULT_JOB_OPTIONS);
  const [output, setOutput] = useState<OutputMode>("files");
  const [phase, setPhase] = useState<"empty" | "ready" | "running" | "finished">("empty");
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [support, setSupport] = useState<{ webp: boolean; avif: boolean }>({ webp: true, avif: false });
  const inputRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<ImageEngine | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    void Promise.all([canEncode("image/webp"), canEncode("image/avif")]).then(([webp, avif]) => setSupport({ webp, avif }));
  }, []);

  const accepted = useMemo(() => entries.filter((e) => e.status !== "rejected"), [entries]);
  const doneCount = entries.filter((e) => e.status === "done" || e.status === "failed" || e.status === "cancelled").length;

  const applyPurpose = useCallback((s: Suggestion | undefined) => {
    if (!s) return;
    setPurposeId(s.purpose.id);
    setOpts(s.purpose.options);
    setOutput(s.purpose.output);
  }, []);

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const files = Array.from(list);
    if (!files.length) return;
    setNotice(null);
    const room = LIMITS.maxFiles - entries.filter((e) => e.status !== "rejected").length;
    if (files.length > room) setNotice(`一度に入れられるのは${LIMITS.maxFiles}枚までです。先頭の${Math.max(0, room)}枚だけ受け付けました。`);

    const added: Entry[] = [];
    for (const [i, file] of files.entries()) {
      const id = nextId.current++;
      const head = await sniffFile(file);
      const base: Entry = { id, file, kind: head.kind, width: head.width, height: head.height, hasAlpha: !!head.hasAlpha, status: "ready" };
      const reject = (reason: string) => added.push({ ...base, status: "rejected", reason });
      if (i >= room) { reject(`${LIMITS.maxFiles}枚を超えたため受け付けませんでした。`); continue; }
      if (head.kind === "svg") { reject("SVGは中にプログラムを含められるため、安全のため扱っていません。"); continue; }
      if (head.kind === "pdf") { reject("PDFは画像ではありません。PDFの作業はPDFツールをお使いください。"); continue; }
      if (!INPUT_KINDS.includes(head.kind)) { reject("画像として読み取れませんでした（中身が画像ではない可能性があります）。"); continue; }
      if (file.size > LIMITS.maxBytes) { reject(`ファイルが大きすぎます（${formatBytes(file.size)}）。25MBまでです。`); continue; }
      if (head.width && head.height && head.width * head.height > LIMITS.maxPixels) {
        reject(`画像が大きすぎます（${Math.round((head.width * head.height) / 10000).toLocaleString()}万画素）。5,000万画素までです。`);
        continue;
      }
      const byName = kindFromName(file.name);
      const note = byName !== "unknown" && byName !== head.kind
        ? `拡張子は${KIND_LABEL[byName]}ですが、中身は${KIND_LABEL[head.kind]}でした。中身に合わせて処理します。`
        : undefined;
      added.push({ ...base, note });
    }

    setEntries((prev) => {
      const next = [...prev.filter((e) => e.status !== "done" && e.status !== "failed" && e.status !== "cancelled"), ...added];
      const ok = next.filter((e) => e.status !== "rejected");
      const s = suggest(ok.map((e) => ({ kind: e.kind, bytes: e.file.size, width: e.width, height: e.height, hasAlpha: e.hasAlpha })));
      setSuggestions(s);
      applyPurpose(s[0]);
      setPhase(ok.length ? "ready" : "empty");
      return next;
    });
  }, [entries, applyPurpose]);

  // どこでも貼り付け（スクリーンショットなど）
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (phase === "running") return;
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
      if (files.length) { e.preventDefault(); void addFiles(files); }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [addFiles, phase]);

  const run = async () => {
    const targets = entries.filter((e) => e.status === "ready");
    if (!targets.length) return;
    // PDF にまとめるときは JPG（透過のある画像は PNG）で書き出す
    const jobOpts: ImageJobOptions = output === "pdf" && opts.format !== "png" ? { ...opts, format: "jpeg" } : opts;
    setPhase("running");
    setEntries((prev) => prev.map((e) => (e.status === "ready" ? { ...e, status: "processing", reason: undefined } : e)));
    const engine = new ImageEngine();
    engineRef.current = engine;
    const onDone = (o: EngineOutcome) => {
      setEntries((prev) => prev.map((e) => {
        if (e.id !== o.id) return e;
        if (o.ok) return { ...e, status: "done", result: { ...o.result, name: outputName(e.file.name, o.result.format) } };
        return { ...e, status: o.code === "cancelled" ? "cancelled" : "failed", reason: ERROR_TEXT[o.code] };
      }));
    };
    await engine.run(targets.map((e) => ({ id: e.id, file: e.file, kind: e.kind, hasAlpha: e.hasAlpha })), jobOpts, onDone);
    engineRef.current = null;
    setPhase("finished");
  };

  const cancel = () => engineRef.current?.cancel();

  const results = useMemo(() => {
    const done = entries.filter((e) => e.status === "done" && e.result);
    const names = dedupeNames(done.map((e) => e.result!.name));
    return done.map((e, i) => ({ entry: e, name: names[i] }));
  }, [entries]);

  const saveAll = async (mode: OutputMode) => {
    if (!results.length) return;
    setSaving(true);
    try {
      if (mode === "pdf") {
        const pdf = await toPdf(results.map((r) => ({ name: r.name, blob: r.entry.result!.blob, width: r.entry.result!.width, height: r.entry.result!.height })));
        saveBlob(pdf, "images.pdf");
      } else if (mode === "zip" || results.length > 1) {
        const zip = await toZip(results.map((r) => ({ name: r.name, blob: r.entry.result!.blob, width: r.entry.result!.width, height: r.entry.result!.height })));
        saveBlob(zip, "images.zip");
      } else {
        saveBlob(results[0].entry.result!.blob, results[0].name);
      }
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    engineRef.current?.cancel();
    setEntries([]);
    setSuggestions([]);
    setPurposeId("");
    setOpts(DEFAULT_JOB_OPTIONS);
    setPhase("empty");
    setNotice(null);
  };

  const removeEntry = (id: number) => setEntries((prev) => {
    const next = prev.filter((e) => e.id !== id);
    if (!next.some((e) => e.status !== "rejected")) setPhase("empty");
    return next;
  });

  const setOpt = <K extends keyof ImageJobOptions>(k: K, v: ImageJobOptions[K]) => {
    setPurposeId("custom");
    setOpts((o) => ({ ...o, [k]: v }));
  };

  const totalBefore = results.reduce((s, r) => s + r.entry.file.size, 0);
  const totalAfter = results.reduce((s, r) => s + r.entry.result!.blob.size, 0);
  const running = phase === "running";
  const processingTotal = entries.filter((e) => e.status !== "rejected" && e.status !== "ready").length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-[12px] font-semibold tracking-wider text-blue-600 dark:text-blue-400">画像ワークスペース・試験公開</p>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 dark:text-white tracking-tight">画像をまとめて整える</h1>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400 leading-relaxed">
          画像を入れると、よく使う仕上げ方を自動でおすすめします。軽くする・大きさをそろえる・形式を変える・1つのPDFにまとめるまで、一度に終わります。
        </p>
      </header>

      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden />
        <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          画像はこの端末の中だけで処理し、外部へは送信しません。位置情報などの撮影データは書き出し時に取り除かれます。ページを閉じると画像は残りません。
        </p>
      </div>

      {/* 入り口 */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!running) void addFiles(e.dataTransfer.files); }}
        disabled={running}
        className={`w-full rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 ${
          dragOver ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-blue-300"
        }`}
      >
        <ImagePlus className="w-9 h-9 mx-auto text-slate-400 mb-3" aria-hidden />
        <span className="block text-[16px] font-semibold text-slate-700 dark:text-zinc-100">画像を選ぶ・ドラッグ＆ドロップ・貼り付け</span>
        <span className="block text-[13px] text-slate-400 dark:text-zinc-500 mt-1">JPG・PNG・WebP・AVIF・GIF・BMP・HEIC（iPhone写真）／1回{LIMITS.maxFiles}枚・1枚25MBまで</span>
      </button>
      <input
        ref={inputRef}
        id="workspace-image-input"
        type="file"
        multiple
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }}
      />

      {notice && (
        <p role="alert" className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 text-[13px] text-amber-800 dark:text-amber-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />{notice}
        </p>
      )}

      {/* 目的を選ぶ */}
      {accepted.length > 0 && phase !== "finished" && (
        <section aria-labelledby="purpose-heading" className="space-y-3">
          <h2 id="purpose-heading" className="text-[15px] font-bold text-slate-900 dark:text-white">何をしたいですか？</h2>
          <div role="radiogroup" aria-labelledby="purpose-heading" className="grid gap-2">
            {suggestions.map((s, i) => {
              const active = s.purpose.id === purposeId;
              return (
                <button
                  key={s.purpose.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active || (i === 0 && !suggestions.some((x) => x.purpose.id === purposeId)) ? 0 : -1}
                  disabled={running}
                  onClick={() => applyPurpose(s)}
                  onKeyDown={(e) => {
                    // ラジオボタンと同じく、矢印キーで選択を移す
                    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!step) return;
                    e.preventDefault();
                    const next = (i + step + suggestions.length) % suggestions.length;
                    applyPurpose(suggestions[next]);
                    const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]");
                    buttons?.[next]?.focus();
                  }}
                  className={`text-left rounded-xl border p-3.5 min-h-[44px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    active ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`text-[14px] font-semibold ${active ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-zinc-100"}`}>{s.purpose.label}</span>
                    {i === 0 && s.reason && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">おすすめ</span>}
                  </span>
                  <span className="block text-[12px] text-slate-500 dark:text-zinc-400 mt-0.5">{s.purpose.detail}</span>
                  {s.reason && <span className="block text-[12px] text-blue-700 dark:text-blue-300 mt-1">{s.reason}</span>}
                </button>
              );
            })}
          </div>

          {/* 細かく設定 */}
          <details className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" open={purposeId === "custom"}>
            <summary className="cursor-pointer select-none px-4 py-3 min-h-[44px] flex items-center gap-2 text-[14px] font-semibold text-slate-700 dark:text-zinc-200">
              <Settings2 className="w-4 h-4" aria-hidden />細かく設定する
            </summary>
            <div className="px-4 pb-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">大きさ</span>
                <select id="ws-resize-mode" disabled={running} value={opts.resize.mode}
                  onChange={(e) => setOpt("resize", { mode: e.target.value as ResizeMode, value: opts.resize.value || (e.target.value === "percent" ? 50 : 1600) })}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  {(Object.keys(RESIZE_LABEL) as ResizeMode[]).map((m) => <option key={m} value={m}>{RESIZE_LABEL[m]}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">{opts.resize.mode === "percent" ? "割合（%）" : "大きさ（px）"}</span>
                <input id="ws-resize-value" type="number" inputMode="numeric" min={1} disabled={running || opts.resize.mode === "none"} value={opts.resize.value || ""}
                  onChange={(e) => setOpt("resize", { ...opts.resize, value: Math.max(0, Number(e.target.value)) })}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-[14px] disabled:opacity-50" />
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">縦横比</span>
                <select id="ws-aspect" disabled={running} value={opts.aspect.ratio}
                  onChange={(e) => setOpt("aspect", { ...opts.aspect, ratio: e.target.value as AspectRatio })}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  {(Object.keys(ASPECT_LABEL) as AspectRatio[]).map((r) => <option key={r} value={r}>{ASPECT_LABEL[r]}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">縦横比の合わせ方</span>
                <select id="ws-aspect-fit" disabled={running || opts.aspect.ratio === "none"} value={opts.aspect.fit}
                  onChange={(e) => setOpt("aspect", { ...opts.aspect, fit: e.target.value as AspectFit })}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px] disabled:opacity-50">
                  <option value="pad">余白を足す（画像は切れない）</option>
                  <option value="crop">はみ出した部分を切り取る</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">形式</span>
                <select id="ws-format" disabled={running} value={opts.format}
                  onChange={(e) => setOpt("format", e.target.value as ImageJobOptions["format"])}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  {(Object.keys(FORMAT_LABEL) as (OutputFormat | "keep")[])
                    .filter((f) => (f === "avif" ? support.avif : f === "webp" ? support.webp : true))
                    .map((f) => <option key={f} value={f}>{FORMAT_LABEL[f]}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">目標ファイルサイズ（1枚あたり）</span>
                <select id="ws-target" disabled={running} value={opts.targetBytes}
                  onChange={(e) => setOpt("targetBytes", Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  {TARGETS.map((t) => <option key={t} value={t}>{t === 0 ? "指定しない" : `${formatBytes(t)}以内`}</option>)}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="flex justify-between text-[12px] text-slate-500 dark:text-zinc-400">
                  <span>画質（PNGでは使いません）</span><span className="font-mono">{opts.quality}</span>
                </span>
                <input id="ws-quality" type="range" min={40} max={100} disabled={running} value={opts.quality}
                  onChange={(e) => setOpt("quality", Number(e.target.value))} className="w-full accent-blue-600 min-h-[44px]" />
              </label>
              <label className="flex items-center gap-3">
                <input id="ws-bg" type="color" disabled={running} value={opts.background} onChange={(e) => setOpt("background", e.target.value)}
                  className="w-11 h-11 rounded-lg border border-slate-200 dark:border-zinc-700 bg-transparent" />
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">背景・余白の色（JPGで透過部分を塗る色）</span>
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-[12px] text-slate-500 dark:text-zinc-400 mb-1">保存のしかた</legend>
                <div className="flex flex-wrap gap-2">
                  {([["files", accepted.length > 1 ? "1枚ずつ（まとめてZIP）" : "画像のまま"], ["zip", "ZIPにまとめる"], ["pdf", "1つのPDFにまとめる"]] as [OutputMode, string][]).map(([m, label]) => (
                    <label key={m} className={`px-3 py-2 min-h-[44px] flex items-center rounded-lg border text-[13px] cursor-pointer ${output === m ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"}`}>
                      <input type="radio" name="ws-output" value={m} checked={output === m} disabled={running} onChange={() => setOutput(m)} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </details>
        </section>
      )}

      {/* 実行・進捗 */}
      {accepted.length > 0 && phase !== "finished" && (
        <div className="flex flex-wrap items-center gap-3">
          {!running ? (
            <button type="button" onClick={run} disabled={!entries.some((e) => e.status === "ready")}
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
              {accepted.length}枚をまとめて処理する
            </button>
          ) : (
            <button type="button" onClick={cancel}
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 text-[15px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Square className="w-4 h-4" aria-hidden />中断する
            </button>
          )}
          <button type="button" onClick={reset} disabled={running}
            className="inline-flex items-center gap-1.5 px-4 py-3 min-h-[44px] rounded-xl text-slate-500 dark:text-zinc-400 text-[14px] hover:text-slate-700 disabled:opacity-50">
            <RotateCcw className="w-4 h-4" aria-hidden />やり直す
          </button>
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {running ? `${processingTotal}枚中${doneCount}枚を処理しました` : phase === "finished" ? `処理が終わりました。${results.length}枚を書き出せます` : ""}
      </div>
      {running && (
        <div className="space-y-1">
          <progress max={Math.max(1, processingTotal)} value={doneCount} className="w-full h-2 accent-blue-600" aria-label="処理の進み具合" />
          <p className="text-[12px] text-slate-500 dark:text-zinc-400">{processingTotal}枚中{doneCount}枚を処理しました</p>
        </div>
      )}

      {/* 結果 */}
      {phase === "finished" && (
        <section aria-labelledby="result-heading" className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-4">
          <div>
            <h2 id="result-heading" className="text-[16px] font-bold text-slate-900 dark:text-white">{results.length}枚を書き出せます</h2>
            {results.length > 0 && (
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">
                合計 {formatBytes(totalBefore)} → <strong className="text-slate-800 dark:text-zinc-100">{formatBytes(totalAfter)}</strong>
                {totalAfter < totalBefore && `（${Math.round((1 - totalAfter / totalBefore) * 100)}%軽くなりました）`}
              </p>
            )}
          </div>
          {results.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {output === "pdf" ? (
                <SaveButton icon={<FileText className="w-4 h-4" aria-hidden />} label="PDFで保存" onClick={() => saveAll("pdf")} busy={saving} primary />
              ) : results.length > 1 ? (
                <SaveButton icon={<FileArchive className="w-4 h-4" aria-hidden />} label="ZIPで保存" onClick={() => saveAll("zip")} busy={saving} primary />
              ) : (
                <SaveButton icon={<Download className="w-4 h-4" aria-hidden />} label="画像を保存" onClick={() => saveAll("files")} busy={saving} primary />
              )}
              {output !== "pdf" && <SaveButton icon={<FileText className="w-4 h-4" aria-hidden />} label="1つのPDFにまとめて保存" onClick={() => saveAll("pdf")} busy={saving} />}
              <button type="button" onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-slate-500 dark:text-zinc-400 text-[14px] hover:text-slate-700">
                <RotateCcw className="w-4 h-4" aria-hidden />別の画像で始める
              </button>
            </div>
          )}
        </section>
      )}

      {/* ファイル一覧 */}
      {entries.length > 0 && (
        <section aria-label="入れた画像" className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
          <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
            {entries.map((e) => (
              <li key={e.id} className="px-4 py-3 flex items-start gap-3">
                <StatusIcon status={e.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-slate-800 dark:text-zinc-100 truncate">{e.file.name}</p>
                  <p className="text-[12px] text-slate-500 dark:text-zinc-400 tabular-nums">
                    {KIND_LABEL[e.kind]} ・ {formatBytes(e.file.size)}{e.width && e.height ? ` ・ ${e.width}×${e.height}` : ""}
                    {e.result && (
                      <> → <span className="text-slate-800 dark:text-zinc-100 font-medium">{FORMAT_LABEL[e.result.format]} ・ {formatBytes(e.result.blob.size)} ・ {e.result.width}×{e.result.height}</span>
                        {e.result.metTarget === false && <span className="text-amber-600 dark:text-amber-400">（目標サイズには届きませんでした）</span>}
                      </>
                    )}
                  </p>
                  {e.note && <p className="text-[12px] text-sky-700 dark:text-sky-300 mt-0.5">{e.note}</p>}
                  {e.reason && <p className="text-[12px] text-red-600 dark:text-red-400 mt-0.5">{e.reason}</p>}
                </div>
                {e.status === "done" && e.result && (
                  <button type="button" onClick={() => saveBlob(e.result!.blob, e.result!.name)} aria-label={`${e.result.name}を保存`}
                    className="shrink-0 p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40">
                    <Download className="w-4 h-4" aria-hidden />
                  </button>
                )}
                {(e.status === "ready" || e.status === "rejected") && !running && (
                  <button type="button" onClick={() => removeEntry(e.id)} aria-label={`${e.file.name}を外す`}
                    className="shrink-0 p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <X className="w-4 h-4" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  const cls = "w-5 h-5 shrink-0 mt-0.5";
  if (status === "processing") return <Loader2 className={`${cls} text-blue-500 animate-spin`} aria-label="処理中" />;
  if (status === "done") return <CheckCircle2 className={`${cls} text-emerald-500`} aria-label="完了" />;
  if (status === "failed" || status === "rejected") return <AlertCircle className={`${cls} text-red-500`} aria-label={status === "failed" ? "失敗" : "受け付けませんでした"} />;
  if (status === "cancelled") return <Square className={`${cls} text-slate-400`} aria-label="中断" />;
  return <span className={`${cls} rounded-full border-2 border-slate-300 dark:border-zinc-600`} aria-label="待機中" />;
}

function SaveButton({ icon, label, onClick, busy, primary }: { icon: React.ReactNode; label: string; onClick: () => void; busy: boolean; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={busy}
      className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-[14px] font-semibold disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        primary ? "bg-blue-600 hover:bg-blue-700 text-white" : "border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
      }`}>
      {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : icon}{label}
    </button>
  );
}
