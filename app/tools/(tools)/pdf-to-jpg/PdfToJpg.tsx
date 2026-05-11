"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileText } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Resolution = "72" | "150" | "300";

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [resolution, setResolution] = useState<Resolution>("150");
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setPreviews([]); setProgress(0);
    setFile(f);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const bytes = await f.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      setPageCount(doc.numPages);
    } catch {
      setError("PDFの読み込みに失敗しました");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  const convert = async () => {
    if (!file) return;
    setConverting(true); setError(null); setPreviews([]); setDone(false);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const JSZip = (await import("jszip")).default;

      const bytes = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      const scale = parseInt(resolution) / 72;
      const zip = new JSZip();
      const newPreviews: string[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        setProgress(Math.round((i / doc.numPages) * 95));
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        if (i <= 4) newPreviews.push(dataUrl);
        const base64 = dataUrl.split(",")[1];
        const blob = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        zip.file(`page-${String(i).padStart(3, "0")}.jpg`, blob);
      }

      setProgress(98);
      if (doc.numPages === 1) {
        const a = document.createElement("a"); a.href = newPreviews[0]; a.download = "page-001.jpg"; a.click();
      } else {
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a"); a.href = url; a.download = `${file.name.replace(".pdf", "")}-pages.zip`; a.click();
        URL.revokeObjectURL(url);
      }

      setPreviews(newPreviews);
      setProgress(100);
      setDone(true);
    } catch {
      setError("変換に失敗しました");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF→JPG変換ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">PDFページを高画質JPGに変換。複数ページはZIPでまとめてダウンロード。</p>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
              ${dragOver ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <FileText className="w-8 h-8 text-rose-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{pageCount}ページ · {formatSize(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setPageCount(0); setPreviews([]); setDone(false); }} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors shrink-0">変更</button>
            </div>

            {/* Resolution */}
            <div>
              <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">出力解像度</p>
              <div className="grid grid-cols-3 gap-2">
                {([["72", "低画質", "軽量・プレビュー向け"], ["150", "標準", "バランス（推奨）"], ["300", "高画質", "印刷・保存向け"]] as [Resolution, string, string][]).map(([dpi, label, desc]) => (
                  <button key={dpi} onClick={() => setResolution(dpi)} className={`p-3 rounded-2xl border text-center transition-all ${resolution === dpi ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-600" : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-rose-300"}`}>
                    <p className={`text-[13px] font-semibold ${resolution === dpi ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-300"}`}>{label} ({dpi}dpi)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {converting && (
              <div>
                <div className="flex justify-between text-[12px] text-slate-400 mb-1"><span>変換中...</span><span>{progress}%</span></div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {done && previews.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">変換完了！{pageCount > 1 ? " ZIPファイルをご確認ください。" : ""}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt={`page ${i + 1}`} className="w-full aspect-[3/4] object-cover rounded-xl border border-slate-100 dark:border-zinc-800" />
                  ))}
                  {pageCount > 4 && <div className="aspect-[3/4] rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-[13px] text-slate-400">+{pageCount - 4}ページ</div>}
                </div>
              </div>
            )}

            {error && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}

            <button
              onClick={convert}
              disabled={converting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {converting ? <><Loader2 className="w-5 h-5 animate-spin" />変換中...</> : <><Download className="w-5 h-5" />{pageCount > 1 ? "JPGに変換してZIPダウンロード" : "JPGに変換してダウンロード"}</>}
            </button>
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>変換したいPDFをアップロード</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>出力解像度を選択</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>変換してダウンロード（複数ページはZIP）</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "複数ページのPDFはどうなりますか？", a: "全ページをJPGに変換してZIPファイルにまとめてダウンロードできます。1ページのみのPDFは直接JPGでダウンロードされます。" },
              { q: "解像度はどれを選べばいいですか？", a: "通常の用途には「標準（150dpi）」がおすすめです。印刷目的なら「高画質（300dpi）」を選んでください。" },
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
