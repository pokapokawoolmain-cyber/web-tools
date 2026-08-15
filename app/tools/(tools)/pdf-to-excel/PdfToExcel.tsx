"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { normalizeItems, itemsToTable, type RawTextItem } from "@/lib/pdf-extract";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type SheetMode = "perPage" | "single";

export function PdfToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [sheetMode, setSheetMode] = useState<SheetMode>("perPage");
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [outName, setOutName] = useState("");
  const [done, setDone] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null); setPageCount(0); setPreview(null); setDone(false);
    setError(null); setWarn(null); setProgress(0);
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
  };

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    reset();
    setError(null); setFile(f);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const bytes = await f.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      setPageCount(doc.numPages);
    } catch {
      setError("PDFの読み込みに失敗しました。ファイルが破損していないかご確認ください。");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  const convert = async () => {
    if (!file) return;
    setConverting(true); setError(null); setWarn(null); setDone(false); setPreview(null);
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const XLSX = await import("xlsx");

      const bytes = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      const wb = XLSX.utils.book_new();
      let firstPreview: string[][] | null = null;
      let totalCells = 0;
      const combined: string[][] = [];

      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const tc = await page.getTextContent();
        const items: RawTextItem[] = normalizeItems(tc.items as unknown[]);
        const table = itemsToTable(items);
        totalCells += table.reduce((s, r) => s + r.filter((c) => c !== "").length, 0);

        if (!firstPreview && table.length) firstPreview = table.slice(0, 20);

        if (sheetMode === "perPage") {
          const ws = XLSX.utils.aoa_to_sheet(table.length ? table : [[""]]);
          XLSX.utils.book_append_sheet(wb, ws, `ページ${p}`);
        } else {
          if (p > 1 && combined.length && table.length) combined.push([]);
          combined.push(...table);
        }
        setProgress(p / doc.numPages);
      }

      if (sheetMode === "single") {
        const ws = XLSX.utils.aoa_to_sheet(combined.length ? combined : [[""]]);
        XLSX.utils.book_append_sheet(wb, ws, "抽出結果");
      }

      if (totalCells === 0) {
        setWarn("文字を抽出できませんでした。スキャン（画像）のPDFの可能性があります。画像PDFは文字情報を持たないため変換できません。");
      }

      const arr = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([arr], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setOutName(file.name.replace(/\.pdf$/i, "") + ".xlsx");
      setPreview(firstPreview);
      setDone(true);
    } catch {
      setError("変換に失敗しました。別のPDFでお試しいただくか、時間をおいて再度お試しください。");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-4 text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
        PDFの表や文字を読み取り、Excel（.xlsx）に変換します。処理は<strong>すべてブラウザ内で完結</strong>し、ファイルはサーバーに送信されません。請求書・明細・名簿などの表を含むPDFに向いています。
      </div>

      {/* アップロード */}
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
            dragOver ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-slate-300 dark:border-zinc-700 hover:border-emerald-400"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto text-slate-400 mb-3" />
          <p className="text-[15px] font-semibold text-slate-700 dark:text-zinc-200">PDFをドラッグ＆ドロップ</p>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">またはクリックして選択</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-slate-800 dark:text-zinc-100 truncate">{file.name}</p>
            <p className="text-[12px] text-slate-400 dark:text-zinc-500">{formatSize(file.size)}{pageCount ? ` ・ ${pageCount}ページ` : ""}</p>
          </div>
          <button onClick={reset} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400" aria-label="削除">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* オプション */}
      {file && !done && (
        <div>
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">シートの分け方</p>
          <div className="grid grid-cols-2 gap-2">
            {([["perPage", "ページごとにシート"], ["single", "1シートにまとめる"]] as [SheetMode, string][]).map(([v, label]) => (
              <button key={v} onClick={() => setSheetMode(v)}
                className={`py-2.5 rounded-xl text-[13px] font-medium border transition-colors ${
                  sheetMode === v ? "bg-emerald-600 border-emerald-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-emerald-400"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-[13px] text-red-700 dark:text-red-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
        </div>
      )}
      {warn && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-[13px] text-amber-700 dark:text-amber-300 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{warn}
        </div>
      )}

      {/* アクション */}
      {file && !done && (
        <button onClick={convert} disabled={converting}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          {converting ? (<><Loader2 className="w-4 h-4 animate-spin" />変換中… {Math.round(progress * 100)}%</>) : (<>Excelに変換する</>)}
        </button>
      )}

      {/* 結果 */}
      {done && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-100">変換が完了しました</p>
            {blobUrl && (
              <a href={blobUrl} download={outName}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors">
                <Download className="w-4 h-4" />Excelをダウンロード
              </a>
            )}
          </div>

          {preview && preview.length > 0 && (
            <div>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-2">プレビュー（先頭ページの一部）</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-700">
                <table className="text-[12px] border-collapse">
                  <tbody>
                    {preview.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? "bg-slate-50 dark:bg-zinc-800 font-medium" : ""}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="border border-slate-200 dark:border-zinc-700 px-2.5 py-1.5 whitespace-nowrap text-slate-700 dark:text-zinc-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button onClick={reset} className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            別のPDFを変換する
          </button>
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 leading-relaxed">
        ※ PDFは文字と座標の集まりで表の構造情報を持たないため、罫線の複雑な表や結合セルは列がずれることがあります。変換後にExcelで微調整してご利用ください。スキャン（画像）のPDFは文字情報が無いため変換できません。
      </p>
    </div>
  );
}
