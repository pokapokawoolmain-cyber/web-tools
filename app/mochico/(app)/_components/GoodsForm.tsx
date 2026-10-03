"use client";
// グッズの登録・編集フォーム。新規は「保存して続けて追加」で連続登録できる。
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { newUuid } from "@/lib/goods/uuid";
import { removeImages, uploadProcessedImage } from "@/lib/goods/image/storage";
import { LIMITS, friendlyDbError, parsePrice, validateGoods, type FieldErrors } from "@/lib/goods/validation";
import type { GoodsItem } from "@/lib/goods/types";
import { btn, field } from "@/lib/goods/ui";
import { ImagePicker, type ImageChange } from "./ImagePicker";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  eventId: string;
  item?: GoodsItem;
  categories: string[];
  nextSortOrder: number;
}

export function GoodsForm({ eventId, item, categories, nextSortOrder }: Props) {
  const router = useRouter();
  const toast = useToast();
  const online = useOnline();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [image, setImage] = useState<ImageChange>({ kind: "keep" });
  const [errors, setErrors] = useState<FieldErrors>({});
  // 入力し直したらその欄のエラーは消す（直したのに赤いままにしない）
  const clearError = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  const [saving, setSaving] = useState<false | "save" | "continue">(false);
  const [sortOrder, setSortOrder] = useState(nextSortOrder);
  const [addedCount, setAddedCount] = useState(0);
  const [knownCategories, setKnownCategories] = useState(categories);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function resetForNext() {
    setName("");
    setPrice("");
    setDescription("");
    setImage({ kind: "keep" });
    setErrors({});
    // カテゴリは続けて同じものを登録することが多いので残す
    nameRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(mode: "save" | "continue") {
    const errs = validateGoods({ name, price, category, description });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(`g-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSaving(mode);
    const supabase = goodsBrowserClient();
    const goodsId = item?.id ?? newUuid();
    let uploaded: { fullPath: string; thumbPath: string } | null = null;

    try {
      if (image.kind === "new") {
        try {
          uploaded = await uploadProcessedImage(supabase, eventId, goodsId, image.img);
        } catch {
          throw { message: "image upload failed", userMessage: "画像をアップロードできませんでした。通信環境を確認してもう一度お試しください。" };
        }
      }
      const base = {
        name: name.trim(),
        price: parsePrice(price),
        category: category.trim() || null,
        description: description.trim() || null,
      };
      const imageCols =
        image.kind === "new"
          ? { image_path: uploaded!.fullPath, thumb_path: uploaded!.thumbPath }
          : image.kind === "remove"
            ? { image_path: null, thumb_path: null }
            : {};

      if (item) {
        const { error } = await supabase.from("goods").update({ ...base, ...imageCols }).eq("id", item.id);
        if (error) throw error;
        if (image.kind !== "keep") await removeImages(supabase, [item.imagePath, item.thumbPath]);
      } else {
        const { error } = await supabase.from("goods").insert({ id: goodsId, event_id: eventId, sort_order: sortOrder, ...base, ...imageCols });
        if (error) throw error;
      }

      if (base.category && !knownCategories.includes(base.category)) setKnownCategories((c) => [...c, base.category!]);

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
      if (uploaded) await removeImages(supabase, [uploaded.fullPath, uploaded.thumbPath]);
      setSaving(false);
      const e = err as { userMessage?: string; code?: string; message?: string };
      toast.show(e.userMessage ?? friendlyDbError(e), { tone: "error" });
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
        save("save");
      }}
      noValidate
      className="space-y-6"
    >
      {addedCount > 0 && (
        <p role="status" className="rounded-xl bg-pink-50 px-4 py-3 text-sm font-medium text-pink-800 dark:bg-pink-950/40 dark:text-pink-200">
          このイベントに {addedCount} 件追加しました。続けて登録できます。
        </p>
      )}

      <ImagePicker label="グッズ写真" currentUrl={item?.thumbUrl ?? null} value={image} onChange={setImage} disabled={busy} />

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

      <div className="grid grid-cols-2 gap-3">
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
        </div>
        <div>
          <label htmlFor="g-category" className={field.label}>カテゴリ</label>
          <input
            id="g-category"
            list="goods-categories"
            value={category}
            onChange={(e) => {
            setCategory(e.target.value);
            clearError("category");
          }}
            maxLength={LIMITS.category}
            aria-invalid={!!errors.category}
            className={field.input}
            placeholder="例: ランダム"
            autoComplete="off"
          />
          <datalist id="goods-categories">
            {knownCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        {errors.price && <p id="g-price-err" className={`${field.error} col-span-2`}>{errors.price}</p>}
        {errors.category && <p className={`${field.error} col-span-2`}>{errors.category}</p>}
      </div>

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
            <button type="button" onClick={() => save("continue")} disabled={busy || !online} className={btn.secondary}>
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
    </form>
  );
}
