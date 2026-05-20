"use client";
import { useState, useEffect } from "react";

const REASONS: Record<string, string> = {
  personal: "一身上の都合",
  family: "家庭の事情",
  health: "体調不良による療養のため",
  career: "キャリアチェンジのため",
};

type FormState = {
  docType: "退職届" | "退職願";
  name: string;
  companyName: string;
  ceoName: string;
  department: string;
  resignDate: string;
  submitDate: string;
  reason: string;
  customReason: string;
};

const defaultForm: FormState = {
  docType: "退職届",
  name: "",
  companyName: "",
  ceoName: "代表取締役社長",
  department: "",
  resignDate: "",
  submitDate: "",
  reason: "personal",
  customReason: "",
};

export function ResignationLetterGenerator() {
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    const saved = localStorage.getItem("resignation-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); return; } catch {}
    }
    const today = new Date();
    setForm(f => ({
      ...f,
      submitDate: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("resignation-form", JSON.stringify(form));
  }, [form]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm(f => ({ ...f, [key]: val }));

  const reasonText = form.reason === "custom" ? (form.customReason || "（理由を入力してください）") : REASONS[form.reason];

  return (
    <div className="space-y-6">
      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div className="flex gap-2">
          {(["退職届", "退職願"] as const).map(type => (
            <button
              key={type}
              onClick={() => set("docType", type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                form.docType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">氏名</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="山田 太郎" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">所属部署（任意）</label>
            <input type="text" value={form.department} onChange={e => set("department", e.target.value)} placeholder="営業部 第一営業課" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">会社名</label>
            <input type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="株式会社〇〇" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">宛名（代表者役職）</label>
            <input type="text" value={form.ceoName} onChange={e => set("ceoName", e.target.value)} placeholder="代表取締役社長" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">退職日</label>
            <input type="text" value={form.resignDate} onChange={e => set("resignDate", e.target.value)} placeholder="令和7年6月30日" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">提出日</label>
            <input type="text" value={form.submitDate} onChange={e => set("submitDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">退職理由</label>
          <select value={form.reason} onChange={e => set("reason", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white">
            {Object.entries(REASONS).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
            <option value="custom">自由入力</option>
          </select>
          {form.reason === "custom" && (
            <input type="text" value={form.customReason} onChange={e => set("customReason", e.target.value)} placeholder="退職理由を入力" className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          )}
        </div>
      </div>

      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={() => window.print()} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">🖨️ PDFで保存・印刷</button>
        <button onClick={() => { setForm(defaultForm); localStorage.removeItem("resignation-form"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">リセット</button>
      </div>

      <div className="print-area">
        <div className="bg-white shadow-lg rounded-xl p-10 sm:p-16 text-slate-900 mx-auto" style={{ minHeight: '297mm', maxWidth: '210mm', fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold" style={{ letterSpacing: '0.5em' }}>{form.docType.split('').join(' ')}</h1>
          </div>

          <div className="text-right mb-10 text-sm">
            <p>{form.submitDate || "令和　年　月　日"}</p>
          </div>

          <div className="mb-10 text-sm">
            <p>{form.companyName || "会社名"}</p>
            <p>{form.ceoName} 殿</p>
          </div>

          <div className="mb-12 text-sm leading-loose">
            <p style={{ textIndent: '2em' }}>私儀、{reasonText}により、誠に勝手ながら</p>
            <p style={{ textIndent: '2em' }}>{form.resignDate || "令和　年　月　日"}をもちまして{form.docType === "退職届" ? "退職いたしたく、ここにお届け申し上げます" : "退職いたしたく、お願い申し上げます"}。</p>
            <p className="text-center mt-4">以　上</p>
          </div>

          <div className="text-right text-sm">
            {form.department && <p>{form.department}</p>}
            <p>{form.name || "氏名"}　　　㊞</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
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
