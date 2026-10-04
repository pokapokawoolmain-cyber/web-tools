"use client";
// ============================================================
// IndexedDB キャッシュ（正本ではない）
//
// 用途:
//   * 直近に表示したイベントのスナップショット（通信できない時の閲覧用）
//   * UI state（イベントごとのフィルター）
//
// 正本は常に Supabase。ここが消えても（ブラウザデータ削除・端末変更）
// ユーザーのコレクションは失われない。書き込みは必ずクラウドへ直接行う。
// IndexedDB が使えない環境（プライベートブラウズ等）では何もせず黙って諦める。
// ============================================================
import type { GoodsEvent, GoodsItem, OwnershipStatus } from "../types";

const DB_NAME = "toolbox-goods";
const DB_VERSION = 1;
const SNAPSHOTS = "event_snapshots";
const UI = "ui_state";

export interface EventSnapshot {
  userId: string;
  eventId: string;
  event: GoodsEvent;
  goods: GoodsItem[];
  statuses: Record<string, OwnershipStatus>;
  isOwner: boolean;
  savedAt: number;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function open(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") return resolve(null);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(SNAPSHOTS)) db.createObjectStore(SNAPSHOTS);
        if (!db.objectStoreNames.contains(UI)) db.createObjectStore(UI);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

async function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> {
  const db = await open();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

const snapKey = (userId: string, eventId: string) => `${userId}:${eventId}`;

export async function saveSnapshot(s: EventSnapshot) {
  await run(SNAPSHOTS, "readwrite", (st) => st.put(s, snapKey(s.userId, s.eventId)));
}

/** 別ユーザーのキャッシュは返さない（共有端末での取り違え防止） */
export async function loadSnapshot(userId: string, eventId: string): Promise<EventSnapshot | undefined> {
  const s = await run<EventSnapshot>(SNAPSHOTS, "readonly", (st) => st.get(snapKey(userId, eventId)));
  return s && s.userId === userId ? s : undefined;
}

export async function saveUiState(key: string, value: unknown) {
  await run(UI, "readwrite", (st) => st.put(value, key));
}

export async function loadUiState<T>(key: string): Promise<T | undefined> {
  return run<T>(UI, "readonly", (st) => st.get(key));
}

/** ログアウト時に呼ぶ。共有端末に他人のコレクションを残さない */
export async function clearGoodsCache() {
  await run(SNAPSHOTS, "readwrite", (st) => st.clear());
  await run(UI, "readwrite", (st) => st.clear());
}
