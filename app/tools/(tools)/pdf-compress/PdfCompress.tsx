"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileText } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Quality = "high" | "medium" | "low";

const QUALITY_CONFIG: Record<Quality, { label: string; scale: number; jpegQuality: number; desc: string }> = {
  high:   { label: "高品質",   scale: 1.0, jpegQuality: 0.85, desc: "画質を維持しながら軽量化" },
  medium: { label: "標準",     scale: 0.9, jpegQuality: 0.7,  desc: "バランス重視（推奨）" },
  low:    { label: "最小サイズ", scale: 0.75, jpegQuality: 0.5, desc: "メール送信・アップロード向け" },
};

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [dragOver, setDragOver] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setResult(null); setProgress(0); setFile(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  const compress = async () => {
    if (!file) return;
    setCompressing(true); setError(null); setProgress(0);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const pageCount = srcDoc.getPageCount();

      const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
      const pdfjsDoc = await loadingTask.promise;

      const newDoc = await PDFDocument.create();
      const cfg = QUALITY_CONFIG[quality];

      for (let i = 0; i < pageCount; i++) {
        setProgress(Math.round(((i + 1) / pageCount) * 90));
        const page = await pdfjsDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: cfg.scale * 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", cfg.jpegQuality);
        const base64 = dataUrl.split(",")[1];
        const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const img = await newDoc.embedJpg(imgBytes);
        const origPage = srcDoc.getPage(i);
        const { width, height } = origPage.getSize();
        const newPage = newDoc.addPage([width, height]);
        newPage.drawImage(img, { x: 0, y: 0, width, height });
      }

      setProgress(95);
      const out = await newDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `compressed-${file.name}`; a.click();
      URL.revokeObjectURL(url);
      setResult({ originalSize: file.size, compressedSize: out.byteLength });
      setProgress(100);
    } catch {
      setError("圧縮に失敗しました。ファイルを確認してください。");
    } finally {
      setCompressing(false);
    }
  };

  const ratio = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 mb-4">
            <span className="text-3xl">🗜️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF圧縮ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">PDFのファイルサイズを軽量化。メール送信・アップロードに最適。</p>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
              ${dragOver ? "border-purple-400 bg-purple-50 dark:bg-purple-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <FileText className="w-8 h-8 text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors shrink-0">変更</button>
            </div>

            {/* Quality selector */}
            <div>
              <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">圧縮品質</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(QUALITY_CONFIG) as [Quality, typeof QUALITY_CONFIG[Quality]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setQuality(key)}
                    className={`p-3 rounded-2xl border text-center transition-all ${quality === key ? "border-purple-400 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-600" : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-purple-300"}`}
                  >
                    <p className={`text-[13px] font-semibold ${quality === key ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"}`}>{cfg.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{cfg.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {compressing && (
              <div>
                <div className="flex justify-between text-[12px] text-slate-400 mb-1">
                  <span>圧縮中...</span><span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {result && (
              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-[14px] font-semibold text-green-700 dark:text-green-400">圧縮完了</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">圧縮前</p>
                    <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{formatSize(result.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">圧縮後</p>
                    <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{formatSize(result.compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">削減率</p>
                    <p className="text-[14px] font-bold text-purple-600 dark:text-purple-400">{ratio > 0 ? `-${ratio}%` : "±0%"}</p>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}

            <button
              onClick={compress}
              disabled={compressing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {compressing ? <><Loader2 className="w-5 h-5 animate-spin" />圧縮中...</> : <><Download className="w-5 h-5" />PDFを圧縮してダウンロード</>}
            </button>
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>圧縮したいPDFをアップロード</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>圧縮品質を選択（推奨：標準）</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>ボタンを押してダウンロード</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">画像ページを再レンダリングして圧縮します。テキスト主体のPDFは効果が限定的な場合があります。</p>
        </div>

        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "どのくらい圧縮できますか？", a: "画像が多いPDFでは50〜80%の削減が見込めます。テキスト主体のPDFは効果が小さい場合があります。" },
              { q: "ファイルはどこで処理されますか？", a: "すべてブラウザ内で処理されます。ファイルが外部サーバーに送信されることはありません。" },
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
