"use client";
// ============================================================
// Storage へのアップロード（パス規約をここに集約）
//
//   {event_id}/{goods_id | "cover"}/{uuid}-full.{ext}
//   {event_id}/{goods_id | "cover"}/{uuid}-thumb.{ext}
//
// 先頭フォルダの event_id で RLS（オーナーのみ書込）が判定される。
// ============================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import { newUuid } from "../uuid";
import { GOODS_BUCKET } from "../env";
import type { ProcessedImage } from "./preprocess";

export interface UploadedImage {
  fullPath: string;
  thumbPath: string;
}

export async function uploadProcessedImage(
  supabase: SupabaseClient,
  eventId: string,
  folder: string,
  img: ProcessedImage
): Promise<UploadedImage> {
  const id = newUuid();
  const fullPath = `${eventId}/${folder}/${id}-full.${img.ext}`;
  const thumbPath = `${eventId}/${folder}/${id}-thumb.${img.ext}`;
  const opts = { contentType: img.mime, cacheControl: "31536000", upsert: false };

  const [a, b] = await Promise.all([
    supabase.storage.from(GOODS_BUCKET).upload(fullPath, img.full, opts),
    supabase.storage.from(GOODS_BUCKET).upload(thumbPath, img.thumb, opts),
  ]);
  if (a.error || b.error) {
    // 片方だけ成功した場合も孤児ファイルを残さない
    await removeImages(supabase, [fullPath, thumbPath]);
    throw new Error("upload failed");
  }
  return { fullPath, thumbPath };
}

export async function removeImages(supabase: SupabaseClient, paths: (string | null | undefined)[]) {
  const list = paths.filter((p): p is string => !!p);
  if (list.length === 0) return;
  // 削除失敗は致命的ではない（容量の無駄のみ）。ユーザー操作は止めない。
  await supabase.storage.from(GOODS_BUCKET).remove(list).catch(() => undefined);
}

export async function signImage(supabase: SupabaseClient, path: string, ttlSec = 3600): Promise<string | null> {
  const { data } = await supabase.storage.from(GOODS_BUCKET).createSignedUrl(path, ttlSec);
  return data?.signedUrl ?? null;
}
