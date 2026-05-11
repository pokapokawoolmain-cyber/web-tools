export type BlogFaq = { q: string; a: string };

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
  faqs?: BlogFaq[];
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
    faqs: [
      { q: "FIREに必要な資産の計算式は？", a: "年間生活費 ÷ 4%（0.04）が基本です。年間生活費300万円なら7,500万円、400万円なら1億円が目安になります。" },
      { q: "4%ルールは日本でも使えますか？", a: "参考程度には使えますが、米国株中心の想定なのでそのまま適用は注意が必要です。日本の税制・社会保険・物価を考慮し、3〜3.5%で試算するほうが安全です。" },
      { q: "FIRE後に税金はかかりますか？", a: "運用益・配当には20.315%の税金がかかります。新NISAの枠内であれば非課税ですが、枠を超えた分は課税対象です。また国民健康保険料も収入に応じてかかります。" },
      { q: "FIREシミュレーターで試算できますか？", a: "はい。当サイトの無料FIREシミュレーターに資産・毎月の積立額・運用利回り・目標生活費を入力すると、FIRE達成年数と必要資産額を即座に計算できます。" },
    ],
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
    faqs: [
      { q: "新NISAは月いくらから始められますか？", a: "証券会社によりますが100円から積み立て可能です。つみたて投資枠の年間上限は120万円（月換算10万円）です。" },
      { q: "新NISAの非課税メリットはどのくらいですか？", a: "例えば月5万円・利回り5%・20年間の場合、課税口座なら運用益約1,225万円に約249万円の税金がかかりますが、NISAなら全額手元に残ります。" },
      { q: "利回り何%で計算するのが現実的ですか？", a: "全世界株式・S&P500インデックスファンドの過去実績は年率5〜7%程度です。保守的に見るなら3〜4%で試算するのが無難です。" },
      { q: "新NISAの非課税保有限度額は？", a: "1人あたり1,800万円（うち成長投資枠1,200万円）です。売却すると翌年以降に枠が復活する仕組みです。" },
    ],
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
    faqs: [
      { q: "年収500万円の手取りはいくらですか？", a: "独身・会社員の場合、おおよそ年間388万円前後（月約32万円）が目安です。社会保険料・所得税・住民税で約112万円程度が引かれます。" },
      { q: "年収700万円の手取りはいくらですか？", a: "独身・会社員の場合、おおよそ年間520万円前後（月約43万円）が目安です。手取り率は約74%になります。" },
      { q: "手取りを増やすための節税方法は？", a: "iDeCo（掛金が全額所得控除）、ふるさと納税（実質2,000円で返礼品）、住宅ローン控除などが代表的です。特にiDeCoは年収700万円で年間20万円以上の節税効果がある場合もあります。" },
      { q: "社会保険料の計算方法は？", a: "健康保険料・厚生年金保険料は標準報酬月額に料率をかけて計算します。会社と折半のため、実際の負担は標準報酬月額の約14〜15%程度です。" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
