// /goods のドメイン型。DB列名はこのファイルと data.ts の中だけで扱う。

/** MVP の UI が扱う所持状態。DB は将来 wanted / reserved 等を追加できる。 */
export type OwnershipStatus = "unowned" | "owned";

export interface GoodsEvent {
  id: string;
  /** 作成者が退会した保存済みイベントでは null */
  ownerId: string | null;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  coverImagePath: string | null;
  coverUrl: string | null;
  deletedAt: string | null;
  /** 作成者が退会し、参加者のために読み取り専用で残っている */
  preserved: boolean;
}

export interface GoodsItem {
  id: string;
  eventId: string;
  name: string;
  price: number | null;
  description: string | null;
  imagePath: string | null;
  thumbPath: string | null;
  category: string | null;
  sortOrder: number;
  /** 署名付きURL（一覧用サムネ）。画像なし・取得失敗は null */
  thumbUrl: string | null;
  /** 署名付きURL（詳細表示用） */
  imageUrl: string | null;
}

export interface MyEventSummary {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  coverUrl: string | null;
  role: "owner" | "member";
  total: number;
  owned: number;
  /** 作成者が削除したイベント（参加者にだけ「削除済み」として残る） */
  deleted: boolean;
  /** 作成者が退会したイベント（読み取り専用で残る） */
  preserved: boolean;
}
