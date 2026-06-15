// ============================================================
// 広告掲載ポリシー（ページ種別ごとの可否・推奨枠数）
//
// 「全ページに広告基盤はあるが、出すべきでないページには出さない」を
// コードで一元管理する。各ページは自分の PageType を宣言し、
// canShowAds() / maxAdsFor() に従って AdSlot を出すか決める。
//
// 法務・問い合わせ・エラー・低コンテンツページは広告禁止。
// ツールページは操作性最優先で「操作領域から離れた下部」に限定。
// ============================================================

export type PageType =
  | "home" // トップ
  | "toolsIndex" // ツール一覧
  | "category" // カテゴリTOP
  | "tool" // 個別ツール
  | "blogIndex" // ブログ一覧
  | "blogArticle" // ブログ記事
  | "landing" // 手取り等のSEOランディング
  | "subsidy" // 補助金（情報量の多い案内）
  | "legal" // about/privacy/terms/contact/disclaimer
  | "error" // 404/500
  | "thin"; // 低コンテンツ・未完成・結果のみ等

type Policy = {
  /** 広告を出してよいか */
  allow: boolean;
  /** 出してよい最大枠数（コンテンツ量に応じ各ページでさらに絞る） */
  max: number;
  /** 補足（レビュー用メモ） */
  note: string;
};

const POLICY: Record<PageType, Policy> = {
  home: { allow: true, max: 2, note: "ファーストビュー直下は不可。説明・人気ツールの後に1〜2枠" },
  toolsIndex: { allow: true, max: 2, note: "カテゴリ説明後・カード群の後。カードに混在させない" },
  category: { allow: true, max: 2, note: "説明後・カード6〜8件後・解説後" },
  tool: { allow: true, max: 2, note: "操作領域から離れた下部のみ。説明が薄いツールは0〜1枠" },
  blogIndex: { allow: true, max: 2, note: "一覧の途中・末尾。記事カードに混在させない" },
  blogArticle: { allow: true, max: 3, note: "長さに応じ1〜3。見出し直後の機械挿入は不可" },
  landing: { allow: true, max: 2, note: "本文の自然な区切り・末尾" },
  subsidy: { allow: true, max: 2, note: "案内文の後。診断フォーム・結果直近は不可" },
  legal: { allow: false, max: 0, note: "法務・問い合わせ・運営者情報は広告禁止" },
  error: { allow: false, max: 0, note: "404/500/エラー画面は広告禁止" },
  thin: { allow: false, max: 0, note: "低コンテンツ・未完成・結果のみは広告禁止" },
};

export function canShowAds(pageType: PageType): boolean {
  return POLICY[pageType].allow;
}

export function maxAdsFor(pageType: PageType): number {
  return POLICY[pageType].max;
}

export function policyNote(pageType: PageType): string {
  return POLICY[pageType].note;
}

/**
 * ブログ記事の本文の長さ（おおよその文字数）から推奨枠数を返す。
 * 短い記事=1 / 標準=2 / 十分長い=3。
 */
export function blogAdCount(approxChars: number): 0 | 1 | 2 | 3 {
  if (approxChars < 1500) return 1;
  if (approxChars < 4000) return 2;
  return 3;
}
