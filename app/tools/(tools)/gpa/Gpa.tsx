"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

type ScaleId = "jp4" | "us40" | "us43" | "s45";

type GradeDef = { label: string; points: number; note: string };

type Scale = { id: ScaleId; name: string; max: number; grades: GradeDef[] };

// 成績の換算方式。大学・提出先によって異なるため、成績証明書や募集要項の換算表に合わせて選ぶ
const SCALES: Scale[] = [
  {
    id: "jp4",
    name: "S・A・B・C（4点満点）",
    max: 4,
    grades: [
      { label: "S", points: 4, note: "秀" },
      { label: "A", points: 3, note: "優" },
      { label: "B", points: 2, note: "良" },
      { label: "C", points: 1, note: "可" },
      { label: "F", points: 0, note: "不可" },
    ],
  },
  {
    id: "us40",
    name: "A・B・C・D（4.0スケール）",
    max: 4,
    grades: [
      { label: "A", points: 4, note: "" },
      { label: "B", points: 3, note: "" },
      { label: "C", points: 2, note: "" },
      { label: "D", points: 1, note: "" },
      { label: "F", points: 0, note: "不合格" },
    ],
  },
  {
    id: "us43",
    name: "A+〜F（4.3スケール）",
    max: 4.3,
    grades: [
      { label: "A+", points: 4.3, note: "" },
      { label: "A", points: 4.0, note: "" },
      { label: "A-", points: 3.7, note: "" },
      { label: "B+", points: 3.3, note: "" },
      { label: "B", points: 3.0, note: "" },
      { label: "B-", points: 2.7, note: "" },
      { label: "C+", points: 2.3, note: "" },
      { label: "C", points: 2.0, note: "" },
      { label: "C-", points: 1.7, note: "" },
      { label: "D", points: 1.0, note: "" },
      { label: "F", points: 0, note: "不合格" },
    ],
  },
  {
    id: "s45",
    name: "S=4.5・A=4.0（4.5点満点）",
    max: 4.5,
    grades: [
      { label: "S", points: 4.5, note: "" },
      { label: "A", points: 4.0, note: "" },
      { label: "B", points: 3.0, note: "" },
      { label: "C", points: 2.0, note: "" },
      { label: "D", points: 1.0, note: "" },
      { label: "F", points: 0, note: "不合格" },
    ],
  },
];

const getScale = (id: ScaleId) => SCALES.find(sc => sc.id === id) ?? SCALES[0];

/** 別のスケールに切り替えたとき、いちばん近い点数の評価に置き換える */
function nearestGrade(scale: Scale, points: number): string {
  return scale.grades.reduce((best, g) =>
    Math.abs(g.points - points) < Math.abs(best.points - points) ? g : best,
  ).label;
}

type Subject = {
  id: string;
  name: string;
  credits: number;
  grade: string;
};

let counter = 0;
function newId() {
  return `s-${++counter}`;
}

function initialSubjects(): Subject[] {
  return [
    { id: newId(), name: "", credits: 2, grade: "S" },
    { id: newId(), name: "", credits: 2, grade: "A" },
  ];
}

/** 目安の表示は4.0満点に換算した値で判定する */
function getGpaLabel(gpa: number): { label: string; color: string } {
  if (gpa >= 3.5) return { label: "優秀", color: "text-emerald-500" };
  if (gpa >= 2.5) return { label: "良好", color: "text-blue-500" };
  if (gpa >= 1.5) return { label: "普通", color: "text-amber-500" };
  return { label: "要注意", color: "text-red-500" };
}

export function Gpa() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [scaleId, setScaleId] = useState<ScaleId>("jp4");
  const scale = getScale(scaleId);

  const result = useMemo(() => {
    const pointsOf = (label: string) => scale.grades.find(g => g.label === label)?.points ?? 0;
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits === 0) return { gpa: 0, gpa40: 0, capped40: 0, totalCredits: 0, count: subjects.length };
    const weightedSum = subjects.reduce((sum, s) => sum + pointsOf(s.grade) * s.credits, 0);
    const gpa = weightedSum / totalCredits;
    // 4.0満点への換算（目安）: ①比例換算 GPA × 4.0 ÷ 満点 ②4.0を超える評価を4.0として計算し直す
    const gpa40 = (gpa * 4) / scale.max;
    const capped40 =
      subjects.reduce((sum, s) => sum + Math.min(4, pointsOf(s.grade)) * s.credits, 0) / totalCredits;
    return { gpa, gpa40, capped40, totalCredits, count: subjects.length };
  }, [subjects, scale]);

  const changeScale = (id: ScaleId) => {
    const prev = scale;
    const next = getScale(id);
    setSubjects(list =>
      list.map(s => {
        const p = prev.grades.find(g => g.label === s.grade)?.points ?? 0;
        return { ...s, grade: nearestGrade(next, p) };
      }),
    );
    setScaleId(id);
  };

  const updateSubject = (id: string, key: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: newId(), name: "", credits: 2, grade: scale.grades[1].label }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const { label: gpaLabel, color: gpaColor } = result.gpa > 0 ? getGpaLabel(result.gpa40) : { label: "—", color: "text-slate-400" };

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
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-2">{scale.max.toFixed(1)}点満点</p>
          {scale.max !== 4 && result.gpa > 0 && (
            <div className="mt-4 text-[13px] text-slate-600 dark:text-zinc-400 space-y-1">
              <p>4.0満点に比例換算（GPA × 4.0 ÷ {scale.max.toFixed(1)}）: <span className="font-semibold text-slate-900 dark:text-white">{result.gpa40.toFixed(2)}</span></p>
              <p>4.0を超える評価を4.0として計算: <span className="font-semibold text-slate-900 dark:text-white">{result.capped40.toFixed(2)}</span></p>
              <p className="text-[12px] text-slate-400 dark:text-zinc-500">換算方法は提出先によって異なります。募集要項に換算方法の指定があればそちらに従ってください。</p>
            </div>
          )}
        </div>

        {/* Scale */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">成績の換算方式</p>
          <select
            value={scaleId}
            onChange={e => changeScale(e.target.value as ScaleId)}
            className="w-full text-[15px] font-medium text-slate-900 dark:text-white bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 outline-none"
            aria-label="成績の換算方式"
          >
            {SCALES.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-2">成績証明書や学生便覧の換算表に合わせて選んでください。</p>
        </section>

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

                  {/* Grade */}
                  {scale.grades.length <= 6 ? (
                    <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
                      {scale.grades.map(g => (
                        <button
                          key={g.label}
                          onClick={() => updateSubject(subject.id, "grade", g.label)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                            subject.grade === g.label
                              ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-500"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[13px] text-slate-400 dark:text-zinc-500">成績</span>
                      <select
                        value={subject.grade}
                        onChange={e => updateSubject(subject.id, "grade", e.target.value)}
                        className="flex-1 text-[15px] font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-lg px-2 py-1 outline-none"
                      >
                        {scale.grades.map(g => (
                          <option key={g.label} value={g.label}>{g.label}（{g.points.toFixed(1)}）</option>
                        ))}
                      </select>
                    </div>
                  )}
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
            {scale.grades.map(g => (
              <div key={g.label} className="flex items-center px-5 py-[14px]">
                <span className="text-[15px] font-semibold text-slate-900 dark:text-white w-8">{g.label}</span>
                <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">{g.note}</span>
                <span className="text-[15px] font-medium text-slate-900 dark:text-white">{g.points.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools toolId="gpa" />
      </div>
    </div>
  );
}
