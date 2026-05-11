"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Trash2, GripVertical, Download, Loader2, CheckCircle2 } from "lucide-react";

type PdfFile = { id: string; file: File; name: string; size: number };

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) { setError("PDFファイルを選択してください"); return; }
    setError(null);
    setDone(false);
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((f) => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, file: f, name: f.name, size: f.size })),
    ]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id: string) => setFiles((p) => p.filter((f) => f.id !== id));

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const merge = async () => {
    if (files.length < 2) { setError("2つ以上のPDFを追加してください"); return; }
    setMerging(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const pf of files) {
        const bytes = await pf.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "merged.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("結合に失敗しました。ファイルが破損していないか確認してください。");
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 mb-4">
            <span className="text-3xl">📎</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF結合ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">複数のPDFを1つのファイルにまとめます。ドラッグで順番変更・登録不要。</p>
        </div>

        {/* Dropzone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
            ${dragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
            }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }} />
          <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">複数ファイル同時選択可</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mb-6 space-y-2">
            <p className="text-[13px] font-medium text-slate-400 dark:text-zinc-500 mb-3">
              {files.length}件のファイル — ドラッグで順番を変更
            </p>
            {files.map((f, i) => (
              <div
                key={f.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={() => setDragIndex(null)}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-3 cursor-grab active:cursor-grabbing group"
              >
                <GripVertical className="w-4 h-4 text-slate-300 dark:text-zinc-600 shrink-0" />
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="flex-1 text-[14px] text-slate-700 dark:text-slate-300 truncate">{f.name}</span>
                <span className="text-[12px] text-slate-400 shrink-0">{formatSize(f.size)}</span>
                <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="p-1 rounded-lg text-slate-300 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {done && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">結合完了！ダウンロードを確認してください。</span>
          </div>
        )}

        <button
          onClick={merge}
          disabled={files.length < 2 || merging}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {merging ? <><Loader2 className="w-5 h-5 animate-spin" />結合中...</> : <><Download className="w-5 h-5" />PDFを結合してダウンロード</>}
        </button>

        {files.length > 0 && (
          <button onClick={() => { setFiles([]); setDone(false); }} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            リセット
          </button>
        )}

        {/* How to use */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>結合したいPDFファイルをドロップまたはタップして追加</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>ファイルをドラッグして結合順を調整</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>「PDFを結合してダウンロード」ボタンを押す</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">ファイルはブラウザ内で処理されます。サーバーへのアップロードは一切行いません。</p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "ファイル数に上限はありますか？", a: "上限はありません。ただしブラウザのメモリ制限があるため、非常に大きなファイルを大量に扱う場合は注意してください。" },
              { q: "結合後のファイルはサーバーに残りますか？", a: "いいえ。処理はすべてブラウザ内（ローカル）で完結します。ファイルが外部に送信されることは一切ありません。" },
              { q: "パスワード付きPDFは結合できますか？", a: "パスワードで保護されたPDFは現在対応していません。事前にパスワードを解除してからご利用ください。" },
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
