"use client";
import { useState, useMemo } from "react";
import { Copy, Check, Printer } from "lucide-react";

type Career = { period: string; company: string; role: string; detail: string };
type Skill = { name: string; level: "初級" | "中級" | "上級" };

const SKILL_LEVELS = ["初級", "中級", "上級"] as const;

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

function InputField({
  label, value, onChange, placeholder, multiline = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none";
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {multiline
        ? <textarea className={cls} rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        : <input type="text" className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

export function ResumeBuilder() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [careers, setCareers] = useState<Career[]>([
    { period: "", company: "", role: "", detail: "" }
  ]);
  const [skills, setSkills] = useState<Skill[]>([
    { name: "", level: "中級" }
  ]);
  const [pr, setPr] = useState("");

  const addCareer = () => setCareers([...careers, { period: "", company: "", role: "", detail: "" }]);
  const removeCareer = (i: number) => setCareers(careers.filter((_, idx) => idx !== i));
  const updateCareer = (i: number, key: keyof Career, val: string) =>
    setCareers(careers.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  const addSkill = () => setSkills([...skills, { name: "", level: "中級" }]);
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, key: keyof Skill, val: string) =>
    setSkills(skills.map((s, idx) => idx === i ? { ...s, [key]: val as Skill["level"] } : s));

  // 職務経歴書テキスト生成
  const resumeText = useMemo(() => {
    const lines: string[] = [];
    lines.push("────────────────────────────────");
    lines.push("　　　　　職務経歴書");
    lines.push("────────────────────────────────");
    if (name) lines.push(`\n氏名：${name}`);
    if (summary) { lines.push("\n【職務要約】"); lines.push(summary); }
    if (careers.some((c) => c.company)) {
      lines.push("\n【職務経歴】");
      careers.forEach((c) => {
        if (!c.company) return;
        lines.push(`\n${c.period}　${c.company}`);
        if (c.role) lines.push(`役職：${c.role}`);
        if (c.detail) lines.push(`業務内容：\n${c.detail}`);
      });
    }
    const activeSkills = skills.filter((s) => s.name);
    if (activeSkills.length > 0) {
      lines.push("\n【スキル・資格】");
      activeSkills.forEach((s) => lines.push(`・${s.name}（${s.level}）`));
    }
    if (pr) { lines.push("\n【自己PR】"); lines.push(pr); }
    return lines.join("\n");
  }, [name, summary, careers, skills, pr]);

  const { copied, copy } = useCopy(resumeText);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* フォーム */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="font-bold text-slate-900 dark:text-white">基本情報</h2>
        <InputField label="氏名" value={name} onChange={setName} placeholder="山田 太郎" />
        <InputField label="職務要約（3〜5行が目安）" value={summary} onChange={setSummary}
          placeholder="Webエンジニアとして5年間、フロントエンド開発に従事してきました..." multiline />
      </div>

      {/* 職務経歴 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">職務経歴</h2>
          <button onClick={addCareer} className="text-sm text-blue-500 hover:text-blue-600 font-medium">+ 追加</button>
        </div>
        {careers.map((c, i) => (
          <div key={i} className="space-y-3 p-4 bg-slate-50 dark:bg-zinc-800 rounded-xl relative">
            {careers.length > 1 && (
              <button onClick={() => removeCareer(i)} className="absolute top-3 right-3 text-xs text-slate-400 hover:text-red-500">削除</button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <InputField label="在職期間" value={c.period} onChange={(v) => updateCareer(i, "period", v)} placeholder="2020年4月 〜 現在" />
              <InputField label="会社名" value={c.company} onChange={(v) => updateCareer(i, "company", v)} placeholder="株式会社〇〇" />
            </div>
            <InputField label="役職・職種" value={c.role} onChange={(v) => updateCareer(i, "role", v)} placeholder="フロントエンドエンジニア" />
            <InputField label="業務内容" value={c.detail} onChange={(v) => updateCareer(i, "detail", v)}
              placeholder="・Next.jsを用いたWebアプリ開発&#10;・チーム5名でアジャイル開発" multiline />
          </div>
        ))}
      </div>

      {/* スキル */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">スキル・資格</h2>
          <button onClick={addSkill} className="text-sm text-blue-500 hover:text-blue-600 font-medium">+ 追加</button>
        </div>
        {skills.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={s.name} onChange={(e) => updateSkill(i, "name", e.target.value)}
              placeholder="TypeScript"
              className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select value={s.level} onChange={(e) => updateSkill(i, "level", e.target.value)}
              className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            {skills.length > 1 && (
              <button onClick={() => removeSkill(i)} className="text-slate-400 hover:text-red-500 text-xs px-2">✕</button>
            )}
          </div>
        ))}
      </div>

      {/* 自己PR */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">自己PR</h2>
        <InputField label="自己PRを入力" value={pr} onChange={setPr}
          placeholder="問題解決力と継続的な学習姿勢を強みとしています..." multiline />
      </div>

      {/* プレビュー & コピー */}
      <div className="bg-slate-900 dark:bg-zinc-950 rounded-2xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white">プレビュー・コピー</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl transition-colors">
              <Printer className="w-4 h-4" />印刷
            </button>
            <button onClick={copy}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "コピー済！" : "全文コピー"}
            </button>
          </div>
        </div>
        <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono overflow-auto max-h-64">
          {resumeText || "左のフォームを入力すると、ここに職務経歴書が生成されます。"}
        </pre>
      </div>
    </div>
  );
}
