"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, GripVertical, ChevronUp, ChevronDown, Download, Loader2, CheckCircle2, X } from "lucide-react";

type PageItem = { index: number; originalIndex: number; thumb: string | null };

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function renderThumbnail(pdfBytes: ArrayBuffer, pageIndex: number): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale: 0.3 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas.toDataURL("image/jpeg", 0.7);
}

export function PdfReorder() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbLoading, setThumbLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setFile(f);
      setFileBytes(bytes);
      setPages(Array.from({ length: count }, (_, i) => ({ index: i, originalIndex: i, thumb: null })));
    } catch {
      setError("PDFの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  // Render thumbnails progressively after pages are loaded
  useEffect(() => {
    if (!fileBytes || pages.length === 0 || pages[0].thumb !== null) return;
    if (thumbLoading) return;

    const bytes = fileBytes;
    setThumbLoading(true);

    (async () => {
      for (let i = 0; i < pages.length; i++) {
        try {
          const thumb = await renderThumbnail(bytes, i);
          setPages((prev) => prev.map((p) => p.originalIndex === i ? { ...p, thumb } : p));
        } catch {
          // ignore thumbnail errors — page number still shown
        }
      }
      setThumbLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileBytes, pages.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  // Drag-and-drop reorder
  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  };

  // Mobile up/down buttons
  const moveUp = (i: number) => {
    if (i === 0) return;
    setPages((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };
  const moveDown = (i: number) => {
    if (i === pages.length - 1) return;
    setPages((prev) => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const isReordered = pages.some((p, i) => p.originalIndex !== i);

  const downloadReordered = async () => {
    if (!file || !fileBytes) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const srcDoc = await PDFDocument.load(fileBytes);
      const newDoc = await PDFDocument.create();
      const newOrder = pages.map((p) => p.originalIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, newOrder);
      for (const page of copiedPages) newDoc.addPage(page);

      const out = await newDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_reordered.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("並び替え処理に失敗しました。");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setFileBytes(null); setPages([]); setDone(false); setError(null); };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 mb-4">
            <GripVertical className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF並び替えツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">ドラッグ操作でページ順を自由に変更。スマホは上下ボタンにも対応。</p>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
              ${dragOver ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) { loadFile(e.target.files[0]); e.target.value = ""; } }} />
            {loading ? (
              <><Loader2 className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-spin" /><p className="text-[15px] text-slate-500">読み込み中...</p></>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">PDF形式のみ対応</p>
              </>
            )}
          </div>
        )}

        {/* Page reorder UI */}
        {file && pages.length > 0 && (
          <div className="mb-6 space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                <span className="text-lg">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)} · {pages.length}ページ</p>
              </div>
              <button onClick={reset} className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Instructions */}
            <div className="flex items-start gap-2 text-[13px] text-slate-400 dark:text-zinc-500">
              <span className="shrink-0">💡</span>
              <span>
                <span className="hidden sm:inline">ドラッグ＆ドロップでページ順を変更。</span>
                <span className="sm:hidden">▲▼ボタンでページ順を変更。</span>
                {thumbLoading && <span className="ml-1 text-amber-500 dark:text-amber-400">サムネイル読み込み中...</span>}
              </span>
            </div>

            {/* Page list */}
            <div className="space-y-2">
              {pages.map((page, i) => (
                <div
                  key={`${page.originalIndex}-${i}`}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex items-center gap-3 rounded-2xl border transition-all
                    ${dragIndex === i
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 shadow-md scale-[0.99]"
                      : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-200 dark:hover:border-amber-900"
                    } px-3 py-2.5`}
                >
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-zinc-600 shrink-0 cursor-grab hidden sm:block" />

                  {/* Thumbnail */}
                  <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                    {page.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.thumb} alt={`Page ${page.originalIndex + 1}`} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono">{page.originalIndex + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">
                      {i + 1}ページ目
                    </p>
                    <p className="text-[12px] text-slate-400 dark:text-zinc-500">
                      元: {page.originalIndex + 1}ページ
                      {page.originalIndex !== i && <span className="ml-1.5 text-amber-500 dark:text-amber-400">（移動済み）</span>}
                    </p>
                  </div>

                  {/* Mobile up/down buttons */}
                  <div className="flex flex-col gap-0.5 sm:hidden">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === pages.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isReordered && (
              <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-[13px] text-amber-700 dark:text-amber-400">
                  ✓ ページ順が変更されました。「ダウンロード」で新しい順序のPDFを取得できます。
                </p>
              </div>
            )}
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
        {done && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">並び替え完了！ダウンロードを確認してください。</span>
          </div>
        )}

        <button
          onClick={downloadReordered}
          disabled={!file || pages.length === 0 || processing}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {processing ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</> : <><Download className="w-5 h-5" />並び替えてダウンロード</>}
        </button>

        {file && (
          <button onClick={reset} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">リセット</button>
        )}

        {/* Usage */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              PDFファイルをドロップまたはタップして選択
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              PC：ドラッグ＆ドロップでページ順を変更　スマホ：▲▼ボタンで順番を入れ替え
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              「並び替えてダウンロード」で新しい順序のPDFを取得
            </li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "スマホでもページ順を変更できますか？", a: "はい。スマホでは各ページ右側の▲▼ボタンで順番を入れ替えられます。PCではドラッグ＆ドロップにも対応しています。" },
              { q: "ページのサムネイルは表示されますか？", a: "はい。PDFをアップロードするとページのプレビュー画像が順次表示されます。表示まで少し時間がかかる場合がありますが、表示前でも並び替えは可能です。" },
              { q: "PDF結合ツールとの違いは何ですか？", a: "PDF並び替えは1つのPDFのページ順を変更するツールです。PDF結合は複数のPDFファイルをまとめて1つにするツールです。" },
              { q: "ファイルはサーバーに送信されますか？", a: "いいえ。すべての処理はブラウザ内で完結します。サムネイル生成も含めてすべてローカルで処理されます。" },
            ].map((item) => (
              <div key={item.q} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-[14px] font-semibold text-slate-800 dark:text-white mb-1.5">{item.q}</p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
