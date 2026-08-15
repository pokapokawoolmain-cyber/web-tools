"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileText, X, AlertCircle } from "lucide-react";
import { normalizeItems, itemsToParagraphs, type RawTextItem } from "@/lib/pdf-extract";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageBreaks, setPageBreaks] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string[] | null>(null);
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

      const bytes = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      const htmlParts: string[] = [];
      const previewParas: string[] = [];
      let totalChars = 0;

      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const tc = await page.getTextContent();
        const items: RawTextItem[] = normalizeItems(tc.items as unknown[]);
        const paras = itemsToParagraphs(items);
        totalChars += paras.join("").length;

        for (const para of paras) {
          htmlParts.push(`<p style="margin:0 0 10pt 0">${escapeHtml(para)}</p>`);
          if (previewParas.length < 8) previewParas.push(para);
        }
        // ページ区切り（最終ページ以外）
        if (pageBreaks && p < doc.numPages) {
          htmlParts.push('<br clear="all" style="page-break-before:always" />');
        }
        setProgress(p / doc.numPages);
      }

      if (totalChars === 0) {
        setWarn("文字を抽出できませんでした。スキャン（画像）のPDFの可能性があります。画像PDFは文字情報を持たないため変換できません。");
      }

      const docHtml =
        `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">` +
        `<head><meta charset="utf-8"><title>${escapeHtml(file.name.replace(/\.pdf$/i, ""))}</title></head>` +
        `<body style="font-family:'Yu Gothic','Meiryo',sans-serif;font-size:11pt;line-height:1.7">${htmlParts.join("")}</body></html>`;

      const blob = new Blob(["﻿", docHtml], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setOutName(file.name.replace(/\.pdf$/i, "") + ".doc");
      setPreview(previewParas);
      setDone(true);
    } catch {
      setError("変換に失敗しました。別のPDFでお試しいただくか、時間をおいて再度お試しください。");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 rounded-2xl p-4 text-[13px] text-sky-800 dark:text-sky-300 leading-relaxed">
        PDFの文章を読み取り、Wordで編集できる文書（.doc）に変換します。処理は<strong>すべてブラウザ内で完結</strong>し、ファイルはサーバーに送信されません。作成された文書はWord・Googleドキュメント・Pagesで開けます。
      </div>

      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
            dragOver ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20" : "border-slate-300 dark:border-zinc-700 hover:border-sky-400"
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
          <FileText className="w-6 h-6 text-sky-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-slate-800 dark:text-zinc-100 truncate">{file.name}</p>
            <p className="text-[12px] text-slate-400 dark:text-zinc-500">{formatSize(file.size)}{pageCount ? ` ・ ${pageCount}ページ` : ""}</p>
          </div>
          <button onClick={reset} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400" aria-label="削除">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {file && !done && (
        <label className="flex items-center gap-2 px-1 cursor-pointer">
          <input type="checkbox" checked={pageBreaks} onChange={(e) => setPageBreaks(e.target.checked)} className="accent-sky-600" />
          <span className="text-[13px] text-slate-600 dark:text-zinc-300">ページごとに改ページを入れる</span>
        </label>
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

      {file && !done && (
        <button onClick={convert} disabled={converting}
          className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          {converting ? (<><Loader2 className="w-4 h-4 animate-spin" />変換中… {Math.round(progress * 100)}%</>) : (<>Wordに変換する</>)}
        </button>
      )}

      {done && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-sky-500 mb-2" />
            <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-100">変換が完了しました</p>
            {blobUrl && (
              <a href={blobUrl} download={outName}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors">
                <Download className="w-4 h-4" />Word文書をダウンロード
              </a>
            )}
          </div>

          {preview && preview.length > 0 && (
            <div>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-2">プレビュー（抽出した文章の一部）</p>
              <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-2 max-h-64 overflow-y-auto">
                {preview.map((para, i) => (
                  <p key={i} className="text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            別のPDFを変換する
          </button>
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 leading-relaxed">
        ※ 文章（テキスト）を編集できる形で取り出すツールです。元PDFの細かなレイアウト・画像・図表の配置は再現されません。スキャン（画像）のPDFは文字情報が無いため変換できません。出力は.doc形式で、Word・Googleドキュメント・Pagesで開けます。
      </p>
    </div>
  );
}
