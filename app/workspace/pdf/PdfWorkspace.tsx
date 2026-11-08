"use client";

// ============================================================
// PDFワークスペース（Phase 2 PoC）
// PDFを入れる → 目的を選ぶ（おすすめを自動で上に）→ ページを見ながら整える → 保存
// 処理はすべて端末内。ファイルは外部に送信しない。
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowLeft, ArrowRight, FileArchive, FilePlus2, FileText, ImageIcon, Loader2, RotateCcw, RotateCw, ShieldCheck, Square, Trash2, Undo2,
} from "lucide-react";
import {
  PDF_LIMITS, initialPages, movePage, parseRanges, pdfOutputName, removePages, rotatePages, splitGroups, suggestPdf,
  type PageItem, type PdfPurposeId, type PdfSuggestion,
} from "@/lib/workspace/pdf-plan";
import { PdfLoadError, buildPdf, closePdfs, loadPdf, renderPageImage, renderThumbnail, type ImageFormat, type LoadedPdf, type PdfLoadErrorCode } from "@/lib/workspace/pdf-export";
import { saveBlob, toZip } from "@/lib/workspace/export";

const MB = 1024 * 1024;

const LOAD_ERROR: Record<PdfLoadErrorCode, string> = {
  "not-pdf": "PDFではありませんでした（中身がPDFの形式ではありません）。",
  encrypted: "パスワード付き（暗号化された）PDFは扱えません。パスワードを外してからお試しください。",
  broken: "PDFを読み込めませんでした。壊れているか、対応していない形式です。",
};

const DPI_OPTIONS = [
  { dpi: 96, label: "画面で見る（96dpi）" },
  { dpi: 150, label: "標準（150dpi）" },
  { dpi: 300, label: "印刷向け（300dpi）" },
];

interface Rejected {
  name: string;
  reason: string;
}

function formatBytes(n: number) {
  if (n < MB) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / MB).toFixed(1)} MB`;
}

// サムネイルは同時に2枚までしか描かない（一度に全ページを描くと重くなるため）
function createQueue(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((r) => waiting.push(r));
    active++;
    try {
      return await task();
    } finally {
      active--;
      waiting.shift()?.();
    }
  };
}

export function PdfWorkspace() {
  const [sources, setSources] = useState<LoadedPdf[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [history, setHistory] = useState<PageItem[][]>([]);
  const [rejected, setRejected] = useState<Rejected[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PdfSuggestion[]>([]);
  const [purpose, setPurpose] = useState<PdfPurposeId>("organize");
  const [rangeText, setRangeText] = useState("");
  const [splitByRange, setSplitByRange] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("jpeg");
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);
  const thumbs = useRef(new Map<string, string>());
  // やり直したときは描画待ちごと作り直す（閉じたPDFの描画が終わらず枠をふさぐことがあるため）
  const [queue, setQueue] = useState(() => createQueue(2));

  // ページを閉じるときに読み込んだPDFとサムネイルを片付ける
  const sourcesRef = useRef<LoadedPdf[]>([]);
  sourcesRef.current = sources;
  useEffect(() => () => {
    thumbs.current.forEach((u) => URL.revokeObjectURL(u));
    void closePdfs(sourcesRef.current);
  }, []);

  const totalBytes = sources.reduce((s, f) => s + f.bytes.length, 0);
  const totalSourcePages = sources.reduce((s, f) => s + f.pages.length, 0);

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const files = Array.from(list);
    if (!files.length) return;
    setNotice(null);
    setMessage(null);
    setLoading(true);
    const added: LoadedPdf[] = [];
    const bad: Rejected[] = [];
    let bytes = totalBytes;
    let pageCount = totalSourcePages;
    let images = 0;
    for (const file of files) {
      if (/^image\//.test(file.type) || /\.(jpe?g|png|webp|heic|heif|gif|bmp|avif)$/i.test(file.name)) { images++; continue; }
      if (sources.length + added.length >= PDF_LIMITS.maxFiles) { bad.push({ name: file.name, reason: `一度に入れられるのは${PDF_LIMITS.maxFiles}件までです。` }); continue; }
      if (bytes + file.size > PDF_LIMITS.maxTotalBytes) { bad.push({ name: file.name, reason: `合計${formatBytes(PDF_LIMITS.maxTotalBytes)}を超えるため受け付けませんでした（${formatBytes(file.size)}）。` }); continue; }
      try {
        const pdf = await loadPdf(file);
        if (pageCount + pdf.pages.length > PDF_LIMITS.maxPages) {
          bad.push({ name: file.name, reason: `合計${PDF_LIMITS.maxPages}ページを超えるため受け付けませんでした（このPDFは${pdf.pages.length}ページ）。` });
          await closePdfs([pdf]);
          continue;
        }
        added.push(pdf);
        bytes += file.size;
        pageCount += pdf.pages.length;
      } catch (e) {
        bad.push({ name: file.name, reason: LOAD_ERROR[e instanceof PdfLoadError ? e.code : "broken"] });
      }
    }
    if (images) setNotice(`画像が${images}件ありました。画像の作業は画像ワークスペースをお使いください。`);
    setRejected((r) => [...r, ...bad]);
    if (added.length) {
      const nextSources = [...sources, ...added];
      const offset = sources.length;
      const newPages = initialPages(added).map((p) => ({ ...p, fileIndex: p.fileIndex + offset, key: `${p.fileIndex + offset}-${p.pageIndex}` }));
      setSources(nextSources);
      setPages((prev) => [...prev, ...newPages]);
      setHistory([]);
      const s = suggestPdf(nextSources.map((f) => ({ pages: f.pages.length, landscapePages: f.pages.filter((p) => p.landscape).length })));
      setSuggestions(s);
      setPurpose(s[0].purpose.id);
    }
    setLoading(false);
  }, [sources, totalBytes, totalSourcePages]);

  const update = (next: PageItem[]) => {
    setHistory((h) => [...h.slice(-29), pages]);
    setPages(next);
    setMessage(null);
  };
  const undo = () => {
    const prev = history.at(-1);
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setPages(prev);
  };

  const reset = async () => {
    cancelRef.current = true;
    thumbs.current.forEach((u) => URL.revokeObjectURL(u));
    thumbs.current.clear();
    setQueue(() => createQueue(2));
    await closePdfs(sources);
    setSources([]);
    setPages([]);
    setHistory([]);
    setRejected([]);
    setSuggestions([]);
    setNotice(null);
    setMessage(null);
    setRangeText("");
  };

  const getThumb = useCallback(async (item: PageItem) => {
    const id = `${item.key}@${item.rotation}`;
    const hit = thumbs.current.get(id);
    if (hit) return hit;
    const src = sources[item.fileIndex];
    if (!src) return "";
    try {
      const url = await queue(() => renderThumbnail(src, item));
      if (url) thumbs.current.set(id, url);
      return url;
    } catch {
      // 閉じたPDF・描画の中断。縮小表示が出ないだけで、書き出しには影響しない
      return "";
    }
  }, [sources, queue]);

  const range = useMemo(() => (purpose === "extract" ? parseRanges(rangeText, pages.length) : null), [purpose, rangeText, pages.length]);
  const baseName = sources[0]?.name ?? "document.pdf";

  const save = async () => {
    if (!pages.length) return;
    setMessage(null);
    cancelRef.current = false;
    try {
      if (purpose === "to-image") {
        setBusy({ done: 0, total: pages.length });
        const files: { name: string; blob: Blob; width: number; height: number }[] = [];
        for (const [i, item] of pages.entries()) {
          if (cancelRef.current) break;
          const img = await renderPageImage(sources[item.fileIndex], item, { format: imageFormat, dpi, quality: 0.9 });
          files.push({ name: pdfOutputName(baseName, `_p${String(i + 1).padStart(String(pages.length).length, "0")}`, imageFormat === "png" ? "png" : "jpg"), ...img });
          setBusy({ done: i + 1, total: pages.length });
          await new Promise((r) => setTimeout(r, 0));
        }
        if (cancelRef.current) { setMessage(`中断しました（${files.length}ページ分は保存していません）。`); return; }
        if (files.length === 1) saveBlob(files[0].blob, files[0].name);
        else saveBlob(await toZip(files), pdfOutputName(baseName, "_images", "zip"));
        setMessage(`${files.length}ページを画像にしました。`);
        return;
      }

      let groups: PageItem[][];
      if (purpose === "extract") {
        if (!range || range.error) return;
        const picked = splitGroups(pages, "ranges", { ranges: range.ranges });
        groups = splitByRange ? picked : [picked.flat()];
      } else if (purpose === "split-each") {
        groups = splitGroups(pages, "each");
      } else {
        groups = splitGroups(pages, "single");
      }
      setBusy({ done: 0, total: groups.length });
      const outputs: { name: string; blob: Blob; width: number; height: number }[] = [];
      for (const [i, g] of groups.entries()) {
        if (cancelRef.current) break;
        const blob = await buildPdf(sources, g);
        const suffix = groups.length === 1
          ? (purpose === "merge" && sources.length > 1 ? "_merged" : "_edited")
          : `_${String(i + 1).padStart(String(groups.length).length, "0")}`;
        outputs.push({ name: pdfOutputName(baseName, suffix), blob, width: 0, height: 0 });
        setBusy({ done: i + 1, total: groups.length });
      }
      if (cancelRef.current) { setMessage("中断しました。"); return; }
      if (outputs.length === 1) saveBlob(outputs[0].blob, outputs[0].name);
      else saveBlob(await toZip(outputs), pdfOutputName(baseName, "_split", "zip"));
      const pageTotal = groups.reduce((s, g) => s + g.length, 0);
      setMessage(outputs.length === 1 ? `${pageTotal}ページのPDFを保存しました。` : `${outputs.length}個のPDFをZIPにまとめて保存しました。`);
    } catch {
      setMessage("書き出しに失敗しました。ページ数を減らすか、別のPDFでお試しください。");
    } finally {
      setBusy(null);
    }
  };

  const running = !!busy;
  const hasPdf = pages.length > 0;
  const allKeys = () => new Set(pages.map((p) => p.key));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-[12px] font-semibold tracking-wider text-blue-600 dark:text-blue-400">PDFワークスペース・試験公開</p>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 dark:text-white tracking-tight">PDFをまとめて整える</h1>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400 leading-relaxed">
          PDFを入れると、よく使う作業を自動でおすすめします。まとめる・並べ替える・回転・削除・分ける・画像にするまで、ページを見ながら一度に終わります。
        </p>
      </header>

      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden />
        <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          PDFはこの端末の中だけで処理し、外部へは送信しません。ページの文字や画像は作り直さずにそのまま写すため、画質は落ちません。ページを閉じるとファイルは残りません。
        </p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!dragKey) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!running && e.dataTransfer.files.length) void addFiles(e.dataTransfer.files); }}
        disabled={running || loading}
        className={`w-full rounded-2xl border-2 border-dashed ${hasPdf ? "p-5" : "p-8 sm:p-10"} text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 ${
          dragOver ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-blue-300"
        }`}
      >
        {loading ? <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-2" aria-hidden /> : <FilePlus2 className={`${hasPdf ? "w-6 h-6" : "w-9 h-9"} mx-auto text-slate-400 mb-2`} aria-hidden />}
        <span className="block text-[16px] font-semibold text-slate-700 dark:text-zinc-100">{loading ? "読み込み中…" : hasPdf ? "PDFを追加する" : "PDFを選ぶ・ドラッグ＆ドロップ"}</span>
        {!hasPdf && <span className="block text-[13px] text-slate-400 dark:text-zinc-500 mt-1">1回{PDF_LIMITS.maxFiles}件・合計{formatBytes(PDF_LIMITS.maxTotalBytes)}・{PDF_LIMITS.maxPages}ページまで</span>}
      </button>
      <input ref={inputRef} id="workspace-pdf-input" type="file" multiple accept="application/pdf,.pdf" className="hidden"
        onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }} />

      {notice && (
        <p role="status" className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-3.5 text-[13px] text-sky-800 dark:text-sky-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
          <span>{notice} <Link href="/workspace/image" className="font-semibold underline">画像ワークスペースを開く</Link></span>
        </p>
      )}
      {rejected.length > 0 && (
        <ul role="alert" className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3.5 space-y-1">
          {rejected.map((r, i) => (
            <li key={i} className="text-[13px] text-red-700 dark:text-red-300 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden /><span><strong className="font-semibold">{r.name}</strong>：{r.reason}</span>
            </li>
          ))}
        </ul>
      )}

      {hasPdf && (
        <section aria-labelledby="pdf-purpose-heading" className="space-y-3">
          <h2 id="pdf-purpose-heading" className="text-[15px] font-bold text-slate-900 dark:text-white">何をしたいですか？</h2>
          <div role="radiogroup" aria-labelledby="pdf-purpose-heading" className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((s, i) => {
              const active = s.purpose.id === purpose;
              return (
                <button key={s.purpose.id} type="button" role="radio" aria-checked={active} tabIndex={active ? 0 : -1} disabled={running}
                  onClick={() => setPurpose(s.purpose.id)}
                  onKeyDown={(e) => {
                    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!step) return;
                    e.preventDefault();
                    const next = (i + step + suggestions.length) % suggestions.length;
                    setPurpose(suggestions[next].purpose.id);
                    e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
                  }}
                  className={`text-left rounded-xl border p-3.5 min-h-[44px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    active ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-600"
                  }`}>
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
        </section>
      )}

      {hasPdf && (
        <section aria-labelledby="pdf-pages-heading" className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="pdf-pages-heading" className="text-[15px] font-bold text-slate-900 dark:text-white">
              ページ <span className="text-slate-400 font-normal text-[13px]">（{pages.length}ページ・{sources.length}件・{formatBytes(totalBytes)}）</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <ToolButton label="全ページを左に回す" onClick={() => update(rotatePages(pages, allKeys(), -90))} disabled={running}><RotateCcw className="w-4 h-4" aria-hidden /></ToolButton>
              <ToolButton label="全ページを右に回す" onClick={() => update(rotatePages(pages, allKeys(), 90))} disabled={running}><RotateCw className="w-4 h-4" aria-hidden /></ToolButton>
              <ToolButton label="1つ前に戻す" onClick={undo} disabled={running || !history.length}><Undo2 className="w-4 h-4" aria-hidden /></ToolButton>
            </div>
          </div>
          <p className="text-[12px] text-slate-500 dark:text-zinc-400">ドラッグで並べ替え、各ページのボタンで回転・削除・移動ができます。</p>
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" aria-label="ページの一覧">
            {pages.map((item, i) => (
              <PageCard
                key={item.key}
                item={item}
                index={i}
                total={pages.length}
                fileLabel={sources.length > 1 ? `${item.fileIndex + 1}件目` : undefined}
                getThumb={getThumb}
                disabled={running}
                dragging={dragKey === item.key}
                onDragStart={() => setDragKey(item.key)}
                onDragEnd={() => setDragKey(null)}
                onDropHere={() => {
                  if (!dragKey || dragKey === item.key) return;
                  const from = pages.findIndex((p) => p.key === dragKey);
                  update(movePage(pages, from, i));
                  setDragKey(null);
                }}
                onRotate={(d) => update(rotatePages(pages, new Set([item.key]), d))}
                onRemove={() => update(removePages(pages, new Set([item.key])))}
                onMove={(to) => update(movePage(pages, i, to))}
              />
            ))}
          </ol>
        </section>
      )}

      {hasPdf && (
        <section aria-labelledby="pdf-save-heading" className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-4">
          <h2 id="pdf-save-heading" className="text-[15px] font-bold text-slate-900 dark:text-white">保存する</h2>

          {purpose === "extract" && (
            <div className="space-y-2">
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">取り出すページ（今の並びで何ページ目か。例: 1-3, 5, 8-）</span>
                <input id="pdf-range" type="text" inputMode="numeric" value={rangeText} disabled={running} onChange={(e) => setRangeText(e.target.value)}
                  aria-invalid={!!(rangeText && range?.error)} aria-describedby="pdf-range-help"
                  placeholder={`1-${Math.min(3, pages.length)}`}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-[14px]" />
              </label>
              <p id="pdf-range-help" className={`text-[12px] ${rangeText && range?.error ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-zinc-400"}`}>
                {rangeText ? (range?.error ?? `${range!.ranges.reduce((s, [a, b]) => s + b - a + 1, 0)}ページを取り出します`) : `全${pages.length}ページです`}
              </p>
              <label className="flex items-center gap-2 min-h-[44px] text-[13px] text-slate-600 dark:text-zinc-300">
                <input type="checkbox" checked={splitByRange} disabled={running} onChange={(e) => setSplitByRange(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                範囲ごとに別のPDFにする（ZIPで保存）
              </label>
            </div>
          )}

          {purpose === "to-image" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">形式</span>
                <select id="pdf-image-format" value={imageFormat} disabled={running} onChange={(e) => setImageFormat(e.target.value as ImageFormat)}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  <option value="jpeg">JPG（軽い・写真向け）</option>
                  <option value="png">PNG（文字がくっきり・重め）</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-500 dark:text-zinc-400">解像度</span>
                <select id="pdf-image-dpi" value={dpi} disabled={running} onChange={(e) => setDpi(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[14px]">
                  {DPI_OPTIONS.map((o) => <option key={o.dpi} value={o.dpi}>{o.label}</option>)}
                </select>
              </label>
            </div>
          )}

          <p className="text-[13px] text-slate-600 dark:text-zinc-300">
            {purpose === "to-image" ? `${pages.length}ページを${imageFormat === "png" ? "PNG" : "JPG"}にします${pages.length > 1 ? "（ZIPで保存）" : ""}。`
              : purpose === "split-each" ? `${pages.length}ページを1ページずつ別のPDFにします（ZIPで保存）。`
              : purpose === "extract" ? "指定したページだけの新しいPDFを作ります。"
              : `今の並び（${pages.length}ページ）で1つのPDFにします。`}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {!running ? (
              <button id="pdf-save" type="button" onClick={save} disabled={purpose === "extract" && (!rangeText || !!range?.error)}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
                {purpose === "to-image" ? <ImageIcon className="w-4 h-4" aria-hidden /> : purpose === "split-each" || (purpose === "extract" && splitByRange) ? <FileArchive className="w-4 h-4" aria-hidden /> : <FileText className="w-4 h-4" aria-hidden />}
                保存する
              </button>
            ) : (
              <button type="button" onClick={() => { cancelRef.current = true; }}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 text-[15px] font-semibold">
                <Square className="w-4 h-4" aria-hidden />中断する
              </button>
            )}
            <button type="button" onClick={() => void reset()} disabled={running}
              className="inline-flex items-center gap-1.5 px-4 py-3 min-h-[44px] rounded-xl text-slate-500 dark:text-zinc-400 text-[14px] hover:text-slate-700 disabled:opacity-50">
              <RotateCcw className="w-4 h-4" aria-hidden />最初からやり直す
            </button>
          </div>
          {busy && (
            <div className="space-y-1">
              <progress max={Math.max(1, busy.total)} value={busy.done} className="w-full h-2 accent-blue-600" aria-label="書き出しの進み具合" />
              <p className="text-[12px] text-slate-500 dark:text-zinc-400">{busy.total}件中{busy.done}件を書き出しました</p>
            </div>
          )}
          <div aria-live="polite" className="text-[13px] text-emerald-700 dark:text-emerald-400 min-h-[1em]">{message}</div>
        </section>
      )}
    </div>
  );
}

function ToolButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      {children}
    </button>
  );
}

interface PageCardProps {
  item: PageItem;
  index: number;
  total: number;
  fileLabel?: string;
  getThumb: (item: PageItem) => Promise<string>;
  disabled: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropHere: () => void;
  onRotate: (d: 90 | -90) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}

function PageCard({ item, index, total, fileLabel, getThumb, disabled, dragging, onDragStart, onDragEnd, onDropHere, onRotate, onRemove, onMove }: PageCardProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  // 画面に入ったページだけサムネイルを描く
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    let alive = true;
    void getThumb(item).then((u) => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [visible, item, getThumb]);

  const label = `${index + 1}ページ目`;
  return (
    <li
      ref={ref}
      draggable={!disabled}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", item.key); onDragStart(); }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDropHere(); }}
      className={`rounded-xl border bg-slate-50 dark:bg-zinc-950 p-2 flex flex-col gap-2 ${dragging ? "opacity-40 border-blue-400" : "border-slate-200 dark:border-zinc-700"}`}
    >
      <div className="aspect-[3/4] max-w-full flex items-center justify-center overflow-hidden rounded-md bg-white dark:bg-zinc-900 cursor-grab">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`${label}の縮小表示`} className="max-w-full max-h-full object-contain shadow-sm" draggable={false} />
        ) : (
          <Loader2 className="w-5 h-5 text-slate-300 animate-spin" aria-hidden />
        )}
      </div>
      <div className="flex items-center justify-between text-[12px] text-slate-600 dark:text-zinc-300">
        <span className="font-semibold tabular-nums">{index + 1}</span>
        {fileLabel && <span className="text-slate-400 dark:text-zinc-500">{fileLabel}</span>}
        {item.rotation !== 0 && <span className="text-blue-600 dark:text-blue-400">{item.rotation}°</span>}
      </div>
      <div className="grid grid-cols-5 gap-0.5">
        <CardButton label={`${label}を前へ移動`} onClick={() => onMove(index - 1)} disabled={disabled || index === 0}><ArrowLeft className="w-4 h-4" aria-hidden /></CardButton>
        <CardButton label={`${label}を左に回す`} onClick={() => onRotate(-90)} disabled={disabled}><RotateCcw className="w-4 h-4" aria-hidden /></CardButton>
        <CardButton label={`${label}を右に回す`} onClick={() => onRotate(90)} disabled={disabled}><RotateCw className="w-4 h-4" aria-hidden /></CardButton>
        <CardButton label={`${label}を削除`} onClick={onRemove} disabled={disabled || total <= 1} danger><Trash2 className="w-4 h-4" aria-hidden /></CardButton>
        <CardButton label={`${label}を後ろへ移動`} onClick={() => onMove(index + 1)} disabled={disabled || index === total - 1}><ArrowRight className="w-4 h-4" aria-hidden /></CardButton>
      </div>
    </li>
  );
}

function CardButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={`min-h-[44px] inline-flex items-center justify-center rounded-md disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40" : "text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
      }`}>
      {children}
    </button>
  );
}
