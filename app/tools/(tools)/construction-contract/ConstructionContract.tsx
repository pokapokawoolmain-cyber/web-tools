"use client";
import { useState, useMemo } from "react";
import { Printer, Copy, CheckCircle2 } from "lucide-react";

type ContractData = {
  // 発注者
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  // 請負者（施工会社）
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  licenseNo: string;
  representativeName: string;
  // 工事情報
  constructionName: string;
  siteAddress: string;
  contractAmount: string;
  taxRate: "10" | "8" | "0";
  // 工期
  startDate: string;
  endDate: string;
  // 支払条件
  paymentMethod: string;
  depositRate: string;
  intermediateRate: string;
  completionRate: string;
  // 保証
  defectWarranty: string;
  // 特約
  specialTerms: string;
  // 契約日
  contractDate: string;
};

const PAYMENT_METHODS = [
  "銀行振込（指定口座）",
  "現金",
  "銀行振込または現金",
];

const DEFECT_WARRANTIES = [
  "木造住宅（雨水浸入・主要構造部）：10年",
  "外壁塗装：施工保証2年・塗膜保証5年",
  "防水工事：施工保証5年・防水保証10年",
  "リフォーム工事全般：施工保証1年",
];

function formatAmount(val: string): number {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

function fmtMoney(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function ConstructionContract() {
  const [data, setData] = useState<ContractData>({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    licenseNo: "",
    representativeName: "",
    constructionName: "",
    siteAddress: "",
    contractAmount: "",
    taxRate: "10",
    startDate: "",
    endDate: "",
    paymentMethod: "銀行振込（指定口座）",
    depositRate: "30",
    intermediateRate: "40",
    completionRate: "30",
    defectWarranty: "外壁塗装：施工保証2年・塗膜保証5年",
    specialTerms: "",
    contractDate: new Date().toISOString().slice(0, 10),
  });
  const [copied, setCopied] = useState(false);

  const set = (key: keyof ContractData, val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const amounts = useMemo(() => {
    const base = formatAmount(data.contractAmount);
    const taxRate = parseInt(data.taxRate);
    const tax = Math.round(base * taxRate / 100);
    const total = base + tax;
    const deposit = Math.round(total * parseInt(data.depositRate) / 100);
    const intermediate = Math.round(total * parseInt(data.intermediateRate) / 100);
    const completion = total - deposit - intermediate;
    return { base, tax, total, deposit, intermediate, completion };
  }, [data.contractAmount, data.taxRate, data.depositRate, data.intermediateRate]);

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    const text = generateContractText(data, amounts);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputSm = "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-[13px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 20mm 15mm; }
          body > *:not(#contract-print) { display: none !important; }
          #contract-print { display: block !important; font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif; }
        }
      `}</style>

      {/* 印刷専用DOM */}
      <div id="contract-print" className="hidden print:block">
        <ContractPrintView data={data} amounts={amounts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左：入力フォーム */}
        <div className="space-y-4">
          {/* 発注者 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">発注者（施主）情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">氏名・会社名</label>
              <input type="text" value={data.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="山田 太郎" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">住所</label>
              <input type="text" value={data.clientAddress} onChange={(e) => set("clientAddress", e.target.value)} placeholder="東京都○○区○○町1-2-3" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">電話番号</label>
              <input type="tel" value={data.clientPhone} onChange={(e) => set("clientPhone", e.target.value)} placeholder="03-0000-0000" className={inputSm} />
            </div>
          </div>

          {/* 請負者 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">請負者（施工会社）情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">会社名</label>
              <input type="text" value={data.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="○○建設株式会社" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">代表者名</label>
              <input type="text" value={data.representativeName} onChange={(e) => set("representativeName", e.target.value)} placeholder="代表取締役 田中 一郎" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">住所</label>
              <input type="text" value={data.companyAddress} onChange={(e) => set("companyAddress", e.target.value)} placeholder="東京都○○区○○町" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">電話番号</label>
              <input type="tel" value={data.companyPhone} onChange={(e) => set("companyPhone", e.target.value)} placeholder="03-0000-0000" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">建設業許可番号</label>
              <input type="text" value={data.licenseNo} onChange={(e) => set("licenseNo", e.target.value)} placeholder="国土交通大臣許可（般-00）第○○○○○号" className={inputSm} />
            </div>
          </div>
        </div>

        {/* 右：工事・金額・支払 */}
        <div className="space-y-4">
          {/* 工事情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事名</label>
              <input type="text" value={data.constructionName} onChange={(e) => set("constructionName", e.target.value)} placeholder="○○邸 外壁塗装工事" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事場所</label>
              <input type="text" value={data.siteAddress} onChange={(e) => set("siteAddress", e.target.value)} placeholder="東京都○○区○○町1-2-3" className={inputSm} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">着工予定日</label>
                <input type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputSm} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">完工予定日</label>
                <input type="date" value={data.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputSm} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">契約日</label>
              <input type="date" value={data.contractDate} onChange={(e) => set("contractDate", e.target.value)} className={inputSm} />
            </div>
          </div>

          {/* 金額 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">請負金額</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事金額（税抜）</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">¥</span>
                <input type="text" inputMode="numeric" value={data.contractAmount}
                  onChange={(e) => set("contractAmount", e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="1,500,000" className={`${inputSm} pl-6`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">消費税率</label>
              <div className="flex gap-2">
                {(["10", "8", "0"] as const).map((r) => (
                  <button key={r} onClick={() => set("taxRate", r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${data.taxRate === r ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"}`}>
                    {r === "0" ? "非課税" : `${r}%`}
                  </button>
                ))}
              </div>
            </div>
            {amounts.base > 0 && (
              <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 p-3 text-[13px] space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400"><span>税抜金額</span><span>¥{fmtMoney(amounts.base)}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400"><span>消費税（{data.taxRate}%）</span><span>¥{fmtMoney(amounts.tax)}</span></div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-zinc-700 pt-1 mt-1"><span>合計（税込）</span><span>¥{fmtMoney(amounts.total)}</span></div>
              </div>
            )}
          </div>

          {/* 支払条件 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">支払条件</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">支払方法</label>
              <select value={data.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={inputSm}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">支払割合（%）</label>
              <div className="grid grid-cols-3 gap-2">
                {(["depositRate", "intermediateRate", "completionRate"] as const).map((key, i) => {
                  const labels = ["着手金", "中間金", "完成時"];
                  return (
                    <div key={key}>
                      <label className="block text-[11px] text-slate-400 dark:text-zinc-500 mb-1">{labels[i]}</label>
                      <div className="relative">
                        <input type="number" min="0" max="100" value={data[key]} onChange={(e) => set(key, e.target.value)} className={`${inputSm} pr-6`} />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]">%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {amounts.total > 0 && (
                <div className="mt-2 text-[12px] text-slate-500 dark:text-zinc-400 space-y-0.5">
                  <div>着手金：¥{fmtMoney(amounts.deposit)} / 中間金：¥{fmtMoney(amounts.intermediate)} / 完成時：¥{fmtMoney(amounts.completion)}</div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">契約不適合責任（保証）</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {DEFECT_WARRANTIES.map((w) => (
                  <button key={w} onClick={() => set("defectWarranty", w)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 transition-colors">
                    {w.split("：")[0]}
                  </button>
                ))}
              </div>
              <input type="text" value={data.defectWarranty} onChange={(e) => set("defectWarranty", e.target.value)} className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">特約事項（任意）</label>
              <textarea rows={3} value={data.specialTerms} onChange={(e) => set("specialTerms", e.target.value)}
                placeholder="例：近隣トラブルが発生した場合は両者協議の上解決する。"
                className={`${inputSm} resize-none`} />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-semibold text-[14px] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              {copied ? <><CheckCircle2 className="w-4 h-4 text-green-500" />コピー済み</> : <><Copy className="w-4 h-4" />テキストコピー</>}
            </button>
            <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] transition-colors">
              <Printer className="w-4 h-4" />PDF保存・印刷
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateContractText(data: ContractData, amounts: { base: number; tax: number; total: number; deposit: number; intermediate: number; completion: number }): string {
  return [
    "工事請負契約書",
    "",
    `契約日：${data.contractDate}`,
    "",
    "【発注者】",
    `氏名：${data.clientName}`,
    `住所：${data.clientAddress}`,
    `電話：${data.clientPhone}`,
    "",
    "【請負者】",
    `会社名：${data.companyName}`,
    `代表者：${data.representativeName}`,
    `住所：${data.companyAddress}`,
    `電話：${data.companyPhone}`,
    data.licenseNo ? `建設業許可番号：${data.licenseNo}` : "",
    "",
    "【工事内容】",
    `工事名：${data.constructionName}`,
    `工事場所：${data.siteAddress}`,
    `工期：${data.startDate} 〜 ${data.endDate}`,
    "",
    "【請負金額】",
    `工事金額（税抜）：¥${amounts.base.toLocaleString()}`,
    `消費税（${data.taxRate}%）：¥${amounts.tax.toLocaleString()}`,
    `合計（税込）：¥${amounts.total.toLocaleString()}`,
    "",
    "【支払条件】",
    `支払方法：${data.paymentMethod}`,
    `着手金：¥${amounts.deposit.toLocaleString()}（${data.depositRate}%）`,
    `中間金：¥${amounts.intermediate.toLocaleString()}（${data.intermediateRate}%）`,
    `完成時：¥${amounts.completion.toLocaleString()}（残額）`,
    "",
    "【契約不適合責任】",
    data.defectWarranty,
    data.specialTerms ? `\n【特約事項】\n${data.specialTerms}` : "",
  ].filter(Boolean).join("\n");
}

function ContractPrintView({ data, amounts }: { data: ContractData; amounts: { base: number; tax: number; total: number; deposit: number; intermediate: number; completion: number } }) {
  const cell = (label: string, value: string) => (
    <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", padding: "6px 0" }}>
      <div style={{ width: "140px", flexShrink: 0, color: "#64748b", fontSize: "12px" }}>{label}</div>
      <div style={{ flex: 1, fontSize: "13px", color: "#1e293b" }}>{value || "　"}</div>
    </div>
  );
  return (
    <div style={{ border: "2px solid #1e293b", padding: "24px 28px" }}>
      <h1 style={{ textAlign: "center", fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>工事請負契約書</h1>
      <p style={{ textAlign: "center", fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>
        発注者（以下「甲」）と請負者（以下「乙」）は、以下の条件で工事請負契約を締結する。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", marginBottom: "20px" }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>甲（発注者）</div>
          {cell("氏名・会社名", data.clientName)}
          {cell("住所", data.clientAddress)}
          {cell("電話", data.clientPhone)}
        </div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>乙（請負者）</div>
          {cell("会社名", data.companyName)}
          {cell("代表者", data.representativeName)}
          {cell("住所", data.companyAddress)}
          {cell("電話", data.companyPhone)}
          {cell("建設業許可番号", data.licenseNo)}
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>工事内容</div>
        {cell("工事名", data.constructionName)}
        {cell("工事場所", data.siteAddress)}
        {cell("着工予定日", data.startDate)}
        {cell("完工予定日", data.endDate)}
        {cell("契約日", data.contractDate)}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>請負金額</div>
        {cell("工事金額（税抜）", `¥${amounts.base.toLocaleString()}`)}
        {cell(`消費税（${data.taxRate}%）`, `¥${amounts.tax.toLocaleString()}`)}
        {cell("合計（税込）", `¥${amounts.total.toLocaleString()}`)}
        {cell("支払方法", data.paymentMethod)}
        {cell("着手金", `¥${amounts.deposit.toLocaleString()}（${data.depositRate}%）`)}
        {cell("中間金", `¥${amounts.intermediate.toLocaleString()}（${data.intermediateRate}%）`)}
        {cell("完成時払い", `¥${amounts.completion.toLocaleString()}（残額）`)}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>契約不適合責任</div>
        <div style={{ padding: "8px 12px", fontSize: "13px", color: "#1e293b" }}>{data.defectWarranty}</div>
      </div>
      {data.specialTerms && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "bold", fontSize: "13px", background: "#f1f5f9", padding: "4px 8px", marginBottom: "4px" }}>特約事項</div>
          <div style={{ padding: "8px 12px", fontSize: "13px", color: "#1e293b", whiteSpace: "pre-wrap" }}>{data.specialTerms}</div>
        </div>
      )}
      <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ border: "1px solid #e2e8f0", padding: "12px 16px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
          <div style={{ marginBottom: "8px" }}>甲（発注者）署名・捺印</div>
          <div style={{ height: "50px" }}></div>
          <div>{data.clientName}</div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", padding: "12px 16px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
          <div style={{ marginBottom: "8px" }}>乙（請負者）署名・捺印</div>
          <div style={{ height: "50px" }}></div>
          <div>{data.companyName}</div>
        </div>
      </div>
      <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginTop: "16px" }}>本契約書は2通作成し、甲乙各1通を保管する。</p>
    </div>
  );
}
