"use client";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

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
  return { id: crypto.randomUUID(), category: "木工事", description: "", unit: "式", quantity: "1", unitPrice: "" };
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

const STORAGE_KEY = "construction-estimate-v2";

export function ConstructionEstimate() {
  const [mounted, setMounted] = useState(false);
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
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");
  const [notes, setNotes] = useState("工事期間中は安全管理を徹底し、近隣への配慮を行います。");
  const [items, setItems] = useState<LineItem[]>([newItem()]);

  useEffect(() => {
    setMounted(true);
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
    setIssueDate(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ companyName, companyAddress, companyPhone, companyEmail, licenseNo }));
    } catch { /* ignore */ }
  }, [companyName, companyAddress, companyPhone, companyEmail, licenseNo]);

  const updateItem = (id: string, field: keyof LineItem, value: string) =>
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));

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
    const discount = showDiscount ? parseFloat(discountAmount.replace(/,/g, "")) || 0 : 0;
    const beforeTax = Math.max(0, subtotal + expenses - discount);
    const tax = beforeTax * taxRate / 100;
    const total = beforeTax + tax;
    return { subtotal, expenses, discount, beforeTax, tax, total };
  }, [items, showExpenses, expensesRate, showDiscount, discountAmount, taxRate]);

  const validUntil = useMemo(() => {
    if (!issueDate || !validDays) return "";
    const d = new Date(issueDate);
    d.setDate(d.getDate() + parseInt(validDays));
    return d.toISOString().slice(0, 10);
  }, [issueDate, validDays]);

  const inputSm = "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-[13px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // 印刷専用DOMをbody直下にportalで配置 → body > *:not(#id)セレクタが確実に機能する
  const printDom = (
    <div id="estimate-print-root" style={{ display: "none" }}>
      <div style={{ fontFamily: '"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif', fontSize: "12px" }}>
        <div style={{ border: "2px solid #1e293b", padding: "20px 24px" }}>
          <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "2px" }}>工事見積書</h1>
          {estimateNo && <p style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>見積番号：{estimateNo}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", marginBottom: "16px" }}>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#475569" }}>【発行先】</div>
              <div style={{ fontSize: "15px", fontWeight: "bold" }}>{clientName || "○○　様"}</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                <div>工事名：{projectName}</div>
                <div>工事場所：{projectAddress}</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>{companyName}</div>
              {companyAddress && <div>{companyAddress}</div>}
              {companyPhone && <div>TEL: {companyPhone}</div>}
              {companyEmail && <div>{companyEmail}</div>}
              {licenseNo && <div style={{ marginTop: "4px", fontSize: "10px" }}>{licenseNo}</div>}
              <div style={{ marginTop: "8px" }}>発行日：{issueDate}</div>
              {validUntil && <div>有効期限：{validUntil}（{validDays}日間）</div>}
            </div>
          </div>

          <div style={{ background: "#1e293b", color: "#fff", textAlign: "center", padding: "6px", fontWeight: "bold", fontSize: "15px", marginBottom: "4px" }}>
            合計金額（税込）　¥{fmt(totals.total)}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "11px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {["No", "工種", "工事内容・品名", "数量", "単位", "単価（円）", "金額（円）"].map((h) => (
                  <th key={h} style={{ border: "1px solid #e2e8f0", padding: "5px 6px", textAlign: "center", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const amt = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice.replace(/,/g, "")) || 0);
                return (
                  <tr key={item.id}>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "center", color: "#94a3b8" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", whiteSpace: "nowrap" }}>{item.category}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>{item.description}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "right" }}>{item.quantity}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "center" }}>{item.unit}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "right" }}>{item.unitPrice ? fmt(parseFloat(item.unitPrice.replace(/,/g, ""))) : ""}</td>
                    <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "right", fontWeight: amt > 0 ? "600" : "normal" }}>{amt > 0 ? fmt(amt) : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <div style={{ width: "240px", fontSize: "12px" }}>
              {[
                { label: "工事費小計", value: fmt(totals.subtotal) },
                ...(showExpenses ? [{ label: `諸経費（${expensesRate}%）`, value: fmt(totals.expenses) }] : []),
                ...(showDiscount && totals.discount > 0 ? [{ label: "値引き", value: `▲${fmt(totals.discount)}` }] : []),
                { label: `消費税（${taxRate}%）`, value: fmt(totals.tax) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", padding: "3px 0", color: "#64748b" }}>
                  <span>{label}</span><span>¥{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #1e293b", marginTop: "4px", paddingTop: "4px", fontWeight: "bold", fontSize: "14px" }}>
                <span>合計（税込）</span><span>¥{fmt(totals.total)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ background: "#f1f5f9", padding: "3px 10px", fontWeight: "bold", fontSize: "11px", color: "#475569" }}>備考・特記事項</div>
              <div style={{ padding: "6px 10px", whiteSpace: "pre-wrap", lineHeight: "1.7", fontSize: "11px" }}>{notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 印刷CSS: body直下にportalするため body > *:not(#id) が正確に機能する */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 15mm 12mm; }
          body > *:not(#estimate-print-root) { display: none !important; }
          #estimate-print-root {
            display: block !important;
            font-family: "Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;
          }
        }
      `}</style>

      {mounted && createPortal(printDom, document.body)}

      {/* 通常UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左：設定 */}
        <div className="space-y-4">
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

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施工会社情報<span className="text-[11px] text-slate-400 font-normal ml-1">（自動保存）</span></h3>
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
              <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="国土交通大臣許可（般-00）第○○○○○号" className={inputSm} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">消費税・諸経費・値引き</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">消費税率</label>
              <div className="flex gap-2">
                {([10, 8, 0] as TaxRate[]).map((r) => (
                  <button key={r} onClick={() => setTaxRate(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${taxRate === r ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"}`}>
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
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={showDiscount} onChange={(e) => setShowDiscount(e.target.checked)} className="rounded accent-blue-600" />
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">値引きを設定する</span>
              </label>
              {showDiscount && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">▲¥</span>
                  <input type="text" inputMode="numeric" placeholder="値引き金額" value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value.replace(/[^\d,]/g, ""))}
                    className={`${inputSm} pl-7`} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">備考・特記事項</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputSm} resize-none`} />
          </div>

          <button onClick={() => window.print()}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-[15px] transition-colors flex items-center justify-center gap-2">
            🖨️ PDF保存・印刷
          </button>
          <p className="text-center text-[12px] text-slate-400">印刷ダイアログで「PDFに保存」を選択するとPDFが作成されます</p>
        </div>

        {/* 右：明細 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事明細</h3>
              <button onClick={addItem} className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">＋ 明細追加</button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice.replace(/,/g, "")) || 0);
                return (
                  <div key={item.id} className="border border-slate-100 dark:border-zinc-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">{idx + 1}</span>
                      <select value={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)} className={`${inputSm} text-[12px] flex-1`}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0">×</button>
                    </div>
                    <input type="text" placeholder="工事内容・品名（例：南面外壁下塗り）" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className={inputSm} />
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

          {/* 合計サマリ */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-2 text-[14px]">
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>工事費小計</span><span>¥{fmt(totals.subtotal)}</span>
            </div>
            {showExpenses && (
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>諸経費（{expensesRate}%）</span><span>¥{fmt(totals.expenses)}</span>
              </div>
            )}
            {showDiscount && totals.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>値引き</span><span>▲¥{fmt(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>消費税（{taxRate}%）</span><span>¥{fmt(totals.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white border-t border-slate-200 dark:border-zinc-700 pt-3 mt-2">
              <span>合計（税込）</span><span>¥{fmt(totals.total)}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 p-4">
            <p className="text-[12px] text-blue-700 dark:text-blue-400 font-semibold mb-1">使い方のヒント</p>
            <ul className="text-[12px] text-blue-600 dark:text-blue-500 space-y-1">
              <li>・「PDF保存・印刷」ボタンで見積書をPDF出力できます</li>
              <li>・施工会社情報は入力後にブラウザへ自動保存されます（次回から省略可）</li>
              <li>・値引きは「消費税・諸経費・値引き」パネルから設定できます</li>
              <li>・明細行の数量・単価は半角数字で入力してください</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
