"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import {
  PREFECTURES,
  type BusinessType, type Industry, type EmployeeCount,
  type Purpose, type InvestmentAmount, type HiringPlan,
  type WageIncreasePlan, type DiagnosisInput, serializeInput,
} from "@/data/subsidies";

const TOTAL_STEPS = 8;
type FormState = Partial<DiagnosisInput> & { purposes: Purpose[] };

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
          STEP {current + 1} / {total}
        </span>
        <span className="text-[11px] font-bold text-blue-500">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard<T extends string>({
  value, label, selected, onClick, multi,
}: { value: T; label?: string; selected: boolean; onClick: () => void; multi?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-[15px] font-medium flex items-center gap-3 min-h-[52px] active:scale-[0.98] ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
          : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:border-blue-700 dark:hover:bg-blue-900/10"
      }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-${multi ? "md" : "full"} border-2 flex items-center justify-center transition-all ${
        selected ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-zinc-600"
      }`}>
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </span>
      <span className="flex-1">{label ?? value}</span>
    </button>
  );
}

const STEP_META = [
  { title: "事業形態を教えてください", desc: "補助金・助成金によって対象となる事業者の種類が異なります" },
  { title: "事業所の所在地", desc: "地域によって使える補助金が異なる場合があります" },
  { title: "業種を教えてください", desc: "最も近いものを1つ選択してください" },
  { title: "従業員数（役員除く）", desc: "パート・アルバイト含む従業員数をお答えください" },
  { title: "やりたいことを選んでください", desc: "複数選択できます（1つ以上）" },
  { title: "投資・支出の予定額", desc: "補助金・助成金の対象となる費用の目安を選んでください" },
  { title: "雇用の予定はありますか？", desc: "新規採用・正社員化などの予定をお答えください" },
  { title: "賃上げの予定はありますか？", desc: "従業員の給与引き上げ予定をお答えください" },
];

export function DiagnosisForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ purposes: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };
  const togglePurpose = (p: Purpose) => {
    setForm((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(p) ? prev.purposes.filter((x) => x !== p) : [...prev.purposes, p],
    }));
    setError("");
  };

  const validate = (): boolean => {
    const msgs: Record<number, string> = {
      0: "事業形態を選択してください",
      1: "都道府県を選択してください",
      2: "業種を選択してください",
      3: "従業員数を選択してください",
      4: "1つ以上選択してください",
      5: "投資予定額を選択してください",
      6: "雇用予定を選択してください",
      7: "賃上げ予定を選択してください",
    };
    const checks: Record<number, boolean> = {
      0: !!form.businessType, 1: !!form.prefecture, 2: !!form.industry,
      3: !!form.employeeCount, 4: form.purposes.length > 0,
      5: !!form.investmentAmount, 6: !!form.hiringPlan, 7: !!form.wageIncreasePlan,
    };
    if (!checks[step]) { setError(msgs[step]); return false; }
    return true;
  };

  const next = async () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      const input: DiagnosisInput = {
        businessType: form.businessType!,
        prefecture: form.prefecture!,
        city: form.city,
        industry: form.industry!,
        employeeCount: form.employeeCount!,
        purposes: form.purposes,
        investmentAmount: form.investmentAmount!,
        hiringPlan: form.hiringPlan!,
        wageIncreasePlan: form.wageIncreasePlan!,
      };
      router.push(`/subsidy/result?d=${serializeInput(input)}`);
    }
  };
  const prev = () => { setStep((s) => s - 1); setError(""); };

  const meta = STEP_META[step];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <ProgressBar current={step} total={TOTAL_STEPS} />
        <h2 className="text-[17px] sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{meta.title}</h2>
        <p className="text-[12px] text-slate-400 dark:text-zinc-500">{meta.desc}</p>
      </div>

      {/* ボディ */}
      <div className="px-5 sm:px-6 py-5">

        {/* Step 0: 事業形態 */}
        {step === 0 && (
          <div className="space-y-2.5">
            {(["法人", "個人事業主", "創業予定", "個人・家庭"] as BusinessType[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.businessType === v} onClick={() => set("businessType", v)} />
            ))}
          </div>
        )}

        {/* Step 1: 所在地 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                都道府県 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.prefecture ?? ""}
                onChange={(e) => set("prefecture", e.target.value)}
                className="input-base text-[15px]"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                市区町村 <span className="text-slate-300 dark:text-zinc-600 font-normal">（任意）</span>
              </label>
              <input
                type="text"
                value={form.city ?? ""}
                onChange={(e) => set("city", e.target.value)}
                placeholder="例：渋谷区"
                className="input-base text-[15px]"
              />
            </div>
          </div>
        )}

        {/* Step 2: 業種 */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {(["飲食","美容","小売","建設","IT","士業","医療・介護","教育","製造","その他"] as Industry[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.industry === v} onClick={() => set("industry", v)} />
            ))}
          </div>
        )}

        {/* Step 3: 従業員数 */}
        {step === 3 && (
          <div className="space-y-2.5">
            {(["0人","1〜5人","6〜20人","21〜50人","51人以上"] as EmployeeCount[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.employeeCount === v} onClick={() => set("employeeCount", v)} />
            ))}
          </div>
        )}

        {/* Step 4: やりたいこと（複数選択） */}
        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(["ホームページ制作","広告・販路開拓","店舗改装","設備投資","IT導入","AI導入","省力化","採用","賃上げ","研修","事業承継","新規事業","海外展開"] as Purpose[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.purposes.includes(v)} onClick={() => togglePurpose(v)} multi />
            ))}
          </div>
        )}

        {/* Step 5: 投資予定額 */}
        {step === 5 && (
          <div className="space-y-2.5">
            {(["〜10万円","10〜50万円","50〜100万円","100〜500万円","500万円以上"] as InvestmentAmount[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.investmentAmount === v} onClick={() => set("investmentAmount", v)} />
            ))}
          </div>
        )}

        {/* Step 6: 雇用予定 */}
        {step === 6 && (
          <div className="space-y-2.5">
            {(["あり","なし","未定"] as HiringPlan[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.hiringPlan === v} onClick={() => set("hiringPlan", v)} />
            ))}
          </div>
        )}

        {/* Step 7: 賃上げ予定 */}
        {step === 7 && (
          <div className="space-y-2.5">
            {(["あり","なし","未定"] as WageIncreasePlan[]).map((v) => (
              <OptionCard key={v} value={v} selected={form.wageIncreasePlan === v} onClick={() => set("wageIncreasePlan", v)} />
            ))}
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="flex items-center gap-2 mt-4 text-red-600 dark:text-red-400 text-[13px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}
      </div>

      {/* フッターナビ */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800 pt-4">
        {step > 0 ? (
          <button type="button" onClick={prev}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700 transition-all text-[13px] font-medium min-h-[48px]">
            <ChevronLeft className="w-4 h-4" />戻る
          </button>
        ) : <div />}

        <button type="button" onClick={next} disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-[14px] transition-all shadow-sm min-h-[48px] min-w-[120px]">
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />診断中…</>
          ) : step === TOTAL_STEPS - 1 ? (
            <><CheckCircle2 className="w-4 h-4" />診断結果を見る</>
          ) : (
            <>次へ<ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
