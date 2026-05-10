"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

type Grade = "S" | "A" | "B" | "C" | "D" | "F";

const GRADE_POINTS: Record<Grade, number> = {
  S: 4.5,
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

const GRADES: Grade[] = ["S", "A", "B", "C", "D", "F"];

type Subject = {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
};

let counter = 0;
function newId() {
  return `s-${++counter}`;
}

function initialSubjects(): Subject[] {
  return [
    { id: newId(), name: "", credits: 2, grade: "A" },
    { id: newId(), name: "", credits: 2, grade: "B" },
  ];
}

function getGpaLabel(gpa: number): { label: string; color: string } {
  if (gpa >= 3.5) return { label: "優秀", color: "text-emerald-500" };
  if (gpa >= 2.5) return { label: "良好", color: "text-blue-500" };
  if (gpa >= 1.5) return { label: "普通", color: "text-amber-500" };
  return { label: "要注意", color: "text-red-500" };
}

export function Gpa() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const result = useMemo(() => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits === 0) return { gpa: 0, totalCredits: 0, count: subjects.length };
    const weightedSum = subjects.reduce((sum, s) => sum + GRADE_POINTS[s.grade] * s.credits, 0);
    const gpa = weightedSum / totalCredits;
    return { gpa, totalCredits, count: subjects.length };
  }, [subjects]);

  const updateSubject = (id: string, key: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: newId(), name: "", credits: 2, grade: "A" }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const { label: gpaLabel, color: gpaColor } = result.gpa > 0 ? getGpaLabel(result.gpa) : { label: "—", color: "text-slate-400" };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">GPA計算</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">科目・単位・成績を入力してGPAを計算</p>
        </div>

        {/* GPA Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">累積GPA</p>
          <p className="text-[64px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {result.gpa > 0 ? result.gpa.toFixed(2) : "—"}
          </p>
          <p className={`text-[17px] font-semibold mt-3 ${gpaColor}`}>{gpaLabel}</p>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
          <div className="flex items-center px-5 py-[14px]">
            <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">取得単位数</span>
            <span className="text-[15px] font-medium text-slate-900 dark:text-white">{result.totalCredits} 単位</span>
          </div>
          <div className="flex items-center px-5 py-[14px]">
            <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">登録科目数</span>
            <span className="text-[15px] font-medium text-slate-900 dark:text-white">{result.count} 科目</span>
          </div>
        </div>

        {/* Subjects */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">科目一覧</p>
          <div className="space-y-2">
            {subjects.map(subject => (
              <div key={subject.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden p-4 space-y-3">
                {/* Name */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={e => updateSubject(subject.id, "name", e.target.value)}
                    placeholder="科目名（任意）"
                    className="flex-1 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none"
                  />
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="text-slate-300 dark:text-zinc-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Credits + Grade */}
                <div className="flex items-center gap-3">
                  {/* Credits */}
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-slate-400 dark:text-zinc-500">単位</span>
                    <select
                      value={subject.credits}
                      onChange={e => updateSubject(subject.id, "credits", Number(e.target.value))}
                      className="text-[15px] font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-lg px-2 py-1 outline-none"
                    >
                      {[1, 2, 3, 4].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Segmented */}
                  <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
                    {GRADES.map(g => (
                      <button
                        key={g}
                        onClick={() => updateSubject(subject.id, "grade", g)}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                          subject.grade === g
                            ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Button */}
        <button
          onClick={addSubject}
          className="w-full py-[16px] text-[17px] font-semibold text-blue-500 bg-white dark:bg-zinc-900 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          科目を追加
        </button>

        {/* Grade Scale Reference */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">成績ポイント表</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            {GRADES.map(g => (
              <div key={g} className="flex items-center px-5 py-[14px]">
                <span className="text-[15px] font-semibold text-slate-900 dark:text-white w-8">{g}</span>
                <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">
                  {g === "S" ? "秀（最高評価）" : g === "A" ? "優" : g === "B" ? "良" : g === "C" ? "可" : g === "D" ? "不可（再履修）" : "不合格"}
                </span>
                <span className="text-[15px] font-medium text-slate-900 dark:text-white">{GRADE_POINTS[g].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentId="gpa" category="lifestyle" />
      </div>
    </div>
  );
}
