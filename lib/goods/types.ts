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

/** 商品の種類。ランダム商品は絵柄（variant）ごとに数量を持つ */
export type GoodsKind = "normal" | "random";

/** イベント内のカテゴリ（共有カタログ） */
export interface GoodsCategory {
  id: string;
  name: string;
  sortOrder: number;
}

/** 商品紹介用の画像（sortOrder 0 が代表画像） */
export interface GoodsImage {
  id: string;
  imagePath: string;
  thumbPath: string;
  sortOrder: number;
  /** 署名付きURL（サムネ）。詳細表示の原寸は開いたときに署名する */
  thumbUrl: string | null;
}

/** ランダム商品の絵柄（所持管理の対象） */
export interface GoodsVariant {
  id: string;
  name: string;
  imagePath: string | null;
  thumbPath: string | null;
  sortOrder: number;
  thumbUrl: string | null;
}

export interface GoodsItem {
  id: string;
  eventId: string;
  name: string;
  price: number | null;
  description: string | null;
  /** 代表画像（goods_images の先頭の写し） */
  imagePath: string | null;
  thumbPath: string | null;
  category: string | null;
  categoryId: string | null;
  kind: GoodsKind;
  sortOrder: number;
  /** 署名付きURL（一覧用サムネ）。画像なし・取得失敗は null */
  thumbUrl: string | null;
  /** 署名付きURL（詳細表示用） */
  imageUrl: string | null;
  /** 商品紹介用の画像（代表画像を含む）。一覧の読み込みでは件数の少ない情報だけ */
  images: GoodsImage[];
  /** ランダム商品の絵柄（通常商品は空）。削除（論理削除）した絵柄は含まない */
  variants: GoodsVariant[];
  /** 編集画面だけ: 削除（論理削除）した絵柄。戻すと参加者の数量も戻る */
  archivedVariants?: GoodsVariant[];
}

/**
 * 自分の所持数量。キーは通常商品 = goodsId、ランダム商品の絵柄 = `${goodsId}:${variantId}`
 * 0 / キーなし = 未所持
 */
export type Quantities = Record<string, number>;

export const qtyKey = (goodsId: string, variantId?: string | null) => (variantId ? `${goodsId}:${variantId}` : goodsId);

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
