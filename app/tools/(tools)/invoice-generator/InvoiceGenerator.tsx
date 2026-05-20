"use client";
import { useState, useEffect, useMemo } from "react";

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

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2000); };

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

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">明細</h3>
          <button onClick={addItem} className="text-sm font-medium text-blue-600 hover:text-blue-700">＋ 明細を追加</button>
        </div>
        <div className="space-y-2">
          {form.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder="品目" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} className="col-span-12 sm:col-span-5 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="number" placeholder="数量" value={item.qty} onChange={e => updateItem(item.id, "qty", Number(e.target.value))} className="col-span-3 sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="text" placeholder="単位" value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)} className="col-span-3 sm:col-span-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <input type="number" placeholder="単価" value={item.price} onChange={e => updateItem(item.id, "price", Number(e.target.value))} className="col-span-4 sm:col-span-3 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <button onClick={() => removeItem(item.id)} className="col-span-2 sm:col-span-1 text-slate-400 hover:text-red-500 text-sm" aria-label="削除">削除</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">消費税率(%)</label>
          <input type="number" value={form.taxRate} onChange={e => set("taxRate", Number(e.target.value))} className="w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
        </div>
      </div>

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">備考（任意）</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="お振込手数料は貴社負担にてお願い申し上げます。" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
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
            <div className="text-right text-sm text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-900">{form.issuerName || "発行者名"}</p>
              {form.issuerAddress && <p>{form.issuerAddress}</p>}
              {form.issuerPhone && <p>Tel: {form.issuerPhone}</p>}
              {form.issuerEmail && <p>{form.issuerEmail}</p>}
              {form.invoiceRegistrationNumber && <p className="text-xs">登録番号: {form.invoiceRegistrationNumber}</p>}
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
