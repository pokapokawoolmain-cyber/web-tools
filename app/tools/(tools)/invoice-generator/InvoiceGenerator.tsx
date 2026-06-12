"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { getSavedSeals } from "@/lib/seal-storage";
import type { SavedSeal } from "@/lib/seal-storage";
import { importFromFile } from "./invoice-import";
import type { ImportWarning } from "./invoice-import";

type LineItem = { id: number; name: string; qty: number; unit: string; price: number };

type InvoiceForm = {
  invoiceNumber: string;
  invoiceRegistrationNumber: string;
  issueDate: string;
  dueDate: string;
  issuerName: string;
  issuerAddress: string;
  issuerPhone: string;
  issuerEmail: string;
  bankInfo: string;
  clientName: string;
  clientContact: string;
  taxRate: number;
  notes: string;
  items: LineItem[];
};

const defaultForm: InvoiceForm = {
  invoiceNumber: "",
  invoiceRegistrationNumber: "",
  issueDate: "",
  dueDate: "",
  issuerName: "",
  issuerAddress: "",
  issuerPhone: "",
  issuerEmail: "",
  bankInfo: "",
  clientName: "",
  clientContact: "",
  taxRate: 10,
  notes: "",
  items: [{ id: 1, name: "", qty: 1, unit: "式", price: 0 }],
};

export function InvoiceGenerator() {
  const [form, setForm] = useState<InvoiceForm>(defaultForm);
  const [toastMsg, setToastMsg] = useState("");
  const [savedSeals, setSavedSeals] = useState<SavedSeal[]>([]);
  const [showSeal, setShowSeal] = useState(false);
  const [sealDataUrl, setSealDataUrl] = useState<string | null>(null);
  const [sealSize, setSealSize] = useState(64);
  const importRef = useRef<HTMLInputElement>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState("");
  const [importWarnings, setImportWarnings] = useState<ImportWarning[] | null>(null);

  useEffect(() => {
    setSavedSeals(getSavedSeals());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("invoice-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); return; } catch {}
    }
    const today = new Date();
    const ym = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;
    setForm(f => ({
      ...f,
      invoiceNumber: `INV-${ym}-001`,
      issueDate: today.toISOString().slice(0, 10),
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoice-form", JSON.stringify(form));
  }, [form]);

  const set = <K extends keyof InvoiceForm>(key: K, val: InvoiceForm[K]) => setForm(f => ({ ...f, [key]: val }));

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { id: Date.now(), name: "", qty: 1, unit: "式", price: 0 }] }));
  const removeItem = (id: number) => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }));
  const updateItem = (id: number, key: keyof LineItem, val: string | number) =>
    setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));

  const { subtotal, tax, total } = useMemo(() => {
    const sub = form.items.reduce((acc, i) => acc + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
    const t = Math.floor(sub * (Number(form.taxRate) || 0) / 100);
    return { subtotal: sub, tax: t, total: sub + t };
  }, [form.items, form.taxRate]);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2500); };

  // ── ファイルインポート ──────────────────────────────────
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    // ── JSON / CSV はテキスト処理 ──────────────
    if (ext === "json" || ext === "csv") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        try {
          if (ext === "json") {
            const data = JSON.parse(text);
            if (data.items && Array.isArray(data.items)) {
              const items: LineItem[] = data.items.map((item: LineItem, idx: number) => ({
                ...item,
                id: Date.now() + idx,
              }));
              setForm({ ...defaultForm, ...data, items });
              showToast("JSONをインポートしました");
            } else {
              showToast("JSONの形式が正しくありません（itemsが必要です）");
            }
          } else {
            const lines = text.split(/\r?\n/).filter(l => l.trim());
            const firstCol = lines[0]?.split(",")[0]?.replace(/"/g, "").trim() ?? "";
            const dataLines =
              isNaN(Number(firstCol)) && firstCol !== "" && isNaN(Date.parse(firstCol))
                ? lines.slice(1)
                : lines;
            const items: LineItem[] = dataLines
              .filter(l => l.trim())
              .map((line, idx) => {
                const cols = line.split(",").map(c => c.trim().replace(/^"([\s\S]*)"$/, "$1"));
                return {
                  id: Date.now() + idx,
                  name: cols[0] ?? "",
                  qty: Number(cols[1]) || 1,
                  unit: cols[2] || "式",
                  price: Number(cols[3]?.replace(/[^\d.-]/g, "")) || 0,
                };
              });
            if (items.length > 0) {
              setForm(f => ({ ...f, items }));
              showToast(`${items.length}件の明細をインポートしました`);
            } else {
              showToast("明細データが見つかりませんでした");
            }
          }
        } catch {
          showToast("ファイルの読み込みに失敗しました");
        }
      };
      reader.readAsText(file, "utf-8");
      return;
    }

    // ── PDF / 画像 → OCR/テキスト抽出 ──────────
    const isPdf = ext === "pdf" || file.type === "application/pdf";
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext) || file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      showToast(".json / .csv / .pdf / .jpg / .png に対応しています");
      return;
    }

    setImportLoading(true);
    setImportProgress("ファイルを読み込み中...");
    try {
      const result = await importFromFile(file, (msg) => setImportProgress(msg));
      // フォームへ反映
      setForm(f => ({
        ...f,
        items: result.items.length > 0 ? result.items : f.items,
        ...(result.issueDate ? { issueDate: result.issueDate } : {}),
        ...(result.issuerName ? { issuerName: result.issuerName } : {}),
      }));
      setImportWarnings(result.warnings);
    } catch (err) {
      setImportWarnings([{
        level: "error",
        message: "ファイルの読み込みに失敗しました。",
        suggestion: `ファイルが壊れていないか確認してください。\nエラー詳細: ${err instanceof Error ? err.message : String(err)}`,
      }]);
    } finally {
      setImportLoading(false);
      setImportProgress("");
    }
  };

  // ── JSONエクスポート ──────────────────────────────────
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${form.invoiceNumber || "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSONを保存しました");
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">{toastMsg}</div>
      )}

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">請求書情報</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">請求書番号</label>
            <input type="text" value={form.invoiceNumber} onChange={e => set("invoiceNumber", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">発行日</label>
            <input type="date" value={form.issueDate} onChange={e => set("issueDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">支払期限</label>
            <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">適格請求書発行事業者 登録番号（任意）</label>
          <input type="text" value={form.invoiceRegistrationNumber} onChange={e => set("invoiceRegistrationNumber", e.target.value)} placeholder="T1234567890123" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
        </div>
      </div>

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">請求先</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">請求先名（御中）</label>
            <input type="text" value={form.clientName} onChange={e => set("clientName", e.target.value)} placeholder="〇〇株式会社" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">担当者（任意）</label>
            <input type="text" value={form.clientContact} onChange={e => set("clientContact", e.target.value)} placeholder="鈴木 様" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">発行者情報</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">発行者名・屋号</label>
            <input type="text" value={form.issuerName} onChange={e => set("issuerName", e.target.value)} placeholder="山田 太郎" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">住所</label>
            <input type="text" value={form.issuerAddress} onChange={e => set("issuerAddress", e.target.value)} placeholder="東京都〇〇区〇〇1-2-3" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">電話番号</label>
            <input type="text" value={form.issuerPhone} onChange={e => set("issuerPhone", e.target.value)} placeholder="090-0000-0000" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">メール</label>
            <input type="email" value={form.issuerEmail} onChange={e => set("issuerEmail", e.target.value)} placeholder="contact@example.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">振込先（任意）</label>
          <textarea value={form.bankInfo} onChange={e => set("bankInfo", e.target.value)} placeholder="〇〇銀行 〇〇支店 普通 1234567 ヤマダ タロウ" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
        </div>
      </div>

      {/* 印鑑 */}
      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">印鑑（任意）</h3>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={showSeal} onChange={(e) => setShowSeal(e.target.checked)} className="rounded accent-blue-600" />
            <span className="text-xs text-slate-500 dark:text-zinc-400">印鑑を表示する</span>
          </label>
        </div>
        {showSeal && (
          <div className="space-y-3">
            {savedSeals.length === 0 ? (
              <p className="text-xs text-slate-400">
                保存済み印鑑がありません。
                <a href="/tools/hanko-generator" className="text-blue-500 hover:underline ml-1">電子印鑑メーカーで作成 →</a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {savedSeals.map((s) => (
                  <button key={s.id} onClick={() => setSealDataUrl(s.dataUrl)}
                    className={`p-1.5 rounded-xl border-2 transition-all ${sealDataUrl === s.dataUrl ? "border-red-500" : "border-transparent hover:border-red-300"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.dataUrl} alt="印鑑" className="w-12 h-12 object-contain" />
                  </button>
                ))}
                <button onClick={() => setSealDataUrl(null)}
                  className={`px-3 py-2 text-xs rounded-xl border-2 transition-all ${!sealDataUrl ? "border-slate-400 text-slate-500" : "border-transparent text-slate-400 hover:border-slate-200"}`}>
                  なし
                </button>
              </div>
            )}
            {sealDataUrl && (
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">サイズ: {sealSize}px</label>
                <input type="range" min="40" max="120" value={sealSize} onChange={(e) => setSealSize(Number(e.target.value))} className="w-48 accent-red-600" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">明細</h3>
          <button onClick={addItem} className="text-sm font-medium text-blue-600 hover:text-blue-700">＋ 明細を追加</button>
        </div>
        <div className="space-y-2">
          {form.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder="品目" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} className="col-span-12 sm:col-span-5 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="number" placeholder="数量" value={item.qty} onFocus={e => e.target.select()} onChange={e => updateItem(item.id, "qty", Number(e.target.value))} className="col-span-3 sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="text" placeholder="単位" value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)} className="col-span-3 sm:col-span-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="number" placeholder="単価" value={item.price} onFocus={e => e.target.select()} onChange={e => updateItem(item.id, "price", Number(e.target.value))} className="col-span-4 sm:col-span-3 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <button onClick={() => removeItem(item.id)} className="col-span-2 sm:col-span-1 text-slate-400 hover:text-red-500 text-sm" aria-label="削除">削除</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">消費税率(%)</label>
          <input type="number" value={form.taxRate} onFocus={e => e.target.select()} onChange={e => set("taxRate", Number(e.target.value))} className="w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
        </div>
      </div>

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">備考（任意）</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="お振込手数料は貴社負担にてお願い申し上げます。" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
      </div>

      {/* インポートボタン（隠しファイル入力） */}
      <input
        ref={importRef}
        type="file"
        accept=".json,.csv,.pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleImport}
      />

      {/* ── ローディングオーバーレイ ── */}
      {importLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 text-center space-y-5 max-w-sm w-full mx-4">
            <div className="text-5xl animate-bounce">📄</div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base mb-1">ファイルを読み取り中</p>
              <p className="text-sm text-slate-500 dark:text-zinc-400 min-h-[1.5em]">{importProgress}</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full animate-pulse w-2/3" />
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              初回はOCR言語データのダウンロードが発生します（約10MB）
            </p>
          </div>
        </div>
      )}

      {/* ── 警告モーダル ── */}
      {importWarnings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">読み取り結果</h3>
            <div className="space-y-3">
              {importWarnings.map((w, i) => {
                const colors =
                  w.level === "error"
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                    : w.level === "warn"
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                    : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300";
                const subColors =
                  w.level === "error"
                    ? "text-red-700 dark:text-red-400"
                    : w.level === "warn"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-blue-700 dark:text-blue-400";
                const icon =
                  w.level === "error" ? "❌" : w.level === "warn" ? "⚠️" : "ℹ️";
                return (
                  <div key={i} className={`rounded-xl p-4 border text-sm ${colors}`}>
                    <p className="font-semibold mb-1">{icon} {w.message}</p>
                    <p className={`text-xs whitespace-pre-line leading-relaxed ${subColors}`}>
                      {w.suggestion}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setImportWarnings(null)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                確認して閉じる
              </button>
              <button
                onClick={() => { setImportWarnings(null); importRef.current?.click(); }}
                className="px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors"
              >
                やり直す
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-3">ファイルから読み込み・保存</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => importRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-sm transition-colors"
          >
            📂 インポート（JSON / CSV）
          </button>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-sm transition-colors"
          >
            💾 JSONで保存
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 leading-relaxed">
          <span className="font-medium">PDF</span>：テキスト埋め込みPDF（freee・マネーフォワード等）は高精度。スキャンPDFはOCR処理<br />
          <span className="font-medium">画像</span>（jpg/png）：レシート・領収書の写真。OCRで読み取り（70〜80%精度）<br />
          <span className="font-medium">JSON/CSV</span>：このツールで保存したJSONまたは4列CSVの明細を一括インポート
        </p>
      </div>

      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={() => window.print()} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">🖨️ PDFで保存・印刷</button>
        <button onClick={() => { setForm(defaultForm); localStorage.removeItem("invoice-form"); showToast("リセットしました"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">リセット</button>
      </div>

      {/* プレビュー */}
      <div className="print-area">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-10 text-slate-900 mx-auto" style={{ maxWidth: '210mm' }}>
          <div className="flex justify-between items-start mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-widest">請 求 書</h2>
              <p className="text-sm text-slate-500 mt-1">INVOICE</p>
            </div>
            <div className="text-right text-sm text-slate-600 space-y-1">
              <p>請求書番号: {form.invoiceNumber || "—"}</p>
              <p>発行日: {formatDate(form.issueDate) || "—"}</p>
              <p>支払期限: {formatDate(form.dueDate) || "—"}</p>
            </div>
          </div>

          <div className="flex justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">請求先</p>
              <p className="text-lg font-semibold text-slate-900">{form.clientName || "御請求先"} 御中</p>
              {form.clientContact && <p className="text-sm text-slate-600">担当: {form.clientContact}</p>}
            </div>
            <div className="relative text-right text-sm text-slate-600 space-y-0.5 pr-2">
              <p className="font-semibold text-slate-900">{form.issuerName || "発行者名"}</p>
              {form.issuerAddress && <p>{form.issuerAddress}</p>}
              {form.issuerPhone && <p>Tel: {form.issuerPhone}</p>}
              {form.issuerEmail && <p>{form.issuerEmail}</p>}
              {form.invoiceRegistrationNumber && <p className="text-xs">登録番号: {form.invoiceRegistrationNumber}</p>}
              {/* 印鑑 */}
              {showSeal && sealDataUrl ? (
                <div className="flex justify-end mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sealDataUrl} alt="印鑑" style={{ width: sealSize, height: sealSize, opacity: 0.85 }} />
                </div>
              ) : showSeal && (
                <div className="flex justify-end mt-2">
                  <div style={{ width: sealSize, height: sealSize }} className="border-2 border-slate-300 rounded-full flex items-center justify-center text-xs text-slate-300">印</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-xl p-5 mb-8 text-center">
            <p className="text-sm mb-1 opacity-80">ご請求金額（税込）</p>
            <p className="text-3xl font-bold">¥{total.toLocaleString('ja-JP')}</p>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-2 text-left font-semibold">品目</th>
                <th className="py-2 text-right font-semibold w-16">数量</th>
                <th className="py-2 text-right font-semibold w-16">単位</th>
                <th className="py-2 text-right font-semibold w-24">単価</th>
                <th className="py-2 text-right font-semibold w-24">金額</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map(item => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{item.name || "—"}</td>
                  <td className="py-2 text-right text-slate-600">{item.qty}</td>
                  <td className="py-2 text-right text-slate-600">{item.unit || "式"}</td>
                  <td className="py-2 text-right text-slate-600">¥{Number(item.price).toLocaleString('ja-JP')}</td>
                  <td className="py-2 text-right font-medium text-slate-800">¥{(Number(item.qty) * Number(item.price)).toLocaleString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-56 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">小計</span><span>¥{subtotal.toLocaleString('ja-JP')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">消費税({form.taxRate}%)</span><span>¥{tax.toLocaleString('ja-JP')}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-slate-300 pt-1"><span>合計</span><span>¥{total.toLocaleString('ja-JP')}</span></div>
            </div>
          </div>

          {form.bankInfo && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-1">お振込先</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{form.bankInfo}</p>
            </div>
          )}

          {form.notes && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-1">備考</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{form.notes}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-area > div { box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
