"use client";
import { useState, useEffect } from "react";

type FormState = {
  discloser: string;
  recipient: string;
  secretDefinition: string;
  purpose: string;
  startDate: string;
  endDate: string;
  ndaYears: string;
  signDate: string;
};

const defaultForm: FormState = {
  discloser: "",
  recipient: "",
  secretDefinition: "本契約に関連して開示される技術情報・営業情報・顧客情報・その他一切の業務上の情報",
  purpose: "",
  startDate: "",
  endDate: "",
  ndaYears: "3",
  signDate: "",
};

export function NdaGenerator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nda-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch {}
    } else {
      setForm(f => ({ ...f, signDate: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nda-form", JSON.stringify(form));
  }, [form]);

  const set = (key: keyof FormState, val: string) => setForm(f => ({ ...f, [key]: val }));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const generateText = () => `秘 密 保 持 契 約 書

開示者（以下「甲」）：${form.discloser || "　　　　　　　　"}
受領者（以下「乙」）：${form.recipient || "　　　　　　　　"}

甲乙間において、以下の通り秘密保持契約を締結する。

第1条（秘密情報の定義）
本契約における「秘密情報」とは、${form.secretDefinition}をいう。ただし、以下に該当するものは秘密情報から除外する。
(1) 開示時点で既に公知のもの
(2) 開示後、受領者の責によらず公知となったもの
(3) 受領者が独自に開発したもの
(4) 法令により開示が義務付けられたもの

第2条（目的）
乙は、秘密情報を${form.purpose || "（使用目的を入力してください）"}の目的でのみ使用するものとする。

第3条（秘密保持義務）
乙は、甲から開示された秘密情報を、甲の書面による事前承諾なくして第三者に開示・漏洩してはならない。乙は、秘密情報の取扱について、自己の機密情報と同等以上の注意義務をもってこれを管理する。

第4条（契約期間）
本契約の有効期間は${form.startDate || "令和　年　月　日"}から${form.endDate || "令和　年　月　日"}までとする。

第5条（秘密保持義務の存続）
前条にかかわらず、本契約に基づく秘密保持義務は本契約終了後${form.ndaYears}年間存続するものとする。

第6条（秘密情報の返還・破棄）
本契約の終了又は甲の請求があったときは、乙は、保有する全ての秘密情報及びその複製物を、甲の指示に従い速やかに返還又は破棄するものとする。

第7条（損害賠償）
乙が本契約に違反したことにより甲に損害を与えた場合、乙はその損害を賠償する責を負う。

第8条（協議事項）
本契約に定めのない事項又は本契約の解釈に疑義が生じた場合、甲乙は誠意をもって協議の上、これを解決するものとする。

　　　${form.signDate} 締結

甲（開示者）署名：＿＿＿＿＿＿＿＿＿＿＿＿＿＿

乙（受領者）署名：＿＿＿＿＿＿＿＿＿＿＿＿＿＿`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generateText()).then(() => showToast("コピーしました"));
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">{toastMsg}</div>
      )}

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">基本情報</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">開示者名（甲）</label>
            <input type="text" value={form.discloser} onChange={e => set("discloser", e.target.value)} placeholder="〇〇株式会社" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">受領者名（乙）</label>
            <input type="text" value={form.recipient} onChange={e => set("recipient", e.target.value)} placeholder="△△株式会社" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">秘密情報の定義</label>
          <textarea value={form.secretDefinition} onChange={e => set("secretDefinition", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">使用目的</label>
          <textarea value={form.purpose} onChange={e => set("purpose", e.target.value)} placeholder="新規業務委託の検討、共同事業の検討 など" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">契約開始日</label>
            <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">契約終了日</label>
            <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">終了後の存続期間（年）</label>
            <input type="number" value={form.ndaYears} onChange={e => set("ndaYears", e.target.value)} min="1" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">締結日</label>
          <input type="text" value={form.signDate} onChange={e => set("signDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={() => window.print()} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">🖨️ PDFで保存・印刷</button>
        <button onClick={handleCopy} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors">📋 テキストをコピー</button>
        <button onClick={() => { setForm(defaultForm); localStorage.removeItem("nda-form"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">リセット</button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden print-area">
        <div className="no-print bg-slate-50 dark:bg-zinc-800 px-5 py-3 border-b border-slate-200 dark:border-zinc-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">プレビュー</p>
        </div>
        <div className="p-8 bg-white">
          <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed" style={{ fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
            {generateText()}
          </pre>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
