"use client";
// グッズ編集フォームの部品
//   GalleryEditor: 商品紹介用の画像（最大10枚。追加・削除・並び替え・代表＝先頭）
//   VariantEditor: ランダム商品の絵柄（所持管理の対象。名前・画像（任意）・並び順）
// どちらも保存は親（GoodsForm）がまとめて行う。ここでは画像の前処理（縮小・圧縮・位置情報除去）まで
import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ImagePlus, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { ACCEPT_ATTR, ImageProcessError, preprocessImage, type ProcessedImage } from "@/lib/goods/image/preprocess";
import { newUuid } from "@/lib/goods/uuid";
import type { GoodsImage } from "@/lib/goods/types";
import { btn, field } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";

export const MAX_IMAGES = 10;
export const MAX_VARIANTS = 100;

export type GalleryEntry = { key: string; kind: "existing"; image: GoodsImage } | { key: string; kind: "new"; img: ProcessedImage };

export type VariantImage = { kind: "keep" } | { kind: "new"; img: ProcessedImage } | { kind: "remove" };
export interface VariantEntry {
  key: string;
  /** 既存の絵柄の ID（新規は undefined） */
  id?: string;
  name: string;
  image: VariantImage;
  /** 既存画像のサムネ（署名URL） */
  thumbUrl: string | null;
}

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:bg-zinc-800";

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

// 選択した複数の画像を順に前処理する（メモリを使いすぎないよう1枚ずつ）
async function processFiles(files: File[], onError: (msg: string) => void): Promise<ProcessedImage[]> {
  const out: ProcessedImage[] = [];
  for (const f of files) {
    try {
      out.push(await preprocessImage(f));
    } catch (e) {
      onError(e instanceof ImageProcessError ? e.userMessage : "画像を読み込めませんでした。別の画像でお試しください。");
    }
  }
  return out;
}

export function GalleryEditor({ entries, onChange, disabled }: { entries: GalleryEntry[]; onChange: (next: GalleryEntry[]) => void; disabled?: boolean }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const remaining = MAX_IMAGES - entries.length;

  // プレビュー用 ObjectURL の解放（このコンポーネントが外れたとき）
  const latest = useRef(entries);
  latest.current = entries;
  useEffect(() => () => latest.current.forEach((e) => e.kind === "new" && URL.revokeObjectURL(e.img.previewUrl)), []);

  async function onFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setError(null);
    const files = [...list].slice(0, remaining);
    if (list.length > remaining) setError(`画像は${MAX_IMAGES}枚までです。先頭の${remaining}枚だけ追加しました。`);
    setProcessing(true);
    const imgs = await processFiles(files, setError);
    setProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
    if (imgs.length) onChange([...latest.current, ...imgs.map((img) => ({ key: newUuid(), kind: "new" as const, img }))]);
  }

  function remove(i: number) {
    const e = entries[i];
    if (e.kind === "new") URL.revokeObjectURL(e.img.previewUrl);
    onChange(entries.filter((_, j) => j !== i));
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">グッズ写真</span>
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
          {entries.length}/{MAX_IMAGES}枚・先頭が一覧に出る代表画像
        </span>
      </div>
      <ul className="mt-1.5 grid grid-cols-3 gap-2" aria-label="グッズ写真の一覧">
        {entries.map((e, i) => {
          const src = e.kind === "new" ? e.img.previewUrl : e.image.thumbUrl;
          return (
            <li key={e.key} className="flex flex-col gap-1">
              <div className={cn("relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800", i === 0 && "ring-2 ring-violet-500")}>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- ローカルプレビュー / 署名URL
                  <img src={src} alt={`写真${i + 1}${i === 0 ? "（代表）" : ""}`} className="h-full w-full object-contain" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-slate-400">読み込めません</span>
                )}
                {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">代表</span>}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" className={iconBtn} disabled={disabled || i === 0} onClick={() => onChange(move(entries, i, i - 1))} aria-label={`写真${i + 1}を前へ`}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                {i > 0 ? (
                  <button type="button" className={iconBtn} disabled={disabled} onClick={() => onChange(move(entries, i, 0))} aria-label={`写真${i + 1}を代表にする`}>
                    <Star className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="h-9 w-9" />
                )}
                <button type="button" className={iconBtn} disabled={disabled || i === entries.length - 1} onClick={() => onChange(move(entries, i, i + 1))} aria-label={`写真${i + 1}を後ろへ`}>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className={cn(iconBtn, "text-red-600 dark:text-red-400")} disabled={disabled} onClick={() => remove(i)} aria-label={`写真${i + 1}を削除`}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
        {remaining > 0 && (
          <li>
            <label
              htmlFor={inputId}
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-slate-400",
                (disabled || processing) && "pointer-events-none opacity-50"
              )}
            >
              {processing ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-6 w-6" aria-hidden="true" />}
              <span className="text-xs font-bold">{processing ? "最適化中…" : "写真を追加"}</span>
            </label>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="sr-only"
        disabled={disabled || processing || remaining <= 0}
        onChange={(e) => onFiles(e.target.files)}
      />
      {error && (
        <p role="alert" className={field.error}>
          {error}
        </p>
      )}
      <p className={field.hint}>JPG・PNG・HEIC・WebP に対応。自動で縮小・圧縮し、位置情報は保存しません。</p>
    </div>
  );
}

export function VariantEditor({ entries, onChange, disabled }: { entries: VariantEntry[]; onChange: (next: VariantEntry[]) => void; disabled?: boolean }) {
  const [bulk, setBulk] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pickFor = useRef<string | null>(null);
  const remaining = MAX_VARIANTS - entries.length;

  function update(key: string, patch: Partial<VariantEntry>) {
    onChange(entries.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  }

  function addMany(n: number) {
    const count = Math.min(n, remaining);
    if (count <= 0) return;
    // 「No.1」「No.2」…と続き番号で作る（名前はあとで変えられる）
    const used = new Set(entries.map((e) => e.name));
    const out: VariantEntry[] = [];
    let i = 1;
    while (out.length < count) {
      const name = `No.${i++}`;
      if (!used.has(name)) out.push({ key: newUuid(), name, image: { kind: "keep" }, thumbUrl: null });
    }
    onChange([...entries, ...out]);
  }

  async function onFile(file: File | undefined) {
    const key = pickFor.current;
    if (!file || !key) return;
    setError(null);
    setBusyKey(key);
    const [img] = await processFiles([file], setError);
    setBusyKey(null);
    if (fileRef.current) fileRef.current.value = "";
    if (img) update(key, { image: { kind: "new", img } });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">絵柄・種類</span>
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">全{entries.length}種</span>
      </div>
      <p className={field.hint}>持っている数は絵柄ごとに記録します。画像は任意です。</p>
      <ul className="mt-2 space-y-2" aria-label="絵柄の一覧">
        {entries.map((e, i) => {
          const src = e.image.kind === "new" ? e.image.img.previewUrl : e.image.kind === "keep" ? e.thumbUrl : null;
          return (
            <li key={e.key} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-zinc-700">
              <button
                type="button"
                disabled={disabled || busyKey === e.key}
                onClick={() => {
                  pickFor.current = e.key;
                  fileRef.current?.click();
                }}
                aria-label={src ? `${e.name || `絵柄${i + 1}`}の画像を変更` : `${e.name || `絵柄${i + 1}`}の画像を追加`}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-zinc-600 dark:bg-zinc-800"
              >
                {busyKey === e.key ? (
                  <Loader2 className="m-auto h-5 w-5 animate-spin" aria-hidden="true" />
                ) : src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- ローカルプレビュー / 署名URL
                  <img src={src} alt="" className="h-full w-full object-contain" />
                ) : (
                  <ImagePlus className="m-auto h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <label htmlFor={`variant-${e.key}`} className="sr-only">
                絵柄{i + 1}の名前
              </label>
              <input
                id={`variant-${e.key}`}
                value={e.name}
                maxLength={60}
                disabled={disabled}
                onChange={(ev) => update(e.key, { name: ev.target.value })}
                placeholder={`絵柄${i + 1}の名前`}
                aria-invalid={!e.name.trim() || undefined}
                className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-base text-slate-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
              {src && (
                <button type="button" className={iconBtn} disabled={disabled} onClick={() => update(e.key, { image: { kind: "remove" } })} aria-label={`${e.name}の画像を外す`}>
                  <span className="text-xs font-bold">画像×</span>
                </button>
              )}
              <div className="flex flex-col">
                <button type="button" className={cn(iconBtn, "h-6")} disabled={disabled || i === 0} onClick={() => onChange(move(entries, i, i - 1))} aria-label={`${e.name}を上へ`}>
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className={cn(iconBtn, "h-6")} disabled={disabled || i === entries.length - 1} onClick={() => onChange(move(entries, i, i + 1))} aria-label={`${e.name}を下へ`}>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button type="button" className={cn(iconBtn, "text-red-600 dark:text-red-400")} disabled={disabled} onClick={() => onChange(entries.filter((x) => x.key !== e.key))} aria-label={`${e.name}を削除`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <input ref={fileRef} type="file" accept={ACCEPT_ATTR} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />
      {error && (
        <p role="alert" className={field.error}>
          {error}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className={btn.secondary} disabled={disabled || remaining <= 0} onClick={() => addMany(1)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          絵柄を追加
        </button>
        <div className="flex items-center gap-1.5">
          <label htmlFor="variant-bulk" className="text-sm text-slate-600 dark:text-slate-300">
            全
          </label>
          <input
            id="variant-bulk"
            inputMode="numeric"
            value={bulk}
            onChange={(e) => setBulk(e.target.value.replace(/[^0-9０-９]/g, ""))}
            className="h-10 w-14 rounded-lg border border-slate-300 bg-white text-center text-base dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="8"
            disabled={disabled}
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">種を</span>
          <button
            type="button"
            className={btn.ghost}
            disabled={disabled || !bulk}
            onClick={() => {
              const n = Number(bulk.normalize("NFKC"));
              if (Number.isInteger(n) && n > 0) addMany(n);
              setBulk("");
            }}
          >
            まとめて追加
          </button>
        </div>
      </div>
    </div>
  );
}
