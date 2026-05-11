"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Trash2, GripVertical, Download, Loader2, CheckCircle2 } from "lucide-react";

type ImgFile = { id: string; file: File; preview: string; name: string };

export function JpgToPdf() {
  const [files, setFiles] = useState<ImgFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<"fit" | "a4">("fit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const imgs = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/") || f.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|heic)$/)
    );
    if (!imgs.length) { setError("画像ファイル（JPG・PNG等）を選択してください"); return; }
    setError(null); setDone(false);
    setFiles((prev) => [
      ...prev,
      ...imgs.map((f) => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, file: f, name: f.name, preview: URL.createObjectURL(f) })),
    ]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id: string) => {
    setFiles((p) => {
      const removed = p.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return p.filter((f) => f.id !== id);
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const next = [...prev]; const [moved] = next.splice(dragIndex, 1); next.splice(index, 0, moved); return next;
    });
    setDragIndex(index);
  };

  const convert = async () => {
    if (!files.length) { setError("画像を追加してください"); return; }
    setConverting(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const A4 = { width: 595.28, height: 841.89 };

      for (const imgFile of files) {
        const bytes = await imgFile.file.arrayBuffer();
        const isJpeg = imgFile.file.type === "image/jpeg" || imgFile.name.toLowerCase().match(/\.jpe?g$/);
        const isPng = imgFile.file.type === "image/png" || imgFile.name.toLowerCase().endsWith(".png");

        let img;
        try {
          img = isJpeg ? await doc.embedJpg(bytes) : isPng ? await doc.embedPng(bytes) : null;
        } catch {
          img = null;
        }

        if (!img) {
          // Fallback: convert via canvas
          const bitmap = await createImageBitmap(imgFile.file);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width; canvas.height = bitmap.height;
          canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const base64 = dataUrl.split(",")[1];
          const jpgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          img = await doc.embedJpg(jpgBytes);
        }

        let pw: number, ph: number;
        if (pageSize === "a4") {
          const ratio = img.width / img.height;
          if (ratio > A4.width / A4.height) {
            pw = A4.width; ph = A4.width / ratio;
          } else {
            ph = A4.height; pw = A4.height * ratio;
          }
          const page = doc.addPage([A4.width, A4.height]);
          const x = (A4.width - pw) / 2; const y = (A4.height - ph) / 2;
          page.drawImage(img, { x, y, width: pw, height: ph });
        } else {
          pw = img.width; ph = img.height;
          const page = doc.addPage([pw, ph]);
          page.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
        }
      }

      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a");
      a.href = url; a.download = "images.pdf"; a.click(); URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("変換に失敗しました。画像形式を確認してください。");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/40 mb-4">
            <span className="text-3xl">🖼️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">JPG→PDF変換ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">複数の画像をまとめてPDFに変換。ドラッグで順番変更・iPhone対応。</p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
            ${dragOver ? "border-green-400 bg-green-50 dark:bg-green-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/10"}`}
        >
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }} />
          <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">画像をドロップ、またはタップして選択</p>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">JPG・PNG・HEIC対応 · 複数選択可</p>
        </div>

        {files.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-slate-400 dark:text-zinc-500">{files.length}枚 — ドラッグで順番を変更</p>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-400">サイズ:</span>
                {(["fit", "a4"] as const).map((s) => (
                  <button key={s} onClick={() => setPageSize(s)} className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-colors ${pageSize === s ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}>
                    {s === "fit" ? "画像サイズ" : "A4"}
                  </button>
                ))}
              </div>
            </div>
            {files.map((f, i) => (
              <div
                key={f.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={() => setDragIndex(null)}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-3 cursor-grab"
              >
                <GripVertical className="w-4 h-4 text-slate-300 dark:text-zinc-600 shrink-0" />
                <img src={f.preview} alt={f.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <span className="flex-1 text-[14px] text-slate-700 dark:text-slate-300 truncate">{f.name}</span>
                <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="p-1 rounded-lg text-slate-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
        {done && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">変換完了！</span>
          </div>
        )}

        <button
          onClick={convert}
          disabled={files.length === 0 || converting}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-600 hover:bg-green-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {converting ? <><Loader2 className="w-5 h-5 animate-spin" />変換中...</> : <><Download className="w-5 h-5" />PDFに変換してダウンロード</>}
        </button>

        {files.length > 0 && (
          <button onClick={() => { files.forEach((f) => URL.revokeObjectURL(f.preview)); setFiles([]); setDone(false); }} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">リセット</button>
        )}

        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>画像ファイルをドロップまたはタップして追加</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>ドラッグしてページ順を調整（必要に応じて）</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>「PDFに変換してダウンロード」を押す</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "iPhoneで撮影した写真（HEIC）は使えますか？", a: "はい。iPhoneからアップロードした場合、ブラウザが自動的にJPEGに変換するため問題なく使用できます。" },
              { q: "何枚まで変換できますか？", a: "上限はありません。ただしブラウザのメモリ制限があるため、非常に多くの高解像度画像を一度に扱う場合は注意してください。" },
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
