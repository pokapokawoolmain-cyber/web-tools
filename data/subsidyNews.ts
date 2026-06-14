export type NewsCategory =
  | "公募開始"
  | "公募終了"
  | "締切間近"
  | "制度変更"
  | "採択結果"
  | "新制度"
  | "重要";

export type NewsRegion = "全国" | string;

export interface SubsidyNewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  region: NewsRegion;
  subsidyId?: string;
  subsidyName?: string;
  publishedAt: string;
  updatedAt?: string;
  officialUrl: string;
  sourceLabel: string;
  isNew: boolean;
  isImportant: boolean;
  tags: string[];
}

export const SUBSIDY_NEWS: SubsidyNewsItem[] = [
  {
    id: "news-2026-001",
    title: "IT導入補助金2025：通常枠・インボイス枠の受付が継続中",
    summary:
      "IT導入補助金2025は通常枠（補助率1/2、上限450万円）およびインボイス枠での申請受付を継続しています。ITベンダー登録済みのツール導入が対象。事業者登録が必要です。",
    category: "公募開始",
    region: "全国",
    subsidyId: "it-donyu",
    subsidyName: "IT導入補助金",
    publishedAt: "2026-04-01",
    updatedAt: "2026-05-01",
    officialUrl: "https://www.it-hojo.jp/",
    sourceLabel: "IT導入補助金事務局",
    isNew: false,
    isImportant: true,
    tags: ["IT導入", "インボイス", "DX"],
  },
  {
    id: "news-2026-002",
    title: "ものづくり補助金：第20次締切が2026年5月末に迫る",
    summary:
      "ものづくり・商業・サービス生産性向上促進補助金の第20次公募締切が2026年5月下旬に迫っています。省力化・グリーン枠の申請を検討中の方はお早めにご準備ください。",
    category: "締切間近",
    region: "全国",
    subsidyId: "monodukuri",
    subsidyName: "ものづくり補助金",
    publishedAt: "2026-05-01",
    officialUrl: "https://portal.monodukuri-hojo.jp/",
    sourceLabel: "ものづくり補助事業公式サイト",
    isNew: false,
    isImportant: true,
    tags: ["ものづくり", "製造", "省力化", "グリーン"],
  },
  {
    id: "news-2026-003",
    title: "小規模事業者持続化補助金：第17回公募が受付中",
    summary:
      "小規模事業者持続化補助金の第17回公募が開始されました。通常枠（上限50万円）のほか、賃金引上げ枠（上限200万円）、後継者支援枠なども受付中です。商工会・商工会議所の支援を受けて申請します。",
    category: "公募開始",
    region: "全国",
    subsidyId: "jizokuka",
    subsidyName: "小規模事業者持続化補助金",
    publishedAt: "2026-04-15",
    officialUrl: "https://jizokukahojokin.info/",
    sourceLabel: "持続化補助金事務局",
    isNew: false,
    isImportant: false,
    tags: ["小規模事業者", "販路開拓", "賃金引上げ"],
  },
  {
    id: "news-2026-004",
    title: "業務改善助成金：2026年度の受付を開始",
    summary:
      "厚生労働省の業務改善助成金（2026年度）の受付が開始されました。設備投資等により事業場内最低賃金を30円以上引き上げる場合に、設備投資費用の一部を助成します。上限600万円（コース別）。",
    category: "公募開始",
    region: "全国",
    subsidyId: "gyomu-kaizen",
    subsidyName: "業務改善助成金",
    publishedAt: "2026-04-01",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/02.html",
    sourceLabel: "厚生労働省",
    isNew: false,
    isImportant: false,
    tags: ["賃上げ", "最低賃金", "設備投資"],
  },
  {
    id: "news-2026-005",
    title: "中小企業省力化投資補助金：カタログ登録製品が拡充",
    summary:
      "中小企業省力化投資補助金において、対象製品カタログの登録件数が拡充されました。AMR（自律走行ロボット）、清掃ロボット、配膳ロボットなど人手不足解消に資する製品が多数追加されています。",
    category: "制度変更",
    region: "全国",
    subsidyId: "shorikika",
    subsidyName: "中小企業省力化投資補助金",
    publishedAt: "2026-03-20",
    updatedAt: "2026-05-01",
    officialUrl: "https://shoryokuka.smrj.go.jp/",
    sourceLabel: "中小企業省力化投資補助事業",
    isNew: false,
    isImportant: true,
    tags: ["省力化", "ロボット", "人手不足", "DX"],
  },
  {
    id: "news-2026-006",
    title: "キャリアアップ助成金：正社員化コースの要件が2026年度から変更",
    summary:
      "2026年4月より、キャリアアップ助成金（正社員化コース）の支給要件が一部変更されました。有期雇用労働者等を正社員化する際の転換日要件・同一事業主での勤続期間要件が見直されています。詳細は厚生労働省HPをご確認ください。",
    category: "制度変更",
    region: "全国",
    subsidyId: "career-up",
    subsidyName: "キャリアアップ助成金",
    publishedAt: "2026-04-01",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    sourceLabel: "厚生労働省",
    isNew: false,
    isImportant: true,
    tags: ["採用", "正社員化", "非正規", "キャリアアップ"],
  },
  {
    id: "news-2026-007",
    title: "新事業進出補助金（新設）：2026年度より公募開始予定",
    summary:
      "中小企業庁が新設を予定する「新事業進出補助金」は、既存事業と異なる分野への進出を支援します。上限2,000万円（補助率1/2）。詳細要件は公募開始後に確認してください。",
    category: "新制度",
    region: "全国",
    subsidyId: "shin-jigyo",
    subsidyName: "新事業進出補助金",
    publishedAt: "2026-02-01",
    officialUrl: "https://www.chusho.meti.go.jp/",
    sourceLabel: "中小企業庁",
    isNew: true,
    isImportant: true,
    tags: ["新規事業", "多角化", "中小企業庁"],
  },
  {
    id: "news-2026-008",
    title: "人材開発支援助成金：定額制訓練コースが2026年度も継続",
    summary:
      "人材開発支援助成金の人材育成支援コースおよびデジタル・DX人材育成コースが2026年度も継続されます。OFF-JT訓練費用の1/2〜3/4（上限あり）が支給されます。",
    category: "公募開始",
    region: "全国",
    subsidyId: "jinzai-kaihatsu",
    subsidyName: "人材開発支援助成金",
    publishedAt: "2026-04-01",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    sourceLabel: "厚生労働省",
    isNew: false,
    isImportant: false,
    tags: ["研修", "人材育成", "DX", "スキルアップ"],
  },
  {
    id: "news-2026-009",
    title: "事業承継・引継ぎ補助金：第10回採択結果を公表",
    summary:
      "事業承継・引継ぎ補助金（経営革新枠・専門家活用枠）の第10回採択結果が公表されました。採択率は経営革新枠で約45%。次回公募の詳細は事務局サイトにてご確認ください。",
    category: "採択結果",
    region: "全国",
    subsidyId: "jigyo-shokei",
    subsidyName: "事業承継・引継ぎ補助金",
    publishedAt: "2026-03-15",
    officialUrl: "https://jigyo-shokei-hojo.jp/",
    sourceLabel: "事業承継・引継ぎ補助金事務局",
    isNew: false,
    isImportant: false,
    tags: ["事業承継", "M&A", "後継者"],
  },
  {
    id: "news-2026-010",
    title: "地域雇用開発助成金：過疎地域等の対象地域が更新",
    summary:
      "地域雇用開発助成金の対象地域（過疎地域等）が2026年4月付で更新されました。新たに指定された地域の事業者は助成対象となる場合があります。最寄りのハローワークにてご確認ください。",
    category: "制度変更",
    region: "全国",
    subsidyId: "chiiki-koyo",
    subsidyName: "地域雇用開発助成金",
    publishedAt: "2026-04-05",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/chiiki_koyou.html",
    sourceLabel: "厚生労働省",
    isNew: false,
    isImportant: false,
    tags: ["採用", "地域", "過疎", "雇用"],
  },
  {
    id: "news-2026-011",
    title: "働き方改革推進支援助成金：2026年度申請受付開始",
    summary:
      "働き方改革推進支援助成金の2026年度申請受付が開始されました。時間外労働等改善助成金（時間外上限設定コース等）について、都道府県労働局へ申請できます。",
    category: "公募開始",
    region: "全国",
    subsidyId: "hatarakikata-kaikaku",
    subsidyName: "働き方改革推進支援助成金",
    publishedAt: "2026-04-10",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000148322.html",
    sourceLabel: "厚生労働省",
    isNew: false,
    isImportant: false,
    tags: ["働き方改革", "時間外労働", "賃上げ"],
  },
  {
    id: "news-2026-012",
    title: "ものづくり補助金：グリーン枠が「グリーン成長枠」に名称変更・拡充",
    summary:
      "ものづくり補助金のグリーン枠が「グリーン成長枠」に名称変更され、補助上限額が引き上げられる見通しです（詳細は次回公募要領で確認）。カーボンニュートラル・脱炭素に取り組む中小企業が対象。",
    category: "制度変更",
    region: "全国",
    subsidyId: "monodukuri",
    subsidyName: "ものづくり補助金",
    publishedAt: "2026-01-20",
    officialUrl: "https://portal.monodukuri-hojo.jp/",
    sourceLabel: "ものづくり補助事業公式サイト",
    isNew: false,
    isImportant: false,
    tags: ["ものづくり", "グリーン", "脱炭素", "製造"],
  },
];

export const NEWS_CATEGORIES: NewsCategory[] = [
  "公募開始", "締切間近", "制度変更", "新制度", "採択結果", "公募終了", "重要",
];

export function getNewsByCategory(category: NewsCategory): SubsidyNewsItem[] {
  return SUBSIDY_NEWS.filter((n) => n.category === category);
}

export function getLatestNews(limit = 5): SubsidyNewsItem[] {
  return [...SUBSIDY_NEWS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function getImportantNews(): SubsidyNewsItem[] {
  return SUBSIDY_NEWS.filter((n) => n.isImportant);
}

export function getNewsBySubsidyId(subsidyId: string): SubsidyNewsItem[] {
  return SUBSIDY_NEWS.filter((n) => n.subsidyId === subsidyId);
}
