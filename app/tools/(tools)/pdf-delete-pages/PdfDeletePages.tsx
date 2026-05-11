"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Trash2, Download, Loader2, CheckCircle2, X } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfDeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setSelected(new Set()); setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDFの読み込みに失敗しました。破損ファイルでないか確認してください。");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) { next.delete(idx); } else { next.add(idx); }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  const deselectAll = () => setSelected(new Set());
  const invertSelection = () => {
    setSelected((prev) => new Set(Array.from({ length: pageCount }, (_, i) => i).filter((i) => !prev.has(i))));
  };

  const remainingCount = pageCount - selected.size;

  const deletePages = async () => {
    if (!file || selected.size === 0) { setError("削除するページを選択してください"); return; }
    if (remainingCount === 0) { setError("すべてのページを削除することはできません。少なくとも1ページは残してください。"); return; }
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();

      const keepIndices = Array.from({ length: pageCount }, (_, i) => i).filter((i) => !selected.has(i));
      const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
      for (const page of copiedPages) newDoc.addPage(page);

      const out = await newDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_deleted.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("削除処理に失敗しました。");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setSelected(new Set()); setDone(false); setError(null); };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 mb-4">
            <Trash2 className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDFページ削除ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">不要なページを選んで削除。複数選択・一括削除に対応。</p>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
              ${dragOver ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) { loadFile(e.target.files[0]); e.target.value = ""; } }} />
            {loading ? (
              <><Loader2 className="w-8 h-8 text-red-400 mx-auto mb-3 animate-spin" /><p className="text-[15px] text-slate-500">読み込み中...</p></>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">PDF形式のみ対応</p>
              </>
            )}
          </div>
        )}

        {/* Page selection UI */}
        {file && pageCount > 0 && (
          <div className="mb-6 space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                <span className="text-lg">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)} · {pageCount}ページ</p>
              </div>
              <button onClick={reset} className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Selection controls */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400">
                {selected.size > 0
                  ? <span className="text-red-600 dark:text-red-400">{selected.size}ページを削除 → {remainingCount}ページが残ります</span>
                  : "削除するページにチェックを入れてください"}
              </p>
              <div className="flex gap-1.5">
                <button onClick={selectAll} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors">全選択</button>
                <button onClick={deselectAll} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">解除</button>
                <button onClick={invertSelection} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">反転</button>
              </div>
            </div>

            {/* Page list */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: pageCount }, (_, i) => {
                const isSelected = selected.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`relative flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border-2 transition-all select-none
                      ${isSelected
                        ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                        : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-200 dark:hover:border-red-900"}`}
                  >
                    <span className={`text-[16px] font-bold ${isSelected ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? "text-red-400 dark:text-red-500" : "text-slate-300 dark:text-zinc-600"}`}>
                      p.{i + 1}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selected.size > 0 && (
              <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-[13px] text-amber-700 dark:text-amber-400">
                  ⚠️ {selected.size}ページを削除し、{remainingCount}ページのPDFを作成します。
                </p>
              </div>
            )}
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
        {done && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">削除完了！ダウンロードを確認してください。</span>
          </div>
        )}

        <button
          onClick={deletePages}
          disabled={!file || selected.size === 0 || processing}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500 hover:bg-red-400 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {processing
            ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</>
            : <><Download className="w-5 h-5" />{selected.size > 0 ? `${selected.size}ページを削除してダウンロード` : "削除するページを選択してください"}</>}
        </button>

        {file && (
          <button onClick={reset} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">リセット</button>
        )}

        {/* Usage */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              PDFファイルをドロップまたはタップして選択
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              削除したいページ番号をタップして選択（複数選択可・全選択ボタンあり）
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              「削除してダウンロード」を押すと選択ページが除かれたPDFをダウンロード
            </li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        {/* PDF split vs delete difference */}
        <div className="mt-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
          <p className="text-[13px] font-semibold text-blue-700 dark:text-blue-300 mb-1">📌 PDF分割との違い</p>
          <p className="text-[13px] text-blue-600 dark:text-blue-400 leading-relaxed">
            <strong>このツール</strong>は「不要なページを消す」目的です。<a href="/tools/pdf-split" className="underline hover:opacity-80">PDF分割ツール</a>は「必要なページだけを取り出す」目的です。検索意図が違うため、用途に合わせてご利用ください。
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "1ページだけ削除できますか？", a: "はい、1ページだけでも複数ページでも削除できます。ページ一覧から削除したいページをタップして選択し、ダウンロードしてください。" },
              { q: "PDF分割ツールとの違いは何ですか？", a: "PDF分割は「必要なページを取り出す」機能です。PDFページ削除は「不要なページを消して、残りを元通りに保存する」機能です。大半のページを残したい場合はこちらのほうが操作が直感的です。" },
              { q: "全ページを選択して削除できますか？", a: "全ページの削除はできません。少なくとも1ページは残す必要があります。すべて選択した場合はエラーが表示されます。" },
              { q: "ファイルはサーバーに保存されますか？", a: "いいえ。処理はすべてブラウザ内で完結します。アップロードしたPDFが外部サーバーに送信されることは一切ありません。" },
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
