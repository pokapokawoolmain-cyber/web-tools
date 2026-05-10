export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  relatedToolId?: string;
  relatedToolHref?: string;
  readingMinutes: number;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "fire-how-much-needed",
    title: "FIREに必要な資産はいくら？年収・生活費別にシミュレーションしてみた",
    description: "「FIRE達成には何億必要？」という疑問に、年収300〜800万円・生活費別のシミュレーション結果で正直に答えます。4%ルールの限界と、日本での現実的なFIRE戦略も。",
    publishedAt: "2026-05-10",
    category: "お金・投資",
    relatedToolId: "fire-simulator",
    relatedToolHref: "/tools/fire-simulator",
    readingMinutes: 9,
  },
  {
    slug: "nisa-monthly-simulation",
    title: "新NISAを毎月いくら積み立てると何年後にいくらになる？複数パターンで計算",
    description: "月3万・5万・10万円で30年積み立てたら実際いくらになるか。利回り3%・5%・7%の3シナリオで徹底シミュレーション。新NISAの非課税メリットを具体的な金額で確認。",
    publishedAt: "2026-05-10",
    category: "お金・投資",
    relatedToolId: "nisa-calculator",
    relatedToolHref: "/tools/nisa-calculator",
    readingMinutes: 8,
  },
  {
    slug: "salary-takehome-table",
    title: "年収400〜1000万円の手取り早見表【2024年版】税金・社会保険料の内訳も解説",
    description: "額面年収から実際の手取りを年収別一覧で紹介。所得税・住民税・健康保険・厚生年金の計算方法と、手取りを増やすための合法的な節税ポイントも。",
    publishedAt: "2026-05-10",
    category: "お金・投資",
    relatedToolId: "net-income",
    relatedToolHref: "/tools/net-income",
    readingMinutes: 10,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
