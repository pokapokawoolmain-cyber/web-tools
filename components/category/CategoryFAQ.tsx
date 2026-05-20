// ========================================
// カテゴリTOP - FAQ セクション
// ========================================
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryFaq } from "@/data/categories";

type Props = {
  faqs: CategoryFaq[];
  accentColor: string;
};

export function CategoryFAQ({ faqs, accentColor }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
        よくある質問
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-100">
                  Q. {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 py-4 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
                  A. {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
