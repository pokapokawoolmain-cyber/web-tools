"use client";
import { useState, useCallback, useRef } from "react";
import { Table, Printer, AlertCircle, CheckCircle2, X, RefreshCw, ChevronDown } from "lucide-react";

type SheetData = {
  name: string;
  html: string;
  rows: number;
  cols: number;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type Orientation = "portrait" | "landscape";
type FontSize = "small" | "medium" | "large";

const FONT_SIZES: Record<FontSize, { label: string; pt: string }> = {
  small:  { label: "小（8pt）",  pt: "8pt" },
  medium: { label: "中（10pt）", pt: "10pt" },
  large:  { label: "大（12pt）", pt: "12pt" },
};

function buildPrintHtml(
  sheetsHtml: string,
  sheetsTitle: string,
  orientation: Orientation,
  fontSize: FontSize,
  fileName: string
): string {
  const fs = FONT_SIZES[fontSize].pt;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${fileName}</title>
<style>
@page { size: A4 ${orientation}; margin: 15mm 20mm; }
@media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
body {
  font-family: 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', 'MS PGothic', sans-serif;
  font-size: ${fs};
  color: #111;
  margin: 0;
}
.sheet-title {
  font-size: calc(${fs} * 1.3);
  font-weight: bold;
  padding: 4pt 0 6pt;
  border-bottom: 2px solid #333;
  margin-bottom: 10pt;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 8pt;
  table-layout: auto;
  word-break: break-word;
}
td, th {
  border: 1px solid #bbb;
  padding: 3pt 6pt;
  vertical-align: top;
  white-space: pre-wrap;
}
tr:nth-child(even) td { background: #f7f7f7; }
.page-break { page-break-after: always; }
</style>
</head>
<body>
<div class="sheet-title">${sheetsTitle}</div>
${sheetsHtml}
</body>
</html>`;
}

export function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [selectedSheets, setSelectedSheets] = useState<Set<number>>(new Set([0]));
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [fontSize, setFontSize] = useState<FontSize>("small");
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
      setError(".xlsx・.xls・.csv ファイルを選択してください。");
      return;
    }
    setIsConverting(true);
    setError(null);
    setSheets([]);
    setFile(f);
    setActiveSheet(0);
    setSelectedSheets(new Set([0]));

    try {
      const XLSX = await import("xlsx");
      const arrayBuffer = await f.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array", cellStyles: true });

      const sheetData: SheetData[] = wb.SheetNames.map((sheetName) => {
        const ws = wb.Sheets[sheetName];
        const ref = ws["!ref"];
        let rows = 0, cols = 0;
        if (ref) {
          const range = XLSX.utils.decode_range(ref);
          rows = range.e.r - range.s.r + 1;
          cols = range.e.c - range.s.c + 1;
        }
        // sheet_to_html でHTMLテーブルに変換（id属性は重複しないよう個別に設定）
        const html = XLSX.utils.sheet_to_html(ws, { id: `xl-${sheetName}`, editable: false });
        return { name: sheetName, html, rows, cols };
      });

      setSheets(sheetData);
    } catch {
      setError("ファイルの読み込みに失敗しました。ファイルが破損しているか、パスワード保護されている可能性があります。");
      setFile(null);
    } finally {
      setIsConverting(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const toggleSheet = (idx: number) => {
    setSelectedSheets((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        if (next.size === 1) return prev; // 最低1枚選択
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handlePrint = () => {
    if (!sheets.length || !file) return;
    const fileName = file.name.replace(/\.(xlsx|xls|csv)$/i, "");

    // 選択中シートのHTMLを結合
    const sortedIndices = Array.from(selectedSheets).sort((a, b) => a - b);
    const combined = sortedIndices
      .map((idx, i) => {
        const s = sheets[idx];
        const pageBreak = i < sortedIndices.length - 1 ? '<div class="page-break"></div>' : "";
        return `<div class="sheet-block">${s.html}${pageBreak}</div>`;
      })
      .join("");

    const sheetsTitle = sortedIndices.length === 1
      ? sheets[sortedIndices[0]].name
      : `${fileName}（${sortedIndices.length}シート）`;

    const html = buildPrintHtml(combined, sheetsTitle, orientation, fontSize, fileName);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 3000);
    }, 350);
  };

  const handleReset = () => {
    setFile(null);
    setSheets([]);
    setActiveSheet(0);
    setSelectedSheets(new Set([0]));
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentSheet = sheets[activeSheet];

  return (
    <div className="space-y-6">
      {/* アップロードゾーン */}
      {!sheets.length && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center select-none
            ${dragOver
              ? "border-green-400 bg-green-50 dark:bg-green-950/30 scale-[1.01]"
              : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-green-300 hover:bg-green-50/50 dark:hover:border-green-700 dark:hover:bg-green-950/20"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {isConverting ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300">読み込み中…</p>
              <p className="text-[12px] text-slate-400">大きなファイルは数秒かかります</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center shadow-sm">
                <Table className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-slate-800 dark:text-zinc-200">
                  Excelファイルをドロップ
                </p>
                <p className="text-[13px] text-slate-500 dark:text-zinc-500 mt-1">
                  または<span className="text-green-600 dark:text-green-400 font-medium">クリックしてファイルを選択</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-zinc-600 bg-white dark:bg-zinc-800 rounded-full px-3 py-1 border border-slate-200 dark:border-zinc-700">
                <Table className="w-3 h-3" />
                対応形式：.xlsx・.xls・.csv
              </span>
            </div>
          )}
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-[14px] text-red-700 dark:text-red-300">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 変換結果 */}
      {sheets.length > 0 && file && (
        <div className="space-y-5">
          {/* ファイル情報 */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
            <div className="flex items-center gap-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-green-800 dark:text-green-300 truncate">{file.name}</p>
                <p className="text-[12px] text-green-600 dark:text-green-500">
                  {formatFileSize(file.size)} · {sheets.length}シート
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" />別のファイル
            </button>
          </div>

          {/* シート選択（複数シートの場合） */}
          {sheets.length > 1 && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900">
              <button
                onClick={() => setShowSheetSelector((v) => !v)}
                className="flex items-center justify-between w-full text-[13px] font-semibold text-slate-700 dark:text-zinc-300"
              >
                <span>PDFに含めるシートを選択（{selectedSheets.size}/{sheets.length}枚選択中）</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSheetSelector ? "rotate-180" : ""}`} />
              </button>
              {showSheetSelector && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sheets.map((s, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors
                        ${selectedSheets.has(idx)
                          ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                          : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSheets.has(idx)}
                        onChange={() => toggleSheet(idx)}
                        className="w-4 h-4 accent-green-600"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-slate-800 dark:text-zinc-200 truncate">{s.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">{s.rows}行 × {s.cols}列</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PDF設定 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-3">PDF設定</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-zinc-500 mb-1.5">用紙の向き</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["portrait", "landscape"] as Orientation[]).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrientation(o)}
                      className={`py-2 rounded-lg border text-[12px] font-medium transition-colors
                        ${orientation === o
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-green-400"
                        }`}
                    >
                      {o === "portrait" ? "縦（A4）" : "横（A4）"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-zinc-500 mb-1.5">フォントサイズ</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.entries(FONT_SIZES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-2">
              列数が多い場合は「横」向きを推奨します
            </p>
          </div>

          {/* PDFとして保存 */}
          <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-[15px] transition-colors shadow-sm"
            >
              <Printer className="w-5 h-5" />
              PDFとして保存する
              {selectedSheets.size > 1 && (
                <span className="text-[12px] font-normal bg-green-500 rounded-full px-2 py-0.5">
                  {selectedSheets.size}シート
                </span>
              )}
            </button>
            <div className="mt-4 space-y-2">
              <p className="text-[12px] font-semibold text-green-700 dark:text-green-300">
                保存手順（ブラウザの印刷ダイアログが開きます）
              </p>
              <ol className="space-y-1.5">
                {[
                  'プリンター欄で「PDFとして保存」または「Save as PDF」を選択する',
                  '「保存」ボタンをクリックして、任意の場所に保存する',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-green-600 dark:text-green-400">
                    <span className="w-4 h-4 rounded-full bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* シートタブ（プレビュー切り替え用） */}
          {sheets.length > 1 && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {sheets.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSheet(idx)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors border
                    ${activeSheet === idx
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-green-400"
                    }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* プレビュー */}
          {currentSheet && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-slate-600 dark:text-zinc-400">
                  プレビュー：{currentSheet.name}
                  <span className="text-[12px] font-normal text-slate-400 dark:text-zinc-600 ml-2">
                    {currentSheet.rows}行 × {currentSheet.cols}列
                  </span>
                </p>
              </div>
              <div className="border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                <div className="overflow-auto max-h-[500px] p-4">
                  <style>{`
                    .xl-preview table { border-collapse: collapse; font-size: 12px; }
                    .xl-preview td, .xl-preview th { border: 1px solid #d1d5db; padding: 4px 8px; white-space: nowrap; }
                    .xl-preview tr:nth-child(even) td { background: #f9fafb; }
                    .dark .xl-preview td, .dark .xl-preview th { border-color: #3f3f46; }
                    .dark .xl-preview tr:nth-child(even) td { background: #27272a; }
                    .dark .xl-preview td, .dark .xl-preview th { color: #e4e4e7; }
                  `}</style>
                  <div
                    className="xl-preview"
                    dangerouslySetInnerHTML={{ __html: currentSheet.html }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-2 text-center">
                ※ 列数が多い場合は「横向き」設定にすると見やすくなります
              </p>
            </div>
          )}
        </div>
      )}

      {/* プライバシー注記 */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
        <span className="text-[18px] flex-shrink-0">🔒</span>
        <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">
          アップロードしたExcelファイルはサーバーに送信されません。すべての処理はブラウザ内で完結するため、社内データや個人情報を含むスプレッドシートも安心してご利用いただけます。
        </p>
      </div>
    </div>
  );
}
