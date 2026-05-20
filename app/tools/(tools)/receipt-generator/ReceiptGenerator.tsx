"use client";
import { useState, useEffect, useMemo } from "react";
import { getSavedSeals } from "@/lib/seal-storage";
import type { SavedSeal } from "@/lib/seal-storage";

type ReceiptForm = {
  recipientName: string;
  amount: string;
  description: string;
  issueDate: string;
  issuerName: string;
  issuerAddress: string;
  issuerPhone: string;
  invoiceNumber: string;
  taxRate: number;
  showTaxBreakdown: boolean;
};

const defaultForm: ReceiptForm = {
  recipientName: "",
  amount: "",
  description: "お品代として",
  issueDate: "",
  issuerName: "",
  issuerAddress: "",
  issuerPhone: "",
  invoiceNumber: "",
  taxRate: 10,
  showTaxBreakdown: true,
};

export function ReceiptGenerator() {
  const [form, setForm] = useState<ReceiptForm>(defaultForm);
  const [toastMsg, setToastMsg] = useState("");
  const [savedSeals, setSavedSeals] = useState<SavedSeal[]>([]);
  const [showSeal, setShowSeal] = useState(false);
  const [sealDataUrl, setSealDataUrl] = useState<string | null>(null);
  const [sealSize, setSealSize] = useState(64);

  useEffect(() => {
    setSavedSeals(getSavedSeals());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("receipt-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); return; } catch { /* ignore */ }
    }
    const today = new Date().toISOString().slice(0, 10);
    setForm((f) => ({ ...f, issueDate: today }));
  }, []);

  useEffect(() => {
    localStorage.setItem("receipt-form", JSON.stringify(form));
  }, [form]);

  const set = <K extends keyof ReceiptForm>(key: K, val: ReceiptForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const { totalAmount, taxExclusive, taxAmount } = useMemo(() => {
    const raw = parseInt(form.amount.replace(/[^\d]/g, ""), 10) || 0;
    const excl = Math.round(raw / (1 + form.taxRate / 100));
    const tax = raw - excl;
    return { totalAmount: raw, taxExclusive: excl, taxAmount: tax };
  }, [form.amount, form.taxRate]);

  const needsRevenuStamp = totalAmount >= 50000;

  const formatDate = (d: string) => {
    if (!d) return "　　　年　月　日";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
  };

  const handleCopy = () => {
    const text = [
      "領 収 書",
      "",
      `${form.recipientName || "　　　　"} 殿`,
      `日付: ${formatDate(form.issueDate)}`,
      "",
      `金額: ¥${totalAmount.toLocaleString("ja-JP")}（税込）`,
      `但し: ${form.description}`,
      "",
      form.showTaxBreakdown ? `税抜金額: ¥${taxExclusive.toLocaleString("ja-JP")}` : "",
      form.showTaxBreakdown ? `消費税(${form.taxRate}%): ¥${taxAmount.toLocaleString("ja-JP")}` : "",
      "",
      form.issuerName,
      form.issuerAddress,
      form.issuerPhone ? `TEL: ${form.issuerPhone}` : "",
      form.invoiceNumber ? `登録番号: ${form.invoiceNumber}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text).then(() => showToast("コピーしました ✓"));
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── 入力フォーム ── */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">基本情報</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">宛名（領収先）</label>
                <input type="text" value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)}
                  placeholder="〇〇株式会社" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">金額（税込）</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">¥</span>
                  <input type="text" value={form.amount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      const num = parseInt(raw, 10);
                      set("amount", isNaN(num) ? "" : num.toLocaleString("ja-JP"));
                    }}
                    placeholder="100,000"
                    className="input-field pl-7 text-lg font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">但し書き</label>
                <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="お品代として" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">発行日</label>
                <input type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)}
                  className="input-field" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">発行者情報</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">発行者名・屋号</label>
                <input type="text" value={form.issuerName} onChange={(e) => set("issuerName", e.target.value)}
                  placeholder="山田 太郎 / 〇〇事務所" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">住所（任意）</label>
                <input type="text" value={form.issuerAddress} onChange={(e) => set("issuerAddress", e.target.value)}
                  placeholder="東京都渋谷区…" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">電話番号（任意）</label>
                <input type="tel" value={form.issuerPhone} onChange={(e) => set("issuerPhone", e.target.value)}
                  placeholder="03-0000-0000" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">インボイス登録番号（任意）</label>
                <input type="text" value={form.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)}
                  placeholder="T0000000000000" className="input-field" maxLength={14} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">消費税</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">税率</label>
                <div className="flex gap-2">
                  {[10, 8, 0].map((rate) => (
                    <button key={rate} onClick={() => set("taxRate", rate)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        form.taxRate === rate ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      {rate === 0 ? "非課税" : `${rate}%`}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.showTaxBreakdown}
                  onChange={(e) => set("showTaxBreakdown", e.target.checked)}
                  className="rounded border-slate-300 accent-blue-600" />
                <span className="text-xs text-slate-600 dark:text-zinc-400">税抜・消費税の内訳を表示</span>
              </label>
            </div>
          </div>

          {/* 印鑑 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">印鑑（任意）</h3>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={showSeal} onChange={(e) => setShowSeal(e.target.checked)} className="rounded accent-blue-600" />
                <span className="text-xs text-slate-600 dark:text-zinc-400">印鑑を表示する</span>
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

          {/* ボタン */}
          <div className="flex gap-3">
            <button onClick={() => window.print()}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
              🖨️ PDFで保存・印刷
            </button>
            <button onClick={handleCopy}
              className="px-5 py-3 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors">
              📋 コピー
            </button>
            <button onClick={() => { setForm(defaultForm); localStorage.removeItem("receipt-form"); }}
              className="px-4 py-3 border border-slate-200 dark:border-zinc-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">
              リセット
            </button>
          </div>
        </div>

        {/* ── プレビュー ── */}
        <div id="print-area">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden print-document">
            {/* 上部アクセントライン */}
            <div className="h-1.5 bg-gradient-to-r from-slate-700 to-slate-900" />
            <div className="p-8 sm:p-10">
              {/* タイトル */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-[0.6em] text-slate-900" style={{ fontFamily: "serif" }}>
                  領 収 書
                </h1>
              </div>

              {/* 宛名 + 日付 */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-xl font-semibold text-slate-900 border-b-2 border-slate-900 pb-1 pr-10" style={{ fontFamily: "serif" }}>
                    {form.recipientName || "　　　　　　"} 殿
                  </p>
                </div>
                <div className="text-sm text-slate-600 text-right">
                  <p>{formatDate(form.issueDate)}</p>
                </div>
              </div>

              {/* 金額 */}
              <div className="border-2 border-slate-900 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">¥</span>
                  <span className="text-4xl font-bold text-slate-900 tracking-wide">
                    {totalAmount > 0 ? totalAmount.toLocaleString("ja-JP") : "0"}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">（税込）</span>
                </div>
              </div>

              {/* 但し書き */}
              <div className="flex gap-2 items-center mb-6 text-sm">
                <span className="text-slate-500 flex-shrink-0">但し</span>
                <span className="flex-1 border-b border-slate-300 pb-0.5 text-slate-900">
                  {form.description || "お品代として"}
                </span>
                <span className="text-slate-500 flex-shrink-0 text-xs">として上記金額領収いたしました</span>
              </div>

              {/* 税内訳 */}
              {form.showTaxBreakdown && form.taxRate > 0 && totalAmount > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>税抜金額</span>
                    <span>¥{taxExclusive.toLocaleString("ja-JP")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>消費税（{form.taxRate}%）</span>
                    <span>¥{taxAmount.toLocaleString("ja-JP")}</span>
                  </div>
                </div>
              )}

              {/* 発行者 */}
              <div className="flex justify-end">
                <div className="text-right space-y-1">
                  <p className="font-bold text-lg text-slate-900" style={{ fontFamily: "serif" }}>
                    {form.issuerName || "発行者名"}
                  </p>
                  {form.issuerAddress && <p className="text-sm text-slate-600">{form.issuerAddress}</p>}
                  {form.issuerPhone && <p className="text-sm text-slate-600">TEL: {form.issuerPhone}</p>}
                  {form.invoiceNumber && (
                    <p className="text-xs text-slate-500">登録番号: {form.invoiceNumber}</p>
                  )}
                  {/* 印鑑 */}
                  <div className="flex justify-end mt-3">
                    {showSeal && sealDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sealDataUrl} alt="印鑑" style={{ width: sealSize, height: sealSize, opacity: 0.85 }} />
                    ) : (
                      <div style={{ width: Math.max(sealSize, 64), height: Math.max(sealSize, 64) }}
                        className="border-2 border-slate-300 rounded-full flex items-center justify-center text-xs text-slate-300">
                        印
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 収入印紙ガイド */}
              {needsRevenuStamp && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    ⚠️ 金額が5万円以上のため、紙の領収書には収入印紙（200円〜）が必要な場合があります。詳細は税理士等にご確認ください。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 印刷CSS */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background: white;
          color: #0f172a;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input-field:focus { box-shadow: 0 0 0 2px #3b82f6; }
        @media (prefers-color-scheme: dark) {
          .input-field { border-color: #52525b; background: #27272a; color: white; }
        }
        @media print {
          body > * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; top: 0; left: 0; width: 100%; }
          .print-document { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}
