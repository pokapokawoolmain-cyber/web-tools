// ============================================================
// SNS Starter Kit 先行予約 — 保存先アダプタ（サーバー専用。Route Handler からのみ import する）
//
// SNS_KIT_RESERVATION_STORE:
//   supabase : 本番。Supabase REST(PostgREST) へ service role で INSERT する。
//              依存追加を避けるため supabase-js は使わず fetch で呼ぶ。
//   fs       : ローカル開発・QA専用。JSONファイルへ保存する（本番では使えない）。
//   未設定    : 保存先なし。API は "unavailable" を返し、フォームは受付準備中を表示する
//              （「送信できたのにどこにも保存されていない」事故を構造的に防ぐ）。
//
// 重複の扱い: email（小文字化済み）で一意。既存があれば "duplicate" を返す（保存はしない）。
// API はこの区別を応答に出さない（メールアドレスの登録有無を漏らさないため）。
// ============================================================

import { randomUUID } from "node:crypto";
import type { ReservationInput, ReservationStatus } from "./reservation";

export interface ReservationRecord {
  reservation_id: string;
  email: string;
  experience_type: string;
  community_description: string;
  use_within_30_days: string;
  purchase_notification_consent: boolean;
  marketing_consent: boolean;
  consent_version: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  status: ReservationStatus;
}

export type SaveResult = "created" | "duplicate";

export interface ReservationStore {
  save(input: ReservationInput): Promise<SaveResult>;
}

export function toRecord(input: ReservationInput): ReservationRecord {
  return {
    reservation_id: randomUUID(),
    email: input.email,
    experience_type: input.experienceType,
    community_description: input.communityDescription,
    use_within_30_days: input.useWithin30Days,
    purchase_notification_consent: input.purchaseNotificationConsent,
    marketing_consent: input.marketingConsent,
    consent_version: input.consentVersion,
    source: input.source,
    utm_source: input.utmSource,
    utm_medium: input.utmMedium,
    utm_campaign: input.utmCampaign,
    created_at: new Date().toISOString(),
    status: "reserved",
  };
}

// ── Supabase（本番） ──────────────────────────────────────────
const TABLE = "sns_starter_kit_reservations";

function supabaseStore(url: string, serviceKey: string): ReservationStore {
  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/${TABLE}`;
  return {
    async save(input) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          // 旧形式（JWT）の service_role key のときだけ Authorization に載せる。
          // 新形式の secret key（sb_secret_...）は apikey ヘッダーだけで認証される。
          ...(serviceKey.startsWith("eyJ") ? { Authorization: `Bearer ${serviceKey}` } : {}),
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        // created_at は DB の now() を正とする（サーバー時計に依存しない）
        body: JSON.stringify({ ...toRecord(input), created_at: undefined }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 201 || res.status === 204) return "created";
      if (res.status === 409) return "duplicate"; // 一意制約違反（email）
      // 応答本文には入力値が含まれ得るため、ログにはステータスだけを出す
      throw new Error(`reservation insert failed: HTTP ${res.status}`);
    },
  };
}

// ── ファイル（ローカル開発・QA専用） ───────────────────────────
function fsStore(dir: string): ReservationStore {
  // 同一プロセス内の直列化（ダブルクリック等の同時送信で重複行を作らない）
  let queue: Promise<unknown> = Promise.resolve();
  return {
    save(input) {
      const run = async (): Promise<SaveResult> => {
        const { mkdir, readFile, writeFile } = await import("node:fs/promises");
        const path = await import("node:path");
        await mkdir(dir, { recursive: true });
        const file = path.join(dir, "reservations.json");
        let rows: ReservationRecord[] = [];
        try {
          rows = JSON.parse(await readFile(file, "utf8")) as ReservationRecord[];
        } catch {
          rows = [];
        }
        if (rows.some((r) => r.email === input.email)) return "duplicate";
        rows.push(toRecord(input));
        await writeFile(file, JSON.stringify(rows, null, 2), "utf8");
        return "created";
      };
      const p = queue.then(run, run);
      queue = p.catch(() => undefined);
      return p;
    },
  };
}

/** 設定から保存先を決める。保存先が無ければ null（= 受付不可）。 */
export function getReservationStore(): ReservationStore | null {
  const mode = process.env.SNS_KIT_RESERVATION_STORE?.trim();

  if (mode === "supabase") {
    const url = process.env.SNS_KIT_SUPABASE_URL?.trim();
    const key = process.env.SNS_KIT_SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return supabaseStore(url, key);
  }

  if (mode === "fs") {
    // ファイル保存は本番では絶対に使わない（Vercelのファイルシステムは永続しない）
    if (process.env.VERCEL_ENV === "production") return null;
    return fsStore(process.env.SNS_KIT_RESERVATION_DIR?.trim() || ".sns-kit-data");
  }

  return null;
}

/** QA用: 障害を再現するための強制失敗。開発環境でのみ有効。 */
export function forcedFailureForQa(): "server_error" | null {
  if (process.env.NODE_ENV === "production") return null;
  return process.env.SNS_KIT_RESERVATION_FORCE_ERROR === "1" ? "server_error" : null;
}
