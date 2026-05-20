"use client";
import { useState, useEffect } from "react";

const TEMPLATES = {
  web: { name: "Web制作", work: "Webサイトの設計・デザイン・実装業務", price: "300,000" },
  video: { name: "動画編集", work: "動画の編集・エフェクト・書き出し業務", price: "50,000" },
  sns: { name: "SNS運用", work: "SNSアカウントの運用・投稿作成・分析業務", price: "80,000" },
  design: { name: "デザイン制作", work: "グラフィックデザイン・ロゴ・バナー制作業務", price: "150,000" },
  system: { name: "システム開発", work: "Webアプリケーション・システムの設計・開発業務", price: "500,000" },
};

type FormState = {
  template: string;
  clientName: string;
  contractorName: string;
  workContent: string;
  startDate: string;
  endDate: string;
  price: string;
  paymentDay: string;
  copyright: string;
  nda: string;
  notes: string;
  signDate: string;
};

const defaultForm: FormState = {
  template: "",
  clientName: "",
  contractorName: "",
  workContent: "",
  startDate: "",
  endDate: "",
  price: "",
  paymentDay: "末日",
  copyright: "発注者（甲）",
  nda: "あり",
  notes: "",
  signDate: "",
};

export function BusinessContractGenerator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [toastMsg, setToastMsg] = useState("");

  // LocalStorage 自動保存
  useEffect(() => {
    const saved = localStorage.getItem("business-contract-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch {}
    } else {
      setForm(f => ({ ...f, signDate: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("business-contract-form", JSON.stringify(form));
  }, [form]);

  const set = (key: keyof FormState, val: string) => setForm(f => ({ ...f, [key]: val }));

  const applyTemplate = (key: string) => {
    const t = TEMPLATES[key as keyof typeof TEMPLATES];
    if (t) setForm(f => ({ ...f, template: key, workContent: t.work, price: t.price }));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const handleCopy = () => {
    const text = generateText();
    navigator.clipboard.writeText(text).then(() => showToast("コピーしました"));
  };

  const handlePrint = () => window.print();

  const formatPrice = (p: string) => {
    const num = parseInt(p.replace(/,/g, ""), 10);
    return isNaN(num) ? p : num.toLocaleString("ja-JP");
  };

  const generateText = () => `業 務 委 託 契 約 書

発注者（以下「甲」）：${form.clientName || "　　　　　　　　"}
受注者（以下「乙」）：${form.contractorName || "　　　　　　　　"}

甲乙間において、以下の通り業務委託契約を締結する。

第1条（委託業務）
甲は乙に対し、以下の業務を委託する。
${form.workContent || "（業務内容を入力してください）"}

第2条（契約期間）
本契約の有効期間は${form.startDate || "令和　年　月　日"}から${form.endDate || "令和　年　月　日"}までとする。

第3条（委託料及び支払方法）
甲は乙に対し、本業務の委託料として金${formatPrice(form.price) || "　　　　　　"}円（消費税別）を支払うものとする。
支払日は毎月${form.paymentDay}とし、乙の指定する銀行口座へ振込む。

第4条（著作権）
本業務により生じた成果物の著作権及び知的財産権は、委託料の完済をもって${form.copyright}に帰属するものとする。

第5条（秘密保持）
${form.nda === "あり"
  ? "甲乙は本契約の履行にあたり知り得た相手方の業務上の秘密情報を、契約期間中及び契約終了後も第三者に開示・漏洩しないものとする。"
  : "本条項は適用しない。"}

第6条（再委託の禁止）
乙は、甲の書面による承諾なく、本業務の全部または一部を第三者に再委託することはできない。

第7条（契約解除）
甲乙いずれかが本契約に違反した場合、相手方は書面にて通知の上、本契約を解除することができる。

${form.notes ? `第8条（特記事項）\n${form.notes}\n\n` : ""}
　　　${form.signDate} 締結

甲（発注者）署名：＿＿＿＿＿＿＿＿＿＿＿＿＿＿

乙（受注者）署名：＿＿＿＿＿＿＿＿＿＿＿＿＿＿`;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          {toastMsg}
        </div>
      )}

      {/* テンプレート選択 */}
      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">テンプレートから始める</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => applyTemplate(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                form.template === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 入力フォーム */}
      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">基本情報</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">発注者名（甲）</label>
            <input type="text" value={form.clientName} onChange={e => set("clientName", e.target.value)} placeholder="〇〇株式会社" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">受注者名（乙）</label>
            <input type="text" value={form.contractorName} onChange={e => set("contractorName", e.target.value)} placeholder="山田 太郎" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">業務内容</label>
          <textarea value={form.workContent} onChange={e => set("workContent", e.target.value)} placeholder="委託する業務の内容を具体的に記載してください" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">契約開始日</label>
            <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">契約終了日</label>
            <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">報酬金額（円）</label>
            <input type="text" value={form.price} onChange={e => set("price", e.target.value)} placeholder="300,000" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">支払日</label>
            <input type="text" value={form.paymentDay} onChange={e => set("paymentDay", e.target.value)} placeholder="末日 / 25日" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">著作権帰属</label>
            <select value={form.copyright} onChange={e => set("copyright", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>発注者（甲）</option>
              <option>受注者（乙）</option>
              <option>甲乙共有</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">秘密保持条項</label>
            <select value={form.nda} onChange={e => set("nda", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="あり">あり（秘密保持義務を設ける）</option>
              <option value="なし">なし</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">その他特記事項（任意）</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="その他合意した条件を記載してください" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">締結日</label>
          <input type="text" value={form.signDate} onChange={e => set("signDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={handlePrint} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
          🖨️ PDFで保存・印刷
        </button>
        <button onClick={handleCopy} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors">
          📋 テキストをコピー
        </button>
        <button onClick={() => { setForm(defaultForm); localStorage.removeItem("business-contract-form"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">
          リセット
        </button>
      </div>

      {/* プレビュー */}
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
