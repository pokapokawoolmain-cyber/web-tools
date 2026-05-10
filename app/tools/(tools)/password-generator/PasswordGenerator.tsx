"use client";
import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { SliderInput } from "@/components/ui/SliderInput";

const CHARS = {
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:   "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similar: "Il1O0",
};

type StrengthLevel = "弱い" | "普通" | "強い" | "最強";

function calcStrength(password: string): { level: StrengthLevel; score: number; color: string } {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: "弱い",  score, color: "bg-red-500" };
  if (score <= 3) return { level: "普通",  score, color: "bg-yellow-500" };
  if (score <= 4) return { level: "強い",  score, color: "bg-blue-500" };
  return               { level: "最強",  score, color: "bg-emerald-500" };
}

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean
): string {
  let charset = "";
  if (useUpper)   charset += CHARS.upper;
  if (useLower)   charset += CHARS.lower;
  if (useNumbers) charset += CHARS.numbers;
  if (useSymbols) charset += CHARS.symbols;
  if (excludeSimilar) {
    for (const c of CHARS.similar) charset = charset.replace(new RegExp(c, "g"), "");
  }
  if (!charset) return "";

  // Web Crypto API で安全な乱数を使用
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((n) => charset[n % charset.length]).join("");
}

type Option = { key: string; label: string; value: boolean; setter: (v: boolean) => void };

export function PasswordGenerator() {
  const [length, setLength]             = useState(16);
  const [useUpper, setUseUpper]         = useState(true);
  const [useLower, setUseLower]         = useState(true);
  const [useNumbers, setUseNumbers]     = useState(true);
  const [useSymbols, setUseSymbols]     = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [passwords, setPasswords]       = useState<string[]>([]);
  const [copied, setCopied]             = useState<number | null>(null);

  const generate = useCallback(() => {
    const list = Array.from({ length: 5 }, () =>
      generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar)
    );
    setPasswords(list);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  const copyPassword = async (pw: string, index: number) => {
    await navigator.clipboard.writeText(pw);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const options: Option[] = [
    { key: "upper",   label: "大文字 (A-Z)",  value: useUpper,   setter: setUseUpper },
    { key: "lower",   label: "小文字 (a-z)",  value: useLower,   setter: setUseLower },
    { key: "numbers", label: "数字 (0-9)",    value: useNumbers, setter: setUseNumbers },
    { key: "symbols", label: "記号 (!@#...)", value: useSymbols, setter: setUseSymbols },
    { key: "similar", label: "紛らわしい文字を除く (I,l,1,O,0)", value: excludeSimilar, setter: setExcludeSimilar },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 設定 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">パスワードの設定</h2>
        <SliderInput
          id="length"
          label="文字数"
          value={length}
          onChange={setLength}
          min={4}
          max={64}
          step={1}
          unit="文字"
          formatValue={(v) => `${v}文字`}
        />
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">使用する文字種</p>
          <div className="grid grid-cols-1 gap-2">
            {options.map((opt) => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => opt.setter(!opt.value)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all cursor-pointer flex-shrink-0 ${
                    opt.value
                      ? "bg-blue-500 border-blue-500"
                      : "border-slate-300 dark:border-zinc-600"
                  }`}
                >
                  {opt.value && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          className="btn-primary w-full justify-center text-base"
        >
          <RefreshCw className="w-4 h-4" />
          パスワードを生成
        </button>
      </div>

      {/* 結果 */}
      {passwords.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white">生成結果（5パターン）</h2>
          {passwords.map((pw, i) => {
            const strength = calcStrength(pw);
            return (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <code className="flex-1 text-sm font-mono text-slate-900 dark:text-white break-all leading-relaxed">
                    {pw}
                  </code>
                  <button
                    onClick={() => copyPassword(pw, i)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors flex-shrink-0"
                    aria-label="コピー"
                  >
                    {copied === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {/* 強度バー */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} rounded-full transition-all`}
                      style={{ width: `${(strength.score / 6) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${
                    strength.level === "最強" ? "text-emerald-500" :
                    strength.level === "強い"  ? "text-blue-500" :
                    strength.level === "普通"  ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {strength.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ 生成はすべてブラウザ内で完結。パスワードはサーバーに送信されません。
      </p>
    </div>
  );
}
