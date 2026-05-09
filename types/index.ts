// ========================================
// 共通型定義ファイル
// ツールを追加するときはここに型を追加する
// ========================================

/** ツール一覧で使うカードの型 */
export type Tool = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string; // emoji or lucide icon name
  category: ToolCategory;
  isNew?: boolean;
  isPopular?: boolean;
  keywords: string[]; // SEO用キーワード
};

/** ツールカテゴリ */
export type ToolCategory =
  | "finance"   // お金・投資
  | "image"     // 画像変換・圧縮
  | "pdf"       // PDF系
  | "calc"      // 計算ツール
  | "text"      // テキスト系
  | "lifestyle"; // 生活・副業

/** SEO用メタデータの型 */
export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
};

/** ツールページの共通Props */
export type ToolPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** ブログ記事の型（将来的な記事追加用） */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTime: number;
};
