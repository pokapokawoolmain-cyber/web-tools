"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileText } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parsePageInput(input: string, total: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((n) => parseInt(n.trim()));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
          if (i >= 1 && i <= total) pages.add(i - 1);
        }
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= 1 && n <= total) pages.add(n - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [splitting, setSplitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"extract" | "each">("extract");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setPageInput(""); setFile(null); setPageCount(0);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDFの読み込みに失敗しました。ファイルが破損していないか確認してください。");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const split = async () => {
    if (!file || pageCount === 0) return;
    setSplitting(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);

      if (mode === "each") {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(page);
          const out = await newDoc.save();
          const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url;
          a.download = `page-${i + 1}.pdf`; a.click();
          URL.revokeObjectURL(url);
          await new Promise((r) => setTimeout(r, 100));
        }
      } else {
        const indices = parsePageInput(pageInput, pageCount);
        if (!indices.length) { setError("有効なページ番号を入力してください"); setSplitting(false); return; }
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach((p) => newDoc.addPage(p));
        const out = await newDoc.save();
        const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url;
        a.download = `extracted-pages.pdf`; a.click();
        URL.revokeObjectURL(url);
      }
      setDone(true);
    } catch {
      setError("分割に失敗しました");
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 mb-4">
            <span className="text-3xl">✂️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF分割ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">ページを指定して抽出、または1ページずつ分割します。</p>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
              ${dragOver ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <FileText className="w-8 h-8 text-orange-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{pageCount}ページ · {formatSize(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setPageCount(0); setDone(false); }} className="text-[12px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">変更</button>
            </div>

            {/* Mode selector */}
            <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 p-1 bg-slate-50 dark:bg-zinc-900 gap-1">
              {(["extract", "each"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-all ${mode === m ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                  {m === "extract" ? "ページ指定抽出" : "1ページずつ分割"}
                </button>
              ))}
            </div>

            {mode === "extract" && (
              <div>
                <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">
                  抽出するページ番号（例: 1, 3, 5-8）· 全{pageCount}ページ
                </label>
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder="例: 1, 3, 5-8"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-[15px] outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-colors"
                />
              </div>
            )}

            {mode === "each" && (
              <div className="px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
                <p className="text-[13px] text-orange-700 dark:text-orange-400">{pageCount}個のPDFファイルがダウンロードされます</p>
              </div>
            )}

            {error && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
            {done && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">分割完了！</span>
              </div>
            )}

            <button
              onClick={split}
              disabled={splitting || (mode === "extract" && !pageInput.trim())}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {splitting ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</> : <><Download className="w-5 h-5" />分割してダウンロード</>}
            </button>
          </div>
        )}

        {/* How to use */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>PDFファイルをアップロード</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>「ページ指定抽出」か「1ページずつ分割」を選択</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>ボタンを押してダウンロード</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はすべてブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "ページ指定の書き方は？", a: "「1, 3, 5-8」のようにカンマ区切りで指定します。連続ページはハイフンで範囲指定できます。" },
              { q: "ファイルはサーバーに送られますか？", a: "いいえ。処理はすべてブラウザ内で完結します。外部への送信は一切行いません。" },
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
