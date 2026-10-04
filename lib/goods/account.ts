import "server-only";
// ============================================================
// 退会（アカウント削除）と cleanup（サーバー専用・service role 使用）
//
// 退会の順序:
//   1. goods_prepare_account_deletion（DB・1トランザクション）
//        共有リンク失効 → 参加者0人のイベントは削除 / 参加者ありは preserved（owner_id = NULL）
//   2. 削除したイベントの画像を Storage API で削除（SQL から Storage の実体は消せない）
//   3. auth ユーザー削除（profiles・本人の membership・ownership は CASCADE、他は SET NULL）
// 途中で失敗しても、もう一度実行すれば続きから完了する（どの段階も冪等）。
// 取りこぼした画像は cleanup の「Storage 孤立フォルダ掃除」で回収する。
// ============================================================
import { GOODS_BUCKET } from "./env";
import { goodsAdminClient } from "./supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** イベントフォルダ配下（{eventId}/{goodsId|cover}/{file}）の画像をすべて削除する */
export async function purgeEventStorage(eventIds: string[]): Promise<number> {
  const admin = goodsAdminClient();
  const bucket = admin.storage.from(GOODS_BUCKET);
  let removed = 0;
  for (const eventId of eventIds) {
    if (!UUID_RE.test(eventId)) continue; // 想定外のパスは絶対に消さない
    const paths: string[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data: folders, error } = await bucket.list(eventId, { limit: 1000, offset });
      if (error) throw new Error("storage list failed");
      for (const f of folders ?? []) {
        if (f.id) {
          paths.push(`${eventId}/${f.name}`); // 直下のファイル（通常は無い）
          continue;
        }
        for (let o2 = 0; ; o2 += 1000) {
          const { data: files, error: e2 } = await bucket.list(`${eventId}/${f.name}`, { limit: 1000, offset: o2 });
          if (e2) throw new Error("storage list failed");
          for (const file of files ?? []) if (file.id) paths.push(`${eventId}/${f.name}/${file.name}`);
          if (!files || files.length < 1000) break;
        }
      }
      if (!folders || folders.length < 1000) break;
    }
    for (let i = 0; i < paths.length; i += 500) {
      const { error } = await bucket.remove(paths.slice(i, i + 500));
      if (error) throw new Error("storage remove failed");
      removed += Math.min(500, paths.length - i);
    }
  }
  return removed;
}

export interface AccountDeletionResult {
  deletedEventIds: string[];
  preservedEventIds: string[];
  removedImages: number;
}

export async function deleteAccount(userId: string): Promise<AccountDeletionResult> {
  if (!UUID_RE.test(userId)) throw new Error("invalid user id");
  const admin = goodsAdminClient();

  const { data, error } = await admin.rpc("goods_prepare_account_deletion", { p_user: userId });
  if (error || !data) throw new Error("prepare failed");
  const { deleted_event_ids: deletedEventIds, preserved_event_ids: preservedEventIds } = data as {
    deleted_event_ids: string[];
    preserved_event_ids: string[];
  };

  const removedImages = await purgeEventStorage(deletedEventIds);

  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) throw new Error("auth delete failed");

  return { deletedEventIds, preservedEventIds, removedImages };
}

export interface CleanupResult {
  deletedEventIds: string[];
  orphanStorageEventIds: string[];
  removedImages: number;
}

/**
 * オーナー不在・参加者0人になってから grace 経過したイベントを削除し、
 * DB にイベントが無いのに Storage に残っている画像フォルダも削除する。
 */
export async function runOrphanCleanup(graceSeconds = 7 * 24 * 60 * 60): Promise<CleanupResult> {
  const admin = goodsAdminClient();
  const { data: deleted, error } = await admin.rpc("goods_cleanup_orphaned_events", { p_grace: `${Math.max(0, Math.floor(graceSeconds))} seconds` });
  if (error) throw new Error("cleanup failed");
  const deletedEventIds = (deleted as string[] | null) ?? [];

  const { data: orphans, error: oErr } = await admin.rpc("goods_orphan_storage_event_ids");
  if (oErr) throw new Error("orphan scan failed");
  const orphanIds = ((orphans as string[] | null) ?? []).filter((id) => !deletedEventIds.includes(id));

  const removedImages = await purgeEventStorage([...deletedEventIds, ...orphanIds]);
  return { deletedEventIds, orphanStorageEventIds: orphanIds, removedImages };
}
