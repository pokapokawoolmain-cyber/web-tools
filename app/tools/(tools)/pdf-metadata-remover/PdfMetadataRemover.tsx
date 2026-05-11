"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Download, Loader2, CheckCircle2, FileText, Info } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type MetaInfo = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
};

function parseDate(pdfDate: string | undefined): string {
  if (!pdfDate) return "";
  const m = pdfDate.match(/D:(\d{4})(\d{2})(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return pdfDate;
}

export function PdfMetadataRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [before, setBefore] = useState<MetaInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setBefore(null);
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setBefore({
        title: doc.getTitle(),
        author: doc.getAuthor(),
        subject: doc.getSubject(),
        keywords: doc.getKeywords(),
        creator: doc.getCreator(),
        producer: doc.getProducer(),
        creationDate: parseDate(doc.getCreationDate()?.toString()),
        modificationDate: parseDate(doc.getModificationDate()?.toString()),
      });
    } catch {
      setError("PDFの読み込みに失敗しました");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  }, [loadFile]);

  const process = async () => {
    if (!file) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setCreator("");
      doc.setProducer("");
      doc.setCreationDate(new Date(0));
      doc.setModificationDate(new Date(0));

      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const baseName = file.name.replace(/\.pdf$/i, "");
      a.href = url; a.download = `${baseName}-cleaned.pdf`; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("処理に失敗しました");
    } finally {
      setProcessing(false);
    }
  };

  const hasAnyMeta = before && Object.values(before).some((v) => v && v !== "1970-01-01");

  const metaRows: { label: string; key: keyof MetaInfo }[] = [
    { label: "タイトル", key: "title" },
    { label: "作成者", key: "author" },
    { label: "サブジェクト", key: "subject" },
    { label: "キーワード", key: "keywords" },
    { label: "作成アプリ", key: "creator" },
    { label: "PDF変換ソフト", key: "producer" },
    { label: "作成日", key: "creationDate" },
    { label: "更新日", key: "modificationDate" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 mb-4">
            <span className="text-3xl">🧹</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDFメタデータ削除ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">PDFに埋め込まれた作成者・日付などのメタ情報を削除。ブラウザ完結・無料。</p>
        </div>

        {/* Scope notice */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-[13px] text-blue-700 dark:text-blue-300 leading-relaxed space-y-1">
            <p className="font-semibold">削除できるもの・できないもの</p>
            <p>✅ 削除できる：タイトル・作成者・日付・キーワード・使用ソフト名などの文書プロパティ</p>
            <p>❌ 削除できない：本文テキスト・画像・注釈・デジタル署名・埋め込みフォント・隠しレイヤー・XMPメタデータ（一部）</p>
          </div>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
              ${dragOver ? "border-slate-400 bg-slate-50 dark:bg-zinc-800" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-slate-300 hover:bg-slate-50/80 dark:hover:bg-zinc-800/60"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <FileText className="w-8 h-8 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setBefore(null); setDone(false); }} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors shrink-0">変更</button>
            </div>

            {/* Before metadata */}
            {before && (
              <div className="rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
                  <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                    {hasAnyMeta ? "検出されたメタデータ（削除対象）" : "メタデータなし（削除する項目がありません）"}
                  </p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-zinc-800/60">
                  {metaRows.map(({ label, key }) => {
                    const val = before[key];
                    if (!val || val === "1970-01-01") return null;
                    return (
                      <div key={key} className="flex gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900/50">
                        <span className="text-[12px] text-slate-400 w-24 shrink-0 pt-0.5">{label}</span>
                        <span className="text-[13px] text-slate-700 dark:text-slate-300 break-all">{val}</span>
                      </div>
                    );
                  })}
                  {!hasAnyMeta && (
                    <div className="px-4 py-3 text-[13px] text-slate-400">このPDFにはメタデータが含まれていません。</div>
                  )}
                </div>
              </div>
            )}

            {done && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-[14px] text-green-700 dark:text-green-400 font-medium">メタデータを削除しました</p>
                  <p className="text-[12px] text-green-600 dark:text-green-500 mt-0.5">「-cleaned.pdf」としてダウンロードされました</p>
                </div>
              </div>
            )}

            {error && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}

            <button
              onClick={process}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-700 hover:bg-slate-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {processing ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</> : <><Download className="w-5 h-5" />メタデータを削除してダウンロード</>}
            </button>
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>PDFをアップロードすると、含まれるメタデータを表示</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>「メタデータを削除してダウンロード」を押す</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>クリーンなPDFが自動でダウンロードされます</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "なぜメタデータを削除する必要があるのですか？", a: "PDFには作成者名・使用ソフト・作成日時などが自動で記録されます。社外に共有する際、これらの情報が意図せず開示されることを防ぐために削除が推奨されます。" },
              { q: "本文テキストや画像は変わりますか？", a: "いいえ。このツールは文書プロパティ（メタデータ）のみを対象としています。本文テキスト・画像・レイアウトは一切変更されません。" },
              { q: "XMPメタデータも削除されますか？", a: "pdf-libが書き出すPDFにはXMPストリームが含まれますが、主要な文書プロパティ（作成者・日付・タイトル等）は削除されます。高度なフォレンジック調査に対応したい場合は専用ツールの使用をお勧めします。" },
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
