"use client";
// グッズの登録・編集フォーム。新規は「保存して続けて追加」で連続登録できる。
//   * 種類: 通常商品 / ランダム商品（絵柄ごとに所持数を記録）
//   * 写真: 最大10枚（先頭が代表画像）。絵柄の画像とは別物
//   * カテゴリ: イベントのカテゴリから選ぶ／その場で新しく作る
// 保存の順番: 画像のアップロード → goods → 画像・絵柄（1トランザクションの RPC）→ 不要になった画像を Storage から削除
// 失われる操作（種類の変換・既存の絵柄の削除）は、保存前に確認する
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { newUuid } from "@/lib/goods/uuid";
import { removeImages, uploadProcessedImage } from "@/lib/goods/image/storage";
import { LIMITS, friendlyDbError, parsePrice, validateGoods, type FieldErrors } from "@/lib/goods/validation";
import type { GoodsCategory, GoodsItem, GoodsKind } from "@/lib/goods/types";
import { btn, field } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { GalleryEditor, VariantEditor, type GalleryEntry, type VariantEntry } from "./MediaEditors";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  eventId: string;
  item?: GoodsItem;
  categories: GoodsCategory[];
  nextSortOrder: number;
  /** 作成者以外の参加者がいるか（ランダム → 通常の変換を止めるため） */
  hasMembers?: boolean;
}

const initialGallery = (item?: GoodsItem): GalleryEntry[] => (item?.images ?? []).map((image) => ({ key: image.id, kind: "existing", image }));
const initialVariants = (item?: GoodsItem): VariantEntry[] =>
  (item?.variants ?? []).map((v) => ({ key: v.id, id: v.id, name: v.name, image: { kind: "keep" }, thumbUrl: v.thumbUrl }));

type Pending = { mode: "save" | "continue"; lines: string[] };

export function GoodsForm({ eventId, item, categories, nextSortOrder, hasMembers = false }: Props) {
  const router = useRouter();
  const toast = useToast();
  const online = useOnline();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [kind, setKind] = useState<GoodsKind>(item?.kind ?? "normal");
  const [categoryChoice, setCategoryChoice] = useState<string>(item?.categoryId ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [knownCategories, setKnownCategories] = useState(categories);
  const [gallery, setGallery] = useState<GalleryEntry[]>(() => initialGallery(item));
  const [variants, setVariants] = useState<VariantEntry[]>(() => initialVariants(item));
  // 削除（論理削除）済みの絵柄。戻すと参加者の数量も戻る
  const [archived, setArchived] = useState(item?.archivedVariants ?? []);
  // 共有中のランダム商品は通常商品へ変えられない（参加者の絵柄ごとの数量をまとめてしまうため）
  const lockRandom = item?.kind === "random" && hasMembers;
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  const [saving, setSaving] = useState<false | "save" | "continue">(false);
  const [sortOrder, setSortOrder] = useState(nextSortOrder);
  const [addedCount, setAddedCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  // 新規登録で goods の作成までは成功し、画像の保存で失敗した場合に、再試行で二重登録しない
  const createdId = useRef<string | null>(null);

  const removedVariants = useMemo(
    () => (item?.kind === "random" && kind === "random" ? item.variants.filter((v) => !variants.some((e) => e.id === v.id)) : []),
    [item, kind, variants]
  );

  function resetForNext() {
    setName("");
    setPrice("");
    setDescription("");
    setGallery([]);
    setVariants([]);
    setErrors({});
    createdId.current = null;
    // カテゴリと種類は続けて同じものを登録することが多いので残す
    nameRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate(): FieldErrors {
    const category = categoryChoice === "new" ? newCategory : knownCategories.find((c) => c.id === categoryChoice)?.name ?? "";
    const errs = validateGoods({ name, price, category, description });
    if (categoryChoice === "new" && !newCategory.trim()) errs.category = "新しいカテゴリ名を入力してください";
    if (kind === "random" && variants.some((v) => !v.name.trim())) errs.variants = "絵柄の名前を入力してください";
    return errs;
  }

  function requestSave(mode: "save" | "continue") {
    const errs = validate();
    setErrors(errs);
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) {
      document.getElementById(first === "variants" ? "variants-section" : `g-${first}`)?.focus();
      return;
    }
    // 失われる操作は確認してから
    const lines: string[] = [];
    if (item && item.kind !== kind) {
      lines.push(
        kind === "random"
          ? "ランダム商品に変更します。今までの所持数は、1つ目の絵柄の所持数として引き継がれます（共有している全員分。合計は変わりません）。"
          : `通常商品に変更します。絵柄（${item.variants.length}種）と絵柄ごとの数は削除され、所持数は合計だけが残ります。`
      );
    }
    if (removedVariants.length) {
      lines.push(
        `絵柄 ${removedVariants.map((v) => `「${v.name}」`).join("")} を一覧から削除します。参加者の所持数は保存されていて、この画面の「削除した絵柄」からいつでも戻せます。`
      );
    }
    if (lines.length) {
      setPending({ mode, lines });
      return;
    }
    save(mode);
  }

  async function save(mode: "save" | "continue") {
    setPending(null);
    setSaving(mode);
    const supabase = goodsBrowserClient();
    const goodsId = item?.id ?? createdId.current ?? newUuid();
    const uploaded: string[] = [];
    let toRemove: string[] = [];
    const uploadErr = { message: "image upload failed", userMessage: "画像をアップロードできませんでした。通信環境を確認してもう一度お試しください。" };

    try {
      // 1. カテゴリ（新しく作る場合は先に作る。同じ名前があればそれを使う）
      let categoryId: string | null = categoryChoice && categoryChoice !== "new" ? categoryChoice : null;
      if (categoryChoice === "new") {
        const cname = newCategory.normalize("NFKC").trim();
        const found = knownCategories.find((c) => c.name === cname);
        if (found) categoryId = found.id;
        else {
          const nextOrder = knownCategories.length ? Math.max(...knownCategories.map((c) => c.sortOrder)) + 1 : 0;
          const { data, error } = await supabase.from("goods_categories").insert({ event_id: eventId, name: cname, sort_order: nextOrder }).select("id, name, sort_order").single();
          if (error) throw error;
          categoryId = data.id;
          setKnownCategories((c) => [...c, { id: data.id, name: data.name, sortOrder: data.sort_order }]);
          setCategoryChoice(data.id);
          setNewCategory("");
        }
      }

      // 2. 種類の変換（既存のグッズだけ。全参加者の所持数を DB 側で移す）
      let variantEntries = variants;
      if (item && item.kind !== kind) {
        const firstNew = variants.find((v) => !v.id);
        const { data, error } = await supabase.rpc("goods_convert_kind", { p_goods_id: item.id, p_kind: kind, p_first_variant_name: firstNew?.name.trim() || null });
        if (error) throw error;
        const res = data as { variant_id?: string; removed_paths?: string[] };
        toRemove = [...toRemove, ...(res.removed_paths ?? [])];
        if (kind === "random" && res.variant_id) {
          // 変換で作られた1つ目の絵柄（所持数を引き継いだもの）を、フォームの最初の新しい絵柄に対応させる
          if (firstNew) variantEntries = variants.map((v) => (v.key === firstNew.key ? { ...v, id: res.variant_id } : v));
          else variantEntries = [{ key: res.variant_id, id: res.variant_id, name: "絵柄1", image: { kind: "keep" }, thumbUrl: null }, ...variants];
        }
      }

      // 3. 画像のアップロード（パスは {event_id}/{goods_id}/...。Storage の権限でオーナーだけ書ける）
      const imagesPayload: { id?: string; image_path?: string; thumb_path?: string }[] = [];
      for (const e of gallery) {
        if (e.kind === "existing") imagesPayload.push({ id: e.image.id });
        else {
          const up = await uploadProcessedImage(supabase, eventId, goodsId, e.img).catch(() => {
            throw uploadErr;
          });
          uploaded.push(up.fullPath, up.thumbPath);
          imagesPayload.push({ image_path: up.fullPath, thumb_path: up.thumbPath });
        }
      }
      let variantsPayload: Record<string, string | null | undefined>[] | null = null;
      if (kind === "random") {
        variantsPayload = [];
        for (const v of variantEntries) {
          const row: Record<string, string | null | undefined> = { id: v.id, name: v.name.trim() };
          if (v.image.kind === "new") {
            const up = await uploadProcessedImage(supabase, eventId, goodsId, v.image.img).catch(() => {
              throw uploadErr;
            });
            uploaded.push(up.fullPath, up.thumbPath);
            row.image_path = up.fullPath;
            row.thumb_path = up.thumbPath;
          } else if (v.image.kind === "remove" && v.id) {
            row.image_path = null;
            row.thumb_path = null;
          }
          variantsPayload.push(row);
        }
      }

      // 4. goods 本体（画像列は DB 側で代表画像から決まるので送らない）
      const base = {
        name: name.trim(),
        price: parsePrice(price),
        description: description.trim() || null,
        category_id: categoryId,
      };
      if (item || createdId.current) {
        const { error } = await supabase.from("goods").update(base).eq("id", goodsId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("goods").insert({ id: goodsId, event_id: eventId, sort_order: sortOrder, kind, ...base });
        if (error) throw error;
        createdId.current = goodsId;
      }

      // 5. 画像・絵柄（1トランザクション）
      const { data: media, error: mErr } = await supabase.rpc("goods_save_media", { p_goods_id: goodsId, p_images: imagesPayload, p_variants: variantsPayload });
      if (mErr) throw mErr;
      toRemove = [...toRemove, ...((media as { removed_paths?: string[] } | null)?.removed_paths ?? [])];

      // 6. 使われなくなった画像を Storage から削除（失敗しても操作は止めない）
      await removeImages(supabase, toRemove);

      if (mode === "continue" && !item) {
        setSortOrder((s) => s + 1);
        setAddedCount((n) => n + 1);
        toast.show(`「${base.name}」を登録しました`);
        resetForNext();
        setSaving(false);
        router.refresh();
        return;
      }
      toast.show(item ? "グッズを更新しました" : `「${base.name}」を登録しました`);
      router.replace(`/mochico/events/${eventId}`);
      router.refresh();
    } catch (err) {
      // 今回アップロードした画像は、DB に登録されていない可能性があるので消す
      if (uploaded.length) await removeImages(supabase, uploaded);
      setSaving(false);
      const e = err as { userMessage?: string; code?: string; message?: string; hint?: string };
      toast.show(e.userMessage ?? friendlyDbError(e), { tone: "error" });
      // 種類の変換まで終わっている場合は画面を最新にする（再試行時に二重に変換しない）
      if (item && item.kind !== kind) router.refresh();
    }
  }

  async function onDelete() {
    if (!item) return;
    setDeleting(true);
    const { error } = await goodsBrowserClient().from("goods").update({ deleted_at: new Date().toISOString() }).eq("id", item.id);
    if (error) {
      setDeleting(false);
      setConfirmDelete(false);
      toast.show(friendlyDbError(error), { tone: "error" });
      return;
    }
    toast.show(`「${item.name}」を削除しました`);
    router.replace(`/mochico/events/${eventId}`);
    router.refresh();
  }

  const busy = saving !== false || deleting;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        requestSave("save");
      }}
      noValidate
      className="space-y-6"
    >
      {addedCount > 0 && (
        <p role="status" className="rounded-xl bg-pink-50 px-4 py-3 text-sm font-medium text-pink-800 dark:bg-pink-950/40 dark:text-pink-200">
          このイベントに {addedCount} 件追加しました。続けて登録できます。
        </p>
      )}

      <GalleryEditor entries={gallery} onChange={setGallery} disabled={busy} />

      <div>
        <label htmlFor="g-name" className={field.label}>
          商品名 <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          ref={nameRef}
          id="g-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          maxLength={LIMITS.goodsName}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "g-name-err" : undefined}
          className={field.input}
          placeholder="例: ペンライト"
          autoComplete="off"
        />
        {errors.name && <p id="g-name-err" className={field.error}>{errors.name}</p>}
      </div>

      <fieldset>
        <legend className={field.label}>種類</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-zinc-800/80">
          {(
            [
              ["normal", "通常商品", "商品ごとに所持数"],
              ["random", "ランダム商品", "絵柄ごとに所持数"],
            ] as const
          ).map(([v, label, sub]) => (
            <label
              key={v}
              className={cn(
                "flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-lg px-2 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-500 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
                kind === v ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-white" : "text-slate-600 dark:text-slate-400"
              )}
            >
              <input type="radio" name="kind" value={v} checked={kind === v} onChange={() => setKind(v)} className="sr-only" disabled={busy || (lockRandom && v === "normal")} />
              <span className="text-sm font-bold">{label}</span>
              <span className="text-[11px]">{sub}</span>
            </label>
          ))}
        </div>
        {lockRandom && <p className={field.hint}>リストを共有しているため、参加者の絵柄ごとの数を守るために通常商品へは変更できません。必要なら新しいグッズとして登録してください。</p>}
      </fieldset>

      {kind === "random" && (
        <div id="variants-section" tabIndex={-1} className="rounded-2xl border border-violet-200 bg-violet-50/40 p-4 focus:outline-none dark:border-violet-900/60 dark:bg-violet-950/20">
          <VariantEditor
            entries={variants}
            onChange={(v) => {
              setVariants(v);
              clearError("variants");
            }}
            disabled={busy}
          />
          {errors.variants && <p className={field.error}>{errors.variants}</p>}
          {archived.length > 0 && (
            <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <summary className="cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-200">削除した絵柄（{archived.length}）</summary>
              <p className={field.hint}>戻すと、参加者の所持数もそのまま戻ります。</p>
              <ul className="mt-2 space-y-1.5">
                {archived.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm">{v.name}</span>
                    <button
                      type="button"
                      className={btn.ghost}
                      disabled={busy}
                      onClick={() => {
                        setVariants((cur) => [...cur, { key: v.id, id: v.id, name: v.name, image: { kind: "keep" }, thumbUrl: v.thumbUrl }]);
                        setArchived((cur) => cur.filter((x) => x.id !== v.id));
                      }}
                    >
                      戻す
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div>
        <label htmlFor="g-price" className={field.label}>価格（円）</label>
        <input
          id="g-price"
          inputMode="numeric"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            clearError("price");
          }}
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "g-price-err" : undefined}
          className={field.input}
          placeholder="3500"
          autoComplete="off"
        />
        {errors.price && <p id="g-price-err" className={field.error}>{errors.price}</p>}
      </div>

      <fieldset className="min-w-0">
        <legend className={field.label}>カテゴリ</legend>
        <div id="g-category" tabIndex={-1} className="mt-1.5 flex flex-wrap gap-1.5 focus:outline-none">
          {[{ id: "", name: "なし" }, ...knownCategories].map((c) => (
            <button
              key={c.id || "none"}
              type="button"
              aria-pressed={categoryChoice === c.id}
              onClick={() => {
                setCategoryChoice(c.id);
                clearError("category");
              }}
              disabled={busy}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-bold transition",
                categoryChoice === c.id ? "bg-violet-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-violet-50 dark:bg-zinc-900 dark:text-slate-200 dark:ring-zinc-700"
              )}
            >
              {c.name}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={categoryChoice === "new"}
            onClick={() => setCategoryChoice("new")}
            disabled={busy}
            className={cn(
              "inline-flex min-h-10 items-center gap-1 rounded-full border border-dashed px-3.5 text-sm font-bold",
              categoryChoice === "new" ? "border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" : "border-slate-300 text-slate-600 dark:border-zinc-600 dark:text-slate-300"
            )}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            新しいカテゴリ
          </button>
        </div>
        {categoryChoice === "new" && (
          <input
            id="g-new-category"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              clearError("category");
            }}
            maxLength={LIMITS.category}
            aria-label="新しいカテゴリ名"
            aria-invalid={!!errors.category}
            className={field.input}
            placeholder="例: アクリルスタンド"
            autoComplete="off"
            autoFocus
          />
        )}
        {errors.category && <p className={field.error}>{errors.category}</p>}
        <p className={field.hint}>カテゴリは共有している全員に表示されます。</p>
      </fieldset>

      <div>
        <label htmlFor="g-description" className={field.label}>概要</label>
        <textarea
          id="g-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearError("description");
          }}
          maxLength={LIMITS.goodsDescription}
          rows={3}
          aria-invalid={!!errors.description}
          className={field.input}
          placeholder="サイズ、種類数、購入制限など"
        />
        {errors.description && <p className={field.error}>{errors.description}</p>}
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button type="submit" disabled={busy || !online} className={`${btn.primary} sm:min-w-36`}>
            {saving === "save" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {item ? "保存する" : "保存して一覧へ"}
          </button>
          {!item && (
            <button type="button" onClick={() => requestSave("continue")} disabled={busy || !online} className={btn.secondary}>
              {saving === "continue" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              保存して続けて追加
            </button>
          )}
        </div>
        {item && (
          <button type="button" onClick={() => setConfirmDelete(true)} disabled={busy || !online} className={btn.danger}>
            このグッズを削除
          </button>
        )}
      </div>
      {!online && <p className="text-sm text-amber-700 dark:text-amber-400">オフラインのため保存できません。</p>}

      <ConfirmDialog
        open={confirmDelete}
        title={`「${item?.name ?? ""}」を削除しますか？`}
        confirmLabel="削除する"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        一覧から表示されなくなります。この操作は元に戻せません。
      </ConfirmDialog>
      <ConfirmDialog
        open={!!pending}
        title="この内容で保存しますか？"
        confirmLabel="保存する"
        busy={saving !== false}
        onConfirm={() => pending && save(pending.mode)}
        onCancel={() => setPending(null)}
      >
        <ul className="list-disc space-y-1 pl-5">
          {pending?.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </ConfirmDialog>
    </form>
  );
}
