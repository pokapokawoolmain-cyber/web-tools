"use client";
import { useState, useCallback, useRef } from "react";
import { FileText, Printer, AlertCircle, CheckCircle2, X, RefreshCw } from "lucide-react";

type ConversionResult = {
  html: string;
  warnings: string[];
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type PageSize = "a4" | "a3" | "letter";
type FontSize = "small" | "medium" | "large";

const PAGE_SIZES: Record<PageSize, { label: string; css: string }> = {
  a4:     { label: "A4（210×297mm）",  css: "size: A4;" },
  a3:     { label: "A3（297×420mm）",  css: "size: A3;" },
  letter: { label: "Letter（216×279mm）", css: "size: letter;" },
};
const FONT_SIZES: Record<FontSize, { label: string; pt: string }> = {
  small:  { label: "小（9pt）",  pt: "9pt" },
  medium: { label: "中（11pt）", pt: "11pt" },
  large:  { label: "大（13pt）", pt: "13pt" },
};

function buildPrintHtml(html: string, pageSize: PageSize, fontSize: FontSize, fileName: string): string {
  const fs = FONT_SIZES[fontSize].pt;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${fileName}</title>
<style>
@page { ${PAGE_SIZES[pageSize].css} margin: 20mm 25mm; }
@media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
body {
  font-family: 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', 'MS PGothic', sans-serif;
  font-size: ${fs};
  line-height: 1.75;
  color: #111;
  margin: 0;
  word-break: break-word;
}
h1 { font-size: calc(${fs} * 1.7); font-weight: bold; margin: 0 0 14pt; border-bottom: 2px solid #222; padding-bottom: 5pt; }
h2 { font-size: calc(${fs} * 1.4); font-weight: bold; margin: 22pt 0 8pt; }
h3 { font-size: calc(${fs} * 1.2); font-weight: bold; margin: 16pt 0 6pt; }
h4 { font-size: ${fs}; font-weight: bold; margin: 12pt 0 4pt; }
p  { margin: 0 0 8pt; }
table { border-collapse: collapse; width: 100%; margin: 10pt 0; font-size: calc(${fs} * 0.88); page-break-inside: avoid; }
th, td { border: 1px solid #aaa; padding: 4pt 8pt; text-align: left; vertical-align: top; }
th { background: #f0f0f0; font-weight: bold; }
tr:nth-child(even) td { background: #fafafa; }
img { max-width: 100%; height: auto; page-break-inside: avoid; }
ul, ol { margin: 0 0 8pt; padding-left: 20pt; }
li { margin-bottom: 3pt; }
strong, b { font-weight: bold; }
em, i { font-style: italic; }
u { text-decoration: underline; }
s, del { text-decoration: line-through; }
blockquote { margin: 8pt 0 8pt 16pt; padding: 6pt 12pt; border-left: 3px solid #bbb; color: #444; background: #f9f9f9; }
pre, code { font-family: 'Courier New', monospace; font-size: calc(${fs} * 0.88); background: #f5f5f5; padding: 2pt 4pt; border: 1px solid #ddd; border-radius: 2pt; }
pre { padding: 8pt; overflow: auto; white-space: pre-wrap; }
a { color: #1155cc; text-decoration: underline; }
hr { border: none; border-top: 1px solid #ccc; margin: 14pt 0; }
.page-break { page-break-after: always; }
</style>
</head>
<body>${html}</body>
</html>`;
}

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".docx")) {
      setError(".docxファイル（Word 2007以降）を選択してください。古い .doc 形式は非対応です。");
      return;
    }
    setIsConverting(true);
    setError(null);
    setResult(null);
    setFile(f);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mammoth = (await import("mammoth")) as any;
      const arrayBuffer = await f.arrayBuffer();
      const output = await mammoth.convertToHtml({ arrayBuffer });
      const warnings = (output.messages as Array<{ type: string; message: string }>)
        .filter((m) => m.type === "warning")
        .map((m) => m.message)
        .slice(0, 4);
      setResult({ html: output.value, warnings });
    } catch {
      setError("変換に失敗しました。ファイルが破損しているか、パスワード保護されている可能性があります。");
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

  const handlePrint = () => {
    if (!result || !file) return;
    const fileName = file.name.replace(/\.docx$/i, "");
    const html = buildPrintHtml(result.html, pageSize, fontSize, fileName);
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
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* アップロードゾーン */}
      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center select-none
            ${dragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]"
              : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="hidden"
          />
          {isConverting ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300">変換中…</p>
              <p className="text-[12px] text-slate-400">ファイルサイズによって数秒かかります</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shadow-sm">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-slate-800 dark:text-zinc-200">
                  Wordファイルをドロップ
                </p>
                <p className="text-[13px] text-slate-500 dark:text-zinc-500 mt-1">
                  または<span className="text-blue-600 dark:text-blue-400 font-medium">クリックしてファイルを選択</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-zinc-600 bg-white dark:bg-zinc-800 rounded-full px-3 py-1 border border-slate-200 dark:border-zinc-700">
                <FileText className="w-3 h-3" />
                対応形式：.docx（Word 2007以降）
              </span>
            </div>
          )}
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 変換結果 */}
      {result && file && (
        <div className="space-y-5">
          {/* ファイル情報バー */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
            <div className="flex items-center gap-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-green-800 dark:text-green-300 truncate">{file.name}</p>
                <p className="text-[12px] text-green-600 dark:text-green-500">{formatFileSize(file.size)} · HTML変換完了</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" />別のファイル
            </button>
          </div>

          {/* 変換警告 */}
          {result.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400 mb-2">
                一部の書式が再現できていない場合があります
              </p>
              <ul className="space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i} className="text-[12px] text-amber-600 dark:text-amber-500">・{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* PDF設定 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-3">PDF設定</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-zinc-500 mb-1.5">用紙サイズ</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                  className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PAGE_SIZES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-zinc-500 mb-1.5">フォントサイズ</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(FONT_SIZES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PDFとして保存ボタン */}
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] transition-colors shadow-sm"
            >
              <Printer className="w-5 h-5" />
              PDFとして保存する
            </button>
            <div className="mt-4 space-y-2">
              <p className="text-[12px] font-semibold text-blue-700 dark:text-blue-300">
                保存手順（ブラウザの印刷ダイアログが開きます）
              </p>
              <ol className="space-y-1.5">
                {[
                  'プリンター欄で「PDFとして保存」または「Save as PDF」を選択する',
                  '「保存」ボタンをクリックして、任意の場所に保存する',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-blue-600 dark:text-blue-400">
                    <span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* プレビュー */}
          <div>
            <p className="text-[13px] font-semibold text-slate-600 dark:text-zinc-400 mb-2">変換プレビュー</p>
            <div className="border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
              <div
                className="max-h-[560px] overflow-y-auto p-6 sm:p-10 prose prose-sm prose-slate dark:prose-invert max-w-none
                  prose-headings:font-bold
                  prose-h1:text-xl prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-2
                  prose-h2:text-lg
                  prose-h3:text-base
                  prose-table:text-sm
                  prose-td:border prose-td:border-slate-200 dark:prose-td:border-zinc-700 prose-td:px-3 prose-td:py-1.5
                  prose-th:border prose-th:border-slate-200 dark:prose-th:border-zinc-700 prose-th:px-3 prose-th:py-1.5 prose-th:bg-slate-50 dark:prose-th:bg-zinc-900
                  prose-a:text-blue-600 dark:prose-a:text-blue-400"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-2 text-center">
              ※ プレビューと実際のPDF出力は多少異なる場合があります
            </p>
          </div>
        </div>
      )}

      {/* プライバシー注記 */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
        <span className="text-[18px] flex-shrink-0">🔒</span>
        <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">
          アップロードしたWordファイルはサーバーに送信されません。すべての変換処理はブラウザ内で完結するため、社内文書や個人情報を含む書類も安心してご利用いただけます。
        </p>
      </div>
    </div>
  );
}
