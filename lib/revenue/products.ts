// ============================================================
// Revenue Experiment（Phase Revenue 0）商品仮説の定義
//
// Image Pro と Seller を同じ形のデータで持つことで、LP側の実装も
// 完全に共通コンポーネントにできる（=同一の計測基盤・同一のUXで比較できる）。
// ここは「商品仮説」であり実装仕様ではない。価格・訴求はGO/NO-GO判断の
// 材料として意図的に変えているだけで、確定した本実装の仕様ではない。
// ============================================================
import type { RevenueProduct } from "@/lib/analytics/events";

export type PriceModel = "monthly" | "yearly_flat";

export interface ProductUseCase {
  title: string;
  steps: string[];
}

export interface ProductConfig {
  id: RevenueProduct;
  path: string;
  name: string;
  tagline: string;
  /** LPで明示する価格（隠さない）。 */
  price: number;
  priceModel: PriceModel;
  priceLabel: string;
  /** 価格直下に並べる短い事実（自動更新なし等）。誤認防止のため箇条書きで明示する。 */
  priceBullets: string[];
  priceNote: string;
  /** 対象読者。LP冒頭で1行に絞って提示する。 */
  audience: string;
  /** 主役となるユースケース。機能一覧ではなく1〜2個に絞る。 */
  useCases: ProductUseCase[];
  /** 補助情報として小さく見せる構想機能。 */
  plannedFeatures: string[];
  /** LP末尾の誠実な注記（保証しないことの明示等）。 */
  disclaimer?: string;
  /** 既存ツール内バナーから使う遷移用の文言（「◯◯を見る」＝LPへの案内として自然）。 */
  bannerCtaLabel: string;
  /** LP本体のCTA文言。価格を見た上での利用意向を測るため、「見る」ではなく意向表明の文言にする。 */
  lpCtaLabel: string;
}

export const REVENUE_PRODUCTS: Record<RevenueProduct, ProductConfig> = {
  image_pro: {
    id: "image_pro",
    path: "/pro/image-pro",
    name: "ToolBoxJP Image Pro",
    tagline: "大量の画像処理を、一度で。",
    price: 980,
    priceModel: "monthly",
    priceLabel: "月額980円",
    priceBullets: ["いつでも解約できます", "追加料金なし"],
    priceNote: "処理はすべてブラウザ内で完結し、画像はサーバーに送信されません。",
    audience: "EC事業者・Web制作者・不動産・大量画像を定期的に扱う業務ユーザー向け",
    useCases: [
      {
        title: "EC事業者：商品画像をまとめて出品準備",
        steps: ["商品画像50枚を選択", "WebP変換 → 圧縮 → リサイズ", "設定を保存して次回も同じ手順を1クリックで", "ZIPで一括ダウンロード"],
      },
      {
        title: "Web制作者：納品前の一括最適化",
        steps: ["納品用フォルダの画像を一括選択", "毎回同じ書き出し設定を適用", "クライアントごとのプリセットを呼び出し", "そのまま納品用ZIPを作成"],
      },
    ],
    plannedFeatures: [
      "処理プリセットの保存・呼び出し",
      "複数処理の連続実行（変換→圧縮→リサイズを1回で）",
      "ファイル名の一括整理",
      "EC向け・Web制作向けのテンプレート",
      "広告非表示",
    ],
    bannerCtaLabel: "Image Proを見る",
    lpCtaLabel: "Image Proを使ってみたい",
  },
  seller: {
    id: "seller",
    path: "/pro/seller",
    name: "ToolBoxJP Seller",
    tagline: "売れたのに、いくら儲かったか分からない。を終わりに。",
    price: 2980,
    priceModel: "yearly_flat",
    priceLabel: "1年間 2,980円",
    priceBullets: ["自動更新なし", "追加料金なし"],
    priceNote:
      "購入後1年間ご利用いただけます。期限が来ても自動的に課金されることはありません。翌年度も続けて使う場合は、その時点で改めてご購入いただく形を想定しています（参考: 月あたり換算で約248円）。",
    audience: "Amazon・メルカリ等のネット物販を行う個人事業主・副業セラー向け",
    useCases: [
      {
        title: "複数販売先の利益を1か所で把握",
        steps: ["Amazon・メルカリ等の売上を記録", "仕入・手数料・送料を自動計算", "月次の利益・利益率を自動集計", "確定申告前にCSVで一括書き出し"],
      },
    ],
    plannedFeatures: [
      "販売先別の手数料自動計算",
      "月次集計・利益率グラフ",
      "在庫の仕入原価管理",
      "CSVインポート・エクスポート",
      "クラウド保存（複数端末で同じデータを参照）",
    ],
    disclaimer:
      "Sellerは物販の売上・仕入・利益を日常的に管理するための記帳補助アプリです。税務判断や確定申告の正確性を保証するものではありません。申告内容は税理士・税務署にご確認ください。",
    bannerCtaLabel: "Sellerを見る",
    lpCtaLabel: "Sellerを使ってみたい",
  },
};

export function getProductConfig(id: RevenueProduct): ProductConfig {
  return REVENUE_PRODUCTS[id];
}
