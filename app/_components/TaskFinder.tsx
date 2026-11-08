"use client";

// ============================================================
// ホームの入り口「何をしたいですか？」
// - 言葉で探す: 入力するとその場で候補を出し、Enter でそのツールへ
// - よく使う作業: ワンタップでツールへ
// - ファイルを入れる: PDFならPDFワークスペース、画像なら画像ワークスペースへ
//   ファイルを持ったまま移動する（送信・保存はしない）
// ============================================================
import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileUp, Search } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { searchTools, toSearchEntries } from "@/lib/tool-search";
import { handOff, routeFiles } from "@/lib/workspace/handoff";

const QUICK_TASKS: { label: string; href: string }[] = [
  { label: "割合を計算する", href: "/tools/percentage-calculator" },
  { label: "敬語に直す", href: "/tools/ai-keigo" },
  { label: "日数を数える", href: "/tools/date-calculator" },
  { label: "手取りを計算する", href: "/tools/net-income" },
  { label: "画像のサイズを変える", href: "/tools/image-resize" },
  { label: "PDFを画像にする", href: "/tools/pdf-to-jpg" },
  { label: "請求書を作る", href: "/tools/invoice-generator" },
  { label: "香典袋を書く", href: "/tools/koden-maker" },
];

export function TaskFinder() {
  const router = useRouter();
  const entries = useMemo(() => toSearchEntries(TOOLS), []);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const hits = useMemo(() => searchTools(entries, query, 6), [entries, query]);
  const open = query.trim().length > 0;

  const go = (href: string) => router.push(href);

  const takeFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const routed = routeFiles(files);
    if (!routed) {
      setFileError("PDFか画像のファイルを入れてください。そのほかの作業は上の検索から探せます。");
      return;
    }
    setFileError(null);
    handOff(routed.target, routed.files);
    go(`/workspace/${routed.target}`);
  };

  return (
    <div
      className={`rounded-2xl border p-3 sm:p-4 bg-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors ${
        dragOver ? "border-blue-400 bg-blue-500/10" : "border-white/15"
      }`}
      onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setDragOver(true); } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
      onDrop={(e) => { if (e.dataTransfer.files.length) { e.preventDefault(); setDragOver(false); takeFiles(e.dataTransfer.files); } }}
    >
      <label htmlFor="task-finder-input" className="block text-[13px] font-semibold text-zinc-200 mb-2">
        何をしたいですか？
      </label>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" aria-hidden />
        <input
          id="task-finder-input"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && hits[active] ? `${listId}-${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          enterKeyHint="go"
          placeholder="例: PDF くっつける / 手取り"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && hits[active]) { e.preventDefault(); go(hits[active].entry.href); }
            else if (e.key === "Escape") setQuery("");
          }}
          className="w-full pl-10 pr-3 py-3 min-h-[52px] rounded-xl bg-zinc-950/60 border border-white/15 text-white text-[16px] placeholder:text-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      {open ? (
        <ul id={listId} role="listbox" aria-label="見つかったツール" className="mt-2 space-y-1">
          {hits.map((h, i) => (
            <li key={h.entry.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <Link
                href={h.entry.href}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[48px] rounded-xl transition-colors ${
                  i === active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-white truncate">{h.entry.title}</span>
                  <span className="block text-[12px] text-zinc-400 truncate">{h.entry.description}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 text-zinc-500" aria-hidden />
              </Link>
            </li>
          ))}
          {hits.length === 0 && (
            <li className="px-3 py-3 text-[13px] text-zinc-400">
              見つかりませんでした。言い方を変えるか、
              <Link href="/tools" className="text-blue-300 underline">すべてのツール</Link>から探してください。
            </li>
          )}
        </ul>
      ) : (
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-zinc-500 mb-2">よく使われている作業</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TASKS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex items-center px-3 py-2 min-h-[44px] rounded-full bg-white/[0.07] border border-white/10 text-[13px] text-zinc-200 hover:bg-white/15 hover:text-white transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[52px] rounded-xl border border-dashed border-white/20 text-left hover:border-blue-400/60 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <FileUp className="w-5 h-5 shrink-0 text-blue-300" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold text-white">PDF・画像を入れて始める</span>
            <span className="block text-[12px] text-zinc-400">ドラッグ＆ドロップでもOK。まとめる・軽くする・変換するを一度に</span>
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="application/pdf,.pdf,image/*,.heic,.heif"
          className="hidden"
          aria-label="PDF・画像を選ぶ"
          onChange={(e) => { takeFiles(e.target.files); e.target.value = ""; }}
        />
        {fileError && <p role="alert" className="mt-2 text-[12px] text-amber-300">{fileError}</p>}
      </div>
    </div>
  );
}
