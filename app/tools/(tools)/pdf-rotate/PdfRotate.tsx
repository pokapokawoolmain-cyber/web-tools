"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, RotateCw, Download, Loader2, CheckCircle2, X } from "lucide-react";

type RotateAngle = 90 | 180 | 270;
type PageMode = "all" | "custom";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [angle, setAngle] = useState<RotateAngle>(90);
  const [pageMode, setPageMode] = useState<PageMode>("all");
  const [customPages, setCustomPages] = useState("");
  const [rotating, setRotating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDFの読み込みに失敗しました。破損していないか確認してください。");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const parsePages = (input: string, total: number): number[] | null => {
    const pages = new Set<number>();
    for (const part of input.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const range = trimmed.split("-");
      if (range.length === 2) {
        const from = parseInt(range[0]); const to = parseInt(range[1]);
        if (isNaN(from) || isNaN(to) || from < 1 || to > total || from > to) return null;
        for (let i = from; i <= to; i++) pages.add(i - 1);
      } else {
        const n = parseInt(trimmed);
        if (isNaN(n) || n < 1 || n > total) return null;
        pages.add(n - 1);
      }
    }
    return pages.size > 0 ? Array.from(pages) : null;
  };

  const rotate = async () => {
    if (!file || pageCount === 0) return;
    setRotating(true); setError(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);

      let targetIndices: number[];
      if (pageMode === "all") {
        targetIndices = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        const parsed = parsePages(customPages, pageCount);
        if (!parsed) { setError(`ページ番号が正しくありません（例: 1, 3, 5-8）。1〜${pageCount}の範囲で入力してください。`); setRotating(false); return; }
        targetIndices = parsed;
      }

      const pages = doc.getPages();
      for (const idx of targetIndices) {
        const page = pages[idx];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      }

      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_rotated.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("回転処理に失敗しました。");
    } finally {
      setRotating(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setDone(false); setError(null); setCustomPages(""); };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 mb-4">
            <RotateCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDFページ回転ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">PDFのページを90°・180°・270°回転。全ページ・指定ページに対応。</p>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
              ${dragOver ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { loadFile(e.target.files[0]); e.target.value = ""; } }} />
            {loading ? (
              <><Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" /><p className="text-[15px] text-slate-500">読み込み中...</p></>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">PDF形式のみ対応</p>
              </>
            )}
          </div>
        )}

        {/* File loaded */}
        {file && pageCount > 0 && (
          <div className="mb-6 space-y-5">
            {/* File card */}
            <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <span className="text-lg">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)} · {pageCount}ページ</p>
              </div>
              <button onClick={reset} className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Angle selector */}
            <div>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">回転角度</p>
              <div className="grid grid-cols-3 gap-2">
                {([90, 180, 270] as RotateAngle[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAngle(a)}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all ${angle === a ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-200"}`}
                  >
                    <RotateCw className={`w-6 h-6 transition-transform ${a === 90 ? "" : a === 180 ? "rotate-90" : "rotate-180"} ${angle === a ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                    <span className={`text-[13px] font-semibold ${angle === a ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500"}`}>{a}° 回転</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Page mode */}
            <div>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">対象ページ</p>
              <div className="flex gap-2 mb-3">
                {(["all", "custom"] as PageMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPageMode(m)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${pageMode === m ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"}`}
                  >
                    {m === "all" ? `全ページ（${pageCount}p）` : "ページ指定"}
                  </button>
                ))}
              </div>
              {pageMode === "custom" && (
                <input
                  type="text"
                  placeholder={`例: 1, 3, 5-8（1〜${pageCount}）`}
                  value={customPages}
                  onChange={(e) => setCustomPages(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[14px] text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
            </div>
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
        {done && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">回転完了！ダウンロードが開始されました。</span>
          </div>
        )}

        <button
          onClick={rotate}
          disabled={!file || pageCount === 0 || rotating}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {rotating ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</> : <><Download className="w-5 h-5" />回転してダウンロード</>}
        </button>

        {file && (
          <button onClick={reset} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">リセット</button>
        )}

        {/* Usage */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>PDFファイルをドロップまたはタップして選択</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>回転角度（90°・180°・270°）を選択</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>全ページ回転、またはページ指定して「回転してダウンロード」</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "スキャンしたPDFが横向きになってしまいました。縦に戻せますか？", a: "はい。このツールで90°または270°回転させることで縦向きに戻せます。" },
              { q: "一部のページだけ回転できますか？", a: "「ページ指定」を選択し、回転したいページ番号をカンマ区切りまたはハイフンでの範囲指定（例：1, 3, 5-8）で入力してください。" },
              { q: "回転後のPDFの品質は変わりますか？", a: "テキスト・画像の品質はそのまま維持されます。pdf-libはメタデータのみを変更するため、再圧縮は発生しません。" },
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
