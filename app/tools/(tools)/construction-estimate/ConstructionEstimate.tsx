"use client";
import { useState, useMemo, useEffect } from "react";

type LineItem = {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
};

type TaxRate = 10 | 8 | 0;

const CATEGORIES = ["仮設工事", "土工事", "基礎工事", "木工事", "屋根工事", "外壁工事", "塗装工事", "内装工事", "建具工事", "設備工事", "外構工事", "諸経費", "その他"];
const UNITS = ["式", "m²", "m", "本", "枚", "箇所", "台", "組", "set", "m³", "kg", "L"];

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    category: "木工事",
    description: "",
    unit: "式",
    quantity: "1",
    unitPrice: "",
  };
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

const STORAGE_KEY = "construction-estimate-v1";

export function ConstructionEstimate() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [estimateNo, setEstimateNo] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [validDays, setValidDays] = useState("30");
  const [taxRate, setTaxRate] = useState<TaxRate>(10);
  const [showExpenses, setShowExpenses] = useState(true);
  const [expensesRate, setExpensesRate] = useState("15");
  const [notes, setNotes] = useState("工事期間中は安全管理を徹底し、近隣への配慮を行います。");
  const [items, setItems] = useState<LineItem[]>([newItem()]);

  // LocalStorageから復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.companyAddress) setCompanyAddress(data.companyAddress);
        if (data.companyPhone) setCompanyPhone(data.companyPhone);
        if (data.companyEmail) setCompanyEmail(data.companyEmail);
        if (data.licenseNo) setLicenseNo(data.licenseNo);
      }
    } catch { /* ignore */ }
    const today = new Date().toISOString().slice(0, 10);
    setIssueDate(today);
  }, []);

  // 会社情報をLocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        companyName, companyAddress, companyPhone, companyEmail, licenseNo
      }));
    } catch { /* ignore */ }
  }, [companyName, companyAddress, companyPhone, companyEmail, licenseNo]);

  const updateItem = (id: string, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, newItem()]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice.replace(/,/g, "")) || 0;
      return sum + qty * price;
    }, 0);
    const expenses = showExpenses ? subtotal * (parseFloat(expensesRate) || 0) / 100 : 0;
    const beforeTax = subtotal + expenses;
    const tax = beforeTax * taxRate / 100;
    const total = beforeTax + tax;
    return { subtotal, expenses, beforeTax, tax, total };
  }, [items, showExpenses, expensesRate, taxRate]);

  const handlePrint = () => window.print();

  const validUntil = useMemo(() => {
    if (!issueDate || !validDays) return "";
    const d = new Date(issueDate);
    d.setDate(d.getDate() + parseInt(validDays));
    return d.toISOString().slice(0, 10);
  }, [issueDate, validDays]);

  const inputSm = "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-[13px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── 左カラム：入力フォーム ── */}
        <div className="space-y-4">
          {/* 基本情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">見積情報</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">見積番号</label>
                <input type="text" value={estimateNo} onChange={(e) => setEstimateNo(e.target.value)} placeholder="EST-2024-001" className={inputSm} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">発行日</label>
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputSm} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">有効期限</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="180" value={validDays} onChange={(e) => setValidDays(e.target.value)} className={`${inputSm} w-20`} />
                <span className="text-[13px] text-slate-500">日間{validUntil && <span className="ml-2 text-slate-400">（{validUntil}まで）</span>}</span>
              </div>
            </div>
          </div>

          {/* 施主情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施主・工事情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施主名</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="山田太郎　様" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事名</label>
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="○○邸リフォーム工事" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事場所</label>
              <input type="text" value={projectAddress} onChange={(e) => setProjectAddress(e.target.value)} placeholder="東京都○○区○○町1-2-3" className={inputSm} />
            </div>
          </div>

          {/* 施工会社情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施工会社情報（自動保存）</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">会社名</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="○○建設株式会社" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">住所</label>
              <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="東京都○○区○○町" className={inputSm} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">電話番号</label>
                <input type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="03-0000-0000" className={inputSm} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">メール</label>
                <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="info@example.com" className={inputSm} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">建設業許可番号（任意）</label>
              <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="国土交通大臣許可（特-00）第○○○○○号" className={inputSm} />
            </div>
          </div>

          {/* 消費税・諸経費 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">消費税・諸経費</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">消費税率</label>
              <div className="flex gap-2">
                {([10, 8, 0] as TaxRate[]).map((r) => (
                  <button key={r} onClick={() => setTaxRate(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      taxRate === r ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    {r === 0 ? "非課税" : `${r}%`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={showExpenses} onChange={(e) => setShowExpenses(e.target.checked)} className="rounded accent-blue-600" />
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">諸経費・現場管理費を加算する</span>
              </label>
              {showExpenses && (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-slate-500">工事費の</span>
                  <input type="number" min="0" max="50" step="1" value={expensesRate} onChange={(e) => setExpensesRate(e.target.value)} className={`${inputSm} w-20`} />
                  <span className="text-[13px] text-slate-500">%</span>
                </div>
              )}
            </div>
          </div>

          {/* 備考 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">備考・特記事項</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputSm} resize-none`} />
          </div>

          <button onClick={handlePrint}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-[15px] transition-colors flex items-center justify-center gap-2">
            🖨️ PDFで保存・印刷
          </button>
        </div>

        {/* ── 右カラム：明細＋プレビュー ── */}
        <div className="space-y-4">
          {/* 明細入力 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事明細</h3>
              <button onClick={addItem}
                className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                ＋ 明細追加
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice.replace(/,/g, "")) || 0);
                return (
                  <div key={item.id} className="border border-slate-100 dark:border-zinc-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{idx + 1}</span>
                      <select value={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)}
                        className={`${inputSm} text-[12px] flex-1`}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                    </div>
                    <input type="text" placeholder="工事内容・品名" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className={inputSm} />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex gap-1">
                        <input type="number" min="0" step="0.1" placeholder="数量" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} className={`${inputSm} flex-1 min-w-0`} />
                        <select value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className={`${inputSm} w-14`}>
                          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">¥</span>
                        <input type="text" inputMode="numeric" placeholder="単価" value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", e.target.value.replace(/[^\d,]/g, ""))}
                          className={`${inputSm} pl-5`} />
                      </div>
                      <div className="flex items-center justify-end text-[13px] font-semibold text-slate-700 dark:text-zinc-300">
                        ¥{fmt(amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 合計 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-2 text-[14px]">
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>工事費小計</span><span>¥{fmt(totals.subtotal)}</span>
            </div>
            {showExpenses && (
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>諸経費（{expensesRate}%）</span><span>¥{fmt(totals.expenses)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>消費税（{taxRate}%）</span><span>¥{fmt(totals.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white border-t border-slate-200 dark:border-zinc-700 pt-3 mt-2">
              <span>合計（税込）</span><span>¥{fmt(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 印刷CSS */}
      <style>{`
        @media print {
          body > * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
